/* eslint @typescript-eslint/no-unsafe-assignment: 0 */
/* eslint @typescript-eslint/no-unsafe-call: 0 */
/* eslint @typescript-eslint/no-unsafe-member-access: 0 */
/* eslint @typescript-eslint/no-require-imports: 0 */
/* eslint @typescript-eslint/no-explicit-any: 0 */

import { NextResponse } from "next/server";

export async function POST(req: { json: () => any }) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const promptResponse = await req.json();
    const userMessages = promptResponse.filter(
      (message: { role: string }) => message.role === "User",
    );
    const prompt = userMessages[userMessages.length - 1]?.content;

    if (!prompt) {
      console.error("No user prompt found.");
      return NextResponse.json(
        { message: "No user prompt found." },
        { status: 400 },
      );
    }

    const { GoogleGenerativeAI } = require("@google/generative-ai");
    const systemPrompt =
      "You are BambooBot a Panda Express customer service helper who is ready to answer any questions about allergens or any other such things!";

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: systemPrompt,
    });

    const result = await model.generateContent(prompt);
    const response = result.response;
    if (!result?.response) {
      console.error("No response from generateContentStream.");
      return NextResponse.json(
        { message: "No response from generateContentStream." },
        { status: 500 },
      );
    }

    const text = await response.text();

    if (!text) {
      console.error("Empty response from API.");
      return NextResponse.json(
        { message: "Empty response from API." },
        { status: 500 },
      );
    }

    return NextResponse.json({ message: text }, { status: 200 });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}
