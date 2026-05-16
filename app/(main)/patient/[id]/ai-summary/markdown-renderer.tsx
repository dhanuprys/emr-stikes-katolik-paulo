"use client";

// Lightweight Markdown renderer for AI summary output
// Handles: headings, bold, italic, bullets, numbered lists, horizontal rules

export default function Markdown({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let listBuffer: { type: "ul" | "ol"; items: string[] } | null = null;

  const flushList = () => {
    if (!listBuffer) return;
    const ListTag = listBuffer.type === "ul" ? "ul" : "ol";
    elements.push(
      <ListTag
        key={elements.length}
        className={`${listBuffer.type === "ul" ? "list-disc" : "list-decimal"} ml-6 mb-3 space-y-1 text-sm`}
      >
        {listBuffer.items.map((item, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: inlineFormat(item) }} />
        ))}
      </ListTag>
    );
    listBuffer = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Horizontal rule
    if (/^---+$/.test(line.trim())) {
      flushList();
      elements.push(<hr key={elements.length} className="my-4 border-border" />);
      continue;
    }

    // Headings
    const headingMatch = line.match(/^(#{1,4})\s+(.+)/);
    if (headingMatch) {
      flushList();
      const level = headingMatch[1].length;
      const text = headingMatch[2];
      const Tag = `h${level + 1}` as keyof React.JSX.IntrinsicElements;
      const sizes: Record<number, string> = {
        1: "text-xl font-bold mt-6 mb-3 text-foreground",
        2: "text-lg font-semibold mt-5 mb-2 text-foreground",
        3: "text-base font-semibold mt-4 mb-2 text-foreground",
        4: "text-sm font-semibold mt-3 mb-1 text-muted-foreground",
      };
      elements.push(
        <Tag key={elements.length} className={sizes[level]} dangerouslySetInnerHTML={{ __html: inlineFormat(text) }} />
      );
      continue;
    }

    // Unordered list
    const ulMatch = line.match(/^[\s]*[-*+]\s+(.+)/);
    if (ulMatch) {
      if (!listBuffer || listBuffer.type !== "ul") {
        flushList();
        listBuffer = { type: "ul", items: [] };
      }
      listBuffer.items.push(ulMatch[1]);
      continue;
    }

    // Ordered list
    const olMatch = line.match(/^[\s]*\d+[.)]\s+(.+)/);
    if (olMatch) {
      if (!listBuffer || listBuffer.type !== "ol") {
        flushList();
        listBuffer = { type: "ol", items: [] };
      }
      listBuffer.items.push(olMatch[1]);
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      flushList();
      continue;
    }

    // Paragraph
    flushList();
    elements.push(
      <p
        key={elements.length}
        className="text-sm leading-relaxed mb-2 text-foreground/90"
        dangerouslySetInnerHTML={{ __html: inlineFormat(line) }}
      />
    );
  }

  flushList();

  return <div className="prose-medical">{elements}</div>;
}

function inlineFormat(text: string): string {
  // Bold
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>');
  // Italic
  text = text.replace(/\*(.+?)\*/g, "<em>$1</em>");
  // Inline code
  text = text.replace(/`(.+?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-xs font-mono">$1</code>');
  return text;
}
