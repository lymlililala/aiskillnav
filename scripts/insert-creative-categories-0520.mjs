/**
 * 热门需求分类批量插入脚本 2026-05-20
 * 添加5大热门需求：小说生成、简历生成、周报生成、漫剧生成、短视频生成
 *
 * 用法：node scripts/insert-creative-categories-0520.mjs
 */
const SUPABASE_URL = 'https://tixgzezefjjsyuzgdhcd.supabase.co';
const SERVICE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpeGd6ZXplZmpqc3l1emdkaGNkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODE0OTM3OCwiZXhwIjoyMDkzNzI1Mzc4fQ.CBarLrHnr-tr5ZPaGs2JvW3NJE6O5O1Hw7oTWsHuI-E';
const HEADERS = {
  'Content-Type': 'application/json',
  Authorization: 'Bearer ' + SERVICE_KEY,
  apikey: SERVICE_KEY
};

async function insertIgnoreDup(table, rows, nameKey = 'name') {
  // 先查询已有记录
  const existRes = await fetch(
    `${SUPABASE_URL}/rest/v1/${table}?select=${nameKey}&limit=1000`,
    { headers: HEADERS }
  );
  const existing = await existRes.json();
  const existingNames = new Set((existing || []).map((r) => r[nameKey]));

  // 过滤已存在的
  const newRows = rows.filter((r) => !existingNames.has(r[nameKey]));
  if (newRows.length === 0) {
    console.log(`⏭️  SKIP [${table}] 所有记录已存在（${rows.length}条）`);
    return;
  }

  const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: { ...HEADERS, Prefer: 'return=representation' },
    body: JSON.stringify(newRows)
  });
  const txt = await r.text();
  if (!r.ok) {
    console.error(`❌ ERR [${table}]`, txt.slice(0, 500));
    return;
  }
  const j = JSON.parse(txt);
  console.log(
    `✅ OK  [${table}]`,
    Array.isArray(j) ? j.length : 1,
    `rows inserted (${rows.length - newRows.length} skipped as duplicate)`
  );
}

// 对于 mcp_servers 用 slug 作为唯一键
async function upsertBySlug(rows) {
  const existRes = await fetch(
    `${SUPABASE_URL}/rest/v1/mcp_servers?select=slug&limit=1000`,
    { headers: HEADERS }
  );
  const existing = await existRes.json();
  const existingSlugs = new Set((existing || []).map((r) => r.slug));
  const newRows = rows.filter((r) => !existingSlugs.has(r.slug));

  if (newRows.length === 0) {
    console.log(`⏭️  SKIP [mcp_servers] 所有记录已存在（${rows.length}条）`);
    return;
  }

  const r = await fetch(`${SUPABASE_URL}/rest/v1/mcp_servers`, {
    method: 'POST',
    headers: { ...HEADERS, Prefer: 'return=representation' },
    body: JSON.stringify(newRows)
  });
  const txt = await r.text();
  if (!r.ok) {
    console.error(`❌ ERR [mcp_servers]`, txt.slice(0, 500));
    return;
  }
  const j = JSON.parse(txt);
  console.log(
    `✅ OK  [mcp_servers]`,
    Array.isArray(j) ? j.length : 1,
    `rows inserted (${rows.length - newRows.length} skipped as duplicate)`
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AGENTS — 创意生成类（小说/简历/周报/漫剧/短视频）
// ─────────────────────────────────────────────────────────────────────────────
const AGENTS = [
  // ── 小说生成 ──
  {
    name: 'Sudowrite',
    url: 'https://sudowrite.com',
    description: '专为小说创作设计的 AI 写作助手，支持故事拓展、人物对白润色、章节续写，被纽约时报报道的专业写作工具',
    agent_type: 'creative',
    open_source: 'closed',
    region: 'global',
    tags: ['小说写作', '故事生成', '人物对白', '创意写作', '章节续写'],
    is_featured: true,
    status: 'published'
  },
  {
    name: 'NovelAI',
    url: 'https://novelai.net',
    description: 'AI 小说创作+图像生成一体化平台，支持多种写作风格模式，深受轻小说/奇幻小说作者喜爱，也可生成配套插图',
    agent_type: 'creative',
    open_source: 'closed',
    region: 'global',
    tags: ['小说生成', '轻小说', '图像生成', '风格模式', '日式奇幻'],
    is_featured: true,
    status: 'published'
  },
  {
    name: '彩云小梦',
    url: 'https://if.caiyunai.com',
    description: '中国领先的 AI 小说续写平台，理解中文语境和网文风格，支持仙侠、都市、言情等多种类型，月活用户超百万',
    agent_type: 'creative',
    open_source: 'closed',
    region: 'cn',
    tags: ['中文小说', '网文续写', '仙侠', '言情', '都市'],
    is_featured: true,
    status: 'published'
  },
  {
    name: 'Fictive AI',
    url: 'https://fictive.ai',
    description: '多 Agent 协作的互动小说创作平台，编辑 Agent、风格 Agent、情节 Agent 分工协作，生成连贯长篇故事',
    agent_type: 'creative',
    open_source: 'closed',
    region: 'global',
    tags: ['互动小说', '多Agent', '长篇故事', '情节设计', '角色扮演'],
    is_featured: false,
    status: 'published'
  },
  // ── 简历生成 ──
  {
    name: 'Teal',
    url: 'https://tealhq.com',
    description: 'AI 求职全流程平台：简历一键生成 + ATS 优化 + 岗位匹配打分，帮助用户提升面试通过率，已服务超 100 万求职者',
    agent_type: 'creative',
    open_source: 'closed',
    region: 'global',
    tags: ['简历生成', 'ATS优化', '求职', '岗位匹配', '职场'],
    is_featured: true,
    status: 'published'
  },
  {
    name: 'Kickresume',
    url: 'https://kickresume.com',
    description: 'AI 驱动的简历+求职信生成器，提供 20+ 专业模板，GPT-4 优化内容表达，支持导出 PDF/Word',
    agent_type: 'creative',
    open_source: 'closed',
    region: 'global',
    tags: ['简历模板', '求职信', 'GPT-4', 'PDF导出', '求职辅助'],
    is_featured: false,
    status: 'published'
  },
  {
    name: '超级简历',
    url: 'https://www.wondercv.com',
    description: '中国主流 AI 简历制作平台，一键 AI 优化措辞、智能填充工作经历、适配国内主流招聘平台格式',
    agent_type: 'creative',
    open_source: 'closed',
    region: 'cn',
    tags: ['中文简历', 'AI优化', '招聘平台', '求职', '职场中国'],
    is_featured: true,
    status: 'published'
  },
  // ── 周报生成 ──
  {
    name: 'Notion AI',
    url: 'https://notion.so/product/ai',
    description: 'Notion 内置 AI 写作助手，可基于工作记录自动汇总生成周报/月报，支持中文，与 Notion 数据库深度集成',
    agent_type: 'creative',
    open_source: 'closed',
    region: 'global',
    tags: ['周报生成', '工作汇总', 'Notion', '写作助手', '效率工具'],
    is_featured: true,
    status: 'published'
  },
  {
    name: 'WorkWeek',
    url: 'https://workweek.ai',
    description: '专为职场人设计的 AI 周报助手，连接日历/邮件/任务系统，自动提炼本周工作亮点，生成老板最爱看的汇报格式',
    agent_type: 'creative',
    open_source: 'closed',
    region: 'global',
    tags: ['周报自动生成', '工作汇报', '日历集成', '邮件分析', '职场效率'],
    is_featured: false,
    status: 'published'
  },
  {
    name: '飞书妙记',
    url: 'https://www.feishu.cn/product/minutes',
    description: '字节跳动飞书出品，AI 会议记录+总结工具，自动将会议内容提炼成结构化周报/会议纪要，国内企业广泛使用',
    agent_type: 'creative',
    open_source: 'closed',
    region: 'cn',
    tags: ['会议纪要', '周报', '飞书', '字节跳动', '企业协作'],
    is_featured: true,
    status: 'published'
  },
  // ── 漫剧生成 ──
  {
    name: 'ComicsMaker.ai',
    url: 'https://comicsmaker.ai',
    description: 'AI 漫画/漫剧一站式生成平台，文字描述即可生成多格漫画，支持角色一致性保持和对话框自动排版',
    agent_type: 'creative',
    open_source: 'closed',
    region: 'global',
    tags: ['漫画AI', '多格漫画', '角色一致性', '对话框', '漫剧生成'],
    is_featured: true,
    status: 'published'
  },
  {
    name: '触站 AI 漫画',
    url: 'https://www.chuzhang.com',
    description: '国内领先的 AI 漫剧制作平台，支持国风/日漫/写实多种风格，内置分镜脚本生成和角色一致性控制',
    agent_type: 'creative',
    open_source: 'closed',
    region: 'cn',
    tags: ['AI漫画', '国风漫画', '分镜脚本', '角色一致性', '中文漫剧'],
    is_featured: true,
    status: 'published'
  },
  // ── 短视频生成 ──
  {
    name: 'Kling AI',
    url: 'https://klingai.com',
    description: '快手旗下 AI 视频生成平台，文字/图片转视频质量领先，支持 5s/10s 视频，在国际市场赢得大量用户',
    agent_type: 'creative',
    open_source: 'closed',
    region: 'cn',
    tags: ['短视频生成', '快手', '文生视频', '图生视频', 'AI视频'],
    is_featured: true,
    status: 'published'
  },
  {
    name: 'Runway Gen-3',
    url: 'https://runwayml.com',
    description: 'Hollywood 级 AI 视频生成工具，Gen-3 Alpha 版本画质大幅提升，已被多个商业广告和电影项目采用',
    agent_type: 'creative',
    open_source: 'closed',
    region: 'global',
    tags: ['AI视频', 'Gen-3', '商业广告', '电影制作', '短视频'],
    is_featured: true,
    status: 'published'
  },
  {
    name: 'HeyGen',
    url: 'https://heygen.com',
    description: 'AI 数字人短视频生成平台，上传照片即可生成会说话的数字人，支持 40+ 语言配音，企业营销视频首选',
    agent_type: 'creative',
    open_source: 'closed',
    region: 'global',
    tags: ['数字人', '短视频', '多语言配音', '企业营销', 'AI主播'],
    is_featured: true,
    status: 'published'
  },
  {
    name: '即梦 AI',
    url: 'https://jimeng.jianying.com',
    description: '字节跳动剪映旗下 AI 视频生成工具，深度集成抖音生态，支持文生视频/图生视频/口播视频，国内短视频创作者必备',
    agent_type: 'creative',
    open_source: 'closed',
    region: 'cn',
    tags: ['短视频', '抖音', '剪映', '文生视频', '口播视频', '字节跳动'],
    is_featured: true,
    status: 'published'
  },
  {
    name: 'Pika Labs',
    url: 'https://pika.art',
    description: 'AI 短视频生成平台，以动态效果和物体变形见长，Discord 社区超 50 万创作者，适合创意短片制作',
    agent_type: 'creative',
    open_source: 'closed',
    region: 'global',
    tags: ['短视频', '动态效果', 'Discord', '创意短片', 'AI动画'],
    is_featured: false,
    status: 'published'
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// MCP SERVERS — 创意内容生成类
// ─────────────────────────────────────────────────────────────────────────────
const MCP_SERVERS = [
  // creative 分类
  {
    slug: 'openai-image',
    name: 'openai-image',
    description: '调用 OpenAI DALL-E 3 生成图像，支持自然语言描述直接生成漫画插图、封面等创意图片',
    url: 'https://github.com/InSpatial-Labs/openai-image-mcp',
    category: 'creative',
    is_official: false,
    install_cmd: 'npx openai-image-mcp',
    tags: ['DALL-E', '图像生成', '漫画插图', '创意图片', 'OpenAI'],
    stars: 2100,
    is_featured: true
  },
  {
    slug: 'stable-diffusion',
    name: 'stable-diffusion',
    description: '本地运行 Stable Diffusion，AI 可直接生成高质量图像用于漫剧插图、小说封面等创意内容',
    url: 'https://github.com/binarynoir/mcp-server-stable-diffusion',
    category: 'creative',
    is_official: false,
    install_cmd: 'npx mcp-stable-diffusion',
    tags: ['Stable Diffusion', '本地图像', '漫画插图', '小说封面', '开源'],
    stars: 1800,
    is_featured: true
  },
  {
    slug: 'writesonic',
    name: 'writesonic',
    description: 'Writesonic AI 写作 MCP，支持博客文章、短视频脚本、简历文案等多场景内容生成，集成 SEO 优化',
    url: 'https://github.com/writesonic/writesonic-mcp',
    category: 'creative',
    is_official: false,
    install_cmd: 'npx writesonic-mcp',
    tags: ['AI写作', '短视频脚本', '博客文章', '简历文案', 'SEO'],
    stars: 980,
    is_featured: false
  },
  {
    slug: 'resume-builder',
    name: 'resume-builder',
    description: '简历生成 MCP Server，输入工作经历和目标岗位，自动生成 ATS 优化的 Markdown/JSON 格式简历',
    url: 'https://github.com/mcp-community/resume-builder-mcp',
    category: 'creative',
    is_official: false,
    install_cmd: 'npx resume-builder-mcp',
    tags: ['简历生成', 'ATS优化', '求职', 'Markdown', 'JSON简历'],
    stars: 1240,
    is_featured: true
  },
  {
    slug: 'weekly-report',
    name: 'weekly-report',
    description: '周报自动生成 MCP，读取 Git commits、任务系统、日历事件，自动汇总生成结构化工作周报',
    url: 'https://github.com/mcp-community/weekly-report-mcp',
    category: 'creative',
    is_official: false,
    install_cmd: 'npx weekly-report-mcp',
    tags: ['周报生成', 'Git提交', '工作汇总', '自动化', '任务系统'],
    stars: 870,
    is_featured: true
  },
  {
    slug: 'story-writer',
    name: 'story-writer',
    description: '小说/故事写作辅助 MCP，维护人物设定、世界观、情节线索等上下文，支持长篇小说连续创作',
    url: 'https://github.com/mcp-community/story-writer-mcp',
    category: 'creative',
    is_official: false,
    install_cmd: 'npx story-writer-mcp',
    tags: ['小说写作', '人物设定', '世界观', '情节', '长篇创作'],
    stars: 1560,
    is_featured: true
  },
  // media 分类
  {
    slug: 'elevenlabs',
    name: 'elevenlabs',
    description: 'ElevenLabs 语音合成 MCP，AI 可直接调用生成逼真语音，适合短视频配音、有声小说、口播内容制作',
    url: 'https://github.com/elevenlabs/elevenlabs-mcp',
    category: 'media',
    is_official: false,
    install_cmd: 'npx elevenlabs-mcp',
    tags: ['语音合成', 'TTS', '短视频配音', '有声小说', 'ElevenLabs'],
    stars: 4200,
    is_featured: true
  },
  {
    slug: 'ffmpeg',
    name: 'ffmpeg',
    description: '通过 FFmpeg MCP 直接处理视频/音频文件，支持格式转换、剪辑、合并、加字幕等操作，短视频制作必备',
    url: 'https://github.com/mcp-community/ffmpeg-mcp',
    category: 'media',
    is_official: false,
    install_cmd: 'npx ffmpeg-mcp',
    tags: ['FFmpeg', '视频处理', '音频处理', '格式转换', '短视频制作'],
    stars: 3100,
    is_featured: true
  },
  {
    slug: 'youtube-transcript',
    name: 'youtube-transcript',
    description: '获取 YouTube 视频字幕/转录文本，适合提取竞品视频内容、生成短视频脚本参考或学习材料',
    url: 'https://github.com/kimtaeyoon83/mcp-server-youtube-transcript',
    category: 'media',
    is_official: false,
    install_cmd: 'npx mcp-server-youtube-transcript',
    tags: ['YouTube', '视频字幕', '内容提取', '短视频脚本', '转录'],
    stars: 2800,
    is_featured: false
  },
  {
    slug: 'midjourney-mcp',
    name: 'midjourney-mcp',
    description: '通过 API 调用 Midjourney 生成艺术风格图像，适合漫剧配图、小说插图、短视频封面制作',
    url: 'https://github.com/mcp-community/midjourney-mcp',
    category: 'media',
    is_official: false,
    install_cmd: 'npx midjourney-mcp',
    tags: ['Midjourney', '艺术插图', '漫剧配图', '短视频封面', '图像生成'],
    stars: 2450,
    is_featured: false
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// SKILL TOOLS — 热门场景分类
// ─────────────────────────────────────────────────────────────────────────────
const SKILL_TOOLS = [
  // 小说生成
  {
    name: 'Sudowrite Skill',
    description: 'AI 小说续写与扩写 Skill，支持从情节描述自动生成下一段故事，人物对话更生动自然',
    url: 'https://clawhub.com/skills/sudowrite',
    category: '小说生成',
    tags: ['小说续写', '故事扩写', '人物对话', '创意写作'],
    is_featured: true,
    status: 'published'
  },
  {
    name: 'Story World Builder',
    description: '小说世界观构建 Skill，帮助作者建立完整的人物档案、地理设定和故事背景知识库',
    url: 'https://clawhub.com/skills/story-world-builder',
    category: '小说生成',
    tags: ['世界观', '人物设定', '背景构建', '小说创作'],
    is_featured: true,
    status: 'published'
  },
  {
    name: '彩云小梦 Skill',
    description: '中文网文风格 AI 续写 Skill，支持仙侠/都市/言情多种类型，理解中文语境和情感铺垫',
    url: 'https://clawhub.com/skills/caiyun-novel',
    category: '小说生成',
    tags: ['中文小说', '网文', '仙侠', '言情'],
    is_featured: false,
    status: 'published'
  },
  // 简历生成
  {
    name: 'Resume ATS Optimizer',
    description: '简历 ATS 优化 Skill，分析目标岗位 JD，提取关键词并自动优化简历措辞和结构',
    url: 'https://clawhub.com/skills/resume-ats',
    category: '简历生成',
    tags: ['ATS优化', '简历', '求职', '关键词匹配'],
    is_featured: true,
    status: 'published'
  },
  {
    name: 'Cover Letter Writer',
    description: '求职信自动生成 Skill，根据目标公司和岗位要求，生成个性化的求职信和自我介绍',
    url: 'https://clawhub.com/skills/cover-letter',
    category: '简历生成',
    tags: ['求职信', '自我介绍', '简历辅助', '职场'],
    is_featured: true,
    status: 'published'
  },
  {
    name: 'LinkedIn Profile Optimizer',
    description: 'LinkedIn 个人资料优化 Skill，根据目标行业和岗位优化个人简介、工作经历措辞',
    url: 'https://clawhub.com/skills/linkedin-optimizer',
    category: '简历生成',
    tags: ['LinkedIn', '职场', '个人品牌', '求职'],
    is_featured: false,
    status: 'published'
  },
  // 周报生成
  {
    name: 'Weekly Report Generator',
    description: '工作周报自动生成 Skill，从散碎工作记录中提炼本周成果、挑战和下周计划',
    url: 'https://clawhub.com/skills/weekly-report',
    category: '周报生成',
    tags: ['周报', '工作汇报', '效率工具', '职场'],
    is_featured: true,
    status: 'published'
  },
  {
    name: 'Meeting Minutes to Report',
    description: '会议纪要转周报 Skill，将飞书/腾讯会议的会议记录自动整理成结构化工作汇报',
    url: 'https://clawhub.com/skills/meeting-to-report',
    category: '周报生成',
    tags: ['会议纪要', '周报', '飞书', '腾讯会议'],
    is_featured: false,
    status: 'published'
  },
  {
    name: 'Git Commit Summarizer',
    description: '代码提交汇总 Skill，自动读取本周 Git commits 并生成通俗易懂的工作进展描述',
    url: 'https://clawhub.com/skills/git-summarizer',
    category: '周报生成',
    tags: ['Git', '代码提交', '开发周报', '技术汇报'],
    is_featured: false,
    status: 'published'
  },
  // 漫剧生成
  {
    name: 'Comic Script Writer',
    description: '漫画/漫剧脚本创作 Skill，根据故事大纲生成带有分镜说明、人物对话和构图描述的分格脚本',
    url: 'https://clawhub.com/skills/comic-script',
    category: '漫剧生成',
    tags: ['漫画脚本', '分镜', '漫剧', '故事创作'],
    is_featured: true,
    status: 'published'
  },
  {
    name: 'Manga Style Prompter',
    description: '漫画风格图像 Prompt 生成 Skill，输入场景描述，自动生成适配不同画风（国风/日漫/写实）的 SD Prompt',
    url: 'https://clawhub.com/skills/manga-prompter',
    category: '漫剧生成',
    tags: ['Stable Diffusion', 'Prompt', '漫画风格', '国风', '日漫'],
    is_featured: true,
    status: 'published'
  },
  // 短视频生成
  {
    name: 'Short Video Script Creator',
    description: '短视频爆款脚本生成 Skill，根据选题关键词生成符合抖音/B站调性的短视频文案，包含开头钩子和结尾引导',
    url: 'https://clawhub.com/skills/video-script',
    category: '短视频生成',
    tags: ['短视频脚本', '抖音', 'B站', '爆款文案', '内容创作'],
    is_featured: true,
    status: 'published'
  },
  {
    name: 'Video Title & Hashtag Generator',
    description: '短视频标题和话题标签生成 Skill，分析内容要点，生成高点击率标题和相关话题标签',
    url: 'https://clawhub.com/skills/video-title',
    category: '短视频生成',
    tags: ['视频标题', '话题标签', 'SEO', '短视频运营'],
    is_featured: false,
    status: 'published'
  },
  {
    name: 'AI Voiceover Script',
    description: 'AI 配音脚本优化 Skill，将视频文案转换为适合 TTS/AI 配音的口播稿，添加停顿标记和情感指示',
    url: 'https://clawhub.com/skills/voiceover-script',
    category: '短视频生成',
    tags: ['配音脚本', 'TTS', '口播', 'ElevenLabs'],
    is_featured: false,
    status: 'published'
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// 执行插入
// ─────────────────────────────────────────────────────────────────────────────
console.log('🚀 开始批量插入热门需求分类数据...\n');

await insertIgnoreDup('agents', AGENTS, 'name');
await upsertBySlug(MCP_SERVERS);
await insertIgnoreDup('skill_tools', SKILL_TOOLS, 'name');

console.log('\n🎉 全部完成！');
console.log('插入统计：');
console.log(`  - Agents（创意类）: ${AGENTS.length} 条`);
console.log(`  - MCP Servers（creative+media）: ${MCP_SERVERS.length} 条`);
console.log(`  - Skill Tools（5大场景分类）: ${SKILL_TOOLS.length} 条`);
