
import { GoogleGenAI } from "@google/genai";

// Always use the process.env.API_KEY directly as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFinancialAdvice = async (balance: number, transactions: any[]) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `As a financial assistant for SwiftPay UPI, analyze this data: 
      Current Balance: ₹${balance}
      Recent Transactions: ${JSON.stringify(transactions.slice(-5))}
      Provide a 2-sentence summary of spending habits and 1 tip for saving. Keep it encouraging.`,
    });
    // The GenerateContentResponse object features a text property (not a method).
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm currently unable to analyze your finances. Try again later!";
  }
};

export const chatWithAi = async (history: { role: 'user' | 'model', parts: { text: string }[] }[], message: string) => {
  try {
    // Pass history to maintain conversation state in stateless calls.
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      history: history,
      config: {
        systemInstruction: "You are SwiftPay Assistant, a friendly financial helper. Help users with payments, budgeting, and general queries about the app. SwiftPay offers 0.01% daily interest and ₹30 joining bonus.",
      }
    });
    
    // sendMessage only accepts the message parameter.
    const response = await chat.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Chat Error:", error);
    return "Something went wrong in my cognitive core. Please try again.";
  }
};
