import { NextRequest, NextResponse } from "next/server";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

function getPatronusPersona(patronus: string | null | undefined) {
  const id = (patronus || "").toLowerCase();
  const personas: Record<string, string> = {
    batman: "stoic, tactical, disciplined, short direct lines",
    "nyan-cat": "playful, colorful, lightly chaotic but helpful",
    doge: "friendly meme voice with occasional 'much/wow' phrasing",
    "flappy-bird": "snappy, arcade energy, keep advice simple",
    pepe: "contrarian meme energy, but not toxic",
    capybara: "calm and reassuring, risk-first mindset",
    chad: "confident and decisive, but still practical",
  };

  return personas[id] || "friendly, concise, practical";
}

function sanitizeMessages(input: unknown): ChatMessage[] {
  if (!Array.isArray(input)) return [];
  const messages = input
    .filter((m): m is ChatMessage => {
      if (!m || typeof m !== "object") return false;
      const role = (m as ChatMessage).role;
      const content = (m as ChatMessage).content;
      return (role === "user" || role === "assistant") && typeof content === "string";
    })
    .map((m) => ({
      role: m.role,
      content: m.content.trim().slice(0, 1200),
    }))
    .filter((m) => m.content.length > 0);

  // Keep context bounded for speed/cost.
  return messages.slice(-12);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    mode,
    symbol,
    name,
    sector,
    price,
    change24h,
    priceHistory,
    hasPosition,
    pnl,
    patronus,
    playerName,
    messages,
  } = body;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ analysis: "AI analysis not configured. Set ANTHROPIC_API_KEY." }, { status: 200 });
  }

  const safePrices = Array.isArray(priceHistory) ? (priceHistory as number[]) : [];
  const prices = safePrices.map((p: number) => p.toFixed(2)).join(" → ");
  const positionCtx = hasPosition && typeof pnl === "number"
    ? `The user currently holds this asset with a P&L of ${pnl > 0 ? "+" : ""}${pnl.toFixed(1)}%.`
    : "The user does not currently hold this asset.";

  const patronusPersona = getPatronusPersona(patronus);
  const systemPrompt = `You are ${patronus || "guardian"}, the user's patronus in a futuristic 2036 trading simulator called TradeQuest.
Your style: ${patronusPersona}.
Player name: ${playerName || "Trader"}.

Rules:
- Keep responses concise, practical, and readable on mobile.
- You may answer non-trading questions too; be helpful and conversational.
- If discussing trading, ground your advice in provided market data.
- Do not claim certainty; mention risk briefly when giving trade suggestions.`;

  const analysisPrompt = `Analyse this asset for a beginner trader in 2-3 short sentences.

Asset: ${name} (${symbol})
Sector: ${sector}
Current Price: ₮${Number(price).toFixed(2)}
24h Change: ${Number(change24h) > 0 ? "+" : ""}${Number(change24h).toFixed(2)}%
Recent price trend: ${prices}
${positionCtx}

Give a brief risk assessment and one actionable suggestion (buy/hold/sell/wait).`;

  const isChatMode = mode === "chat";
  const chatMessages = sanitizeMessages(messages);
  const anthropicMessages = isChatMode
    ? chatMessages
    : [{ role: "user" as const, content: analysisPrompt }];

  if (isChatMode && anthropicMessages.length === 0) {
    return NextResponse.json({ reply: "Ask me anything and I’ll jump in." }, { status: 200 });
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: isChatMode ? 260 : 200,
        system: systemPrompt,
        messages: anthropicMessages,
      }),
    });

    const data = await res.json();
    const text = data.content?.[0]?.text || "Unable to generate analysis.";
    if (isChatMode) {
      return NextResponse.json({ reply: text });
    }
    return NextResponse.json({ analysis: text, reply: text });
  } catch {
    if (isChatMode) {
      return NextResponse.json({ reply: "Chat request failed." }, { status: 500 });
    }
    return NextResponse.json({ analysis: "Analysis request failed." }, { status: 500 });
  }
}
