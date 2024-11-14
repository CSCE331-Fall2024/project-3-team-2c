import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { text, target } = (await request.json()) as {
    text: string;
    target: string;
  };
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY;

  const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q: text, target }),
    });

    interface TranslationResponse {
      data: {
        translations: {
          translatedText: string;
        }[];
      };
    }

    const data: TranslationResponse =
      (await response.json()) as TranslationResponse;
    return NextResponse.json({
      translatedText:
        data.data.translations[0]?.translatedText ??
        "Translation not available",
    });
  } catch (error) {
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}
