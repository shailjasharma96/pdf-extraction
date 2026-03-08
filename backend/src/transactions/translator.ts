import { translate } from "@vitalets/google-translate-api";

export async function translateTamilText(text?: string): Promise<string | undefined> {
  if (!text) return text;

  try {
    const result = await translate(text, {
      from: "ta",
      to: "en",
    });

    return result.text;
  } catch (error) {
    console.error("Translation error:", error);
    return text;
  }
}