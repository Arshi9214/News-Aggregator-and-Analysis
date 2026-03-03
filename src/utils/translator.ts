import { Language } from '../App';

/**
 * Browser-native translation using built-in Translator API (Chrome 138+, Edge 143+)
 * Falls back to original text if not supported
 */

interface TranslatorAPI {
  create(options: { sourceLanguage: string; targetLanguage: string }): Promise<any>;
  availability(): Promise<any>;
}

declare global {
  interface Window {
    Translator?: TranslatorAPI;
  }
  const Translator: TranslatorAPI | undefined;
}

/**
 * Translate text using browser's native API
 */
export async function translateText(
  text: string,
  targetLanguage: Language
): Promise<string> {
  // Skip translation if target is English
  if (targetLanguage === 'en' || !text) {
    return text;
  }

  // Check if browser supports native translation
  if (typeof Translator === 'undefined') {
    console.log('Browser translation not supported, keeping original text');
    return text;
  }

  try {
    // Check availability for language pair
    const availability = await Translator.availability();
    const langPair = `en-${targetLanguage}`;
    
    if (availability[langPair] !== 'available') {
      console.log(`Translation not available for ${langPair}`);
      return text;
    }

    // Create translator
    const translator = await Translator.create({
      sourceLanguage: 'en',
      targetLanguage: targetLanguage
    });

    // Translate text
    const translated = await translator.translate(text);
    return translated || text;
  } catch (error) {
    console.warn('Translation failed:', error);
    return text;
  }
}

/**
 * Translate news article content
 */
export async function translateNewsContent(
  title: string,
  content: string,
  targetLanguage: Language
): Promise<{ title: string; content: string }> {
  if (targetLanguage === 'en') {
    return { title, content };
  }

  try {
    const [translatedTitle, translatedContent] = await Promise.all([
      translateText(title, targetLanguage),
      translateText(content.substring(0, 500), targetLanguage) // Limit content length
    ]);

    return {
      title: translatedTitle,
      content: translatedContent
    };
  } catch (error) {
    console.warn('Content translation failed:', error);
    return { title, content };
  }
}

/**
 * Check if browser translation is supported
 */
export function isTranslationSupported(): boolean {
  return typeof Translator !== 'undefined';
}