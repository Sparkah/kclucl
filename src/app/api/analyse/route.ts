import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { symbol, name, sector, price, change24h, priceHistory, hasPosition, pnl } = body;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ analysis: "AI analysis not configured. Set ANTHROPIC_API_KEY." }, { status: 200 });
  }

  const prices = (priceHistory as number[]).map((p: number) => p.toFixed(2)).join(" → ");
  const positionCtx = hasPosition
    ? `The user holds this asset with a P&L of ${pnl > 0 ? "+" : ""}${pnl.toFixed(1)}%.`
    : "The user does not hold this asset.";

  const prompt = `You are a concise AI trading analyst in a futuristic 2036 trading simulator game called TradeQuest.
Analyse this asset for a beginner trader. Keep it to 2-3 short sentences. Be specific about the data.

Asset: ${name} (${symbol})
Sector: ${sector}
Current Price: ₮${price.toFixed(2)}
24h Change: ${change24h > 0 ? "+" : ""}${change24h.toFixed(2)}%
Recent price trend: ${prices}
${positionCtx}

Give a brief risk assessment and a simple actionable suggestion (buy/hold/sell/wait). Use plain language a beginner would understand.`;

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
        max_tokens: 200,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await res.json();
    const text = data.content?.[0]?.text || "Unable to generate analysis.";
    return NextResponse.json({ analysis: text });
  } catch {
    return NextResponse.json({ analysis: "Analysis request failed." }, { status: 500 });
  }
}
