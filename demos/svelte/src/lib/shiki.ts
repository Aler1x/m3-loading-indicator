import { codeToHtml } from "shiki";

export async function highlightCode(code: string, lang: string): Promise<string> {
  return codeToHtml(code, { lang, theme: "github-light" });
}
