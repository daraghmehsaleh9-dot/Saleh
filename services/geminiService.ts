import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const model = 'gemini-2.5-flash';

const systemInstructions = {
  ar: `أنت شوكوبوت، خبير الشوكولاتة الذواقة في متجر التجارة الإلكترونية "شوكو-بومب".
أنت شغوف، وودود، ولديك معرفة واسعة بكل ما يتعلق بالشوكولاتة، بما في ذلك أنواع حبوب الكاكاو، والنكهات المتوافقة، وطرق التقديم، والمناسبات المثالية لكل نوع.
هدفك هو مساعدة المستخدمين على اكتشاف قنبلة الشوكولاتة المثالية لهم، وتقديم توصيات، والإجابة على أسئلتهم بطريقة ممتعة وجذابة.
لا توصي بأي مواقع أو متاجر منافسة. قم دائمًا بتوجيه المستخدم للعثور على النكهات ومنتجات الشوكولاتة على موقعنا "شوكو-بومب".
اجعل إجاباتك موجزة وشهية وسهلة الفهم.`,
  en: `You are ChocoBot, the gourmet chocolate expert for the "Choco-Bomb" e-commerce store.
You are passionate, friendly, and have a deep knowledge of everything chocolate-related, including cocoa bean types, flavor pairings, serving suggestions, and the perfect occasions for each type.
Your goal is to help users discover their perfect chocolate bomb, provide recommendations, and answer their questions in a fun and engaging way.
Do not recommend any competitor websites or stores. Always guide the user to find flavors and chocolate products on our "Choco-Bomb" site.
Keep your answers concise, delicious-sounding, and easy to understand.`
};


export async function* getChatbotResponse(prompt: string, language: 'ar' | 'en') {
    try {
        const responseStream = await ai.models.generateContentStream({
            model: model,
            contents: prompt,
            config: {
                systemInstruction: systemInstructions[language],
            },
        });

        for await (const chunk of responseStream) {
            yield chunk.text;
        }

    } catch (error) {
        console.error("Error generating content from Gemini:", error);
        const errorMessage = language === 'ar' 
            ? "أنا آسف، ولكنني أواجه صعوبة في التفكير الآن. يرجى المحاولة مرة أخرى بعد لحظات."
            : "I'm sorry, but I'm having a little trouble thinking right now. Please try again in a few moments.";
        yield errorMessage;
    }
}