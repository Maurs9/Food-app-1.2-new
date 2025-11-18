
import { GoogleGenAI, GenerateContentResponse, Type, Part } from "@google/genai";
import { DietaryProfile, Product, PersonalizedAnalysisResult, ComparisonResult, MealAnalysis } from '../types';

// Initialize the Google GenAI client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to convert image base64 to GenerativePart
const fileToGenerativePart = (base64Data: string, mimeType: string = 'image/jpeg'): Part => {
    return {
        inlineData: {
            data: base64Data,
            mimeType,
        },
    };
};

async function* streamApiRequest(prompt: string | Part[], model: string = 'gemini-2.5-flash', tools?: any): AsyncGenerator<string> {
    const contents = Array.isArray(prompt) ? { parts: prompt } : { parts: [{text: prompt}] };
    
    const responseStream = await ai.models.generateContentStream({
        model,
        contents,
        config: { tools }
    });

    for await (const chunk of responseStream) {
        if (chunk && chunk.text) {
             yield chunk.text;
        }
    }
}

export const analyzeProductImages = async (ingredientPhoto: string, nutritionPhoto: string): Promise<string> => {
    const ingredientImagePart = fileToGenerativePart(ingredientPhoto);
    const nutritionImagePart = fileToGenerativePart(nutritionPhoto);
    
    const prompt = `Analizează aceste imagini ale unui produs alimentar. Prima imagine arată lista de ingrediente, a doua arată tabelul nutrițional. Oferă un raport detaliat despre produs. Include o scurtă descriere, o listă de ingrediente cheie (și dacă sunt bune sau rele), și o analiză a valorilor nutriționale. Formatează răspunsul în Markdown.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [ { text: prompt }, ingredientImagePart, nutritionImagePart ] },
    });

    return response.text;
};

export const getPersonalizedAnalysis = async (product: Product, profile: DietaryProfile): Promise<PersonalizedAnalysisResult> => {
    const schema = {
        type: Type.OBJECT,
        properties: {
            verdict: { type: Type.STRING, enum: ['RECOMANDAT', 'CU PRECAUȚIE', 'NERECOMANDAT'] },
            summary: { type: Type.STRING },
            pros: { type: Type.ARRAY, items: { type: Type.STRING } },
            cons: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ['verdict', 'summary', 'pros', 'cons'],
    };

    const prompt = `Analizează acest produs alimentar pe baza profilului meu dietetic și oferă un verdict. Produs: { "Nume": "${product.product_name_ro || product.product_name}", "Ingrediente": "${product.ingredients_text_ro || product.ingredients_text}", "Nutrienți (per 100g)": ${JSON.stringify(product.nutriments)}, "Alergeni": "${product.allergens_tags?.join(', ')}" }. Profilul meu: { "Alergii": "${profile.allergies.join(', ')}", "Preferințe": "${profile.preferences.join(', ')}", "Obiective zilnice": "Calorii: ${profile.calorieGoal}, Proteine: ${profile.proteinGoal}g, Carbohidrați: ${profile.carbGoal}g, Grăsimi: ${profile.fatGoal}g" }. Returnează un obiect JSON cu verdictul, un rezumat, o listă de argumente pro și o listă de argumente contra.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: schema,
        },
    });
    
    return JSON.parse(response.text);
};

export const getHealthyAlternativesStream = (product: Product): AsyncGenerator<string> => {
    const prompt = `Oferă o listă de alternative mai sănătoase pentru următorul produs: ${product.product_name_ro || product.product_name}. Explică de ce fiecare alternativă este mai bună. Formatează răspunsul în Markdown.`;
    return streamApiRequest(prompt);
};

export const getMealIdeaStream = (product: Product): AsyncGenerator<string> => {
    const prompt = `Oferă o idee de masă rapidă și sănătoasă care include produsul: ${product.product_name_ro || product.product_name}. Formatează răspunsul în Markdown.`;
    return streamApiRequest(prompt);
};

export const getHomemadeRecipeStream = (product: Product): AsyncGenerator<string> => {
    const prompt = `Oferă o rețetă simplă, făcută în casă, care poate înlocui produsul: ${product.product_name_ro || product.product_name}. Formatează răspunsul în Markdown.`;
    return streamApiRequest(prompt);
};

export const getSeasonalFoods = async (): Promise<GenerateContentResponse> => {
    const prompt = "Ce fructe și legume sunt de sezon acum în România? Oferă o listă și o scurtă descriere pentru fiecare.";
    return ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            tools: [{googleSearch: {}}],
        },
    });
};

export const getAlternativeForUnhealthyFoodStream = (foodName: string): AsyncGenerator<string> => {
    const prompt = `Oferă o alternativă sănătoasă și o scurtă explicație pentru ${foodName}.`;
    return streamApiRequest(prompt);
};

export const compareProducts = async (product1: Product, product2: Product): Promise<ComparisonResult> => {
    const schema = {
        type: Type.OBJECT,
        properties: {
            summary: { type: Type.STRING },
            healthierOption: { type: Type.STRING, enum: ['produsul 1', 'produsul 2', 'niciunul'] },
            recommendationReason: { type: Type.STRING },
            product1_pros: { type: Type.ARRAY, items: { type: Type.STRING } },
            product1_cons: { type: Type.ARRAY, items: { type: Type.STRING } },
            product2_pros: { type: Type.ARRAY, items: { type: Type.STRING } },
            product2_cons: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ['summary', 'healthierOption', 'recommendationReason', 'product1_pros', 'product1_cons', 'product2_pros', 'product2_cons'],
    };

    const prompt = `Compară aceste două produse alimentare și determină care este mai sănătos. Produsul 1: { "Nume": "${product1.product_name_ro || product1.product_name}", "Ingrediente": "${product1.ingredients_text_ro || product1.ingredients_text}", "Nutrienți (per 100g)": ${JSON.stringify(product1.nutriments)} }. Produsul 2: { "Nume": "${product2.product_name_ro || product2.product_name}", "Ingrediente": "${product2.ingredients_text_ro || product2.ingredients_text}", "Nutrienți (per 100g)": ${JSON.stringify(product2.nutriments)} }. Returnează un obiect JSON cu un rezumat al comparației, care produs este mai sănătos ('produsul 1', 'produsul 2', sau 'niciunul'), motivul recomandării, și liste separate de argumente pro și contra pentru fiecare produs.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: schema,
        },
    });
    
    return JSON.parse(response.text);
};

export const analyzeMealPhoto = async (base64Image: string): Promise<MealAnalysis> => {
    const schema = {
        type: Type.OBJECT,
        properties: {
            analysisText: { type: Type.STRING, description: "O descriere detaliată a mesei, incluzând ingredientele identificate și o evaluare a cât de sănătoasă este. Formatează ca Markdown." },
            nutrients: {
                type: Type.OBJECT,
                properties: {
                    calories: { type: Type.NUMBER },
                    protein: { type: Type.NUMBER },
                    carbs: { type: Type.NUMBER },
                    fat: { type: Type.NUMBER },
                },
                required: ['calories', 'protein', 'carbs', 'fat'],
            },
        },
        required: ['analysisText', 'nutrients'],
    };
    
    const imagePart = fileToGenerativePart(base64Image);
    const prompt = "Analizează imaginea acestei mese. Identifică alimentele prezente, oferă o scurtă analiză a valorii nutritive a mesei și estimează numărul de calorii, proteine, carbohidrați și grăsimi. Formatează răspunsul ca un obiect JSON.";

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [ { text: prompt }, imagePart ] },
        config: {
            responseMimeType: "application/json",
            responseSchema: schema,
        },
    });

    return JSON.parse(response.text);
};

export const analyzeRecipeFromUrlStream = (url: string): AsyncGenerator<string> => {
    const prompt = `Analizează rețeta de la următoarea adresă URL: ${url}. Evaluează cât de sănătoasă este, oferă o estimare a caloriilor per porție și sugerează posibile îmbunătățiri pentru a o face mai nutritivă. Formatează răspunsul în Markdown.`;
    return streamApiRequest(prompt, 'gemini-2.5-flash', [{ googleSearch: {} }]);
};

export const generateRecipesFromIngredientsStream = (ingredients: string, mealType: string, dietaryStyle: string): AsyncGenerator<string> => {
    let prompt = `Generează una sau două idei de rețete folosind următoarele ingrediente: ${ingredients}. `;
    if (mealType !== 'any') prompt += `Rețetele ar trebui să fie potrivite pentru ${mealType}. `;
    if (dietaryStyle !== 'any') prompt += `Rețetele ar trebui să respecte un stil dietetic ${dietaryStyle}. `;
    prompt += `Formatează răspunsul în Markdown, cu titluri clare pentru fiecare rețetă, urmate de listele de ingrediente și instrucțiunile de preparare.`;

    return streamApiRequest(prompt);
};

export const analyzeRestaurantMenuStream = (base64Image: string): AsyncGenerator<string> => {
    const imagePart = fileToGenerativePart(base64Image);
    const prompt = [{ text: "Analizează acest meniu de restaurant. Identifică cele mai sănătoase 2-3 opțiuni și cele mai nesănătoase 2-3 opțiuni. Explică pe scurt de ce ai făcut aceste alegeri. Formatează răspunsul în Markdown." }, imagePart];
    return streamApiRequest(prompt);
};

export const analyzeIngredientsList = (ingredientsText: string, isCosmetic: boolean): AsyncGenerator<string> => {
    const prompt = `Analizează 5-7 ingrediente ${isCosmetic ? 'cosmetice' : 'alimentare'} cheie din următoarea listă: "${ingredientsText}". 
    ${isCosmetic ? 'Explică funcția lor (ex: hidratant, conservant).' : 'Oferă o explicație simplă, de o propoziție, pentru fiecare (ex: sursă de zahăr, aditiv).'}
    Formatează răspunsul ca o listă cu denumirile ingredientelor îngroșate (bold).`;
    return streamApiRequest(prompt);
};

export const getAdditiveExplanation = async (additiveName: string): Promise<string> => {
    const prompt = `Acționează ca un expert în siguranță alimentară. Oferă o explicație clară și concisă despre aditivul alimentar "${additiveName}". 
    Include scopul său principal (ex: conservant, colorant) și un rezumat al consensului științific privind siguranța. 
    Răspunsul trebuie să fie un singur paragraf scurt, în limba română.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
};