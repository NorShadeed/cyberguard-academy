const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

// 1. Initialize the OpenAI client with your API key
// It will automatically find the OPENAI_API_KEY in your .env file
const openai = new OpenAI({
    apiKey: process.env.GPT_API_KEY // Or OPENAI_API_KEY, whatever you named it in .env
});

// 2. This is the endpoint your frontend is calling!
router.post('/', async (req, res) => {
    const { choiceHistory, scenarioTitle } = req.body;

    // 3. Create a powerful prompt for the AI
    const systemPrompt = `
        You are an elite cybersecurity training assessor. Your role is to provide a deep, insightful analysis of a user's performance in a tabletop exercise.
        The user's decision-by-decision history will be provided as a JSON object.
        You MUST respond with a JSON object in the following exact structure:
        {
          "executiveSummary": "A 2-3 sentence overview of the user's performance, highlighting their key success or failure.",
          "performanceArchetype": {
            "name": "A cool, punchy title for their playstyle (e.g., 'The Cautious Analyst', 'The Reckless Responder', 'The Proactive Sentinel').",
            "description": "A 2-3 sentence explanation of WHY they earned this title, based on their choices."
          },
          "decisionAnalysis": [
            {
              "choice": "The text of the user's choice (e.g., 'Execute quarantine protocol immediately.')",
              "analysis": "A brief 1-2 sentence analysis of this specific choice. Was it good, bad, and why?"
            }
          ],
          "actionableRecommendations": [
            "A specific, actionable tip for improvement.",
            "Another specific, actionable tip for improvement."
          ]
        }
    `;

    // 4. Format the user's choices for the AI
    const userPrompt = `
        Analyze my performance for the scenario: "${scenarioTitle}"
        Here is my choice history:
        ${JSON.stringify(choiceHistory, null, 2)}
    `;

    try {
        // 5. Make the API call to GPT
        const completion = await openai.chat.completions.create({
            model: "gpt-4-turbo", // Or "gpt-3.5-turbo", but 4 is better for this
            response_format: { type: "json_object" }, // This is CRITICAL!
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
        });

        // 6. Send the AI's JSON response directly back to the frontend
        const aiResponse = JSON.parse(completion.choices[0].message.content);
        res.json(aiResponse);

    } catch (err) {
        console.error("GPT API Error:", err);
        res.status(500).json({ msg: 'Error generating AI analysis.' });
    }
});

module.exports = router;