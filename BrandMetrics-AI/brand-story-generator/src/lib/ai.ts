import { UserAnswers, GeneratedContent, PlatformAd, PitchSlide } from "@/types";

/**
 * AI Generation Module – Upgraded
 * Supports Full Profile + Social Ads (4 platforms) + Pitch Deck
 * High-quality mock fallback when no API key is present.
 */

function buildPrompt(answers: UserAnswers): string {
  return `
You are a world-class personal branding strategist and conversion copywriter.

Create high-quality, ready-to-use brand assets for this person:

Name: ${answers.name}
Profession: ${answers.profession}
Background / Journey: ${answers.background}
Key Strengths: ${answers.strengths}
Unique Value: ${answers.uniqueValue}
Goals: ${answers.goals}
Target Audience: ${answers.audience}
Preferred Tone: ${answers.tonePreference || "professional, authentic"}

Return ONLY valid JSON (no markdown, no explanation) with this exact structure:

{
  "stories": {
    "professional": "150-220 word polished personal brand story",
    "friendly": "150-220 word warm, conversational brand story",
    "bold": "150-220 word confident, energetic brand story"
  },
  "linkedinHeadline": "Compelling LinkedIn headline under 120 characters",
  "linkedinBio": "120-180 word LinkedIn About section",
  "contentIdeas": ["idea1", "idea2", "idea3", "idea4", "idea5"],
  "ads": [
    {
      "platform": "linkedin",
      "hook": "Strong professional hook",
      "body": "2-4 sentences of value-focused copy",
      "cta": "Clear call to action"
    },
    {
      "platform": "instagram",
      "hook": "Attention-grabbing first line",
      "body": "Short engaging caption",
      "cta": "Call to action",
      "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3", "#hashtag4", "#hashtag5"]
    },
    {
      "platform": "facebook",
      "hook": "Relatable problem or story hook",
      "body": "Problem → solution narrative",
      "cta": "Clear call to action"
    },
    {
      "platform": "x",
      "hook": "Punchy micro-hook (under 100 chars)",
      "body": "Short thread-style or single tweet body",
      "cta": "Call to action"
    }
  ],
  "elevatorPitch": "A powerful 60-second elevator pitch (80-120 words)",
  "pitchSlides": [
    { "title": "Slide 1 Title", "coreMessage": "Main point", "visualCue": "Suggested visual" },
    { "title": "Slide 2 Title", "coreMessage": "Main point", "visualCue": "Suggested visual" },
    { "title": "Slide 3 Title", "coreMessage": "Main point", "visualCue": "Suggested visual" },
    { "title": "Slide 4 Title", "coreMessage": "Main point", "visualCue": "Suggested visual" },
    { "title": "Slide 5 Title", "coreMessage": "Main point", "visualCue": "Suggested visual" }
  ]
}

Rules:
- Make every piece of copy specific to this person's real background, strengths and goals.
- Never leave placeholders or generic text.
- Ads must feel native to each platform.
- Keep language natural and human.
`;
}

function generateMockContent(answers: UserAnswers): Omit<GeneratedContent, "id" | "createdAt" | "answers"> {
  const name = answers.name?.trim() || "Creator";
  const profession = answers.profession?.trim() || "Professional";
  const strengths = answers.strengths?.trim() || "problem-solving and communication";
  const unique = answers.uniqueValue?.trim() || "a unique mix of skills and genuine care";
  const goals = answers.goals?.trim() || "help people grow and create impact";
  const audience = answers.audience?.trim() || "ambitious professionals and founders";
  const background = answers.background?.trim() || "hands-on experience and continuous learning";

  const stories = {
    professional: `${name} is a dedicated ${profession} known for delivering clear, measurable results. With a background in ${background}, they bring both technical depth and strategic thinking to every project.\n\nRecognized for strengths in ${strengths}, ${name} helps clients cut through complexity and move forward with confidence. Their unique approach—centered on ${unique}—consistently sets them apart.\n\nToday, ${name} focuses on ${goals}, partnering with ${audience} to create lasting impact. Whether you need strategic guidance or hands-on execution, ${name} delivers professionalism, clarity, and outcomes that matter.`,
    friendly: `Hi, I’m ${name}! I’m a ${profession} who genuinely enjoys turning ideas into real results. My journey started with ${background}, and along the way I’ve discovered I’m especially good at ${strengths}.\n\nWhat makes my work different is ${unique}. I listen first, then build solutions that actually fit the person or team I’m working with.\n\nRight now I’m focused on ${goals}. If you’re part of ${audience} and looking for someone who cares about both the work and the people behind it, I’d love to connect.`,
    bold: `${name} doesn’t do average. As a ${profession}, they cut through noise and deliver work that actually moves the needle.\n\nBackground: ${background}. Strengths: ${strengths}. Edge: ${unique}.\n\nWhile others play it safe, ${name} goes all-in on ${goals}. The result? Clients and collaborators who stand out, grow faster, and finally feel in control.\n\nIf you’re ${audience} and ready to stop settling — let’s talk.`
  };

  const ads: PlatformAd[] = [
    {
      platform: "linkedin",
      hook: `Looking for a ${profession} who actually delivers results?`,
      body: `${name} combines ${strengths} with real-world experience in ${background}. They help ${audience} achieve ${goals} through clear strategy and hands-on execution.`,
      cta: "Let’s connect and explore how we can work together."
    },
    {
      platform: "instagram",
      hook: `The difference between average and exceptional?`,
      body: `It’s having someone who brings both skill and heart. Meet ${name} — ${profession}. Known for ${strengths} and a unique approach built on ${unique}.`,
      cta: "DM me if this resonates ✨",
      hashtags: ["#PersonalBrand", "#TechCareers", "#FreelancerLife", "#AI", "#GrowthMindset"]
    },
    {
      platform: "facebook",
      hook: `Ever felt stuck trying to stand out in a crowded field?`,
      body: `${name} understands that challenge. As a ${profession} with strengths in ${strengths}, they help ${audience} cut through the noise and build real momentum toward ${goals}.`,
      cta: "Comment “YES” or message me to start a conversation."
    },
    {
      platform: "x",
      hook: `${profession} tip: Stop competing on skills alone.`,
      body: `The real edge is ${unique}.\n\nThat’s what ${name} brings to every project — clarity, speed, and results for ${audience}.`,
      cta: "Follow for more insights →"
    }
  ];

  const pitchSlides: PitchSlide[] = [
    {
      title: "The Opportunity",
      coreMessage: `${audience} are actively looking for people who can help them ${goals}.`,
      visualCue: "Image of target audience or growth chart"
    },
    {
      title: "Who I Am",
      coreMessage: `${name} — ${profession} with proven strengths in ${strengths}.`,
      visualCue: "Professional headshot + key titles"
    },
    {
      title: "My Unique Edge",
      coreMessage: unique,
      visualCue: "Simple diagram showing the unique combination of skills"
    },
    {
      title: "How I Help",
      coreMessage: `I partner with ${audience} to deliver clarity, execution, and measurable progress toward ${goals}.`,
      visualCue: "3-step process or before/after"
    },
    {
      title: "Let’s Connect",
      coreMessage: "Open to collaborations, internships, freelance projects, and meaningful conversations.",
      visualCue: "Contact details + LinkedIn QR or link"
    }
  ];

  return {
    stories,
    linkedinHeadline: `${profession} | Helping ${audience.split(",")[0]} | ${strengths.split(",")[0]?.trim() || "Results-Driven"}`,
    linkedinBio: `I’m ${name}, a ${profession} passionate about ${goals}.\n\nMy background in ${background} taught me the power of ${strengths}. What I bring to the table is simple: ${unique}.\n\nI work with ${audience} who are ready to level up — whether that means clearer strategy, stronger execution, or better results.\n\nOpen to collaborations, speaking, and new projects. Let’s connect.`,
    contentIdeas: [
      `Share a behind-the-scenes look at how you approach projects as a ${profession}`,
      `Write a short story about overcoming a challenge related to ${goals}`,
      `Create a carousel: "5 things I wish I knew when starting as a ${profession}"`,
      `Post a lesson learned from your unique strength: ${unique}`,
      `Offer a free tip or mini-resource that helps ${audience}`
    ],
    ads,
    elevatorPitch: `Hi, I’m ${name}, a ${profession}. I help ${audience} achieve ${goals} by combining ${strengths} with a unique approach centered on ${unique}. My background in ${background} has taught me how to deliver both strategic clarity and practical results. If you’re looking for someone who can move the needle — I’d love to explore how we can work together.`,
    pitchSlides
  };
}

export async function generateBrandStory(answers: UserAnswers): Promise<GeneratedContent> {
  const apiKey = process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY || process.env.GROK_API_KEY;
  const provider = process.env.AI_PROVIDER || (process.env.OPENAI_API_KEY ? "openai" : process.env.ANTHROPIC_API_KEY ? "anthropic" : process.env.GROK_API_KEY ? "grok" : "mock");

  let content: Omit<GeneratedContent, "id" | "createdAt" | "answers">;

  if (!apiKey || provider === "mock") {
    await new Promise((r) => setTimeout(r, 1600 + Math.random() * 1000));
    content = generateMockContent(answers);
  } else {
    try {
      content = await callAI(answers, provider, apiKey);
    } catch (err) {
      console.error("AI call failed, falling back to mock:", err);
      content = generateMockContent(answers);
    }
  }

  return {
    id: `story_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    createdAt: new Date().toISOString(),
    answers,
    ...content,
  };
}

async function callAI(answers: UserAnswers, provider: string, apiKey: string) {
  const prompt = buildPrompt(answers);

  if (provider === "openai") {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a world-class personal branding copywriter. Always respond with valid JSON only." },
          { role: "user", content: prompt },
        ],
        temperature: 0.75,
        response_format: { type: "json_object" },
      }),
    });
    if (!res.ok) throw new Error(`OpenAI error: ${res.status}`);
    const data = await res.json();
    return JSON.parse(data.choices[0].message.content);
  }

  if (provider === "anthropic") {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 3000,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!res.ok) throw new Error(`Anthropic error: ${res.status}`);
    const data = await res.json();
    const text = data.content[0].text;
    const match = text.match(/\{[\s\S]*\}/);
    return JSON.parse(match ? match[0] : text);
  }

  if (provider === "grok") {
    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-2-latest",
        messages: [
          { role: "system", content: "You are a world-class personal branding copywriter. Always respond with valid JSON only." },
          { role: "user", content: prompt },
        ],
        temperature: 0.75,
      }),
    });
    if (!res.ok) throw new Error(`Grok error: ${res.status}`);
    const data = await res.json();
    const text = data.choices[0].message.content;
    const match = text.match(/\{[\s\S]*\}/);
    return JSON.parse(match ? match[0] : text);
  }

  throw new Error("Unknown provider");
}
