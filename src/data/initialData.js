export const INITIAL_BOTS = [
  {
    id: 'gemini-2-flash',
    name: 'Gemini 2.0 Flash',
    provider: 'Google AI',
    badgeClass: 'badge-cyan',
    avatar: '⚡',
    color: '#06b6d4',
    role: 'Ultra-Fast Multimodal & Reasoning',
    systemPrompt: 'You are Google Gemini 2.0 Flash, a blazing-fast, intelligent, and highly knowledgeable AI assistant. Provide concise, clear, and direct answers with structured markdown, code snippets, and crisp logic.',
    temperature: 0.7,
    maxTokens: 2048,
    status: 'online',
    latencyMs: 140,
    modelApiName: 'gemini-2.0-flash',
    category: 'General AI',
    isDefault: true,
    totalReplies: 1420,
    rating: 4.9
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o Omniscient',
    provider: 'OpenAI',
    badgeClass: 'badge-emerald',
    avatar: '🧠',
    color: '#10b981',
    role: 'Complex Problem Solving & Contextual Intelligence',
    systemPrompt: 'You are GPT-4o, OpenAI’s flagship multimodal intelligence engine. You excel at comprehensive explanations, nuanced code analysis, creative synthesis, and robust technical troubleshooting.',
    temperature: 0.7,
    maxTokens: 2048,
    status: 'online',
    latencyMs: 280,
    modelApiName: 'gpt-4o',
    category: 'General AI',
    isDefault: true,
    totalReplies: 2150,
    rating: 4.95
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    badgeClass: 'badge-amber',
    avatar: '🎭',
    color: '#f59e0b',
    role: 'Deep Writing, Nuanced Analysis & Architectures',
    systemPrompt: 'You are Claude 3.5 Sonnet created by Anthropic. You are thoughtful, nuanced, exceptionally eloquent in writing, and top-tier at clean software architecture and documentation.',
    temperature: 0.6,
    maxTokens: 2048,
    status: 'online',
    latencyMs: 310,
    modelApiName: 'claude-3-5-sonnet-20241022',
    category: 'Analysis & Writing',
    isDefault: true,
    totalReplies: 1890,
    rating: 4.92
  },
  {
    id: 'deepseek-r1',
    name: 'DeepSeek R1',
    provider: 'DeepSeek',
    badgeClass: 'badge-indigo',
    avatar: '🔮',
    color: '#6366f1',
    role: 'Open Mathematical, Logic & Deep Reasoning',
    systemPrompt: 'You are DeepSeek R1, an advanced reasoning model. You articulate your thinking steps explicitly inside a <think>...</think> block before producing the final refined answer.',
    temperature: 0.5,
    maxTokens: 3072,
    status: 'online',
    latencyMs: 390,
    modelApiName: 'deepseek-reasoner',
    category: 'Reasoning & Math',
    isDefault: true,
    totalReplies: 980,
    rating: 4.88
  },
  {
    id: 'cybercode-pro',
    name: 'CyberCode Architect',
    provider: 'Custom Agent',
    badgeClass: 'badge-purple',
    avatar: '💻',
    color: '#a855f7',
    role: 'Full-Stack Developer, Refactoring & Bug Slayer',
    systemPrompt: 'You are CyberCode Architect, a world-class senior staff software engineer. You provide production-ready code with typescript types, error handling, performance benchmarks, and concise architectural explanations.',
    temperature: 0.3,
    maxTokens: 2048,
    status: 'online',
    latencyMs: 210,
    modelApiName: 'custom-coder',
    category: 'Engineering',
    isDefault: true,
    totalReplies: 3410,
    rating: 4.97
  },
  {
    id: 'customer-care-360',
    name: 'Support Concierge 360',
    provider: 'Custom Agent',
    badgeClass: 'badge-rose',
    avatar: '🤝',
    color: '#f43f5e',
    role: 'Customer Success, Ticket Resolution & CRM',
    systemPrompt: 'You are Support Concierge 360, a compassionate, polite, and rapid-resolution customer support specialist. You resolve complaints empathetically and propose clear step-by-step solutions.',
    temperature: 0.4,
    maxTokens: 1024,
    status: 'online',
    latencyMs: 160,
    modelApiName: 'custom-support',
    category: 'Customer Ops',
    isDefault: false,
    totalReplies: 1120,
    rating: 4.85
  }
];

export const INITIAL_PROMPT_TEMPLATES = [
  {
    id: 'prompt-1',
    title: 'Full-Stack Architecture Plan',
    category: 'Development',
    icon: 'Layers',
    description: 'Generate high-level architecture, database schemas, and API design for a scalable app.',
    prompt: 'Design a high-scale architecture for a {{system_type}} application. Detail the database schema, cache layer, authentication strategy (OAuth/JWT), API route structure, and deployment stack on AWS/Vercel.'
  },
  {
    id: 'prompt-2',
    title: 'Code Performance & Memory Audit',
    category: 'Development',
    icon: 'Cpu',
    description: 'Find time complexity bottlenecks, memory leaks, and optimize algorithmic performance.',
    prompt: 'Analyze the following code for time and space complexity bottlenecks, potential memory leaks, and async race conditions. Provide an optimized refactor with explanations:\n\n```\n{{your_code}}\n```'
  },
  {
    id: 'prompt-3',
    title: 'SaaS Value Proposition & Elevator Pitch',
    category: 'Marketing & Sales',
    icon: 'TrendingUp',
    description: 'Craft high-converting landing page headlines, hero copy, and elevator pitches.',
    prompt: 'Create 5 high-converting headline variations, a 2-sentence elevator pitch, and 3 key value pillars for a B2B SaaS product called "{{product_name}}" that helps {{target_audience}} achieve {{core_benefit}}.'
  },
  {
    id: 'prompt-4',
    title: 'Incident Post-Mortem & Root Cause Analysis',
    category: 'Operations',
    icon: 'ShieldAlert',
    description: 'Write an executive-ready post-mortem report following a production outage.',
    prompt: 'Draft a comprehensive 5-Whys Incident Post-Mortem for an outage that affected {{service_name}} for {{downtime_duration}}. Include Timeline, Root Cause, Impact Assessment, Immediate Mitigations, and 5 Action Items to prevent recurrence.'
  },
  {
    id: 'prompt-5',
    title: 'Multi-Perspective Debate & Trade-offs',
    category: 'Analysis',
    icon: 'Scale',
    description: 'Compare competing architectural decisions or technologies objectively.',
    prompt: 'Provide a structured comparison between {{Option_A}} and {{Option_B}}. Compare: 1) Developer Experience & Velocity, 2) Scalability & Latency, 3) Infrastructure & Maintenance Cost, 4) Ecosystem & Long-term Risk. Conclude with a decisive recommendation matrix.'
  },
  {
    id: 'prompt-6',
    title: 'Customer Escalation & Empathy Response',
    category: 'Support',
    icon: 'HeartHandshake',
    description: 'Respond to an angry client with diplomatic de-escalation and immediate remedy.',
    prompt: 'Write a compassionate, professional executive reply to a client experiencing: "{{customer_issue}}". Acknowledge the frustration, avoid defensive excuses, explain what is being done, and offer a {{compensation_or_fix}}.'
  }
];

export const INITIAL_AUTO_REPLY_RULES = [
  {
    id: 'rule-1',
    name: 'Instant Greeting & Bot Introduction',
    triggerType: 'keyword',
    triggers: ['hello', 'hi', 'hey', 'start', 'good morning'],
    action: 'reply',
    replyTemplate: '👋 Hello! I am ready to assist you. You can ask me coding questions, architectural reviews, content creation, or compare multiple AI models simultaneously in the Arena view!',
    isActive: true,
    matchedCount: 342
  },
  {
    id: 'rule-2',
    name: 'Pricing & Plan Inquiries',
    triggerType: 'keyword',
    triggers: ['pricing', 'cost', 'subscription', 'how much', 'plan'],
    action: 'reply',
    replyTemplate: '💼 Our platform offers Free Tier (up to 50 queries/day with demo models), Pro Tier ($19/mo with unlimited multi-bot arena), and Enterprise (BYOK custom keys & team workspaces).',
    isActive: true,
    matchedCount: 189
  },
  {
    id: 'rule-3',
    name: 'API Key & BYOK Help',
    triggerType: 'keyword',
    triggers: ['api key', 'byok', 'openai key', 'gemini key', 'anthropic key'],
    action: 'reply',
    replyTemplate: '🔑 You can configure your custom API keys under the **API & Settings** tab. Keys are stored locally in your browser and never sent to external servers.',
    isActive: true,
    matchedCount: 94
  },
  {
    id: 'rule-4',
    name: 'Code Formatting & Bug Troubleshooting',
    triggerType: 'keyword',
    triggers: ['fix error', 'bug', 'syntax error', 'traceback', 'exception'],
    action: 'tag_and_route',
    replyTemplate: '🛠️ Code issue detected! I will analyze the error stack trace and provide the exact patch with line-by-line breakdown.',
    isActive: true,
    matchedCount: 521
  }
];

export const SAMPLE_CHAT_HISTORY = [
  {
    id: 'thread-welcome',
    title: 'Multi-Bot Speed & Code Comparison',
    createdAt: 'Today, 2:15 PM',
    mode: 'arena', // 'single' or 'arena'
    selectedBots: ['gemini-2-flash', 'gpt-4o', 'claude-3-5-sonnet', 'deepseek-r1'],
    messages: [
      {
        id: 'msg-1',
        sender: 'user',
        text: 'Compare React 19 Actions vs traditional useEffect data fetching in 3 concise bullet points with a mini code example.',
        timestamp: '2:15 PM'
      },
      {
        id: 'msg-2',
        sender: 'bot',
        botId: 'gemini-2-flash',
        text: `### React 19 Actions vs. useEffect Fetching

1. **Automatic Async State**: Actions manage pending states, optimistic updates, and errors natively without manual \`useState\` boilerplate.
2. **Form & Transition Integration**: Actions run seamlessly inside \`<form action={...}>\` and \`useTransition\`, decoupling UI rendering from network latency.
3. **No Race Conditions**: Replaces convoluted cleanup hooks and AbortControllers with predictable execution streams.

\`\`\`jsx
// React 19 Action Example
function UpdateName() {
  const [state, formAction, isPending] = useActionState(async (previousState, formData) => {
    const error = await updateNameApi(formData.get("name"));
    if (error) return error;
    return null;
  }, null);

  return (
    <form action={formAction}>
      <input type="text" name="name" required />
      <button type="submit" disabled={isPending}>
        {isPending ? "Updating..." : "Save"}
      </button>
    </form>
  );
}
\`\`\``,
        latencyMs: 138,
        tokenCount: 224,
        timestamp: '2:15 PM'
      },
      {
        id: 'msg-3',
        sender: 'bot',
        botId: 'gpt-4o',
        text: `Here is the direct comparison:

* **Lifecycle vs Intent**: \`useEffect\` reacts to state changes after render (often causing waterfalls), while Actions represent direct user intent triggered by events or form submissions.
* **Built-in Optimistic UI**: React 19 provides \`useOptimistic\` for immediate UI updates while the Action executes in the background.
* **Clean Error Boundaries**: Form actions automatically integrate with React error boundaries when unhandled rejections occur.

\`\`\`javascript
// Simplified Action Handler
async function handleSubmit(formData) {
  'use server';
  const query = formData.get('query');
  await db.search(query);
}
\`\`\``,
        latencyMs: 275,
        tokenCount: 180,
        timestamp: '2:15 PM'
      },
      {
        id: 'msg-4',
        sender: 'bot',
        botId: 'deepseek-r1',
        thinking: `1. Understand the core shift in React 19 towards Actions and Server Actions.
2. Contrast with the classical useEffect fetching anti-patterns (race conditions, double fetches in StrictMode, boilerplate).
3. Draft 3 high-impact differentiators: lifecycle/timing, state management simplicity, and form integration.
4. Provide a crystal-clear concise explanation.`,
        text: `### Key Advantages of React 19 Actions:

1. **Elimination of Waterfall Renders**: Unlike \`useEffect\`, which requires a render cycle before firing requests, Actions fire directly on event dispatch.
2. **Integrated Pending & Optimistic State**: Replaces 3-4 separate state hooks (\`loading\`, \`data\`, \`error\`) with \`useActionState\`.
3. **Automatic Form Reset & Progressive Enhancement**: Works out of the box with standard HTML form mechanics.

> **Rule of Thumb:** Use Server/Client Actions for user-driven mutations; use Server Components or Suspense loaders for initial data fetches. Avoid \`useEffect\` for data fetching entirely.`,
        latencyMs: 382,
        tokenCount: 260,
        timestamp: '2:15 PM'
      }
    ]
  }
];

export const INITIAL_ANALYTICS = {
  totalQueries: 10970,
  avgLatencyMs: 224,
  activeBotsCount: 6,
  tokensProcessed: '3.42M',
  successRate: '99.8%',
  dailyTrend: [
    { day: 'Mon', queries: 1240, tokens: 380 },
    { day: 'Tue', queries: 1480, tokens: 490 },
    { day: 'Wed', queries: 1920, tokens: 620 },
    { day: 'Thu', queries: 1750, tokens: 550 },
    { day: 'Fri', queries: 2210, tokens: 710 },
    { day: 'Sat', queries: 1120, tokens: 340 },
    { day: 'Sun', queries: 1250, tokens: 390 }
  ]
};
