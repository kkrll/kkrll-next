// Shared by the site preview (writings.ts) and the llms.txt build script
// (scripts/build-agent-md.mjs, run with bun so it can import TS)

type ExcerptOptions = {
  maxLength?: number;
  /** How paragraphs are joined — "\n\n" for the site preview, " " for single-line llms.txt entries */
  separator?: string;
};

export function extractExcerpt(
  content: string,
  { maxLength = 500, separator = "\n\n" }: ExcerptOptions = {},
): string {
  const lines = content.split("\n");
  const paragraphs: string[] = [];
  let currentParagraph = "";
  let paragraphCount = 0;
  let hitParagraphLimit = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip non-content lines (MDX imports/comments, JSX, code fences, headings,
    // and the *[interactive demo]* placeholder emitted by the build script)
    if (
      trimmed.startsWith("import ") ||
      trimmed.startsWith("export ") ||
      trimmed.startsWith("<") ||
      trimmed.startsWith("```") ||
      trimmed.startsWith("#") ||
      trimmed.startsWith("{") ||
      trimmed.startsWith("*[")
    ) {
      continue;
    }

    // Empty line = paragraph break
    if (!trimmed) {
      if (currentParagraph) {
        paragraphs.push(currentParagraph);
        paragraphCount++;
        currentParagraph = "";
        if (paragraphCount >= 3) {
          hitParagraphLimit = true;
          break;
        }
      }
      continue;
    }

    const cleaned = trimmed
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Links
      .replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, "$1") // Bold/italic
      .replace(/`([^`]+)`/g, "$1"); // Inline code

    currentParagraph += (currentParagraph ? " " : "") + cleaned;
  }

  // Don't forget the last paragraph if we didn't hit a blank line
  if (currentParagraph && paragraphCount < 3) {
    paragraphs.push(currentParagraph);
  }

  // Check if there's more content after what we captured
  let excerpt = paragraphs.join(separator);

  if (excerpt.length > maxLength) {
    excerpt = excerpt.substring(0, maxLength);
    // Try to cut at a word boundary
    const lastSpace = excerpt.lastIndexOf(" ");
    if (lastSpace > maxLength * 0.8) {
      excerpt = excerpt.substring(0, lastSpace);
    }
    excerpt += "...";
  } else if (hitParagraphLimit) {
    excerpt += "...";
  }

  return excerpt;
}
