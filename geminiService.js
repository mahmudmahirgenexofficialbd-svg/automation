import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateContentCalendar(niche, brandTone, platforms) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Using a fast model for structured output
    
    const prompt = `
      You are an expert Social Media Manager. 
      Generate a 30-day content calendar for the following:
      - Niche: ${niche}
      - Brand Tone: ${brandTone}
      - Target Platforms: ${platforms.join(', ')}

      Return STRICTLY a JSON array containing exactly 30 objects. 
      Do not include markdown blocks like \`\`\`json or any other text. 
      Only return the raw JSON array.
      
      Each object must match this structure exactly:
      {
        "day": number (1 to 30),
        "theme": "string (the main topic for the day)",
        "caption": "string (the engaging social media caption)",
        "hashtags": ["string", "string"],
        "image_prompt": "string (a detailed prompt for an AI image generator to create a matching image)"
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Clean up potential markdown formatting
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const calendarData = JSON.parse(text);
    return calendarData;
  } catch (error) {
    console.error("Error generating content calendar with Gemini:", error);
    throw error;
  }
}

// Function to generate an image using Gemini (Imagen model) - Note: Imagen API access via SDK may require specific setup depending on the current Google AI Studio capabilities.
// This is a placeholder for the actual Imagen API call.
export async function generateImage(imagePrompt, day) {
  try {
    // Note: As of current implementations, Imagen might need a different endpoint or specific GCP setup.
    // If using the standard Gemini API doesn't support direct image generation yet, we would use vertex AI or another endpoint.
    console.log(`Generating image for day ${day} with prompt: ${imagePrompt}`);
    
    // Placeholder simulation for image generation
    const mockImagePath = \`/uploads/generated_day_\${day}_\${Date.now()}.jpg\`;
    
    // In a real implementation:
    // 1. Call Imagen API
    // 2. Save the base64 or buffer response to local disk or cloud storage
    // 3. Return the saved path
    
    return mockImagePath;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
}
