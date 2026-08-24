// Handcrafted Model Providers with Official Vector Marks & Typography
export const PRIME_MODELS = [
  {
    id: 'gpt-4o',
    name: 'ChatGPT 5',
    shortName: 'ChatGPT 5',
    provider: 'OpenAI',
    brandColor: '#10a37f',
    brandBg: 'rgba(16, 163, 127, 0.14)',
    badgeText: 'GPT-5',
    iconSvg: `<svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor"><path d="M20.5 9.5c-.3-1.8-1.5-3.3-3.2-3.9-1.2-.4-2.5-.3-3.6.3-.5-.7-1.3-1.3-2.1-1.6-1.9-.8-4.2-.2-5.4 1.4-.7.9-1 2-1 3.1-.9.2-1.8.8-2.4 1.6-1.2 1.7-1.2 4 0 5.7.5.7 1.3 1.3 2.1 1.6 1.9.8 4.2.2 5.4-1.4.7-.9 1-2 1-3.1.9-.2 1.8-.8 2.4-1.6 1.2-1.7 1.2-4 0-5.7z"/></svg>`,
    role: 'Versatile Multimodal Reasoning & Logic',
    systemPrompt: 'You are ChatGPT, an AI assistant developed by OpenAI.',
    temperature: 0.7,
    maxTokens: 4096,
    status: 'Ready',
    latencyMs: 180,
    speed: '62 tok/s',
    contextWindow: '128k',
    isPrime: true,
    citationsSupported: false
  },
  {
    id: 'gemini-2-flash',
    name: 'Gemini 2.5 Pro',
    shortName: 'Gemini 2.5',
    provider: 'Google AI',
    brandColor: '#4285f4',
    brandBg: 'rgba(66, 133, 244, 0.14)',
    badgeText: 'Pro 2.5',
    iconSvg: `<svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor"><path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"/></svg>`,
    role: 'Ultra-Fast Multimodal Inference & Knowledge',
    systemPrompt: 'You are Gemini, an AI developed by Google.',
    temperature: 0.7,
    maxTokens: 4096,
    status: 'Ready',
    latencyMs: 95,
    speed: '120 tok/s',
    contextWindow: '1M',
    isPrime: true,
    citationsSupported: false
  },
  {
    id: 'deepseek-r1',
    name: 'DeepSeek',
    shortName: 'DeepSeek',
    provider: 'DeepSeek',
    brandColor: '#3b82f6',
    brandBg: 'rgba(59, 130, 246, 0.14)',
    badgeText: 'R1 Reasoning',
    iconSvg: `<svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor"><path d="M12 3a9 9 0 0 0-9 9 9 9 0 0 0 3.37 7l.13.1a4.5 4.5 0 0 1 1.5 3.4v.5h6v-.5a4.5 4.5 0 0 1 1.5-3.4l.13-.1A9 9 0 0 0 21 12a9 9 0 0 0-9-9z"/></svg>`,
    role: 'Chain-of-Thought & Deep Algorithmic Problem Solving',
    systemPrompt: 'You are DeepSeek-R1, an AI assistant developed by DeepSeek.',
    temperature: 0.6,
    maxTokens: 4096,
    status: 'Ready',
    latencyMs: 290,
    speed: '48 tok/s',
    contextWindow: '64k',
    isPrime: true,
    citationsSupported: false
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    shortName: 'Claude 3.5',
    provider: 'Anthropic',
    brandColor: '#d97706',
    brandBg: 'rgba(217, 119, 6, 0.14)',
    badgeText: 'Sonnet 3.5',
    iconSvg: `<svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5L4.5 9.75 2 11l10 5 10-5-2.5-1.25L12 13.5zM2 15l10 5 10-5-2.5-1.25L12 17.5 4.5 13.75 2 15z"/></svg>`,
    role: 'Systems Architecture, Coding & Nuanced Synthesis',
    systemPrompt: 'You are Claude 3.5 Sonnet by Anthropic.',
    temperature: 0.6,
    maxTokens: 4096,
    status: 'Ready',
    latencyMs: 240,
    speed: '68 tok/s',
    contextWindow: '200k',
    isPrime: false,
    citationsSupported: false
  },
  {
    id: 'perplexity-sonar',
    name: 'Perplexity Sonar',
    shortName: 'Sonar Pro',
    provider: 'Perplexity AI',
    brandColor: '#06b6d4',
    brandBg: 'rgba(6, 182, 212, 0.14)',
    badgeText: 'Web Search',
    iconSvg: `<svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 14.93V17a1 1 0 0 1-2 0v-.07A8 8 0 0 1 4.07 11H5a1 1 0 0 1 0-2h-.93A8 8 0 0 1 11 4.07V5a1 1 0 0 1 2 0v-.93A8 8 0 0 1 19.93 11H19a1 1 0 0 1 0 2h.93A8 8 0 0 1 13 16.93z"/></svg>`,
    role: 'Live Web Grounding & Real-Time Verified Citations',
    systemPrompt: 'You are Perplexity Sonar Pro.',
    temperature: 0.2,
    maxTokens: 4096,
    status: 'Ready',
    latencyMs: 155,
    speed: '60 tok/s',
    contextWindow: '128k',
    isPrime: false,
    citationsSupported: true
  }
];

export const INITIAL_THREADS = [
  {
    id: 'thread-1',
    title: 'Which model are you?',
    modelId: 'gpt-4o',
    updatedAt: 'Just now',
    timeGroup: 'Today',
    messages: [
      {
        id: 'msg-1-1',
        sender: 'user',
        text: 'Which model are you?',
        timestamp: '15:20'
      },
      {
        id: 'msg-1-2-gpt',
        sender: 'bot',
        botId: 'gpt-4o',
        text: `I don't have a personal name or version number I can share. What I can tell you is that I'm an AI assistant designed to provide accurate, clear, and helpful responses across a wide range of topics.

If you'd like, you can tell me more about what you want to do, and I can explain my capabilities in that context — for example: answering questions, helping with writing, reasoning through problems, or breaking down complex concepts.

👉 **Do you want to know more about what kinds of tasks I can handle?**`,
        latencyMs: 185,
        tokenCount: 114,
        timestamp: '15:20'
      },
      {
        id: 'msg-1-2-gemini',
        sender: 'bot',
        botId: 'gemini-2-flash',
        text: `I'm an AI developed by **Google**, here to assist you with your questions and tasks. How can I help you today?

I'm an AI language model designed to assist with information, problem-solving, and conversation. If you have any specific questions or need help with something, feel free to ask!`,
        latencyMs: 95,
        tokenCount: 88,
        timestamp: '15:20'
      },
      {
        id: 'msg-1-2-deepseek',
        sender: 'bot',
        botId: 'deepseek-r1',
        text: `I'm an AI assistant designed to provide helpful, accurate, and engaging responses to your questions. My focus is on understanding your needs and delivering the best possible assistance, whether you're looking for information, creative ideas, or problem-solving support.

If you have any specific questions or tasks, feel free to ask—I'm here to help!`,
        latencyMs: 270,
        tokenCount: 96,
        timestamp: '15:20'
      },
      {
        id: 'msg-1-3',
        sender: 'user',
        text: 'Which model are you?',
        timestamp: '15:22'
      },
      {
        id: 'msg-1-4-gpt',
        sender: 'bot',
        botId: 'gpt-4o',
        text: `I understand why you're asking. What I can share is this: I'm based on a large language model from OpenAI's **GPT-4** family, optimized to be helpful, accurate, and safe.

Would you like me to explain the differences between various AI models?`,
        latencyMs: 190,
        tokenCount: 78,
        timestamp: '15:22'
      },
      {
        id: 'msg-1-4-gemini',
        sender: 'bot',
        botId: 'gemini-2-flash',
        text: `I'm Gemini, a large language model built by Google. I'm capable of multimodal processing, real-time code synthesis, and deep factual reasoning.`,
        latencyMs: 102,
        tokenCount: 52,
        timestamp: '15:22'
      },
      {
        id: 'msg-1-4-deepseek',
        sender: 'bot',
        botId: 'deepseek-r1',
        text: `I'm an AI language model designed to assist with a wide range of topics, from answering questions and brainstorming ideas to offering guidance on complex subjects. While I don't have a specific public model name or version number, you can think of me as a highly capable conversational assistant optimized for accuracy, clarity, and helpfulness.

If you're curious about my capabilities or how I can assist you, feel free to ask—I'm happy to help!`,
        latencyMs: 285,
        tokenCount: 110,
        timestamp: '15:22'
      }
    ]
  },
  {
    id: 'thread-2',
    title: "What's the best car in...",
    modelId: 'gpt-4o',
    updatedAt: '1 hour ago',
    timeGroup: 'Today',
    messages: [
      {
        id: 'msg-2-1',
        sender: 'user',
        text: "What's the best car in 2026 for reliability and fuel economy?",
        timestamp: '14:10'
      },
      {
        id: 'msg-2-2-gpt',
        sender: 'bot',
        botId: 'gpt-4o',
        text: `The top contenders in 2026 for rock-solid reliability and low fuel consumption are:

1. **Toyota Prius Prime / Camry Hybrid**: Industry benchmark with over 50+ MPG and proven e-CVT powertrains.
2. **Honda Civic e:HEV**: Excellent build quality, dynamic handling, and sub-4.5L/100km fuel economy.
3. **Hyundai Ioniq Hybrid**: Superior tech stack and 10-year warranty coverage.`,
        latencyMs: 210,
        tokenCount: 120,
        timestamp: '14:10'
      },
      {
        id: 'msg-2-2-gemini',
        sender: 'bot',
        botId: 'gemini-2-flash',
        text: `### ⚡ Top 2026 Recommendations
* 🚗 **Best Overall**: Toyota Corolla Hybrid (Top reliability index)
* 🔋 **Best PHEV**: Toyota Prius Prime (44 miles pure EV range)
* 🛡️ **Best Warranty**: Hyundai Elantra Hybrid (10-year / 100k miles)`,
        latencyMs: 98,
        tokenCount: 85,
        timestamp: '14:10'
      },
      {
        id: 'msg-2-2-deepseek',
        sender: 'bot',
        botId: 'deepseek-r1',
        text: `### Multi-Factor Evaluation (Reliability vs TCO):
1. **Drivetrain Architecture**: Naturally aspirated 4-cylinder engines paired with planetary gear hybrids (e.g. Toyota Hybrid Synergy Drive) yield the lowest 10-year maintenance costs.
2. **Depreciation Curve**: Japanese hybrid sedans retain ~62% residual value after 36 months.`,
        latencyMs: 290,
        tokenCount: 110,
        timestamp: '14:10'
      }
    ]
  }
];

export const SUGGESTED_PROMPTS = [
  {
    tag: 'Comparison',
    title: 'Which model are you?',
    subtitle: 'Compare self-identities, architecture & capabilities side-by-side',
    prompt: 'Which model are you and what are your primary strengths compared to other LLMs?'
  },
  {
    tag: 'Automotive',
    title: "What's the best car in...",
    subtitle: 'Analyze 2026 vehicle reliability, economy, and cost',
    prompt: "What's the best car in 2026 for reliability, safety, and fuel economy?"
  },
  {
    tag: 'Software',
    title: 'Postgres Concurrency',
    subtitle: 'Compare SQL isolation levels and distributed row locks',
    prompt: 'How should we handle high-concurrency inventory deductions in PostgreSQL without table locks?'
  },
  {
    tag: 'Algorithms',
    title: 'Explain Raft Consensus',
    subtitle: 'Leader election, log replication, and split-brain recovery',
    prompt: 'Explain the Raft consensus algorithm step-by-step with practical examples.'
  }
];
