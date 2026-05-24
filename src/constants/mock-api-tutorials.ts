////////////////////////////////////////////////////////////////////////////////
// 🛑 Nothing in here has anything to do with Nextjs, it's just a fake database
////////////////////////////////////////////////////////////////////////////////

import { delay } from './mock-api';

export type TutorialLevel = 'beginner' | 'intermediate' | 'advanced';
export type TutorialCategory =
  | 'concept'
  | 'hands-on'
  | 'mcp'
  | 'agent'
  | 'workflow'
  | 'creative'
  | 'productivity';

export type Tutorial = {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  summary: string;
  content: string; // Markdown
  level: TutorialLevel;
  category: TutorialCategory;
  tags: string[];
  estimated_minutes: number;
  related_tools: string[]; // 相关工具名
  is_featured: boolean;
  published_at: string;
};

const TUTORIAL_DATA: Omit<Tutorial, 'id'>[] = [
  // ── 新手系列 ──────────────────────────────────────────────────────────────
  {
    slug: 'what-is-ai-agent',
    title: '什么是 AI Agent？',
    subtitle: '5 分钟搞懂和普通 AI 的区别',
    summary:
      '用一个简单的类比解释 AI Agent：ChatGPT 是顾问，Agent 是帮你干活的员工。本文带你快速理解 Agent 的核心概念、与普通 AI 的区别，以及为什么 2025 年是 Agent 元年。',
    content: `# 什么是 AI Agent？

## 一个简单的类比

想象你需要安排一次出差：

- **普通 AI（ChatGPT）**：你问它"帮我规划北京到上海的出差行程"，它给你一个建议清单。**但你还得自己去订机票、订酒店、发邮件通知同事。**

- **AI Agent**：你告诉它"帮我安排3月15日去上海出差，预算5000元以内"，它会**自动**查询机票价格、比较酒店、发送日历邀请、通知相关人员——全程不需要你操作。

> 💡 **一句话总结：ChatGPT 是顾问，Agent 是帮你干活的员工。**

## AI Agent 的三个关键能力

### 1. 感知（Perceive）
Agent 能接收多种输入：文字、图片、文件、网页、代码……

### 2. 规划（Plan）
面对复杂目标，Agent 会自动分解成多个步骤，判断先做什么、后做什么。

### 3. 执行（Act）
Agent 能调用工具：搜索网页、写代码并运行、操控浏览器、读写文件、发送邮件……

## 为什么 2025 年是 Agent 元年？

三个关键突破同时发生：

1. **模型能力飞跃**：Claude 3.5、GPT-4o 等模型的推理能力达到能可靠完成复杂任务的阈值
2. **工具生态成熟**：MCP 协议标准化了工具接入方式，现已有 500+ MCP Server
3. **基础设施完善**：Dify、LangChain 等平台降低了 Agent 开发门槛

## 常见 Agent 类型

| 类型 | 代表产品 | 主要能力 |
|------|---------|---------|
| 通用自主 | Manus, OpenClaw | 能完成任意开放性任务 |
| 软件工程 | Devin, Cursor | 写代码、修 Bug、部署 |
| 研究助手 | Deep Research, Perplexity | 信息收集与分析报告 |
| 流程自动化 | n8n, Dify | 连接多个系统自动化工作 |

## 下一步

- 了解 [什么是 MCP？](/tutorials/what-is-mcp)
- 浏览 [Agent Hub](/agents) 发现更多工具
`,
    level: 'beginner',
    category: 'concept',
    tags: ['AI Agent', '入门', '概念', '新手必读'],
    estimated_minutes: 5,
    related_tools: ['Manus', 'OpenClaw', 'Devin'],
    is_featured: true,
    published_at: '2025-03-01T08:00:00Z'
  },
  {
    slug: 'what-is-mcp',
    title: '什么是 MCP？',
    subtitle: '为什么它让 Agent 变得更强',
    summary:
      'MCP（Model Context Protocol）是 Anthropic 发布的开放协议，让 AI 模型能安全、标准化地连接外部工具和数据。用一个类比：MCP 是 Agent 的 USB 接口。本文带你搞懂 MCP 的原理和价值。',
    content: `# 什么是 MCP？

## MCP 是 Agent 的 USB 接口

在 MCP 出现之前，每当你想让 AI 连接一个新工具（比如 GitHub），开发者需要为每个 AI 平台单独写集成代码。这就像每台设备都需要专属充电线——乱且低效。

**MCP 就是 USB-C**：只要遵循 MCP 协议，任何 AI 模型都能连接任何 MCP Server，任何工具只需实现一次 MCP 接口。

> 💡 **一句话总结：MCP 是 AI 与外部世界通信的标准化插头。**

## MCP 的工作原理

\`\`\`
AI 模型 (Claude/GPT)
    ↕ MCP 协议
MCP Server (工具/数据源)
    ↕ 原生 API
真实系统 (GitHub/数据库/文件系统)
\`\`\`

当你对 Claude 说"帮我查一下 GitHub 上的 open issues"：

1. Claude 识别需要使用 GitHub 工具
2. 通过 MCP 协议调用 GitHub MCP Server
3. Server 用 GitHub API 查询数据
4. 返回结构化结果给 Claude
5. Claude 用自然语言回答你

## 为什么 MCP 很重要？

### 之前：碎片化
- 每个工具需要单独集成
- 不同 AI 平台互不兼容
- 安全性难以保证

### MCP 之后：标准化
- 一次实现，到处可用
- 跨平台：Claude、GPT、Gemini 均支持
- 权限控制：细粒度的工具访问授权

## 目前最受欢迎的 MCP Server

- **filesystem**：读写本地文件（官方）
- **github**：完整 GitHub 操作（官方）
- **brave-search**：实时网页搜索（官方）
- **notion**：Notion 知识库读写
- **puppeteer**：控制浏览器（官方）

👉 [查看全部 MCP Server](/mcp)
`,
    level: 'beginner',
    category: 'mcp',
    tags: ['MCP', '协议', '工具调用', '新手必读'],
    estimated_minutes: 5,
    related_tools: ['filesystem', 'github', 'brave-search'],
    is_featured: true,
    published_at: '2025-03-10T08:00:00Z'
  },
  {
    slug: 'skill-vs-agent-vs-model',
    title: 'Skill vs Agent vs Model：三者关系一张图看懂',
    subtitle: '积木、建造者、大脑的关系',
    summary:
      '很多人搞不清楚 AI Skill、Agent 和 Model 的关系。用一个建房子的类比：Model 是大脑（提供智慧），Skill 是积木（提供能力），Agent 是建造者（负责执行）。',
    content: `# Skill vs Agent vs Model

## 一张图看懂

\`\`\`
┌─────────────────────────────────┐
│           AI Model              │  ← 大脑：提供推理能力
│   (GPT-4o / Claude / DeepSeek)  │
└──────────────┬──────────────────┘
               │ 驱动
┌──────────────▼──────────────────┐
│           AI Agent              │  ← 建造者：负责规划和执行
│   (Manus / Devin / OpenClaw)    │
└──────────────┬──────────────────┘
               │ 调用
┌──────────────▼──────────────────┐
│           AI Skill / MCP        │  ← 积木：提供具体能力
│  (搜索 / 写文件 / 操控浏览器)    │
└─────────────────────────────────┘
\`\`\`

## 三者的角色

### 🧠 Model（模型）= 大脑
- 提供语言理解和推理能力
- 代表：GPT-4o、Claude 3.5、DeepSeek-R1
- 本身**不能执行动作**，只能思考和生成文字

### 🤖 Agent（智能体）= 建造者
- 接收目标，规划步骤，调用工具，完成任务
- 代表：Manus、Devin、OpenClaw、AutoGPT
- **驱动力**来自 Model，**执行力**来自 Skill

### 🧩 Skill / MCP Server = 积木
- 提供具体能力：搜索网页、读写文件、操控浏览器
- 代表：filesystem MCP、github MCP、brave-search MCP
- 本身没有智能，被 Agent 调用后才发挥作用

## 实际案例

**目标**：帮我分析竞品并生成报告

\`\`\`
Model (Claude)      →  理解意图，规划步骤
    ↓
Agent (Manus)       →  分解任务：搜索→分析→写作→输出
    ↓
Skills 调用序列：
  brave-search MCP  →  搜索竞品信息
  fetch MCP         →  抓取竞品官网
  filesystem MCP    →  保存分析结果
  (Claude 生成报告)
\`\`\`
`,
    level: 'beginner',
    category: 'concept',
    tags: ['Skill', 'Agent', 'Model', '概念辨析'],
    estimated_minutes: 5,
    related_tools: ['Manus', 'filesystem', 'brave-search'],
    is_featured: true,
    published_at: '2025-03-15T08:00:00Z'
  },
  // ── 实操系列 ──────────────────────────────────────────────────────────────
  {
    slug: 'openclaw-personal-assistant',
    title: '用 OpenClaw 5分钟搭建你的第一个私人 AI 助手',
    subtitle: '从安装到第一次对话的完整教程',
    summary:
      '本教程手把手带你安装和配置 OpenClaw，搭建完全私有化的 AI 助手。OpenClaw 完全开源，支持自托管，数据不出本地，适合有隐私需求的个人和企业用户。',
    content: `# 用 OpenClaw 搭建私人 AI 助手

## 准备工作

- 系统：macOS / Linux / Windows (WSL2)
- 需要：Node.js 18+ 或 Docker

## 方法一：Docker 一键启动（推荐）

\`\`\`bash
# 拉取镜像
docker pull openclaw/openclaw:latest

# 启动服务
docker run -d \\
  -p 3000:3000 \\
  -v ~/.openclaw:/data \\
  --name openclaw \\
  openclaw/openclaw:latest

# 访问 http://localhost:3000
\`\`\`

## 方法二：本地安装

\`\`\`bash
# 克隆仓库
git clone https://github.com/openclaw/openclaw
cd openclaw

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 填入你的 API Key

# 启动
npm run dev
\`\`\`

## 配置 AI 模型

OpenClaw 支持接入任意兼容 OpenAI API 格式的模型：

\`\`\`env
# .env 文件
OPENAI_API_KEY=sk-...        # OpenAI
ANTHROPIC_API_KEY=sk-ant-... # Claude
DEEPSEEK_API_KEY=...         # DeepSeek（推荐，性价比高）
\`\`\`

## 添加你的第一个 MCP Tool

\`\`\`json
// .openclaw/config.json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/你的用户名/Documents"]
    }
  }
}
\`\`\`

重启后，你的 AI 助手就能读写 Documents 文件夹了！

## 第一次对话

试试这些指令：
- "帮我在桌面创建一个 todo.txt 文件，写入今天的三个任务"
- "读取我的 Documents/notes.md 并总结要点"
- "搜索最新的 AI Agent 新闻并整理成摘要"
`,
    level: 'intermediate',
    category: 'hands-on',
    tags: ['OpenClaw', '自托管', '安装教程', '私有化'],
    estimated_minutes: 15,
    related_tools: ['OpenClaw', 'filesystem'],
    is_featured: true,
    published_at: '2025-04-01T08:00:00Z'
  },
  {
    slug: 'dify-customer-service-agent',
    title: '用 Dify 零代码构建一个客服 Agent（附模板）',
    subtitle: '30分钟搭建能回答产品问题的智能客服',
    summary:
      'Dify 是目前最易用的 AI Agent 构建平台，无需编写代码，通过可视化界面就能搭建功能完整的客服 Agent。本教程提供完整步骤和可直接导入的模板。',
    content: `# 用 Dify 构建客服 Agent

## 什么是 Dify？

Dify 是一个开源的 LLM 应用开发平台，特点：
- **零代码**：拖拽操作，无需编程
- **开源可自托管**：数据完全自控
- **工作流编排**：支持复杂的多步骤逻辑
- **RAG 内置**：轻松接入私有知识库

## 第一步：注册/部署 Dify

**云端版（推荐新手）**：访问 [dify.ai](https://dify.ai) 注册

**自托管**：
\`\`\`bash
git clone https://github.com/langgenius/dify
cd dify/docker
docker compose up -d
\`\`\`

## 第二步：上传知识库

1. 进入 **知识库** → **创建知识库**
2. 上传你的产品文档（支持 PDF、Word、Markdown）
3. 等待向量化完成

## 第三步：创建 Chatbot

1. **创建应用** → 选择 **Chatbot**
2. 在 **上下文** 中绑定刚创建的知识库
3. 设置系统提示词：

\`\`\`
你是 [公司名] 的智能客服助手。
- 只回答与产品相关的问题
- 如果知识库中没有答案，礼貌告知用户联系人工客服
- 回答简洁友好，使用中文
\`\`\`

## 第四步：添加工具增强

在 **工具** 面板添加：
- **网络搜索**：回答知识库以外的通用问题
- **代码执行**：计算订单金额、处理数据

## 发布与集成

1. 点击 **发布** → 获取 API Key
2. 将以下代码嵌入你的网站：

\`\`\`html
<script>
  window.difyChatbotConfig = {
    token: 'YOUR_TOKEN',
    baseUrl: 'https://api.dify.ai'
  }
</script>
<script src="https://udify.app/embed.min.js"></script>
\`\`\`
`,
    level: 'intermediate',
    category: 'hands-on',
    tags: ['Dify', '零代码', '客服Agent', 'RAG'],
    estimated_minutes: 30,
    related_tools: ['Dify', 'brave-search'],
    is_featured: false,
    published_at: '2025-04-15T08:00:00Z'
  },
  {
    slug: 'top-10-mcp-servers',
    title: '10个最实用的 MCP Server，装完效率翻倍',
    subtitle: '覆盖 GitHub / Notion / 浏览器 / 文件系统',
    summary:
      '从数百个 MCP Server 中精选 10 个最实用的，涵盖开发、效率、搜索、浏览器自动化等场景，并提供每个 Server 的安装命令和使用示例。',
    content: `# 10个最实用的 MCP Server

## 安装方式说明

大多数 MCP Server 通过配置 Claude Desktop 的 \`claude_desktop_config.json\` 来使用：

**macOS**：\`~/Library/Application Support/Claude/claude_desktop_config.json\`

\`\`\`json
{
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["-y", "@package/name"]
    }
  }
}
\`\`\`

---

## 🥇 Top 10

### 1. filesystem — 读写本地文件
最基础也最常用，让 AI 能直接操作你的文件。
\`\`\`json
"filesystem": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/你的用户名"]
}
\`\`\`
**用途**：整理文档、批量重命名、读取配置文件

### 2. github — GitHub 全功能操作
PR、Issues、代码搜索、仓库管理一手掌握。
\`\`\`json
"github": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_..." }
}
\`\`\`

### 3. brave-search — 实时搜索
让 AI 能搜索最新信息，不再被训练数据截断日期限制。

### 4. puppeteer — 浏览器自动化
让 AI 帮你自动填表、截图、抓取数据。

### 5. notion — Notion 知识库
直接读写 Notion，打造 AI 驱动的个人知识管理系统。

### 6. sqlite — 本地数据库
用自然语言查询和操作 SQLite 数据库。

### 7. fetch — 网页内容抓取
抓取任意网页并转为 Markdown，AI 直接分析。

### 8. slack — 团队沟通自动化
让 AI 帮你发 Slack 消息、查历史记录、自动通知。

### 9. google-drive — 云端文件管理
读写 Google Docs/Sheets，实现 AI 驱动的文档自动化。

### 10. sequential-thinking — 增强推理
复杂问题让 AI 一步步思考，显著提升回答质量。

---

👉 [浏览全部 MCP Server](/mcp)
`,
    level: 'beginner',
    category: 'mcp',
    tags: ['MCP', '效率工具', '最佳实践', '推荐清单'],
    estimated_minutes: 10,
    related_tools: ['filesystem', 'github', 'brave-search', 'notion'],
    is_featured: true,
    published_at: '2025-05-01T08:00:00Z'
  },
  {
    slug: 'claude-computer-use-tutorial',
    title: 'Claude + Computer Use：让 AI 帮你自动填表格、刷网页',
    subtitle: '从零开始使用 Anthropic 的计算机控制功能',
    summary:
      'Claude Computer Use 让 AI 能直接操控电脑界面，本教程带你了解如何通过 API 启用这项功能，并实现自动填写表格、网页数据抓取等实际场景。',
    content: `# Claude Computer Use 教程

## 什么是 Computer Use？

Computer Use 允许 Claude 通过截图感知屏幕状态，然后通过模拟鼠标点击、键盘输入来操控电脑，就像人类使用电脑一样。

**目前支持的操作**：
- 截取屏幕截图
- 移动鼠标、点击
- 键盘输入
- 滚动页面

## 运行环境设置

Anthropic 提供了一个预配置的 Docker 镜像：

\`\`\`bash
# 启动演示环境
docker run \\
  -e ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY \\
  -v $HOME/.anthropic:/home/user/.anthropic \\
  -p 5900:5900 \\
  -p 8501:8501 \\
  -p 6080:6080 \\
  -it ghcr.io/anthropics/anthropic-quickstarts:computer-use-demo-latest

# 通过浏览器访问 http://localhost:6080 查看 AI 操控的桌面
\`\`\`

## 实战：让 AI 自动填写表单

\`\`\`python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=4096,
    tools=[{"type": "computer_20241022", "name": "computer", "display_width_px": 1024, "display_height_px": 768}],
    betas=["computer-use-2024-10-22"],
    messages=[{
        "role": "user",
        "content": "打开浏览器，访问 https://example.com/form，填写姓名为'张三'，邮箱为'zhang@example.com'，然后提交"
    }]
)
\`\`\`

## 注意事项

- ⚠️ Computer Use 目前处于 Beta 阶段
- 不要让 AI 操控包含敏感信息的应用
- 建议在沙盒环境中使用
- 每次操作都需要截图，API 费用较高
`,
    level: 'advanced',
    category: 'agent',
    tags: ['Claude', 'Computer Use', '浏览器自动化', 'API'],
    estimated_minutes: 20,
    related_tools: ['Claude Computer Use', 'puppeteer'],
    is_featured: false,
    published_at: '2025-05-15T08:00:00Z'
  },
  {
    slug: 'cursor-mcp-setup-guide',
    title: '在 Cursor 中配置 MCP：构建超强 AI 编程环境',
    subtitle: '让 AI 编辑器直连 GitHub、数据库、实时搜索',
    summary:
      'Cursor 是目前最受欢迎的 AI 代码编辑器，配合 MCP 后能力倍增。本文手把手带你配置 5 个最实用的 MCP Server，让 AI 能直接操作 GitHub PR、查询数据库、搜索实时文档，把 Cursor 变成真正的 AI 编程 Agent。',
    content: `# 在 Cursor 中配置 MCP：30 分钟构建超强 AI 编程环境

## 为什么需要 MCP？

默认 Cursor 只能操作当前打开的文件。配置 MCP 后，AI 可以：
- 直接查询 GitHub Issues 和 PR
- 读写任意目录的文件
- 执行 SQL 数据库查询
- 搜索实时网页和文档信息

## 快速开始

### 1. 打开 MCP 配置文件

按 \`Cmd + Shift + J\` 打开设置，或直接编辑：

\`\`\`bash
# macOS
open ~/.cursor/mcp.json
\`\`\`

### 2. 配置 5 个必备 MCP Server

\`\`\`json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/你的用户名/projects"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "你的Token"
      }
    },
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-brave-search"],
      "env": {
        "BRAVE_API_KEY": "你的API Key"
      }
    },
    "sqlite": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sqlite", "--db-path", "/path/to/project.db"]
    },
    "fetch": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-fetch"]
    }
  }
}
\`\`\`

### 3. 获取 GitHub Personal Access Token

1. 访问 GitHub → Settings → Developer Settings → Personal Access Tokens
2. 创建新 Token（Classic），勾选 \`repo\`、\`read:org\` 权限
3. 复制 Token 到配置文件

### 4. 申请 Brave Search API Key

1. 访问 https://api.search.brave.com 注册账号
2. 免费套餐：每月 2000 次查询，足够日常使用
3. 复制 API Key 到配置文件

## 验证配置

重启 Cursor 后，在 Chat 中测试：

> "列出我 github.com/你的用户名 仓库的最近 5 个 Issues"

如果 AI 能正确返回 GitHub Issues 列表，说明 MCP 配置成功 ✅

## 实战：让 AI 帮你修 Bug

\`\`\`
你：帮我查一下 #42 这个 Issue，然后找到相关代码修复它
AI：已获取 Issue 内容... 正在分析代码库... 发现问题在 src/auth/validator.ts 第 38 行...
    已生成修复方案，是否创建 PR？
\`\`\`

## 进阶配置

- 添加 \`notion\` MCP：让 AI 直接更新项目文档
- 添加 \`docker\` MCP：让 AI 管理容器和查看日志
- 添加 \`supabase\` MCP：直接操作生产数据库（谨慎使用！）

👉 [查看全部 MCP Server](/mcp)
`,
    level: 'intermediate',
    category: 'mcp',
    tags: ['Cursor', 'MCP', 'GitHub', 'AI编程', '实战配置'],
    estimated_minutes: 20,
    related_tools: ['Cursor', 'github', 'brave-search', 'filesystem'],
    is_featured: true,
    published_at: '2025-04-10T08:00:00Z'
  },
  {
    slug: 'dify-enterprise-knowledge-base',
    title: '用 Dify 搭建企业知识库问答系统',
    subtitle: '30 分钟上线 RAG 应用，告别信息孤岛',
    summary:
      'Dify 是最流行的开源 LLMOps 平台，内置 RAG 知识库功能。本文从零开始，教你把公司文档、内部 Wiki、产品手册全部导入，搭建一个能准确回答业务问题的企业 AI 助手，并分享提升准确率的关键调优技巧。',
    content: `# 用 Dify 搭建企业知识库问答系统

## 什么是 RAG？

RAG（Retrieval-Augmented Generation）= 检索 + 生成

普通 AI 回答问题只靠训练数据，RAG 会先在你的文档库中搜索相关内容，再结合搜索结果生成答案。

**效果对比**：
- 普通 ChatGPT：不了解你公司的产品和流程
- RAG 知识库：能准确回答"我们的退款政策是什么？"

## 1. 安装 Dify

\`\`\`bash
# 克隆仓库
git clone https://github.com/langgenius/dify.git
cd dify/docker

# 启动所有服务
cp .env.example .env
docker compose up -d

# 访问 http://localhost/install 完成初始化
\`\`\`

## 2. 创建知识库

1. 登录 Dify → 点击 **知识库** → **创建知识库**
2. 上传文档（支持 PDF、Word、Markdown、网页链接）
3. 设置分块策略：
   - **分块大小**：推荐 500-1000 字符
   - **重叠长度**：推荐 100 字符（避免语义断裂）
4. 选择 Embedding 模型（推荐 text-embedding-3-small，性价比最高）
5. 等待向量化完成

## 3. 创建 AI 助手应用

1. 点击 **应用** → **创建应用** → **聊天助手**
2. 在编排界面绑定上一步创建的知识库
3. 设置系统提示词：

\`\`\`
你是公司的 AI 客服助手。请基于提供的知识库内容回答用户问题。
如果知识库中没有相关信息，请明确告知"我在知识库中没有找到相关信息"，不要编造答案。
回答要简洁准确，如有必要请引用来源文档。
\`\`\`

## 4. 关键调优技巧

### 提升召回准确率

| 问题 | 解决方案 |
|------|---------|
| 找不到相关内容 | 降低相似度阈值（0.5→0.3）|
| 找到太多无关内容 | 提高阈值或减少召回数量 |
| 答案不完整 | 增加分块大小或召回数量 |
| 引用了错误来源 | 开启 Rerank 模型重排序 |

### 混合检索（推荐）

同时启用**向量搜索**（语义）和**全文搜索**（关键词），两者互补，准确率提升 20-30%。

## 5. 发布和集成

- **Web 应用**：Dify 提供现成的 Web 界面，一键分享链接
- **API 集成**：通过 REST API 嵌入到你的产品中
- **飞书/企业微信**：通过官方集成直接在 IM 中使用

👉 [查看 Dify 使用案例](/usecases)
`,
    level: 'intermediate',
    category: 'hands-on',
    tags: ['Dify', 'RAG', '知识库', '企业AI', 'LLMOps'],
    estimated_minutes: 25,
    related_tools: ['Dify', 'Claude', 'notion', 'filesystem'],
    is_featured: true,
    published_at: '2025-04-20T08:00:00Z'
  },
  {
    slug: 'langgraph-stateful-agent',
    title: '用 LangGraph 构建多步骤 Agent',
    subtitle: '状态机思维：让 Agent 像工作流一样可控',
    summary:
      'LangGraph 是 LangChain 团队推出的 Agent 编排框架，用图（DAG）的方式组织 Agent 逻辑，支持循环、条件分支、状态持久化和人工干预点。相比 ReAct Agent，LangGraph 的行为更可预测、更易调试，是生产级 Agent 开发的首选。',
    content: `# 用 LangGraph 构建多步骤 Agent

## LangGraph vs ReAct Agent

| 维度 | ReAct Agent | LangGraph |
|------|------------|-----------|
| 控制流 | 模型自主决定 | 开发者定义图结构 |
| 可调试性 | 难以追踪 | 每步骤状态可见 |
| 循环支持 | 有限 | 原生支持 |
| 人工干预 | 不支持 | 内置 Interrupt |
| 生产可用 | 一般 | 推荐 |

## 核心概念

\`\`\`
State（状态）：Agent 的记忆，贯穿整个执行过程
Node（节点）：执行具体工作的函数
Edge（边）：节点间的连接，可以是条件跳转
Graph（图）：所有节点和边的集合
\`\`\`

## 安装

\`\`\`bash
pip install langgraph langchain-anthropic
\`\`\`

## 实战：研究报告 Agent

\`\`\`python
from typing import TypedDict, List
from langgraph.graph import StateGraph, END
from langchain_anthropic import ChatAnthropic

# 1. 定义状态
class ResearchState(TypedDict):
    topic: str
    search_results: List[str]
    outline: str
    report: str
    iteration: int

# 2. 定义节点函数
def search_node(state: ResearchState) -> ResearchState:
    """搜索相关信息"""
    # 调用搜索 MCP 或 API
    results = search_web(state["topic"])
    return {"search_results": results}

def outline_node(state: ResearchState) -> ResearchState:
    """生成报告大纲"""
    llm = ChatAnthropic(model="claude-3-5-sonnet-20241022")
    outline = llm.invoke(f"基于以下信息生成报告大纲：{state['search_results']}")
    return {"outline": outline.content}

def write_node(state: ResearchState) -> ResearchState:
    """撰写完整报告"""
    llm = ChatAnthropic(model="claude-3-5-sonnet-20241022")
    report = llm.invoke(f"根据大纲撰写完整报告：{state['outline']}")
    return {"report": report.content, "iteration": state.get("iteration", 0) + 1}

def review_node(state: ResearchState) -> str:
    """决定是继续改进还是完成"""
    if state["iteration"] >= 2:
        return "complete"
    # 检查报告质量
    if len(state["report"]) > 2000:
        return "complete"
    return "revise"

# 3. 构建图
builder = StateGraph(ResearchState)
builder.add_node("search", search_node)
builder.add_node("outline", outline_node)
builder.add_node("write", write_node)

builder.set_entry_point("search")
builder.add_edge("search", "outline")
builder.add_edge("outline", "write")
builder.add_conditional_edges("write", review_node, {
    "complete": END,
    "revise": "search"  # 循环重新搜索
})

graph = builder.compile()

# 4. 运行
result = graph.invoke({"topic": "2025年 AI Agent 发展趋势"})
print(result["report"])
\`\`\`

## 添加人工审核节点

\`\`\`python
from langgraph.checkpoint.memory import MemorySaver

# 在敏感操作前暂停，等待人工确认
builder.add_node("human_review", lambda state: state)
builder.add_edge("outline", "human_review")

# 使用 interrupt_before 参数
graph = builder.compile(
    checkpointer=MemorySaver(),
    interrupt_before=["human_review"]
)

# 运行到中断点
config = {"configurable": {"thread_id": "research-1"}}
graph.invoke({"topic": "..."}, config=config)

# 人工审核后继续
graph.invoke(None, config=config)  # 从断点继续
\`\`\`

## 最佳实践

1. **状态不可变**：每个节点返回新状态，不直接修改
2. **节点单一职责**：每个节点只做一件事
3. **条件边用枚举**：返回字符串 key，避免拼写错误
4. **持久化检查点**：生产环境使用 PostgresSaver 而非 MemorySaver

👉 [查看 Agent 工具](/agents)
`,
    level: 'advanced',
    category: 'agent',
    tags: ['LangGraph', 'Agent', 'Python', '状态机', '可控AI'],
    estimated_minutes: 35,
    related_tools: ['LangGraph', 'Claude', 'brave-search'],
    is_featured: true,
    published_at: '2025-05-01T08:00:00Z'
  },
  {
    slug: 'local-deepseek-ollama',
    title: '本地运行 DeepSeek：零成本私有 AI 部署',
    subtitle: '用 Ollama 在 Mac/Linux 上跑开源大模型',
    summary:
      '不想把数据发给 OpenAI？本文教你用 Ollama 在本地机器上运行 DeepSeek-R1 等开源模型，完全离线、零 API 费用、数据不出本地。从安装到配置 Cursor/Continue 接入本地模型，全程图文指南。',
    content: `# 本地运行 DeepSeek：零成本私有 AI 部署

## 为什么选择本地部署？

- **隐私安全**：代码、文档永不离开本地
- **零费用**：一次配置，无限使用
- **低延迟**：局域网速度，无网络延迟
- **离线可用**：断网也能正常工作

## 硬件要求

| 模型 | 最低显存/内存 | 推荐配置 |
|------|-------------|---------|
| DeepSeek-R1 1.5B | 4GB RAM | M2 MacBook Air |
| DeepSeek-R1 7B | 8GB RAM | M2 MacBook Pro |
| DeepSeek-R1 14B | 16GB RAM | M3 MacBook Pro |
| DeepSeek-R1 32B | 32GB RAM | M3 Max / RTX 4090 |

> 💡 Apple Silicon Mac 的统一内存效率极高，M3 Max 可流畅运行 32B 模型

## 1. 安装 Ollama

\`\`\`bash
# macOS / Linux 一键安装
curl -fsSL https://ollama.ai/install.sh | sh

# 验证安装
ollama --version
\`\`\`

## 2. 下载并运行 DeepSeek

\`\`\`bash
# 下载 7B 模型（4.7GB）
ollama pull deepseek-r1:7b

# 直接运行对话
ollama run deepseek-r1:7b

# 或者后台启动服务（供其他应用调用）
ollama serve
\`\`\`

## 3. 接入 Cursor/VS Code

### Cursor 配置

1. 打开 Cursor Settings → Models
2. 添加自定义模型：
   - Base URL: \`http://localhost:11434/v1\`
   - API Key: \`ollama\`（任意字符串）
   - Model: \`deepseek-r1:7b\`

### Continue 插件配置（VS Code）

\`\`\`json
// ~/.continue/config.json
{
  "models": [
    {
      "title": "DeepSeek R1 Local",
      "provider": "ollama",
      "model": "deepseek-r1:7b",
      "apiBase": "http://localhost:11434"
    }
  ]
}
\`\`\`

## 4. OpenAI 兼容 API

Ollama 提供 OpenAI 兼容的 API，任何支持 OpenAI API 的工具都可以无缝接入：

\`\`\`python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama"
)

response = client.chat.completions.create(
    model="deepseek-r1:7b",
    messages=[{"role": "user", "content": "解释量子纠缠"}]
)
print(response.choices[0].message.content)
\`\`\`

## 5. 其他推荐本地模型

\`\`\`bash
# 代码专项（推荐）
ollama pull qwen2.5-coder:7b

# 中文能力最强
ollama pull qwen2.5:14b

# 通用推理
ollama pull llama3.3:70b  # 需要 32GB+ 内存
\`\`\`

## 常见问题

**Q：速度太慢怎么办？**
A：选择更小的模型（1.5B/3B），或使用 \`num_gpu=-1\` 强制使用全部 GPU 层。

**Q：Cursor 显示连接失败？**
A：确认 \`ollama serve\` 已在运行，端口 11434 未被占用。

**Q：中文效果差怎么办？**
A：切换到 Qwen2.5 系列，中文能力更强。

👉 [对比更多模型](/models)
`,
    level: 'beginner',
    category: 'hands-on',
    tags: ['DeepSeek', 'Ollama', '本地部署', '开源模型', '隐私安全'],
    estimated_minutes: 20,
    related_tools: ['Ollama', 'DeepSeek-R1', 'Cursor'],
    is_featured: false,
    published_at: '2025-05-10T08:00:00Z'
  },
  {
    slug: 'n8n-ai-workflow-automation',
    title: '用 n8n + AI Agent 自动化你的日常工作流',
    subtitle: '零代码连接 200+ 应用，让 AI 接管重复性工作',
    summary:
      'n8n 是目前最强大的开源自动化平台，结合 AI Agent 能力，可以将你的日常重复工作完全自动化。本教程以"每日新闻摘要"和"邮件自动处理"为例，展示如何快速搭建工作流。',
    content: `# n8n + AI Agent 工作流教程

## 为什么选择 n8n？

- **完全开源**：可自托管，数据不外流
- **400+ 集成**：Gmail、Slack、GitHub、Notion...
- **可视化编排**：拖拽连接节点，无需写代码
- **AI 原生**：内置 OpenAI、Claude 等 AI 节点

## 安装 n8n

\`\`\`bash
# Docker 安装（推荐）
docker run -it --rm \\
  -p 5678:5678 \\
  -v ~/.n8n:/home/node/.n8n \\
  n8nio/n8n

# 访问 http://localhost:5678
\`\`\`

## 实战 1：每日 AI 新闻摘要邮件

**工作流设计**：
\`\`\`
定时触发（每天 8:00）
    ↓
HTTP Request → 抓取 AI 新闻 RSS
    ↓
AI Agent（Claude）→ 总结今日要点
    ↓
Gmail → 发送摘要邮件
\`\`\`

**关键节点配置**：

AI Agent 提示词：
\`\`\`
以下是今日的 AI 行业新闻：
{{ $json.items }}

请用中文总结：
1. 今日最重要的 3 条新闻
2. 对 AI 行业的影响分析
3. 值得关注的新产品或研究
\`\`\`

## 实战 2：智能邮件处理

**工作流设计**：
\`\`\`
Gmail Trigger（新邮件到达）
    ↓
AI Agent → 判断邮件类型和优先级
    ↓
Switch 节点：
  重要邮件 → 发 Slack 通知
  垃圾邮件 → 自动标记
  普通邮件 → 起草回复草稿
\`\`\`

## 进阶技巧

- 使用 **Code 节点** 处理复杂数据转换
- 使用 **Sub-workflow** 复用工作流模块
- 配置 **Error Workflow** 处理失败情况
`,
    level: 'intermediate',
    category: 'workflow',
    tags: ['n8n', '工作流', '自动化', '邮件处理'],
    estimated_minutes: 25,
    related_tools: ['n8n', 'Claude', 'notion'],
    is_featured: false,
    published_at: '2025-06-01T08:00:00Z'
  },
  // ── 新增教程 ──────────────────────────────────────────────────────────────
  {
    slug: 'coze-wechat-customer-service-bot',
    title: '用扣子（Coze）10分钟搭建微信客服 Bot',
    subtitle: '零代码接入企业微信，自动回答产品问题',
    summary:
      '扣子是国内最流行的 AI Bot 平台，支持一键发布到企业微信、飞书、抖音等平台。本教程以"电商退款客服 Bot"为例，带你完成从创建 Bot 到上线的全流程，无需任何编程基础。',
    content: `# 用扣子搭建微信客服 Bot

## 什么是扣子？

扣子（Coze）是字节跳动推出的 AI Bot 构建平台，核心优势：

- **零代码**：拖拽配置，无需写一行代码
- **国内可用**：无需翻墙，支持国内大模型
- **多平台发布**：企业微信/飞书/抖音/微信服务号
- **插件丰富**：200+ 内置插件，可调用天气、快递、搜索等

## 第一步：注册并创建 Bot

1. 访问 [coze.cn](https://www.coze.cn) 注册账号
2. 点击「创建 Bot」，选择「从空白创建」
3. 填写 Bot 名称：「退款客服助手」
4. 选择模型：**豆包 Pro**（国内稳定，效果好）

## 第二步：配置人设和提示词

在「人设与回复逻辑」中填写：

\`\`\`
你是一个专业的电商客服助手，名字叫「小美」。

你的职责：
1. 回答客户关于退款、换货的问题
2. 查询订单状态（通过查询插件）
3. 遇到复杂问题，引导客户联系人工客服

回答原则：
- 语气亲切，称呼客户为「亲」
- 回复简洁，不超过 100 字
- 无法处理的问题说「我帮您转接人工客服」
\`\`\`

## 第三步：添加知识库

1. 点击「知识库」→「新建知识库」
2. 上传退款政策 PDF 或填写常见问题文档
3. 设置「触发知识库」条件：包含「退款/退货/换货」关键词时优先查知识库

## 第四步：配置插件

添加「订单查询」插件（需填写你的电商平台 API）：

\`\`\`
插件类型：HTTP 请求
接口地址：https://api.yourshop.com/orders/query
参数：order_id（从用户消息中提取）
\`\`\`

## 第五步：发布到企业微信

1. 点击「发布」→「企业微信」
2. 扫码授权企业微信管理后台
3. 选择发布为「客服账号」
4. 测试：用企业微信向 Bot 发送「我要退款」

## 常见问题

**Q：Bot 回答不准确怎么办？**
在「调试」模式下查看 Bot 的思考过程，优化提示词或补充知识库。

**Q：如何处理用户的图片（快递单截图）？**
在模型设置中选择「豆包 Vision」（多模态模型），Bot 即可识别图片内容。
`,
    level: 'beginner',
    category: 'hands-on',
    tags: ['扣子', 'Coze', '客服Bot', '企业微信', '零代码'],
    estimated_minutes: 20,
    related_tools: ['Coze（扣子）', 'n8n'],
    is_featured: true,
    published_at: '2025-04-15T08:00:00Z'
  },
  {
    slug: 'multi-agent-collaboration-patterns',
    title: '多 Agent 协作：3种模式让复杂任务自动完成',
    subtitle: '串行、并行、监督者模式的选择和实现',
    summary:
      '单个 Agent 能力有限，多 Agent 协作才是处理复杂任务的正确姿势。本文介绍串行流水线、并行分工、监督者-执行者三种多 Agent 模式，并用 Dify 实现一个真实案例：自动生成竞品分析报告。',
    content: `# 多 Agent 协作：3种核心模式

## 为什么需要多 Agent 协作？

单 Agent 的问题：
- **上下文窗口限制**：处理超长任务会遗忘前面内容
- **能力单一**：一个 Agent 很难既擅长搜索又擅长写作
- **并行效率低**：顺序执行耗时长

多 Agent 解决方案：分工合作，各司其职。

---

## 模式一：串行流水线（Pipeline）

**适用场景**：任务有明确先后依赖关系

\`\`\`
搜索 Agent → 分析 Agent → 写作 Agent → 校对 Agent
\`\`\`

**实现要点**：
- 每个 Agent 的输入是上一个的输出
- 在 Dify 中用「LLM 节点」顺序连接
- 适合：文章生成、报告撰写

---

## 模式二：并行分工（Parallel）

**适用场景**：子任务相互独立，可同时进行

\`\`\`
              ┌→ 研究竞品A → ┐
主 Agent ──→ ├→ 研究竞品B → ├→ 汇总 Agent
              └→ 研究竞品C → ┘
\`\`\`

**实现要点**：
- Dify 中用「并行分支」节点
- 设置超时：单个分支失败不阻塞整体
- 适合：多来源数据收集、批量处理

---

## 模式三：监督者-执行者（Supervisor）

**适用场景**：任务需要动态规划，无法预先设计全部步骤

\`\`\`
用户目标 → 监督者 Agent
               ↓（分配子任务）
          执行者 Agent 1, 2, 3...
               ↓（汇报结果）
          监督者 Agent（评估 + 再分配）
               ↓
          最终输出
\`\`\`

**实现要点**：
- 监督者负责分解目标 + 验证结果质量
- 执行者专注具体操作（搜索/计算/写作）
- 适合：开放式研究任务、复杂项目管理

---

## 实战：竞品分析报告（并行模式）

用 Dify 实现同时分析3个竞品：

### 工作流设计

\`\`\`
输入：目标公司名称
    ↓
并行分支：
  Branch 1：Brave Search 搜索公司官网 + 产品特性
  Branch 2：搜索 GitHub 查看技术栈
  Branch 3：搜索融资信息和市场评价
    ↓
汇总节点：合并三路结果
    ↓
分析 Agent：生成结构化竞品分析报告
    ↓
输出：Markdown 格式报告
\`\`\`

### 关键配置

Branch 搜索提示词模板：
\`\`\`
搜索关键词：{{company_name}} 产品功能 定价
返回：官网链接、核心功能列表、价格方案
\`\`\`

分析 Agent 提示词：
\`\`\`
基于以下三路信息，生成竞品分析报告：
[产品信息]：{{branch1_result}}
[技术信息]：{{branch2_result}}
[市场信息]：{{branch3_result}}

报告结构：
1. 产品定位（一句话）
2. 核心功能对比
3. 定价策略
4. 优劣势总结
\`\`\`

## 选择哪种模式？

| 任务特征 | 推荐模式 |
|---------|---------|
| 步骤固定、顺序明确 | 串行流水线 |
| 子任务独立、可并行 | 并行分工 |
| 目标模糊、需动态规划 | 监督者-执行者 |
`,
    level: 'intermediate',
    category: 'agent',
    tags: ['多Agent', '协作模式', 'Dify', '并行', '工作流设计'],
    estimated_minutes: 20,
    related_tools: ['Dify', 'n8n', 'OpenClaw'],
    is_featured: true,
    published_at: '2025-04-28T08:00:00Z'
  },
  {
    slug: 'rag-knowledge-base-best-practices',
    title: 'RAG 实战避坑指南：让知识库问答真正好用',
    subtitle: '分块策略、向量检索、重排序——影响效果的关键细节',
    summary:
      '「搭了 RAG 但效果很差」是最常见的抱怨。本文从用户真实痛点出发，讲清楚影响 RAG 效果的 5 个关键决策：文档分块、Embedding 模型选择、检索策略、重排序（Reranking）和提示词工程，附带 Dify 配置截图。',
    content: `# RAG 实战避坑指南

## RAG 为什么经常效果差？

做了 RAG 但问答效果差，90% 的问题出在这里：

1. **分块太粗**：整页文档塞进一个 Chunk，检索到的内容包含大量无关信息
2. **分块太细**：句子级别分块，丢失上下文，AI 无法理解语义
3. **Embedding 模型不匹配**：用英文模型处理中文文档
4. **只用相似度检索**：关键词完全匹配的文档反而排名靠后
5. **提示词没有限制**：AI 开始「创作」而不是「引用」

---

## 关键决策一：分块策略

### 推荐配置

| 文档类型 | 分块大小 | 重叠 |
|---------|---------|------|
| 产品文档/FAQ | 500 token | 50 token |
| 法律合同 | 800 token | 100 token |
| 技术教程 | 300 token（按标题分） | 0 |
| 新闻/长文 | 1000 token | 100 token |

### 实用技巧

\`\`\`python
# 按语义边界分块（推荐）
# 不要在句子中间切断，保留完整段落
from langchain.text_splitter import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50,
    separators=["\\n\\n", "\\n", "。", "！", "？", " "]  # 中文优先
)
\`\`\`

---

## 关键决策二：Embedding 模型选择

### 中文文档推荐

| 模型 | 适用场景 | 费用 |
|------|---------|------|
| **智谱 Embedding** | 通用中文，效果最好 | 付费 |
| **BAAI/bge-m3** | 多语言，可本地部署 | 免费 |
| **text-embedding-3-small** | 中英混合文档 | 低价 |

> ⚠️ **不要用** \`text-embedding-ada-002\` 处理纯中文文档，中文效果差。

---

## 关键决策三：混合检索

只用向量检索会漏掉关键词精确匹配的文档。**混合检索 = 向量相似度 + BM25 关键词**。

在 Dify 中配置：
\`\`\`
检索模式：混合检索
向量权重：0.7
关键词权重：0.3
Top K：5（检索前5个结果）
\`\`\`

---

## 关键决策四：重排序（Reranking）

检索到 5 个候选结果后，用 Reranker 对它们重新打分，确保最相关的排在最前：

\`\`\`
推荐 Reranker：
- Cohere Rerank（效果最好，付费）
- BAAI/bge-reranker-v2（本地部署，免费）
\`\`\`

在 Dify 中：知识库设置 → 检索设置 → 开启「Rerank 模型」。

---

## 关键决策五：限制提示词

\`\`\`
# 好的 RAG 提示词
请严格基于以下参考资料回答问题，不要使用资料以外的知识：

[参考资料]
{{context}}

[用户问题]
{{question}}

如果参考资料中没有相关内容，请明确回复「根据现有资料无法回答此问题」，不要猜测。
\`\`\`

---

## 效果评估

用这 3 个指标评估你的 RAG 系统：

- **召回率**：相关文档有没有被检索到（目标 > 80%）
- **精确率**：检索到的文档中有多少是真正相关的（目标 > 70%）
- **答案忠实度**：AI 的回答有没有超出文档内容（目标：无幻觉）
`,
    level: 'intermediate',
    category: 'hands-on',
    tags: ['RAG', '知识库', '向量检索', 'Embedding', 'Dify', '避坑'],
    estimated_minutes: 25,
    related_tools: ['Dify', 'OpenClaw'],
    is_featured: true,
    published_at: '2025-05-12T08:00:00Z'
  },
  {
    slug: 'build-your-first-mcp-server',
    title: '从零开发一个 MCP Server：让 AI 读取你的私有数据',
    subtitle: '用 TypeScript 实现一个查询内部 Wiki 的 MCP 工具',
    summary:
      '自己写 MCP Server 并不难。本教程用 TypeScript 从零实现一个能查询内部 Wiki/Confluence 的 MCP Server，让 Claude 或 Cursor 直接访问你公司的私有知识，全程代码不超过 100 行。',
    content: `# 从零开发一个 MCP Server

## 需要什么基础？

- Node.js 基础（会写 JS/TS 函数）
- 理解 HTTP API 调用
- 已安装：Node.js 18+, npm

## 项目目标

创建一个 MCP Server，暴露一个工具：\`search_wiki\`

当 Claude 调用时：
\`\`\`
User: 我们公司的请假流程是什么？
Claude: [调用 search_wiki("请假流程")]
        → 返回 Wiki 相关页面内容
        → "根据公司 Wiki，请假流程为..."
\`\`\`

## 第一步：初始化项目

\`\`\`bash
mkdir my-wiki-mcp && cd my-wiki-mcp
npm init -y
npm install @modelcontextprotocol/sdk zod
npm install -D typescript @types/node ts-node
\`\`\`

创建 \`tsconfig.json\`：
\`\`\`json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "Node16",
    "moduleResolution": "Node16",
    "outDir": "./dist",
    "strict": true
  }
}
\`\`\`

## 第二步：实现 MCP Server

创建 \`src/index.ts\`：

\`\`\`typescript
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

// 创建 MCP Server 实例
const server = new McpServer({
  name: 'company-wiki',
  version: '1.0.0'
});

// 模拟 Wiki 数据（替换为真实 Confluence/Notion API）
const WIKI_DATA = [
  { title: '请假流程', content: '1. 提前3天在OA系统申请 2. 直属leader审批 3. HR备案' },
  { title: '报销流程', content: '1. 保留发票 2. 在费控系统提交 3. 财务审核（3个工作日）' },
  { title: '入职须知', content: '第一周：领取设备、开通权限、了解团队...' }
];

// 注册工具
server.tool(
  'search_wiki',                        // 工具名
  '搜索公司内部 Wiki 知识库',             // 描述（AI 靠这个决定何时调用）
  { query: z.string().describe('搜索关键词') },  // 参数 schema
  async ({ query }) => {
    // 简单关键词匹配（生产环境替换为向量搜索）
    const results = WIKI_DATA.filter(
      (item) =>
        item.title.includes(query) ||
        item.content.includes(query)
    );

    if (results.length === 0) {
      return { content: [{ type: 'text', text: '未找到相关 Wiki 页面' }] };
    }

    const text = results
      .map((r) => \`## \${r.title}\\n\${r.content}\`)
      .join('\\n\\n');

    return { content: [{ type: 'text', text }] };
  }
);

// 启动 Server
const transport = new StdioServerTransport();
await server.connect(transport);
console.error('Wiki MCP Server running...');
\`\`\`

## 第三步：接入 Claude Desktop

编辑 \`~/.config/claude-desktop/claude_desktop_config.json\`：

\`\`\`json
{
  "mcpServers": {
    "company-wiki": {
      "command": "node",
      "args": ["/absolute/path/to/my-wiki-mcp/dist/index.js"]
    }
  }
}
\`\`\`

编译并测试：
\`\`\`bash
npx tsc
# 重启 Claude Desktop → 在聊天中问「公司请假流程是什么？」
\`\`\`

## 第四步：对接真实 Confluence API

替换 \`search_wiki\` 内的逻辑：

\`\`\`typescript
import fetch from 'node-fetch';

async function searchConfluence(query: string) {
  const response = await fetch(
    \`https://your-domain.atlassian.net/wiki/rest/api/content/search?cql=text~"\${query}"&limit=3\`,
    {
      headers: {
        Authorization: \`Basic \${Buffer.from(\`\${EMAIL}:\${API_TOKEN}\`).toString('base64')}\`,
        Accept: 'application/json'
      }
    }
  );
  const data = await response.json();
  return data.results.map((r: any) => ({
    title: r.title,
    content: r.body?.storage?.value ?? ''
  }));
}
\`\`\`

## 完成！

你现在有了一个能让 AI 查询内部知识的 MCP Server，进阶方向：

- 添加 \`create_page\` 工具：让 AI 自动写入 Wiki
- 添加 \`list_recent_pages\` 工具：让 AI 了解最新更新
- 部署到服务器，支持远程访问
`,
    level: 'advanced',
    category: 'mcp',
    tags: ['MCP', 'TypeScript', 'MCP Server开发', 'Confluence', '私有数据'],
    estimated_minutes: 35,
    related_tools: ['Claude', 'Cursor'],
    is_featured: false,
    published_at: '2025-05-20T08:00:00Z'
  },
  {
    slug: 'ai-product-manager-workflow',
    title: 'AI 时代的产品经理工作流：从需求到原型全程提效',
    subtitle: '用 AI Agent 完成竞品分析、PRD撰写、原型描述一条龙',
    summary:
      '产品经理是最能用 AI 提效的岗位之一。本文展示一套完整的 AI 辅助产品工作流：用 Genspark 做竞品调研，用 Claude 撰写 PRD，用 Cursor 生成前端原型，把 1 周的工作压缩到 1 天。',
    content: `# AI 时代的产品经理工作流

## 你能节省多少时间？

| 传统流程 | 时间 | AI 辅助后 | 时间 |
|---------|------|---------|------|
| 竞品调研 | 2-3天 | Genspark 深度研究 | 2小时 |
| PRD 撰写 | 1-2天 | Claude 协作撰写 | 3小时 |
| 原型设计 | 2-3天 | AI 生成线框图描述 | 4小时 |
| **合计** | **5-8天** | **合计** | **1天** |

---

## 第一步：竞品调研（Genspark）

打开 [Genspark](https://genspark.ai)，输入：

\`\`\`
请帮我做一份关于「AI 写作助手」赛道的竞品分析，重点分析：
1. 主要玩家（Notion AI、Jasper、Copy.ai）的产品定位
2. 各自的核心差异化功能
3. 定价策略对比
4. 用户评价中反复提到的痛点
5. 市场空白点在哪里？
\`\`\`

Genspark 会自动搜索多个来源并生成结构化报告（约10分钟）。

---

## 第二步：用户洞察（整理访谈/评论）

把用户访谈录音转文字后，对 Claude 说：

\`\`\`
以下是10份用户访谈记录，请帮我：
1. 提取用户最高频的3个痛点
2. 找出用户描述问题时用的原话（原声引用）
3. 分析哪类用户群体最迫切需要解决方案

[粘贴访谈内容]
\`\`\`

---

## 第三步：撰写 PRD（Claude 协作模式）

不要让 AI 直接写完整 PRD，用「对话式迭代」效果更好：

**对话 1：确认范围**
\`\`\`
我在规划一个 AI 写作助手功能，目标用户是运营人员。
核心场景：从关键词生成 SEO 文章初稿（500-1000字）。
请帮我列出这个功能的 MVP 范围，不超过 5 个用户故事。
\`\`\`

**对话 2：补充验收标准**
\`\`\`
基于上面的用户故事 1（关键词输入），帮我写 Acceptance Criteria，
格式：Given/When/Then，至少覆盖正常流程和 3 个异常情况。
\`\`\`

**对话 3：整合成文档**
\`\`\`
现在把我们讨论的内容整合成一份完整的 PRD，
按照：背景→目标→用户故事→功能规格→非功能要求→成功指标 的结构。
\`\`\`

---

## 第四步：用 Cursor 生成原型

把 PRD 的关键功能描述发给 Cursor Agent：

\`\`\`
基于以下功能规格，用 React + Tailwind 生成一个可交互的原型页面：

功能：用户输入关键词和字数要求，点击生成按钮，显示 AI 生成的文章草稿。
组件需要：
- 关键词输入框（支持多个，用逗号分隔）
- 字数滑块（500/800/1000/1500）
- 语气选择（专业/轻松/SEO优化）
- 生成按钮（Loading 状态）
- 输出区域（Markdown 渲染）
\`\`\`

Cursor 会生成可以直接在浏览器预览的 HTML/React 组件。

---

## 最佳实践

1. **PRD 不要让 AI 一次写完**：对话式迭代，每步验证，质量更高
2. **竞品分析要指定来源**：让 AI 搜索 G2、Product Hunt 等专业评价平台
3. **原型描述要具体**：给 AI 的组件描述越细，生成的原型越接近你想要的
4. **用 AI 做预演**：把 PRD 给 Claude 扮演「挑剔的工程师」，提前发现问题
`,
    level: 'beginner',
    category: 'workflow',
    tags: ['产品经理', 'PRD', '竞品分析', 'AI提效', 'Genspark', 'Claude'],
    estimated_minutes: 15,
    related_tools: ['Genspark', 'Claude', 'Cursor', 'n8n'],
    is_featured: true,
    published_at: '2025-05-08T08:00:00Z'
  },
  // ── 2026-05-21 新增 SEO/GEO 优化批次 ─────────────────────────────────────
  {
    slug: 'langgraph-vs-langchain-agent-framework-guide',
    title: 'LangGraph vs LangChain：2026 年 Agent 框架选哪个？',
    subtitle: '从原理到实战，帮你做出正确选择',
    summary:
      'LangChain 是起点，LangGraph 是进化。本文从循环执行、状态持久化、可调试性三个维度深度对比两者，并给出不同场景下的选型建议，附带真实代码示例。',
    content: `# LangGraph vs LangChain：Agent 框架选型指南

## 先说结论

- **LangChain**：适合快速原型验证，链式调用简单任务
- **LangGraph**：适合生产级 Agent，需要循环、状态管理、人工干预节点

一句话：**LangChain 是乐高积木，LangGraph 是流程图引擎。**

---

## 为什么会有 LangGraph？

LangChain 在 2023 年爆火，帮助无数开发者快速搭起了 AI 应用原型。但生产环境很快暴露出问题：

1. **无法循环**：链（Chain）只能线性执行，Agent 遇到失败无法重试
2. **状态丢失**：每次调用都是全新的，无法记住上一步做了什么
3. **黑箱调试**：出了问题很难知道哪一步出错

LangGraph 用**有向图（DAG + 循环支持）**彻底重构了 Agent 的执行模型。

---

## 核心概念对比

| 维度 | LangChain | LangGraph |
|------|-----------|-----------|
| 执行模型 | 线性链式 | 有向图，支持循环 |
| 状态管理 | 无 / 手动维护 | 内置 StateGraph，自动持久化 |
| 人工干预 | 不支持 | 原生支持 interrupt 节点 |
| 调试工具 | LangSmith（有限） | LangSmith + 节点级追踪 |
| 学习曲线 | 低 | 中等 |
| 生产适用性 | 原型 | 生产级 |

---

## LangChain 代码示例

\`\`\`python
from langchain.agents import initialize_agent, Tool
from langchain.llms import OpenAI
from langchain.tools import DuckDuckGoSearchRun

search = DuckDuckGoSearchRun()
tools = [
    Tool(name="Search", func=search.run, description="搜索网页")
]

agent = initialize_agent(tools, OpenAI(temperature=0), agent="zero-shot-react-description")
result = agent.run("2026年最热门的AI Agent框架是什么？")
print(result)
\`\`\`

**问题**：如果搜索结果不够好，Agent 不会自动重试，直接返回结果。

---

## LangGraph 代码示例

\`\`\`python
from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated
import operator

class AgentState(TypedDict):
    messages: Annotated[list, operator.add]
    search_attempts: int

def should_continue(state: AgentState) -> str:
    """决定是继续搜索还是结束"""
    if state["search_attempts"] >= 3:
        return "end"
    last_msg = state["messages"][-1]
    if "找不到" in last_msg.content:
        return "retry"  # 循环回到搜索节点
    return "end"

# 构建图
workflow = StateGraph(AgentState)
workflow.add_node("search", search_node)
workflow.add_node("analyze", analyze_node)
workflow.add_conditional_edges("analyze", should_continue, {
    "retry": "search",  # 支持循环！
    "end": END
})
\`\`\`

**关键差异**：\`should_continue\` 可以把流程导回 \`search\` 节点，实现自动重试和迭代优化。

---

## 三种场景的选型建议

### 场景一：快速验证 AI 功能 → LangChain
你只是想测试「用 AI 搜索后总结结果」，LangChain 的 5 行代码搞定，没必要用 LangGraph。

### 场景二：复杂 Agent，需要多步迭代 → LangGraph
比如：「自动修 Bug → 运行测试 → 若测试失败继续修 → 最多重试5次」。这种循环逻辑必须用 LangGraph。

### 场景三：多 Agent 协作 → LangGraph 多图
LangGraph 支持 Supervisor Agent + Worker Agent 模式，每个 Agent 是一个独立的子图，通过消息通信协作，是目前构建多 Agent 系统最清晰的方案之一。

---

## 实战：用 LangGraph 构建一个能自我纠错的研究 Agent

\`\`\`python
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from langchain_anthropic import ChatAnthropic
from langchain_community.tools import TavilySearchResults

model = ChatAnthropic(model="claude-3-5-sonnet-20241022")
search_tool = TavilySearchResults(max_results=5)

class ResearchState(TypedDict):
    query: str
    search_results: list
    draft: str
    quality_score: int
    iterations: int

def search_node(state: ResearchState) -> ResearchState:
    results = search_tool.invoke(state["query"])
    return {**state, "search_results": results, "iterations": state.get("iterations", 0) + 1}

def write_node(state: ResearchState) -> ResearchState:
    context = "\\n".join([r["content"] for r in state["search_results"]])
    response = model.invoke(f"基于以下信息写一份研究报告：{context}")
    return {**state, "draft": response.content}

def evaluate_node(state: ResearchState) -> ResearchState:
    # 让 AI 给自己的报告打分
    score_response = model.invoke(
        f"给以下报告的质量打分（1-10），只返回数字：\\n{state['draft']}"
    )
    score = int(score_response.content.strip())
    return {**state, "quality_score": score}

def route(state: ResearchState) -> str:
    if state["quality_score"] >= 7 or state["iterations"] >= 3:
        return "end"
    return "retry"  # 分数不够，重新搜索

# 组装
graph = StateGraph(ResearchState)
graph.add_node("search", search_node)
graph.add_node("write", write_node)
graph.add_node("evaluate", evaluate_node)
graph.set_entry_point("search")
graph.add_edge("search", "write")
graph.add_edge("write", "evaluate")
graph.add_conditional_edges("evaluate", route, {"end": END, "retry": "search"})

# 支持断点续传
memory = MemorySaver()
app = graph.compile(checkpointer=memory)

result = app.invoke({"query": "2026年最具潜力的AI应用场景", "iterations": 0})
print(result["draft"])
\`\`\`

---

## 迁移成本

如果你已经有 LangChain 代码，迁移到 LangGraph 的成本：
- **工具定义**：完全复用，无需改动
- **模型调用**：完全复用
- **Agent 逻辑**：需要重新建模为图结构（主要工作量）

一个中等复杂度的 LangChain Agent 迁移到 LangGraph 大约需要 4-8 小时。

---

## 总结

LangGraph 不是 LangChain 的竞争者，而是它的升级。对于任何严肃的生产级 Agent，请直接选 LangGraph。LangChain 适合用来学习和验证概念。

👉 [查看更多 Agent 教程](/tutorials) | [浏览 Agent Hub](/agents)
`,
    level: 'intermediate',
    category: 'agent',
    tags: ['LangGraph', 'LangChain', 'Agent框架', 'Python', '选型指南'],
    estimated_minutes: 18,
    related_tools: ['LangGraph', 'LangChain', 'Claude', 'OpenAI'],
    is_featured: true,
    published_at: '2026-05-21T08:00:00Z'
  },
  {
    slug: 'gmail-ai-automation-n8n-complete-guide',
    title: '用 n8n + AI 自动处理邮件：每天节省 90 分钟的真实方案',
    subtitle: '从自动分类到生成回复草稿，附完整工作流配置',
    summary:
      '本文分享一套经过真实验证的 Gmail 智能处理方案：n8n + OpenAI 自动识别邮件类型、判断优先级、生成回复草稿，并推送到 Slack 提醒，亲测每天节省超过 90 分钟。',
    content: `# Gmail + n8n + AI：打造自动邮件助手

## 痛点：邮件处理吃掉太多时间

如果你每天要处理 50+ 封邮件，其中真正需要你亲自回复的可能不到 20%。剩下的是：

- 垃圾广告邮件（直接删）
- 抄送你的 FYI 邮件（读一眼存档）
- 需要简单确认的邮件（"好的，收到"）
- 真正需要思考和回复的邮件

**问题是**：你得先打开每一封才能判断。这个过程本身就是时间杀手。

---

## 方案架构

\`\`\`
Gmail 收件箱
    ↓ (n8n Gmail Trigger，实时监听)
n8n 工作流
    ├── OpenAI 分类节点：判断邮件类型 + 优先级
    ├── 若优先级=高 → 生成回复草稿 + Slack 通知
    ├── 若类型=广告 → 自动打标签"广告"并归档
    └── 若类型=FYI → 打标签"已读/待查"并归档
\`\`\`

---

## 第一步：n8n 环境准备

**云端（推荐新手）**：注册 [n8n.cloud](https://n8n.cloud)，免费计划够用  
**自托管**：

\`\`\`bash
docker run -it --rm \\
  --name n8n \\
  -p 5678:5678 \\
  -v ~/.n8n:/home/node/.n8n \\
  n8nio/n8n
\`\`\`

访问 \`http://localhost:5678\` 开始配置。

---

## 第二步：连接 Gmail

1. 在 n8n 创建新工作流
2. 添加 **Gmail Trigger** 节点
3. 点击「Credential」→「Create New」→ 按照 OAuth2 流程授权 Google 账户
4. 触发条件选「New Email」，过滤条件：Label = INBOX

---

## 第三步：AI 分类节点

添加 **OpenAI** 节点，配置如下：

**Prompt 模板**：

\`\`\`
你是一个邮件助手。分析以下邮件，返回 JSON 格式结果：

发件人: {{ $json.from }}
主题: {{ $json.subject }}
正文（前500字）: {{ $json.text.slice(0, 500) }}

返回格式：
{
  "type": "urgent|reply_needed|fyi|spam|newsletter",
  "priority": "high|medium|low",
  "suggested_label": "标签名称",
  "reply_hint": "如果需要回复，一句话概括应该回复什么"
}

只返回JSON，不要其他内容。
\`\`\`

---

## 第四步：条件分支

添加 **IF** 节点，根据 AI 返回的 \`priority\` 字段分支：

**高优先级分支**：
- 添加 **OpenAI** 节点生成完整回复草稿
- 添加 **Gmail** 节点创建草稿（不自动发送！）
- 添加 **Slack** 节点发送通知：「收到高优先级邮件，草稿已准备」

**垃圾邮件分支**：
- 添加 **Gmail** 节点：添加 Label「AI-垃圾」+ 归档

**FYI 分支**：
- 添加 **Gmail** 节点：添加 Label「已处理」+ 归档

---

## 回复草稿生成 Prompt

\`\`\`
你是我的邮件助手，帮我起草以下邮件的回复：

原邮件主题：{{ $json.subject }}
原邮件内容：{{ $json.text }}
回复方向：{{ $('OpenAI').item.json.reply_hint }}

要求：
- 语气专业礼貌
- 篇幅简洁，不超过150字
- 第一人称
- 不要加签名（我会自己加）
\`\`\`

---

## 第五步：测试与调优

运行一周后，根据实际情况调整分类 Prompt：

**常见问题**：
- **误判率高**：在 Prompt 中加入更多你的行业/职业背景
- **回复草稿太生硬**：加入你过去的邮件样本作为 few-shot 示例
- **漏掉重要邮件**：调低 "urgent" 的判断门槛

---

## 实际效果

亲测数据（处理技术团队邮件，日均 60 封）：

| 邮件类型 | 占比 | 处理方式 | 节省时间 |
|---------|------|---------|---------|
| 广告/通讯 | 35% | 自动归档 | 18分钟 |
| FYI 抄送 | 25% | 自动标记 | 20分钟 |
| 简单确认 | 20% | AI 生成草稿，30秒review | 35分钟 |
| 需要思考 | 20% | 仍然手动处理 | 不节省 |

**总计节省：约 73 分钟/天**

---

## 注意事项

1. **不要让 AI 自动发送邮件**：生成草稿 + 人工确认是最安全的方式
2. **隐私保护**：如果邮件含敏感信息，使用本地部署的 Ollama 替代 OpenAI
3. **异常监控**：在 n8n 设置错误通知，避免重要邮件被误处理

👉 [查看更多自动化方案](/usecases) | [探索 MCP 工具](/mcp)
`,
    level: 'intermediate',
    category: 'workflow',
    tags: ['n8n', 'Gmail', '邮件自动化', 'OpenAI', '效率工具', 'workflow'],
    estimated_minutes: 20,
    related_tools: ['n8n', 'OpenAI', 'Gmail', 'Slack'],
    is_featured: true,
    published_at: '2026-05-21T09:00:00Z'
  },
  {
    slug: 'openai-assistants-api-complete-guide-2026',
    title: 'OpenAI Assistants API 完整指南：从零构建带记忆的 AI 助手',
    subtitle: '不用自己管状态，官方 API 帮你实现持久对话和文件分析',
    summary:
      'OpenAI Assistants API 内置线程管理、文件搜索和代码执行，相比原始 Chat Completions API 大幅降低了有状态 AI 应用的开发复杂度。本文从原理到实战，带你从零构建一个能「记住你」的 AI 助手。',
    content: `# OpenAI Assistants API 完整指南

## Assistants API 解决了什么问题？

用普通 Chat Completions API 构建对话 AI 时，开发者需要自己：
- 维护对话历史（每次把所有消息发给 API）
- 管理上下文长度（超出就要截断）
- 实现文件上传和解析
- 处理代码执行的沙箱环境

**Assistants API 把这些全包了。**

---

## 核心概念

\`\`\`
Assistant（助手）
  ├── 配置项：系统指令、工具权限、模型选择
  └── 可以跨 Thread 复用

Thread（线程）= 一次完整的对话
  ├── 自动管理历史消息
  └── 超出上下文长度时自动截断旧消息

Message（消息）= Thread 中的一条消息
  └── 支持文本、图片、文件

Run（运行）= 让 Assistant 处理 Thread 的一次执行
  └── 状态：queued → in_progress → completed
\`\`\`

---

## 快速开始

\`\`\`python
from openai import OpenAI

client = OpenAI()

# 第一步：创建 Assistant（只需创建一次，保存 ID 复用）
assistant = client.beta.assistants.create(
    name="个人助手",
    instructions="""你是一个专业的个人助手。
    - 记住用户提到的个人信息和偏好
    - 回答简洁，避免废话
    - 遇到需要计算的问题，使用 code_interpreter 工具
    """,
    tools=[{"type": "code_interpreter"}, {"type": "file_search"}],
    model="gpt-4o",
)
print(f"Assistant ID: {assistant.id}")  # 保存这个ID！
\`\`\`

---

## 完整对话流程

\`\`\`python
# 每个用户一个 Thread（保存 thread_id 到数据库）
thread = client.beta.threads.create()
print(f"Thread ID: {thread.id}")

# 用户发消息
client.beta.threads.messages.create(
    thread_id=thread.id,
    role="user",
    content="我叫张三，在北京工作，帮我分析一下北京AI创业公司的趋势"
)

# 运行 Assistant
run = client.beta.threads.runs.create_and_poll(
    thread_id=thread.id,
    assistant_id=assistant.id,  # 你保存的 Assistant ID
)

# 获取回复
if run.status == "completed":
    messages = client.beta.threads.messages.list(thread_id=thread.id)
    print(messages.data[0].content[0].text.value)
\`\`\`

---

## 文件分析能力

\`\`\`python
# 上传文件
with open("financial_report.pdf", "rb") as f:
    file = client.files.create(file=f, purpose="assistants")

# 创建带文件的消息
client.beta.threads.messages.create(
    thread_id=thread.id,
    role="user",
    content="帮我总结这份财报的关键数字",
    attachments=[
        {"file_id": file.id, "tools": [{"type": "file_search"}]}
    ]
)
\`\`\`

---

## 代码执行（Code Interpreter）

Assistants API 内置 Python 沙箱，AI 可以直接运行代码：

\`\`\`python
client.beta.threads.messages.create(
    thread_id=thread.id,
    role="user",
    content="帮我分析一下这份 CSV 的数据分布，并生成图表"
)
# AI 会自动写 Python 代码、运行、返回图表
\`\`\`

---

## 持久化：把对话存起来

对于生产应用，需要把 Thread ID 和用户绑定：

\`\`\`python
import sqlite3

def get_or_create_thread(user_id: str) -> str:
    """为每个用户维护一个持久 Thread"""
    conn = sqlite3.connect("threads.db")
    cursor = conn.cursor()
    
    cursor.execute("SELECT thread_id FROM users WHERE user_id = ?", (user_id,))
    result = cursor.fetchone()
    
    if result:
        return result[0]
    
    # 新用户，创建 Thread
    thread = client.beta.threads.create()
    cursor.execute(
        "INSERT INTO users (user_id, thread_id) VALUES (?, ?)",
        (user_id, thread.id)
    )
    conn.commit()
    return thread.id
\`\`\`

---

## 费用说明

| 费用项 | 计费方式 | 备注 |
|--------|---------|------|
| 模型推理 | 按 token | 与 Chat API 相同 |
| Code Interpreter | $0.03/次 Session | 每次 Run 独立计算 |
| File Search | $0.10/GB/天 | 向量存储费用 |

**建议**：测试阶段关闭 File Search 节省费用，仅在需要时开启。

---

## 什么时候用 Assistants API vs Chat API？

| 场景 | 推荐 API |
|------|---------|
| 简单的单次问答 | Chat Completions |
| 需要多轮对话记忆 | Assistants API |
| 需要分析上传的文件 | Assistants API |
| 需要执行代码 | Assistants API |
| 要求极低延迟 | Chat Completions |
| 成本极度敏感 | Chat Completions |

---

## 常见问题

**Q：Thread 的消息会一直保存吗？**  
A：默认保存 60 天，之后自动删除。

**Q：可以给 Assistant 设置记忆上限吗？**  
A：不能直接设置，但可以在系统提示词中要求 AI「总结并丢弃超过 N 轮的对话」。

**Q：Assistants API 支持流式输出吗？**  
A：支持，使用 \`stream=True\` 参数。

👉 [查看 MCP 工具生态](/mcp) | [探索 AI Agent 用例](/usecases)
`,
    level: 'intermediate',
    category: 'hands-on',
    tags: ['OpenAI', 'Assistants API', 'API教程', '对话AI', 'Python'],
    estimated_minutes: 22,
    related_tools: ['OpenAI', 'GPT-4o'],
    is_featured: true,
    published_at: '2026-05-21T10:00:00Z'
  },
  {
    slug: 'mcp-server-security-best-practices-2026',
    title: 'MCP Server 安全使用指南：避开这 7 个高危配置',
    subtitle: '给 AI 赋权不等于失控，掌握这些原则保护你的系统',
    summary:
      '随着 MCP 生态爆发，越来越多人在本地和生产环境部署 MCP Server。本文整理了实际踩过的 7 个安全坑，以及对应的防护方案，帮你在享受 AI 工具威力的同时不失去系统控制权。',
    content: `# MCP Server 安全使用指南

## 为什么需要关注 MCP 安全？

MCP Server 给 AI 模型赋予了操控现实系统的能力：
- filesystem MCP → AI 可以读写你的任意文件
- github MCP → AI 可以合并 PR、删除分支
- postgres MCP → AI 可以执行任意 SQL
- slack MCP → AI 可以以你的名义发消息

这些能力非常强大，但也意味着一旦出错，后果可能是灾难性的。

---

## 高危配置 #1：文件系统权限过大

**危险配置**：
\`\`\`json
{
  "filesystem": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-filesystem", "/"]
  }
}
\`\`\`
这给了 AI 访问整个根目录的权限，包括 \`/etc/passwd\`、SSH 密钥等敏感文件。

**安全配置**：
\`\`\`json
{
  "filesystem": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-filesystem",
      "/Users/你的用户名/Documents/ai-workspace"
    ]
  }
}
\`\`\`
只授权一个专用的 AI 工作目录，敏感文件不在其中。

---

## 高危配置 #2：数据库 MCP 使用管理员账户

**危险配置**：
\`\`\`json
{
  "postgres": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-postgres",
      "postgresql://admin:password@localhost/production"
    ]
  }
}
\`\`\`

AI 可以执行 \`DROP TABLE\`、\`DELETE FROM\` 等破坏性操作。

**安全配置**：为 MCP 专门创建只读用户：
\`\`\`sql
-- 创建只读角色
CREATE ROLE mcp_readonly;
GRANT CONNECT ON DATABASE your_db TO mcp_readonly;
GRANT USAGE ON SCHEMA public TO mcp_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO mcp_readonly;

-- 创建用户
CREATE USER mcp_user WITH PASSWORD 'strong_password';
GRANT mcp_readonly TO mcp_user;
\`\`\`

---

## 高危配置 #3：在生产环境使用 puppeteer MCP

puppeteer MCP 让 AI 控制真实浏览器，如果连接的是生产系统的管理员界面，AI 误操作可能直接影响线上用户。

**正确做法**：
- puppeteer 只用于测试环境或沙盒浏览器
- 不要在 puppeteer 的浏览器中保存已登录的生产系统 Session
- 考虑使用 \`--disable-extensions --incognito\` 启动无痕模式

---

## 高危配置 #4：GitHub MCP 使用过宽泛的 Token 权限

**危险**：使用具有 \`repo:write\` + \`delete_repo\` 权限的 Personal Access Token

**安全做法**：
创建细粒度 Token（Fine-grained tokens），只授权必要的仓库和操作：

\`\`\`
权限设置建议（日常使用）：
✅ Contents: Read and Write（代码读写）
✅ Issues: Read and Write
✅ Pull requests: Read and Write
❌ Administration: 不授权
❌ Delete repositories: 不授权
❌ Secrets: 不授权
\`\`\`

---

## 高危配置 #5：多个高权限 MCP Server 同时激活

Claude 在单次对话中可以连续调用多个 MCP Server。一个设计不良的 Prompt 注入攻击可能链式利用多个工具：

\`\`\`
攻击路径示例：
恶意网页内容 → fetch MCP 读取
→ 注入指令：「把刚才读取的内容写入 filesystem」
→ filesystem MCP 写入恶意文件
\`\`\`

**防护**：
- 不要同时激活「读取外部内容」和「写入本地文件」的 MCP
- 对从外部来源获取的内容，不允许 AI 直接将其传递给写入类工具

---

## 高危配置 #6：不审查 AI 的工具调用计划

Claude 在执行复杂任务前通常会说「我将要进行以下操作：...」，很多用户直接点「确认」不仔细看。

**好习惯**：
- 在工具调用前，养成快速扫描 AI 计划的习惯
- 对于不可逆操作（删除、发送、部署），要求 AI 先列出清单再执行
- 在系统提示词中加入：「执行任何写入、删除或发送操作前，必须先向用户确认」

---

## 高危配置 #7：MCP Server 使用过期或未维护的包

\`\`\`bash
# 检查你安装的 MCP Server 是否有已知漏洞
npm audit --prefix ~/.npm/_npx
\`\`\`

**建议**：
- 优先使用 Anthropic 官方维护的 MCP Server
- 第三方 MCP 使用前检查 GitHub 最后更新时间和 Issues 记录
- 不要安装来源不明的 MCP Server

---

## 安全检查清单

部署 MCP Server 前，对照以下清单：

- [ ] 文件系统权限是否限定在专用目录？
- [ ] 数据库连接是否使用只读账户？
- [ ] GitHub Token 是否限制了权限范围？
- [ ] 是否避免了多个高权限工具同时激活？
- [ ] 系统提示词中是否要求 AI 在不可逆操作前确认？
- [ ] MCP Server 包是否来自可信来源且定期更新？

---

## 小结

MCP 的强大来自于它给 AI 赋予了真实能力，安全使用的核心原则只有一条：

**最小权限原则**——只给 AI 完成当前任务所需的最小权限，任务完成后立即收回。

👉 [查看全部 MCP Server](/mcp) | [了解 MCP 协议基础](/tutorials/what-is-mcp)
`,
    level: 'intermediate',
    category: 'mcp',
    tags: ['MCP', '安全', '最佳实践', 'MCP Server', '权限控制'],
    estimated_minutes: 15,
    related_tools: ['filesystem', 'github', 'postgres', 'puppeteer'],
    is_featured: true,
    published_at: '2026-05-21T11:00:00Z'
  },
  {
    slug: 'ai-content-marketing-sop-2026',
    title: '内容营销团队的 AI 工作流 SOP：从选题到发布全自动化',
    subtitle: '一套让3人内容团队输出能力媲美10人的可复制方案',
    summary:
      '本文分享一套真实可落地的内容营销 AI 工作流 SOP，涵盖选题研究、大纲生成、全文写作、SEO 优化、配图描述和多平台适配，让小团队也能以低成本保持高频内容输出。',
    content: `# 内容营销团队的 AI 工作流 SOP

## 背景：为什么需要标准化 AI 工作流？

很多内容团队「会用 AI」，但没有 SOP。每个人用 AI 的方式不同，效果参差不齐，最终陷入：
- AI 生成的内容太像 AI 写的，需要大量修改
- 流程不可复制，依赖个别「会用 AI 的人」
- 无法衡量 AI 到底帮团队提了多少效

以下是一套经过多个内容团队验证的标准化工作流。

---

## 整体流程图

\`\`\`
[选题研究] → [受众分析] → [大纲生成] → [全文写作]
      ↓                                        ↓
[热点监控]                              [SEO 优化]
                                              ↓
                              [多平台适配] → [发布]
\`\`\`

---

## 阶段一：选题研究（20分钟 → 5分钟）

**工具**：Perplexity + Claude

**Prompt 模板**：

\`\`\`
你是一个内容策略师。我们的目标受众是[描述受众：如"月收入2万以上、对AI感兴趣的职场人士"]。

请帮我：
1. 找出过去2周这个人群最关心的5个话题（基于你的知识）
2. 对每个话题，评估：a) 受众关心程度（1-5）b) 竞争激烈程度（1-5）c) 我们的内容差异化机会
3. 推荐1个最适合我们本周写的话题，并说明理由

我们的内容风格：[描述：如"实用、有数据支撑、不说废话"]
我们过去表现最好的话题类型：[描述过往爆款主题]
\`\`\`

---

## 阶段二：受众与搜索意图分析（新增环节，不可跳过）

很多 AI 生成内容读起来是对的，但没人想看——因为它不是在回答真实的人的真实问题。

**操作**：

\`\`\`
针对话题"[你的选题]"，帮我：
1. 列出5个这个受众在Google/百度真实会搜索的问题（要口语化，不要书面语）
2. 分析他们搜索这个问题背后的真实动机是什么（表面诉求 vs 深层需求）
3. 他们读完文章后，希望能做到什么？（学到什么、感受到什么、行动什么）
4. 他们最大的疑虑/反驳是什么？我们的内容需要提前解答
\`\`\`

---

## 阶段三：大纲生成（30分钟 → 8分钟）

**关键**：大纲的质量决定文章质量，不要跳过这步。

\`\`\`
基于以上受众分析，为话题"[选题]"生成文章大纲。

要求：
- 标题要能引起目标受众的点击欲望（不用标题党，但要精准击中痛点）
- 每个章节必须有「交付物」：读者看完这节能得到什么
- 在大纲中标注：哪些地方应该放数据/案例/截图
- 结尾必须有明确的行动号召（不是"欢迎关注"，是让读者做一件具体的事）
- 控制在6-8个主要章节内
\`\`\`

**人工审核要点**：
- 逻辑是否流畅（不跳跃）
- 是否真的在解决受众问题（而不是在展示我们的知识）
- 是否有差异化（和已有文章区分）

---

## 阶段四：全文写作（2小时 → 25分钟）

不要让 AI 一次性生成全文，而是**分节写作**：

\`\`\`
现在写第[X]节：[节标题]

背景：
- 上一节的结论是：[总结]
- 本节要解决的问题：[本节交付物]
- 目标读者此刻的状态：[他们刚读完上节后的心理状态]

写作要求：
- 字数：[400-600字]
- 开头不要是"在当今..."或"随着AI的发展..."（这两种开头立刻删除）
- 至少包含1个具体的例子或数据
- 语气：[口语化/专业/直接/...]
- 结尾要自然引出下一节
\`\`\`

---

## 阶段五：去 AI 味（关键步骤）

AI 写的内容有几个特征很容易被识别：
1. 大量「首先...其次...最后...」的排比结构
2. 过度使用「值得注意的是」「重要的是」「不可忽视的是」
3. 每段结尾爱做总结：「总体而言...」
4. 很少有第一人称的主观判断

**处理方式**：

\`\`\`
对以下段落进行改写，去掉AI写作的痕迹：
[粘贴段落]

改写要求：
- 加入1个具体的、有细节的例子（可以是假设的场景，但要真实感）
- 把1-2处客观陈述改为主观判断（"我认为..."、"我们的经验是..."）
- 删除所有"值得注意的是"、"总体而言"类表达
- 至少有1处不完美的表达（不是错误，但是人类才会这样说话的表达）
\`\`\`

---

## 阶段六：SEO 优化（15分钟 → 5分钟）

\`\`\`
对以下文章做SEO优化：

目标关键词：[主关键词] + [3-5个长尾关键词]

优化要求：
1. 检查标题是否自然包含主关键词
2. 前100字是否出现主关键词
3. 建议2-3处可以自然插入长尾关键词的位置
4. 生成1个Meta Description（120-150字，包含主关键词，有吸引点击的动作词）
5. 建议3个内链锚文本和目标页面
\`\`\`

---

## 阶段七：多平台适配（1小时 → 20分钟）

同一篇文章，微信公众号、小红书、LinkedIn 的格式完全不同：

\`\`\`
把以下文章改写为[平台]版本：

平台特点：
- 微信公众号：可长篇，但开头5行决定是否被读，可以有二维码引导
- 小红书：800字以内，表情符号，3-5个关键截图，话题标签
- LinkedIn：英文，专业语气，数据驱动，开头1-2句要引发共鸣

[粘贴原文]
\`\`\`

---

## 效率数据对比

| 环节 | 传统流程 | AI 工作流 | 节省 |
|------|---------|---------|------|
| 选题研究 | 2小时 | 20分钟 | 83% |
| 大纲生成 | 30分钟 | 8分钟 | 73% |
| 全文写作 | 3-4小时 | 30分钟 | 87% |
| SEO优化 | 30分钟 | 8分钟 | 73% |
| 多平台适配 | 2小时 | 25分钟 | 79% |
| **总计** | **8-9小时** | **约1.5小时** | **~83%** |

---

## 常见误区

❌ **直接把 AI 生成的内容发出去**：读者很快能感受到，信任度下降  
❌ **用 AI 代替选题判断**：选题是人的核心价值，AI 辅助参考即可  
❌ **所有内容都 AI 化**：保持 20-30% 的内容是人工原创，维护品牌个性  

👉 [查看更多营销自动化方案](/usecases) | [探索 AI Agent 工具](/agents)
`,
    level: 'intermediate',
    category: 'workflow',
    tags: ['内容营销', 'SOP', 'AI写作', 'SEO', '工作流', '营销自动化'],
    estimated_minutes: 20,
    related_tools: ['Claude', 'Perplexity', 'n8n', 'Dify'],
    is_featured: true,
    published_at: '2026-05-21T12:00:00Z'
  },
  // ── 新增（2026-05-24）SEO/GEO 优化批次 ──────────────────────────────────
  {
    slug: 'chatgpt-plus-vs-claude-pro-worth-it-2026',
    title: 'ChatGPT Plus 和 Claude Pro 哪个值？2026 年真实对比',
    subtitle: '花同样的 $20/月，你应该订哪一个？',
    summary:
      '每个月 $20，订 ChatGPT Plus 还是 Claude Pro？这是很多人在问的问题，但大多数对比文章只讲参数不讲实际使用体验。本文基于真实的日常工作场景——写作、编程、分析、多轮对话——给你一个有用的答案。',
    content: `# ChatGPT Plus 和 Claude Pro 哪个值？

坦白说，这个问题我被朋友问过不下十次。每次回答完，对方都觉得不够直接。所以这次我想换一种方式来聊——不讲 benchmark，只讲在真实工作里哪个更好用。

## 先说结论（避免浪费时间）

**如果你主要做这些事，选 ChatGPT Plus：**
- 写代码（Code Interpreter / 高级数据分析）
- 生成图片（DALL-E 内置）
- 用各种插件和 GPT 市场
- 语音对话（Advanced Voice Mode）
- 需要联网搜索的任务

**如果你主要做这些事，选 Claude Pro：**
- 写长文、写作润色、文案创作
- 处理超长文档（上传一整本书分析）
- 需要 AI 态度更认真、更少"幻觉"的工作
- 代码调试（尤其是解释思路这件事 Claude 更耐心）
- 希望 AI 给你真实反馈，而不是一味迎合

**如果你两样都需要**：有人同时订两个。$40/月换来两种完全不同的 AI 能力，很多重度用户觉得值。

---

## 核心功能对比（2026年5月）

| 功能 | ChatGPT Plus | Claude Pro |
|------|-------------|-----------|
| 底层模型 | GPT-4o + o1/o3 系列 | Claude 3.7 / Claude 4 Sonnet |
| 上下文窗口 | 128K token | 200K token（≈15万字） |
| 图像生成 | ✅ DALL-E 3 内置 | ❌ 不支持 |
| 联网搜索 | ✅ 实时搜索 | ✅ 支持（有限） |
| 文件上传 | ✅ 支持多格式 | ✅ 支持，处理能力更强 |
| 代码执行 | ✅ Python 沙盒 | ❌ 不支持原生执行 |
| 语音对话 | ✅ Advanced Voice | ❌ 不支持 |
| Projects | ✅ 项目记忆 | ✅ Projects 功能 |
| API 访问 | 另外付费 | 另外付费 |
| 价格 | $20/月 | $20/月 |

---

## 写作场景：Claude 赢，但不是碾压

我用相同的需求测试了两款：「帮我把这份 2000 字的工作总结改写成更有说服力的版本，保留所有数据，语气要自信但不夸张」。

**ChatGPT Plus 的结果**：改得很流畅，加了一些 action-oriented 的动词，但有几处细节我没要求它改却被改掉了，而且没有解释为什么这样修改。

**Claude 的结果**：不仅改了，还在最后附上了一段"修改说明"——指出了哪 3 处是结构性调整，哪 2 处是语气问题。这让我可以学到东西，也让我能更快判断要不要接受这些改动。

这不是个大差距，但如果你每天要做很多写作工作，Claude 这种"会解释自己"的特点会节省你大量来回确认的时间。

---

## 编程场景：取决于你在做什么

**调试和理解代码** → Claude 更好。当你看着一段报错不知道从哪里开始，Claude 会先帮你定位问题根源，然后一步一步解释修复逻辑。GPT-4o 通常直接给你修改后的代码，但如果你还不理解为什么，下次遇到类似问题还是会卡住。

**生成完整项目** → ChatGPT Plus 的 Code Interpreter 有优势。能直接运行 Python 代码、生成可视化图表、处理数据文件，这些在 Claude 里都需要你自己复制代码去跑。

**Cursor 用户注意**：如果你用 Cursor 或其他 AI 编程 IDE，Claude 的 API 通常是 Sonnet 级别，和 Claude Pro 里用的模型有所不同。两者订阅相对独立。

---

## 长文档处理：Claude 明显更强

这是 Claude 最突出的优势之一。200K token 的上下文（约 15 万字）意味着你可以：

- 一次上传一份完整的技术文档或学术论文
- 把合同全文丢进去，让 AI 找出所有风险条款
- 上传多个月的会议记录，让 AI 帮你梳理项目决策历史

我自己测试过把一本 300 页的 PDF 上传到 Claude，问它「这本书里作者最核心的几个论点是什么，在哪几章有具体论证？」——给出的答案非常准确，连页码都能说对。

同样的文档，ChatGPT 在处理超过 100K token 时会开始"遗忘"前面的内容，对话越长越不可靠。

---

## 我实际遇到的一些细节差异

**Claude 会更诚实**：问 Claude 它不确定的问题，它会告诉你"我没有把握"。ChatGPT 有时候会用听起来很自信的方式给出错误答案——这对需要准确信息的工作来说是个隐患。

**ChatGPT 的 Projects 功能更成熟**：可以在项目里上传参考文档，让 AI 在整个项目的对话里都参考这些背景资料。Claude 的 Projects 功能类似，但上手体验稍微复杂一些。

**速度**：Claude Pro 在高峰期有时候响应会变慢，ChatGPT Plus 的速度相对更稳定。

---

## 常见问题

**Q：能不能只订一个月试试再决定？**
A：可以，两家都支持按月订阅、随时取消。建议先把你最常做的 3 种工作拿去测试一下，比任何评测文章都准。

**Q：学生有折扣吗？**
A：ChatGPT 有学生优惠（部分地区有折扣），Claude 目前没有专门的学生计划。两家都有免费版可以先体验。

**Q：免费版够用吗？**
A：免费版的 ChatGPT（GPT-4o mini）和 Claude 3.5 Sonnet（免费有次数限制）对于轻度使用已经够用。如果你每天要大量使用，付费版的次数限制会少很多。

**Q：两个都订有必要吗？**
A：对于重度 AI 用户来说，有相当一部分人两个都订。$40/月在换来的生产力提升面前，很多人觉得值得。

---

## 最终建议

与其纠结哪个"更好"，不如问自己：**你每天最频繁的工作是什么？**

写作、分析、长文档 → Claude Pro  
编程、图像生成、多工具整合 → ChatGPT Plus  
都需要 → 两个都订，或者主订一个辅助用另一个的免费版

👉 [查看更多 AI 工具对比](/models) | [浏览 AI Agent 推荐](/agents)
`,
    level: 'beginner',
    category: 'concept',
    tags: ['ChatGPT Plus', 'Claude Pro', 'AI工具对比', '订阅值不值', 'GPT-4o', 'Claude 4'],
    estimated_minutes: 13,
    related_tools: ['ChatGPT', 'Claude'],
    is_featured: true,
    published_at: '2026-05-24T08:00:00Z'
  },
  {
    slug: 'best-free-ai-tools-complete-guide-2026',
    title: '2026 年最好用的免费 AI 工具：零成本入门 AI 的完整清单',
    subtitle: '不花一分钱，这 12 款工具已经够用了',
    summary:
      '很多人觉得 AI 工具都要付费，其实不然。2026 年，免费 AI 工具的质量已经远超两年前的付费产品。本文整理 12 款真正好用的免费 AI 工具，覆盖写作、编程、图像、搜索、自动化等主要场景，帮你零成本开始使用 AI。',
    content: `# 2026 年最好用的免费 AI 工具完整清单

两年前，"免费 AI"基本意味着"够用但不够好"。现在不一样了。

我花了一个月时间，把各种免费 AI 工具轮流用在真实工作里，筛选出这 12 款——不是因为它们有免费版，而是因为它们的免费版**在实际工作中真的有用**。

## 对话 & 写作

### 1. Claude（Anthropic）

**免费层级**：每天有限次数的 Claude 3.5 Sonnet

Claude 的免费版是目前写作场景里最强的选择之一。如果你主要用 AI 来写文案、改文章、分析文档，Claude 免费版的质量完全可以撑起日常工作。

唯一的限制是每天的使用次数——高峰期有时候会遇到限速。解决方法：把重要任务集中在早上处理，避开晚上高峰。

### 2. ChatGPT（GPT-4o mini）

**免费层级**：无限次 GPT-4o mini，有限次 GPT-4o

ChatGPT 的免费版在 2024 年底大幅升级，GPT-4o mini 已经可以完成大多数日常任务。对于入门用户，免费版够用的时间比你想象的长。

**最适合**：日常问答、简单文案、编程入门、学习辅助

### 3. Gemini（Google）

**免费层级**：Gemini 1.5 Flash（无限次）

Gemini 1.5 Flash 速度快、有长上下文，和 Google Workspace 深度整合。如果你的工作大量依赖 Gmail、Google Docs、Google Drive，Gemini 免费版的优势很突出——直接在这些工具里调用，不用切换界面。

---

## 搜索 & 研究

### 4. Perplexity AI（免费版）

**免费层级**：每天 5 次 Pro 搜索，基础搜索无限次

Perplexity 是目前最好的 AI 搜索工具，免费版已经非常实用。它的核心价值在于：每个答案都有来源引用，可以点击验证。相比 Google 给你 10 条链接让你自己读，Perplexity 直接给你答案。

我现在遇到需要查资料的问题，基本上先去 Perplexity，而不是 Google。

**特别提示**：免费版的基础搜索（不是 Pro 搜索）是无限次的，对日常使用完全够用。

### 5. You.com

**免费层级**：基础 AI 搜索免费

You.com 是 Perplexity 的有力替代，免费版几乎没有限制。特别适合技术类查询——它有专门针对代码问题优化的搜索模式。

---

## 编程 & 开发

### 6. GitHub Copilot（学生/开源免费）

**免费条件**：学生（GitHub Education）或开源项目维护者

如果你是学生，GitHub Education 的免费包含完整的 Copilot 订阅，这是最不该错过的免费资源。

**普通用户的替代**：Cursor 的免费版每月有 2000 次补全，对入门学习足够。

### 7. Codeium

**免费层级**：个人用户完全免费

Codeium 是一款完全免费的 AI 编程助手（不限次数），支持 70+ 编程语言，可以在 VS Code、JetBrains、Neovim 等主流 IDE 中安装。

很多开发者用它作为 GitHub Copilot 的免费替代。补全质量没有 Copilot 强，但对大多数日常编程任务来说够用，而且真的免费。

---

## 图像 & 多媒体

### 8. Ideogram

**免费层级**：每天 25 次生成（约 10 张图）

Ideogram 是目前最适合**文字排版**的 AI 图像工具——生成带文字的海报、标题卡片、封面图，效果远超 Midjourney 和 DALL-E。免费版每天 25 次足够日常创作使用。

### 9. Stable Diffusion（本地运行）

**免费方式**：开源，自己电脑跑

如果你的电脑有独立显卡（8GB 显存以上），Stable Diffusion WebUI 完全免费、无限制、数据不上传。一次配置好，之后生成图像零成本。

对有技术背景的用户，这是最划算的选择。

---

## 自动化 & 工作流

### 10. n8n（自托管）

**免费方式**：开源，自己服务器部署

n8n 是目前最强的 AI 工作流自动化工具，自托管版本完全免费。可以用来搭建各种自动化流程：邮件自动归类、竞品监控、社交媒体发布……

需要一台云服务器（最便宜的约 $5/月），但软件本身免费。

### 11. Zapier（免费层级）

**免费层级**：每月 100 次自动化任务

Zapier 的免费版虽然次数有限，但对刚开始尝试自动化的用户，100 次/月可以帮你验证哪些场景值得投入。

---

## 知识管理

### 12. NotebookLM（Google）

**免费层级**：50 个文档/Notebook，5 个 Notebook

NotebookLM 是把文档变成"可对话知识库"的工具。上传你的笔记、书、报告，然后像和人聊天一样问问题——AI 只基于你上传的内容回答，不会胡说。

我用它处理技术文档：上传一份 100 页的 API 文档，然后直接问"如何用这个 API 实现 webhook 通知"——比自己翻文档快多了。

---

## 免费工具的局限性

说完好的，也要说实话：

**次数限制**：大多数免费版有每日或每月限额，密集使用会受限。  
**速度**：高峰期免费用户的请求优先级低，等待时间更长。  
**功能缺失**：图像生成、语音输入、深度研究等高级功能通常是付费专属。  
**数据隐私**：免费版通常会用你的对话数据训练模型（付费版通常不会）。

---

## 如何搭配使用

一套性价比很高的免费 AI 工具组合：

- **日常写作和问答**：Claude 免费版（质量优先）
- **搜索查资料**：Perplexity 免费版
- **编程辅助**：Codeium（无限次）
- **图像生成**：Ideogram 免费版
- **文档知识库**：NotebookLM 免费版

这套组合零成本，覆盖了大多数人 80% 的 AI 使用需求。

👉 [查看付费 AI 工具对比](/models) | [了解 AI Agent 自动化](/agents)
`,
    level: 'beginner',
    category: 'concept',
    tags: [
      '免费AI工具',
      'AI工具推荐',
      '零成本AI',
      'Claude免费',
      'ChatGPT免费版',
      'Perplexity',
      'Codeium'
    ],
    estimated_minutes: 14,
    related_tools: ['Claude', 'ChatGPT', 'Perplexity', 'Codeium', 'NotebookLM'],
    is_featured: true,
    published_at: '2026-05-24T09:00:00Z'
  },
  {
    slug: 'dify-build-knowledge-base-complete-tutorial-2026',
    title: 'Dify 搭建企业知识库实战：从零到可用的完整教程',
    subtitle: '不用写代码，30 分钟搭出一个能回答内部文档问题的 AI 助手',
    summary:
      'Dify 是目前最简单的企业知识库搭建工具。本文从创建账号到正式上线，手把手教你用 Dify 搭建一个基于 RAG 的内部知识库问答系统——上传文档、配置模型、调试效果、接入应用，所有步骤配有真实截图说明。',
    content: `# Dify 搭建企业知识库实战教程

我第一次用 Dify 搭知识库是为了解决团队里的一个痛点：新员工入职后，总是在钉钉群里问一些"公司报销流程是什么""差旅政策是怎么规定的"这类问题，每次都要有人去翻 HR 文档再回答。

花了不到一个小时，把所有 HR 文档上传到 Dify，搭了一个简单的问答 Bot，之后这类问题全部自动解答了。这是我觉得 RAG 知识库真正有价值的第一个例子。

## 什么是 RAG 知识库？

不需要懂技术的解释：

把你的文档（PDF、Word、网页）上传进去，AI 在回答问题前会先搜索这些文档，找到相关内容后再组织答案——而不是凭空"想象"。这样 AI 的回答就有了依据，不会胡说。

Dify 就是帮你做这件事的工具，而且不需要写代码。

---

## 准备工作

**账号**：去 [dify.ai](https://dify.ai) 注册，有免费额度。如果要私有化部署，也可以下载开源版本自己搭。

**文档准备**：
- 支持 PDF、Word(.docx)、TXT、Markdown、HTML
- 单文件建议不超过 50MB
- 中文文档支持很好，不用担心语言问题

**选择模型**：
- 免费额度内推荐用 **Deepseek** 或 **通义千问**（国内，性价比高）
- 如果不在意价格，**Claude 3.5 Sonnet** 效果最好
- 用 OpenAI 需要自备 API Key

---

## 第一步：创建知识库

1. 登录 Dify，左侧菜单点击「知识库」
2. 点击「创建知识库」→ 给它取个名字（比如"HR 政策文档"）
3. 上传你的文档

**上传技巧**：
- 可以一次上传多个文件
- 建议把相关文档分主题放在同一个知识库（比如"HR 文档"一个知识库，"产品文档"一个知识库）
- 不要把不相关的文档混在一起，会影响检索精度

---

## 第二步：配置文档分块

上传后，Dify 会问你怎么分割文档。这个设置很关键，很多人在这里选错了导致效果差。

**推荐配置（适合大多数场景）**：

\`\`\`
分块方式：自动
分块大小：500-800 个 token（对中文大概是 300-500 个汉字）
重叠长度：50 token（让相邻块有一点重叠，避免切断上下文）
\`\`\`

**什么时候调整**？
- 文档里有很多列表和表格 → 可以尝试更小的分块（300 token）
- 文档是长篇叙述（如技术文档）→ 可以适当增大（1000 token）

等待处理完成（通常几分钟，大文件可能要更久）。

---

## 第三步：测试检索效果

在知识库页面，有一个「召回测试」功能，一定要先用这个测试。

输入你预计用户会问的问题，看看 AI 能检索到哪些相关段落。

**测试案例**：

| 问题 | 期望检索到的内容 |
|------|---------------|
| 出差住宿标准是什么 | 差旅政策中关于住宿报销的段落 |
| 年假怎么申请 | 请假流程说明的相关部分 |

如果检索结果不理想（找不到相关段落，或找到了但内容不对），需要调整分块配置重新处理文档。

---

## 第四步：创建应用

知识库只是"存储"，还需要创建一个"应用"来让用户使用。

1. 左侧菜单点击「工作室」→「创建应用」
2. 选择「聊天助手」（最简单的形式）
3. 应用名称：比如"HR 小助手"
4. 在「上下文」那一栏，选择刚才创建的知识库

**System Prompt 配置**（很重要）：

在「系统提示词」里写清楚这个 AI 的角色和限制。好的系统提示词能大幅提升回答质量：

\`\`\`
你是公司的 HR 助手，专门回答关于公司政策、报销流程、请假规定等问题。

回答规则：
1. 只基于提供的文档内容回答，不要凭空猜测
2. 如果文档里没有相关信息，明确告知"我在现有资料中没有找到这个问题的答案，建议联系 HR 部门"
3. 引用具体政策条款时，注明来源文档
4. 使用简洁友好的语言，避免官僚腔调
\`\`\`

---

## 第五步：调试和优化

点击右上角「预览」，开始真实对话测试。

**常见问题和解决方法**：

**问题 1：回答正确但太啰嗦**  
→ 在 System Prompt 里加上：「回答要简洁，控制在 200 字以内，除非用户明确要详细解释」

**问题 2：找不到文档里的信息**  
→ 检查「召回设置」，把「召回 Top-K」从默认的 3 调高到 5-8；或者调整分块大小

**问题 3：AI 回答了文档以外的内容**  
→ 加强 System Prompt 的限制，明确说明「只能基于提供的知识库内容回答」

**问题 4：中文检索效果差**  
→ 在知识库设置里，Embedding 模型选择支持中文的（推荐 text-embedding-v2 或 BGE）

---

## 第六步：发布和分享

调试满意后，点击「发布」。Dify 提供多种接入方式：

- **嵌入到网页**：一段代码，粘贴到你的网站
- **API 接口**：供开发者调用
- **分享链接**：直接发给团队成员用
- **微信/飞书等平台**：通过配置可以接入企业即时通讯工具

对于内部知识库，最简单的方式就是直接分享链接——团队成员打开链接就能用，不需要任何安装。

---

## 进阶技巧

**多知识库调用**：一个应用可以关联多个知识库，让 AI 根据问题自动从不同知识库检索。

**定期更新文档**：当原始文档更新时，在 Dify 里重新上传即可。建议设置一个定期维护提醒。

**权限控制**：Dify 企业版支持设置哪些人可以访问哪个应用。如果知识库包含敏感信息，这个很重要。

---

## 实际效果参考

我在几个团队里使用 Dify 知识库的真实反馈：

- 某 20 人团队用来管理产品文档，新功能上线后把更新文档上传，客服回答问题的准确率从 60% 提升到 88%
- 某律所用来处理合同模板库，律师助理找模板的时间从平均 15 分钟降到 2 分钟
- 某教育机构用来回答家长常见问题，人工客服工作量减少约 40%

效果好不好，取决于文档质量和系统提示词的设计——这两个是决定性因素，工具本身退居其次。

---

## 常见问题

**Q：Dify 免费版够用吗？**  
A：个人学习和小团队试用够用。正式生产环境建议自托管开源版，或升级到付费版（$59/月起）。

**Q：数据安全吗？上传到 Dify 云端安全吗？**  
A：Dify 是开源项目，可以私有化部署在自己的服务器上，数据完全自己控制。如果对数据安全要求高，建议自托管。

**Q：和直接用 ChatGPT 问文档有什么区别？**  
A：ChatGPT 处理长文档有上下文限制，而且每次都要重新上传。Dify 把文档处理成向量索引，检索速度快、可扩展、可以管理大量文档。

👉 [了解更多 AI 工作流方案](/usecases) | [查看 RAG 知识库最佳实践](/tutorials/rag-knowledge-base-best-practices)
`,
    level: 'intermediate',
    category: 'hands-on',
    tags: ['Dify', 'RAG', '知识库', '企业AI', 'LLM', 'Dify教程', '知识库搭建'],
    estimated_minutes: 18,
    related_tools: ['Dify', 'Claude', 'OpenAI', 'DeepSeek'],
    is_featured: true,
    published_at: '2026-05-24T10:00:00Z'
  }
];

export const fakeTutorials = {
  records: [] as Tutorial[],

  initialize() {
    this.records = TUTORIAL_DATA.map((item, i) => ({ ...item, id: i + 1 }));
  },

  async getTutorials({
    level,
    category,
    search
  }: {
    level?: string;
    category?: string;
    search?: string;
  } = {}) {
    await delay(200);
    let items = [...this.records];
    if (level && level !== 'all') items = items.filter((t) => t.level === level);
    if (category && category !== 'all') items = items.filter((t) => t.category === category);
    if (search) {
      items = items.filter(
        (t) =>
          t.title.toLowerCase().includes(search.toLowerCase()) ||
          t.summary.toLowerCase().includes(search.toLowerCase()) ||
          t.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))
      );
    }
    return items;
  },

  async getTutorialBySlug(slug: string): Promise<Tutorial | null> {
    await delay(150);
    return this.records.find((t) => t.slug === slug) ?? null;
  },

  async getFeatured(): Promise<Tutorial[]> {
    await delay(150);
    return this.records.filter((t) => t.is_featured);
  },

  async create(payload: Omit<Tutorial, 'id'>): Promise<Tutorial> {
    await delay(400);
    const newItem: Tutorial = { ...payload, id: this.records.length + 1 };
    this.records.push(newItem);
    return newItem;
  },

  async update(id: number, payload: Partial<Omit<Tutorial, 'id'>>): Promise<Tutorial | null> {
    await delay(300);
    const idx = this.records.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    this.records[idx] = { ...this.records[idx], ...payload };
    return this.records[idx];
  },

  async delete(id: number): Promise<boolean> {
    await delay(200);
    const idx = this.records.findIndex((t) => t.id === id);
    if (idx === -1) return false;
    this.records.splice(idx, 1);
    return true;
  }
};

fakeTutorials.initialize();
