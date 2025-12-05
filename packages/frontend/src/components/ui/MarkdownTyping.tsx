"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  text: string;
  typingSpeed?: number; // ms per karakter
  onProgress?: () => void; // dipanggil setiap kali teks bertambah
}

export default function MarkdownTyping({ text, typingSpeed = 12, onProgress }: Props) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i));
      onProgress?.(); // minta parent scroll ke bawah
      i++;
      if (i > text.length) clearInterval(interval);
    }, typingSpeed);

    return () => clearInterval(interval);
  }, [text, typingSpeed, onProgress]);

  return (
    <div className="prose prose-sm max-w-none dark:prose-invert">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {displayed}
      </ReactMarkdown>
    </div>
  );
}
