import { NextRequest, NextResponse } from "next/server";

// 1. Setup our API key and Model name
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-2.5-flash"; 

export async function POST(req: NextRequest) {
  try {
    // 2. Security Check: Make sure the API key exists
    if (!GEMINI_API_KEY) {
      return NextResponse.json({ success: false, message: "Missing API Key" }, { status: 500 });
    }

    // 3. Read incoming data from the frontend app
    const { role, lastMessage } = await req.json();

    // 4. Validation: Ensure we got a real message and a valid role
    if (!lastMessage || (role !== "driver" && role !== "user")) {
      return NextResponse.json({ success: false, message: "Invalid input data" }, { status: 400 });
    }

    // 5. The Google Gemini API Endpoint URL
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    // 6. Build the payload instructions for the AI
    const payload = {
      contents: [
        {
          role: "user",
          parts: [
            { 
              text: `Context: You are a vehicle booking chat assistant.
                     Role: Write suggestions for a ${role}. 
                     Tone: ${role === "driver" ? "Professional and polite" : "Casual and realistic"}.
                     Task: Read the following last message and reply with exactly 3 quick-reply suggestions that are 3 to 12 words long.
                     
                     Last Message: "${lastMessage}"` 
            }
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        // These two lines force Gemini to return pure JSON without markdown code blocks
        response_mime_type: "application/json", 
        response_schema: {
          type: "object",
          properties: {
            suggestions: {
              type: "array",
              items: { type: "string" }
            }
          },
          required: ["suggestions"]
        }
      },
    };

    // 7. Send the request to Google's servers
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // If Google responds with an error (like a 503 load spike or bad request)
    if (!response.ok) {
      return NextResponse.json({ success: false, message: "AI service error" }, { status: response.status });
    }

    // 8. Extract the text response out of Google's deep object structure
    const data = await response.json();
    const aiTextContent = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiTextContent) {
      return NextResponse.json({ success: false, message: "AI returned an empty response" }, { status: 500 });
    }

    // 9. Turn the raw AI text string back into a real JavaScript object
    const parsedJson = JSON.parse(aiTextContent);
    const suggestions = parsedJson.suggestions || [];

    // 10. Send the beautiful array back to your chat UI!
    return NextResponse.json({
      success: true,
      suggestions: suggestions,
    });

  } catch (error) {
    // If the code crashes anywhere (e.g. invalid JSON received), catch it here
    console.error("API Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}