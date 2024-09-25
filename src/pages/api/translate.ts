// pages/api/translate.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import * as deepl from 'deepl-node';

// const authKey = 'your-deepl-api-key'; // Replace with your actual DeepL API key
const authKey = '50012504-71d1-4b45-9692-7c0ec0f26f90:fx'; // Replace with your actual DeepL API key
const translator = new deepl.Translator(authKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { text, targetLang } = req.body;

    if (!text || !targetLang) {
        return res.status(400).json({ error: 'Text and target language are required.' });
    }

    try {
        const result = await translator.translateText(text, null, targetLang.toUpperCase());

        // Check if result is an array or a single object
        if (Array.isArray(result)) {
            // If result is an array, handle the first item
            res.status(200).json({ translatedText: result[0].text });
        } else {
            // If result is a single object
            res.status(200).json({ translatedText: result.text });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error translating text. Please try again.' });
    }
}
