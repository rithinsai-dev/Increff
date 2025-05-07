'use client';
import { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "AIzaSyCR3Fp6Coy4N2hXd2MOoohXRX4pW4QWR3U");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export default function Chatbot() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const faqData = `Here is the customer support data you should use to answer questions:

  Products:
  - PhoneX Pro: Snapdragon 8 Gen 2, 12GB RAM, 5000mAh battery, 6.7" AMOLED 120Hz display (₹82,999)
  - PhoneX Lite: Snapdragon 7 Gen 1, 8GB RAM, 4500mAh battery, 6.4" LCD 90Hz display (₹54,999)
  - LaptopZ Ultra: Intel i7-1360P, 16GB RAM, 1TB SSD, 15.6" 4K OLED touchscreen (₹1,24,999)
  - LaptopZ Basic: Intel i5-1240P, 8GB RAM, 512GB SSD, 14" FHD IPS display (₹74,999)
  - NovaTab Pro: Snapdragon 8cx Gen 3, 8GB RAM, 256GB storage, 11" 2.8K AMOLED (₹59,999)
  - NovaTab Lite: MediaTek Dimensity 900, 6GB RAM, 128GB storage, 10.4" FHD LCD (₹34,999)
  
  FAQs:
  - Order Tracking: Visit https://technova.com/orders and enter your Order ID (TNV-XXXXXX format)
  - Return Policy: Return products within 14 days of delivery for full refund (₹500 shipping fee deducted)
  - Exchange Policy: Defective items can be exchanged within 30 days (free pickup service)
  - Payment Methods: Credit cards (Visa/MC/Amex), UPI, NetBanking, EMI options available
  - Warranty: 1-year manufacturer warranty (extended 2-year warranty for ₹2,999)
  - Shipping: Standard (3-5 days, free), Express (2 days, ₹199), Next-day (₹499)
  - Price Match: We'll match competitors' prices within 7 days of purchase
  
  Accessories:
  - NovaCase Pro: ₹3,999 (military-grade protection)
  - NovaPen: ₹6,499 (pressure-sensitive stylus)
  - UltraFast Charger: ₹3,299 (65W GaN charger)
  - NovaBuds Pro: ₹10,799 (ANC wireless earbuds)
  
  Discounts:
  - Student discount: 10% off (max ₹5,000 discount)
  - Senior citizen discount: 7% off all products
  - Festival offers: Extra 5% cashback during Diwali/Dussehra
  
  Only answer based on this data. If the question is not related to this, say: "I'm afraid I can't answer that. Would you like information about our products or policies instead?`;

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const chat = model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: faqData }]
          },
          {
            role: "model",
            parts: [{ text: "Understood. I'll answer based on the provided customer support data." }]
          },
          ...updatedMessages.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
          }))
        ],
        generationConfig: {
          maxOutputTokens: 1000,
        },
      });

      const result = await chat.sendMessage(input);
      const response = await result.response;
      const text = response.text();

      setMessages([...updatedMessages, { role: 'assistant', content: text }]);
    } catch (error: any) {
      console.error("Error calling Gemini API:", error);
      
      let errorMessage = "Sorry, I encountered an error. Please try again.";
      if (error.message.includes("API_KEY_INVALID")) {
        errorMessage = "API key is invalid. Please check your configuration.";
      } else if (error.message.includes("QUOTA_EXCEEDED")) {
        errorMessage = "API quota exceeded. Please try again later.";
      } else if (error.message.includes("MODEL_NOT_FOUND")) {
        errorMessage = "The AI model is not available. Please try a different model.";
      }

      setMessages([...updatedMessages, { 
        role: 'assistant', 
        content: errorMessage 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-6 flex flex-col">
        <h1 className="text-3xl font-bold text-center mb-6 text-black">📱 Customer Support Chatbot</h1>
        
        {/* Chat messages container */}
        <div className="flex-1 space-y-4 overflow-y-auto max-h-[500px] border p-4 rounded-lg mb-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 p-4">
              Ask me about our products, order tracking, or return policy!
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-black'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-black p-3 rounded-2xl max-w-[80%]">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            placeholder="Ask a question about our products..."
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : null}
            Send
          </button>
        </div>
      </div>
    </main>
  );
}