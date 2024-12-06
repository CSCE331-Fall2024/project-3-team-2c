import { NextResponse } from "next/server";


/**
 * POST API Handler for Google Translate
 * 
 * This function handles POST requests to translate text using the Google Translate API.
 * It receives text and a target language from the request body, interacts with the API, 
 * and returns the translated text in JSON format.
 * 
 * **Flow:**
 * 1. Parses the request body to extract `text` (the string to translate) and `target` (the target language).
 * 2. Constructs the request payload for the Google Translate API.
 * 3. Sends a POST request to the API endpoint and retrieves the translated text.
 * 4. Returns the translated text as JSON or an error response if translation fails.
 * 
 * **Returns:**
 * - `200`: Success, with the translated text.
 * - `500`: Internal server error, with an error message for failures during API calls.
 * 
 */
export async function POST(request: Request) {
  const { text, target } = (await request.json()) as {
    text: string;
    target: string;
  };
  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;

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
