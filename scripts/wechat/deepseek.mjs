// DeepSeek 客户端 —— 零依赖（Node 18+ 原生 fetch），OpenAI 兼容 chat completions。
// 用于：聚类(2-cluster)、合成(3-synthesize)、自评分(4-publish)。
//
// 用法：
//   import { DeepSeek } from './deepseek.mjs'
//   const ds = new DeepSeek()
//   const text = await ds.chat([{ role: 'user', content: '...' }])
//   const obj  = await ds.chatJSON([{ role: 'user', content: '... 只返回 JSON' }])

import { loadEnv } from './lib/env.mjs'

const sleep = ms => new Promise(r => setTimeout(r, ms))

export class DeepSeek {
  constructor(opts = {}) {
    loadEnv()
    this.apiKey = opts.apiKey || process.env.DEEPSEEK_API_KEY
    this.baseUrl = (opts.baseUrl || process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com').replace(/\/+$/, '')
    this.model = opts.model || process.env.DEEPSEEK_MODEL || 'deepseek-chat'
    this.maxRetries = opts.maxRetries ?? 3
    this.minIntervalMs = opts.minIntervalMs ?? 300
    this.timeoutMs = opts.timeoutMs ?? 120000 // 单次请求超时 120s，超时中断重试
    this._lastAt = 0
    // 累计 token 用量，便于成本核算
    this.usage = { prompt: 0, completion: 0, calls: 0 }
    if (!this.apiKey) throw new Error('缺少 DEEPSEEK_API_KEY（检查 scripts/wechat/.env）')
  }

  async _throttle() {
    const wait = this._lastAt + this.minIntervalMs - Date.now()
    if (wait > 0) await sleep(wait)
    this._lastAt = Date.now()
  }

  /**
   * 原始 chat 调用，返回完整响应 JSON。
   * @param {Array} messages  OpenAI 风格消息
   * @param {object} [opts]   { temperature, maxTokens, jsonMode }
   */
  async _complete(messages, opts = {}) {
    const body = {
      model: opts.model || this.model,
      messages,
      temperature: opts.temperature ?? 0.7,
      max_tokens: opts.maxTokens ?? 8000
    }
    if (opts.jsonMode) body.response_format = { type: 'json_object' }

    let lastErr
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      await this._throttle()
      // 单次请求超时控制：卡住则中断并重试，避免一个慢请求拖死整个流程
      const ac = new AbortController()
      const timer = setTimeout(() => ac.abort(), this.timeoutMs)
      try {
        const res = await fetch(`${this.baseUrl}/chat/completions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.apiKey}` },
          body: JSON.stringify(body),
          signal: ac.signal
        })
        if (!res.ok) {
          const txt = await res.text()
          // 429/5xx 重试，其它（4xx）直接抛
          if ((res.status === 429 || res.status >= 500) && attempt < this.maxRetries) {
            await sleep(1500 * (attempt + 1))
            continue
          }
          throw new Error(`DeepSeek HTTP ${res.status}: ${txt.slice(0, 300)}`)
        }
        const json = await res.json()
        if (json.usage) {
          this.usage.prompt += json.usage.prompt_tokens || 0
          this.usage.completion += json.usage.completion_tokens || 0
          this.usage.calls += 1
        }
        return json
      } catch (e) {
        lastErr = e
        if (attempt < this.maxRetries) await sleep(1200 * (attempt + 1))
      } finally {
        clearTimeout(timer)
      }
    }
    throw lastErr
  }

  /** 返回纯文本回复 */
  async chat(messages, opts = {}) {
    const json = await this._complete(messages, opts)
    return json.choices?.[0]?.message?.content ?? ''
  }

  /**
   * 强制 JSON 输出并解析。多重兜底，确保不因一次截断/脏输出整条流水线崩溃：
   *  1) 若本次因 max_tokens 截断（finish_reason==='length'），加倍上限重试一次；
   *  2) 解析失败 → 附加强约束、原 maxTokens 重试一次；
   *  3) 仍失败 → 尝试修复被截断的 JSON（裁掉尾部不完整元素 + 补齐括号）作为最后防线。
   * （temperature 降到 0.2 求稳；提高反而不利于稳定）
   */
  async chatJSON(messages, opts = {}) {
    const o = { temperature: 0.2, maxTokens: 8000, ...opts, jsonMode: true }

    let json = await this._complete(messages, o)
    let raw = json.choices?.[0]?.message?.content ?? ''
    // 被 max_tokens 截断：加大上限重来一次（封顶 16000，避免无限膨胀）
    if (json.choices?.[0]?.finish_reason === 'length') {
      const bigger = { ...o, maxTokens: Math.min((o.maxTokens || 8000) * 2, 16000) }
      json = await this._complete(messages, bigger)
      raw = json.choices?.[0]?.message?.content ?? ''
    }
    try {
      return JSON.parse(sanitizeJSON(stripFence(raw)))
    } catch {
      // 再试一次，附加更强约束
      const retry = await this.chat(
        [...messages, { role: 'system', content: '上次输出不是合法 JSON。只输出一个合法 JSON 对象，字符串内的换行/制表符等必须转义（\\n \\t），不要任何解释或代码围栏。' }],
        o
      )
      try {
        return JSON.parse(sanitizeJSON(stripFence(retry)))
      } catch (e) {
        // 最后防线：修复被截断的 JSON（保留最长可解析前缀）。修不出来才真正抛错。
        const repaired = repairTruncatedJSON(sanitizeJSON(stripFence(retry))) ?? repairTruncatedJSON(sanitizeJSON(stripFence(raw)))
        if (repaired) return repaired
        throw e
      }
    }
  }

  /** 成本估算（DeepSeek 定价随时变，按粗略 ¥/百万 token 估） */
  costEstimate({ inPerM = 2, outPerM = 3 } = {}) {
    const yuan = (this.usage.prompt / 1e6) * inPerM + (this.usage.completion / 1e6) * outPerM
    return { ...this.usage, yuan: Number(yuan.toFixed(3)) }
  }
}

function stripFence(s) {
  // 去掉可能的 ```json ... ``` 围栏
  return s.replace(/^\s*```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim()
}

// LLM 常在 JSON 字符串值里塞入未转义的原始换行/制表符，导致 JSON.parse 失败。
// 这里在“字符串字面量内部”把裸控制字符转义，字符串外的格式化空白保持不变。
function sanitizeJSON(s) {
  let out = ''
  let inStr = false
  let esc = false
  for (const ch of s) {
    if (inStr) {
      if (esc) { out += ch; esc = false; continue }
      if (ch === '\\') { out += ch; esc = true; continue }
      if (ch === '"') { out += ch; inStr = false; continue }
      if (ch === '\n') { out += '\\n'; continue }
      if (ch === '\r') { out += '\\r'; continue }
      if (ch === '\t') { out += '\\t'; continue }
      out += ch
    } else {
      if (ch === '"') { inStr = true }
      out += ch
    }
  }
  return out
}

// 兜底：修复被 max_tokens 截断的 JSON。策略——逐字符扫描，记录“处于字符串外、栈深度回到能闭合的位置”
// 的最后一个合法断点，截到那里，再把未闭合的 { / [ 反向补齐。能解析就返回，否则返回 null。
// 注意：输入应已过 sanitizeJSON（字符串内裸控制字符已转义），这里只处理结构性截断。
function repairTruncatedJSON(s) {
  if (!s) return null
  const stack = []
  let inStr = false
  let esc = false
  let lastGood = -1 // 可安全截断的位置（字符串外、且刚闭合完一个值之后）
  for (let i = 0; i < s.length; i++) {
    const ch = s[i]
    if (inStr) {
      if (esc) esc = false
      else if (ch === '\\') esc = true
      else if (ch === '"') inStr = false
      continue
    }
    if (ch === '"') { inStr = true; continue }
    if (ch === '{' || ch === '[') { stack.push(ch === '{' ? '}' : ']'); continue }
    if (ch === '}' || ch === ']') {
      if (stack[stack.length - 1] === ch) stack.pop()
      // 闭合一个容器后是个干净断点（外层若还有未闭合括号，可在此截断再补齐）
      if (stack.length) lastGood = i
      continue
    }
  }
  // 从 lastGood 处截断，丢弃尾部不完整元素，再按剩余栈补齐闭合括号
  const tryParse = str => { try { return JSON.parse(str) } catch { return undefined } }
  for (const end of [s.length - 1, lastGood]) {
    if (end < 0) continue
    let head = s.slice(0, end + 1).replace(/,\s*$/, '')
    // 重新计算该前缀仍未闭合的括号并补齐
    const st = []
    let str = false, e2 = false
    for (const ch of head) {
      if (str) { if (e2) e2 = false; else if (ch === '\\') e2 = true; else if (ch === '"') str = false; continue }
      if (ch === '"') str = true
      else if (ch === '{') st.push('}')
      else if (ch === '[') st.push(']')
      else if (ch === '}' || ch === ']') st.pop()
    }
    if (str) head += '"' // 末尾仍在字符串内（理论上 sanitize 后少见），先闭合
    const closed = head + st.reverse().join('')
    const parsed = tryParse(closed)
    if (parsed !== undefined) return parsed
  }
  return null
}

export default DeepSeek
