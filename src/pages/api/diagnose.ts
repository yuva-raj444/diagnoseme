import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'No image provided' });
    }

    // Initialize the Gemini API with your API key
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Use gemini-1.5-flash instead of the deprecated gemini-pro-vision
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Prepare the prompt for health condition analysis
    const prompt = `
    You are a medical AI assistant trained to analyze images of skin conditions, rashes, and visible symptoms.
    Based on the image provided, please:

    1. Identify the potential medical condition shown in the image
    2. Provide a confidence level (as a percentage)
    3. Assess the severity level (Mild, Moderate, Severe)
    4. Give a brief description of the condition
    5. Suggest possible treatment options
    6. Provide prevention tips

    Format your response as a JSON object with the following structure:
    {
      "disease": "Name of the condition",
      "confidence": 95,
      "severity": "Moderate",
      "description": "Brief description of the condition, its causes and symptoms",
      "treatment": "Recommended treatment options",
      "prevention": "Tips to prevent this condition"
    }

    Important: Include a disclaimer that this is an AI-assisted preliminary assessment and not a substitute for professional medical advice.
    `;

    // Create parts for the model input
    const imageParts = [
      {
        inlineData: {
          data: imageBase64,
          mimeType: "image/jpeg"
        }
      }
    ];

    // Generate content with the image and prompt
    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON response from the model
    try {
      const jsonResponse = JSON.parse(text);
      return res.status(200).json(jsonResponse);
    } catch (parseError) {
      console.error('Error parsing JSON from Gemini:', parseError);
      // If the response isn't valid JSON, try to extract JSON from the text
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const extractedJson = JSON.parse(jsonMatch[0]);
          return res.status(200).json(extractedJson);
        } catch (e) {
          return res.status(500).json({ 
            error: 'Failed to parse response from AI model',
            rawResponse: text
          });
        }
      } else {
        return res.status(500).json({ 
          error: 'AI response was not in the expected format',
          rawResponse: text
        });
      }
    }
  } catch (error) {
    console.error('Diagnosis error:', error);
    return res.status(500).json({ error: 'Failed to process the image' });
  }
}
