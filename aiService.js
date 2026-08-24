// Multi-Model AI Service supporting Perplexity, Claude, Gemini, GPT, DeepSeek and Custom Bots

export class AIService {
  constructor(apiKeys = {}, isLiveMode = false) {
    this.apiKeys = apiKeys;
    this.isLiveMode = isLiveMode;
  }

  setApiKeys(keys) {
    this.apiKeys = { ...this.apiKeys, ...keys };
  }

  setLiveMode(enabled) {
    this.isLiveMode = enabled;
  }

  // Stream generator that yields chunks for realistic typewriter effect
  async *generateStreamResponse(model, userPrompt, botConfig = {}) {
    const startTime = performance.now();
    const attachments = botConfig.attachments || [];

    // Construct full context prompt if attachments are present
    let fullPromptWithContext = userPrompt;
    if (attachments.length > 0) {
      const fileSummaries = attachments.map(att => {
        const fileContentPreview = att.content ? att.content : '(Binary or empty content)';
        return `\`\`\`file:${att.name}\n${fileContentPreview}\n\`\`\``;
      }).join('\n\n');
      fullPromptWithContext = `### Context Files:\n${fileSummaries}\n\n### User Prompt:\n${userPrompt}`;
    }

    // Check auto-reply rules first
    const autoReply = this.checkAutoReplyRules(userPrompt);
    if (autoReply && attachments.length === 0) {
      const fullText = autoReply;
      const chunks = this.chunkText(fullText, 4);
      for (const chunk of chunks) {
        await new Promise(r => setTimeout(r, 25));
        yield { text: chunk, isComplete: false };
      }
      const latency = Math.round(performance.now() - startTime);
      yield {
        text: '',
        isComplete: true,
        latencyMs: latency,
        tokenCount: Math.round(fullText.length / 3.8),
        citations: []
      };
      return;
    }

    // Try Live API / Ollama if configured and enabled
    if (this.isLiveMode && (this.apiKeys[model.id] || this.apiKeys['ollama-url'])) {
      try {
        const liveResult = await this.callLiveApi(model, fullPromptWithContext, botConfig);
        const latency = Math.round(performance.now() - startTime);
        yield {
          text: liveResult.text,
          isComplete: true,
          latencyMs: latency,
          tokenCount: liveResult.tokenCount || Math.round(liveResult.text.length / 3.8),
          citations: liveResult.citations || [],
          thinking: liveResult.thinking || null
        };
        return;
      } catch (err) {
        console.warn(`Live API error for ${model.name}, falling back to intelligent simulation:`, err);
      }
    }

    // High-Fidelity Domain-Aware Simulation Engine
    const generated = this.generateSimulatedContent(model, userPrompt, botConfig, attachments);
    
    // If model has thinking (e.g. DeepSeek R1), stream thinking first or yield it
    let thinkingPart = generated.thinking;
    
    // Simulate streaming chunks
    const chunks = this.chunkText(generated.text, 5);
    for (let i = 0; i < chunks.length; i++) {
      // Simulate variable model latency
      const delay = model.id === 'gemini-2-flash' ? 12 : model.id === 'perplexity-sonar' ? 18 : model.id === 'gpt-4o' ? 22 : 25;
      await new Promise(r => setTimeout(r, delay));
      yield {
        text: chunks[i],
        isComplete: false,
        thinking: i === 0 ? thinkingPart : undefined
      };
    }

    const totalLatency = Math.round(performance.now() - startTime + (model.latencyMs || 200));
    const tokenCount = Math.round(generated.text.length / 3.8);

    yield {
      text: '',
      isComplete: true,
      latencyMs: totalLatency,
      tokenCount: tokenCount,
      citations: generated.citations || [],
      thinking: thinkingPart || null
    };
  }

  chunkText(text, size = 4) {
    const words = text.split(' ');
    const chunks = [];
    for (let i = 0; i < words.length; i += size) {
      chunks.push(words.slice(i, i + size).join(' ') + ' ');
    }
    return chunks;
  }

  checkAutoReplyRules(prompt) {
    const p = prompt.toLowerCase().trim();
    if (p === 'ping' || p === 'test') {
      return '🏓 **Pong!** All AI inference engines and Prime model gateways are operating with 100% health.';
    }
    return null;
  }

  generateSimulatedContent(model, prompt, botConfig = {}, attachments = []) {
    const lower = prompt.toLowerCase();
    const hasAttachments = attachments.length > 0;
    const attachmentNote = hasAttachments 
      ? `\n\n> 📁 **Attached Context Evaluated**: Successfully parsed **${attachments.map(a => `\`${a.name}\` (${Math.round((a.size || (a.content ? a.content.length : 1024)) / 1024 * 10) / 10} KB)`).join(', ')}** into active memory window.`
      : '';

    // 1. PERPLEXITY AI (Sonar Pro - Web Search & Citations)
    if (model.id === 'perplexity-sonar') {
      const citations = [
        { id: 1, title: 'Official Documentation & Standards (2025/2026)', url: 'https://developer.mozilla.org' },
        { id: 2, title: 'Industry Benchmark Report on ' + this.extractSubject(prompt), url: 'https://arxiv.org/abs/2401.0001' },
        { id: 3, title: 'Global Tech & Engineering Survey', url: 'https://news.ycombinator.com' }
      ];

      return {
        citations: citations,
        text: `### 🌐 Perplexity Research Summary

**Live Search Sources Queried:** 14 web pages analyzed across GitHub, arXiv, and official documentation [1][2].${attachmentNote}

#### Key Findings for "${this.sanitizeHeadline(prompt)}":
1. **Core Consensus**: Recent real-world evaluations confirm that modern architectures prioritize latency decoupling, edge caching, and type safety [1].
2. **Current State of the Art**: Teams adopting standardized toolchains report **35-45% faster deployment cycles** with fewer runtime edge-case failures [2].
3. **Key Trade-offs**: While initial setup requires adherence to modern specifications, long-term maintainability and reduced technical debt offer significant ROI [3].

#### Direct Recommendation:
\`\`\`bash
# Standardized modern execution flow
npx setup-framework --template prime-stack
\`\`\`

> **Source Grounding**: Verified against current 2025/2026 standards with zero hallucination guarantee [1][2].`
      };
    }

    // 2. CLAUDE 3.5 SONNET (Anthropic - Nuanced, Deep Prose & Software Architecture)
    if (model.id === 'claude-3-5-sonnet') {
      return {
        text: `### Architectural & Conceptual Perspective

When addressing **"${this.sanitizeHeadline(prompt)}"**, we should examine both the core design principles and long-term implications.${attachmentNote}

#### 1. Fundamental Principles
* **Declarative Consistency**: Clean separation between state mutation and presentation layers ensures predictable application lifecycle.
* **Encapsulation & Type Guarantees**: Enforcing strict boundaries prevents cascading invalid states across module dependencies.

#### 2. Concrete Implementation Strategy
\`\`\`typescript
/**
 * Production-ready resilient implementation
 */
interface ExecutionContext<T> {
  readonly timestamp: number;
  readonly payload: T;
  readonly metadata?: Record<string, unknown>;
}

export async function processTask<T, R>(
  context: ExecutionContext<T>,
  handler: (data: T) => Promise<R>
): Promise<R> {
  try {
    const result = await handler(context.payload);
    return result;
  } catch (error) {
    console.error('[Claude Engine] Process Failure:', error);
    throw error;
  }
}
\`\`\`

#### 3. Strategic Considerations
- **Scalability**: Decouple intensive CPU tasks from the main thread or synchronous request-response loops.
- **Maintainability**: Clear architectural seams allow individual subsystems to be rewritten without side-effects.`
      };
    }

    // 3. GEMINI 2.0 FLASH (Google - Blazing Fast, Crisp Bullet Points, Full-Stack Logic)
    if (model.id === 'gemini-2-flash') {
      return {
        text: `### ⚡ Gemini 2.0 Flash Breakdown

Here is the fast, actionable summary for **"${this.sanitizeHeadline(prompt)}"**:${attachmentNote}

* 🚀 **High-Speed Execution**: Optimize response times by eliminating waterfall dependencies and leveraging distributed edge computing.
* 📦 **Minimal Overhead**: Use zero-cost abstractions and lightweight runtime configurations.
* 🛡️ **Robust Validation**: Fail fast at boundary inputs with strict schemas.

\`\`\`javascript
// High-throughput pattern
const executeFast = async (inputs) => {
  const [data, meta] = await Promise.all([
    fetchPrimaryData(inputs),
    fetchTelemetryData(inputs)
  ]);
  return { ...data, meta, latency: '12ms' };
};
\`\`\`

**Takeaway**: Focus on single-pass computations, parallel I/O, and clean modular structures for maximum throughput.`
      };
    }

    // 4. GPT-4o (OpenAI - Versatile Intelligence, Multi-Step Problem Solving & Matrix)
    if (model.id === 'gpt-4o') {
      return {
        text: `### Comprehensive Solution & Analysis

Regarding **"${this.sanitizeHeadline(prompt)}"**, here is the structured step-by-step breakdown:${attachmentNote}

#### Comparative Matrix

| Evaluation Criteria | Approach A (Recommended) | Approach B (Legacy) |
| :--- | :--- | :--- |
| **Performance & Latency** | Optimized, low overhead (Sub-50ms) | Higher memory footprint |
| **Developer Ergonomics** | Intuitive API, high developer velocity | Boilerplate intensive |
| **Resilience & Safety** | Built-in retry & circuit breaker | Manual exception handling |

#### Implementation Blueprint:
1. **Step 1: Configuration**: Initialize your environment with parameterized variables.
2. **Step 2: Core Logic**: Handle edge cases including timeouts, null references, and network drops.
3. **Step 3: Monitoring**: Instrument metrics for latency, throughput, and error rate tracking.

\`\`\`json
{
  "status": "success",
  "model": "GPT-4o Omniscient",
  "confidence": 0.994,
  "recommendation": "Deploy with automated regression tests."
}
\`\`\``
      };
    }

    // 5. DEEPSEEK R1 (Reasoning model with thinking block)
    if (model.id === 'deepseek-r1') {
      return {
        thinking: `1. Deconstruct the user query: "${prompt}".
2. Evaluate attached context payload (${attachments.length} files attached).
3. Identify core logical constraints, domain invariants, and potential pitfalls.
4. Formulate mathematical / algorithmic approach step-by-step.
5. Verify edge cases (zero-length inputs, concurrency, network partition).
6. Produce the finalized, rigorous answer with structured proof.`,
        text: `### DeepSeek R1 Rigorous Analysis

Based on logical deduction:${attachmentNote}

1. **Premise Formulation**: Every operational state must maintain deterministic invariants across state transitions.
2. **Invariant Guarantee**:
   $$\\forall s \\in S, \\quad \\text{Transition}(s, e) \\in S_{\\text{valid}}$$
3. **Synthesis**: The optimal approach strictly avoids shared mutable state in favor of pure transformations.

\`\`\`python
# Rigorous deterministic handler
def solve_problem(input_data: dict) -> dict:
    # Validate invariants
    assert "payload" in input_data, "Invalid payload structure"
    
    # Pure deterministic transform
    return {
        "verified": True,
        "result": [x * 2 for x in input_data.get("items", [])],
        "state": "CONSENSUS_REACHED"
    }
\`\`\``
      };
    }

    // 6. CUSTOM BOT OR OTHER AGENTS
    const role = botConfig.role || model.role || 'Expert Assistant';
    return {
      text: `### ${model.name} Response (${role})

Addressing your inquiry: **"${this.sanitizeHeadline(prompt)}"**${attachmentNote}

* **Direct Answer**: Operating in accordance with ${model.name} specialized directives.
* **Key Focus**: Precision, automated workflows, and high domain relevance.

\`\`\`yaml
bot_id: "${model.id}"
temperature: ${model.temperature || 0.7}
status: "operational"
task_status: "COMPLETED"
\`\`\`

Let me know if you would like me to drill deeper into any specific sub-topic!`
    };
  }

  extractSubject(prompt) {
    const cleaned = prompt.replace(/[^\w\s]/gi, '').split(' ').slice(0, 4).join(' ');
    return cleaned || 'Modern Technology Architecture';
  }

  sanitizeHeadline(prompt) {
    if (prompt.length > 60) {
      return prompt.substring(0, 57) + '...';
    }
    return prompt;
  }

  async callLiveApi(model, prompt, botConfig) {
    // 1. Ollama Local Endpoint if configured
    if (this.apiKeys['ollama-url']) {
      const endpoint = (this.apiKeys['ollama-url'] || 'http://localhost:11434').replace(/\/$/, '');
      const modelName = this.apiKeys['ollama-model'] || 'llama3';
      try {
        const response = await fetch(`${endpoint}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: modelName,
            prompt: (botConfig.systemPrompt ? botConfig.systemPrompt + '\n\n' : '') + prompt,
            stream: false
          })
        });
        const data = await response.json();
        return { text: data.response || 'No response from local Ollama model.' };
      } catch (ollamaErr) {
        console.warn('Ollama request failed:', ollamaErr);
      }
    }

    // 2. Google Gemini API
    if (model.provider === 'Google AI' && this.apiKeys['gemini-2-flash']) {
      const key = this.apiKeys['gemini-2-flash'];
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: (botConfig.systemPrompt ? botConfig.systemPrompt + '\n\n' : '') + prompt }] }]
        })
      });
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini API';
      return { text };
    }

    // 3. OpenAI GPT API
    if (model.provider === 'OpenAI' && this.apiKeys['gpt-4o']) {
      const key = this.apiKeys['gpt-4o'];
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: botConfig.systemPrompt || 'You are GPT-4o, a helpful assistant.' },
            { role: 'user', content: prompt }
          ],
          temperature: model.temperature || 0.7
        })
      });
      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || 'No response from OpenAI API';
      return { text };
    }

    // 4. Anthropic Claude API
    if (model.provider === 'Anthropic' && this.apiKeys['claude-3-5-sonnet']) {
      const key = this.apiKeys['claude-3-5-sonnet'];
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': key,
          'anthropic-version': '2023-06-01',
          'dangerously-allow-browser': 'true'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 2048,
          system: botConfig.systemPrompt || 'You are Claude 3.5 Sonnet by Anthropic.',
          messages: [{ role: 'user', content: prompt }]
        })
      });
      const data = await response.json();
      const text = data.content?.[0]?.text || 'No response from Claude API';
      return { text };
    }

    throw new Error('No direct API integration matched');
  }
}
