import { translate } from "@vitalets/google-translate-api";

export async function translateTamilText(text?: string): Promise<string | undefined> {
  if (!text) return text;

  // If text is small, translate directly
  if (text.length < 4000) {
    return directTranslate(text);
  }

  // Chunk for large text
  const chunks = text.match(/[\s\S]{1,4000}/g) || [];
  const translatedChunks = await Promise.all(
    chunks.map(chunk => directTranslate(chunk))
  );
  return translatedChunks.join(" ");
}

async function directTranslate(text: string): Promise<string> {
  try {
    const result = await translate(text, {
      from: "ta",
      to: "en"
    });
    return result.text;
  } catch (err) {
    console.warn("[Translator] Translation failed for chunk, returning original.", err);
    return text;
  }
}