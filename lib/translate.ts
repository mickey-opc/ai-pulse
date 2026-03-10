/**
 * Translation utility using Google Translate free API
 * Uses the MyMemory Translation API (free, no API key required)
 */

const TRANSLATION_API = "https://api.mymemory.translated.net/get";

interface TranslationResponse {
  responseData: {
    translatedText: string;
  };
  responseStatus: number;
}

/**
 * Translates text to Chinese using MyMemory API
 * @param text - The text to translate
 * @returns Translated text in Chinese
 */
export async function translateToChinese(text: string): Promise<string> {
  if (!text || text.trim().length === 0) {
    return "";
  }

  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const encodedText = encodeURIComponent(text);
      const url = `${TRANSLATION_API}?q=${encodedText}&langpair=en|zh-CN`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: TranslationResponse = await response.json();

      if (data.responseStatus !== 200) {
        throw new Error(`Translation API error: ${data.responseStatus}`);
      }

      return data.responseData.translatedText;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.warn(`Translation attempt ${attempt} failed:`, lastError.message);

      // Wait before retry (exponential backoff)
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
    }
  }

  // If all retries fail, return original text
  console.error("Translation failed after all retries:", lastError?.message);
  return text;
}

/**
 * Translates an object with title and summary fields to Chinese
 */
export async function translateArticle(
  article: { title: string; summary: string }
): Promise<{ title_zh: string; summary_zh: string }> {
  const [title_zh, summary_zh] = await Promise.all([
    translateToChinese(article.title),
    translateToChinese(article.summary),
  ]);

  return { title_zh, summary_zh };
}
