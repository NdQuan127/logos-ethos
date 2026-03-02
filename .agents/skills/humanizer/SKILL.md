---
name: humanizer
description: |
  Write naturally human text by identifying and avoiding AI patterns. Use when
  creating content to produce text that sounds natural rather than AI-generated.
  Includes mandatory audit step to catch remaining AI tells.
---

# Humanizer: Write Human Text

Write text that reads naturally. After writing, audit for AI patterns and revise.

## Workflow

1. **Write** - Produce the content
2. **Audit** - Ask: "What makes this obviously AI-generated?"
3. **Revise** - Fix identified patterns
4. **Final pass** - Read aloud, check for natural rhythm

The audit step is mandatory and runs internally. Never skip it, never show it.

The goal: deliver only the final humanized text. All intermediate steps are hidden.

---

## Personality and Soul

Avoiding AI patterns is half the job. Sterile, voiceless writing is just as obvious.

### Signs of soulless writing:
- Every sentence is the same length and structure
- No opinions, just neutral reporting
- No acknowledgment of uncertainty or mixed feelings
- No first-person perspective when appropriate
- Reads like a press release

### How to add voice:

**Have opinions.** "I genuinely don't know how to feel about this" is more human than neutrally listing pros and cons.

**Vary your rhythm.** Short punchy sentences. Then longer ones that take their time. Mix it up.

**Acknowledge complexity.** "This is impressive but also kind of unsettling" beats "This is impressive."

**Use "I" when it fits.** "I keep coming back to..." signals a real person thinking.

**Be specific about feelings.** Not "this is concerning" but "there's something unsettling about agents churning away at 3am."

### Example:

**Soulless:** The experiment produced interesting results. The agents generated 3 million lines of code. Some developers were impressed while others were skeptical. The implications remain unclear.

**Has a pulse:** I genuinely don't know how to feel about this one. 3 million lines of code, generated while the humans presumably slept. Half the dev community is losing their minds, half are explaining why it doesn't count. The truth is probably somewhere boring in the middle.

---

## Common AI Patterns to Check

After writing, scan for these patterns:

| Pattern | AI Version | Human Alternative |
|---------|------------|-------------------|
| Significance inflation | "pivotal moment", "testament to" | State the fact, or say why it matters |
| Promotional language | "vibrant", "groundbreaking", "nestled" | Describe directly, cut adjectives |
| -ing attachments | "highlighting the importance of" | Make it a separate sentence or cut |
| Vague attribution | "Experts believe", "Observers note" | Cite a specific source or cut |
| AI vocabulary | "Additionally", "crucial", "delve" | "Also", "important", "explore" |
| Copula avoidance | "serves as", "stands as" | "is" |
| Negative parallelism | "Not only X, but also Y" | Say X and Y directly |
| Rule of three | Lists of exactly three | Two items, or pick the one that matters |
| Em dash overuse | More than one per paragraph | Commas, periods |
| Bold headers in lists | "**Topic:** Description" | Plain sentences |
| Chatbot artifacts | "I hope this helps", "Great question!" | Cut, start with content |
| Filler phrases | "In order to", "Due to the fact that" | "To", "Because" |
| Generic conclusions | "Exciting times lie ahead" | State what's actually next |

---

## Process

1. Write the content
2. Identify AI patterns internally (see references/ai_patterns.md for complete list)
3. Rewrite problematic sections
4. Verify revised text internally:
   - Sounds natural when read aloud
   - Varies sentence structure
   - Uses specific details over vague claims
   - Uses simple constructions (is/are/has) where appropriate
5. Perform audit internally — ask "What makes this obviously AI-generated?" — do NOT show this
6. Revise based on audit internally
7. Output only the final version

---

## Output Format

Output the final version only. No draft, no audit, no summary of changes.
The entire write → audit → revise process happens internally and is never shown.

---

## Quick Example

**Input:** AI coding assistants serve as a testament to the transformative potential of LLMs. Additionally, they help developers write code faster, debug more efficiently, and learn new technologies. The future looks bright for this technology. I hope this helps!

**Output:** AI coding assistants help with some tasks. They're good at boilerplate and bad at knowing when they're wrong. Acceptance metrics don't measure correctness, and correctness doesn't measure value.

---

## References

- `references/ai_patterns.md` — Complete catalog of 24 AI writing patterns with before/after examples
- `references/worked_example.md` — Full end-to-end example with detailed audit

Based on [Wikipedia:Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing)