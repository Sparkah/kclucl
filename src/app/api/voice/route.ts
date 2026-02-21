import { NextRequest, NextResponse } from "next/server";

function getVoiceIdForPatronus(patronus: string | null | undefined) {
  const id = (patronus || "").toLowerCase();
  const map: Record<string, string> = {
    batman: "VR6AewLTigWG4xSOukaG",
    "nyan-cat": "EXAVITQu4vr4xnSDxMaL",
    doge: "TxGEqnHWrfWFTfGW9XjX",
    "flappy-bird": "MF3mGyEYCl7XYWbV9V6O",
    pepe: "AZnzlk1XvdvUeBnXmlld",
    capybara: "ErXwobaYiN019PkySvjV",
    chad: "TxGEqnHWrfWFTfGW9XjX",
  };

  return map[id] || "21m00Tcm4TlvDq8ikWAM";
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const text = typeof body?.text === "string" ? body.text.trim() : "";
  const patronus = typeof body?.patronus === "string" ? body.patronus : null;

  if (!text) {
    return NextResponse.json({ error: "Missing text." }, { status: 400 });
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Voiceover not configured. Set ELEVENLABS_API_KEY." }, { status: 200 });
  }

  const voiceId = getVoiceIdForPatronus(patronus);

  try {
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text: text.slice(0, 1800),
        model_id: "eleven_turbo_v2_5",
        voice_settings: {
          stability: 0.45,
          similarity_boost: 0.75,
          style: 0.6,
          use_speaker_boost: true,
        },
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json({ error: `Voice API failed: ${errorText.slice(0, 200)}` }, { status: 502 });
    }

    const audio = await res.arrayBuffer();
    return new NextResponse(audio, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "Voice request failed." }, { status: 500 });
  }
}
