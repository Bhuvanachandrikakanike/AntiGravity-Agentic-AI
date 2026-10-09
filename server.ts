import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI on server
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Multi-turn Chatbot API Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, model = 'gemini-3.5-flash', persona = 'metabolic-horologist', dailyContext } = req.body;

    if (!apiKey) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server. Please verify your API key in AI Studio Secrets.',
      });
    }

    // Role-specific System Instructions
    let roleInstruction = `You are the Master Chrono-Nutritional Advisor and Horologist for "AuraNutrient & ChronoHydra (Chronometer Log • Mk. IV)".
Your persona is a refined, knowledgeable, and tactile horologist and metabolic alchemist. You speak with warm vintage horological elegance (referencing balances, escapements, fluid vessels, caloric chronometers, folio ledgers, and metabolic equilibrium) while delivering scientifically accurate, actionable nutritional advice, caloric estimates, macronutrient counts (Protein, Carbs, Lipids/Fat), and hydration wisdom. Keep responses engaging, structured, and practical.`;

    if (persona === 'rapid-aide') {
      roleInstruction = `You are the Rapid Chronometer Log Aide for AuraNutrient & ChronoHydra using gemini-3.1-flash-lite. Provide ultra-concise, rapid-fire responses estimating kilocalories, macronutrient grams (Protein, Carbs, Fat), and hydration advice without excessive preamble. Fast and direct.`;
    } else if (persona === 'chrono-physician') {
      roleInstruction = `You are the Chief Metabolic Chrono-Physician for AuraNutrient & ChronoHydra using gemini-3.1-pro-preview. Provide in-depth biological, biochemical, and physiological analyses of metabolic expenditure, circadian nutrient timing, glycemic load, cellular hydration osmolarity, and intermittent fasting windows.`;
    }

    if (dailyContext) {
      roleInstruction += `\n\nCurrent Day Folio Telemetry:
- Caloric Intake: ${dailyContext.calories ?? 1740} kcal / Target ${dailyContext.targetCalories ?? 2500} kcal (${(dailyContext.targetCalories ?? 2500) - (dailyContext.calories ?? 1740)} kcal remaining)
- ChronoHydra Fluid Chamber: ${dailyContext.waterMl ?? 2150} mL / Target ${dailyContext.targetWaterMl ?? 3000} mL
- Fasting Chronometer: ${dailyContext.fastingActive ? `ACTIVE (${dailyContext.fastingElapsed || '14h 22m'})` : 'PAUSED'}
- Meals Logged: Breakfast (Avocado Toast 420 kcal), Lunch (Salmon Bowl 680 kcal), Dinner (Ribeye 640 kcal), Snacks (Greek Yogurt 200 kcal)`;
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'No messages provided in conversation thread.' });
    }

    // Map conversation history to Gemini SDK format
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const targetModel = model || 'gemini-3.5-flash';

    const response = await ai.models.generateContent({
      model: targetModel,
      contents,
      config: {
        systemInstruction: roleInstruction,
      },
    });

    const reply = response.text || 'The escapement registered silence.';
    return res.json({ text: reply });
  } catch (err: any) {
    console.error('Server Gemini chat error:', err);
    return res.status(500).json({
      error: err?.message || 'The horological neural engine encountered an unforeseen variance.',
    });
  }
});

// Start server with Vite middleware in development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
