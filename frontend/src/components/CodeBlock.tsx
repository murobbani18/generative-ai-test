// /src/components/CodeBlock.tsx
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { MdContentCopy } from "react-icons/md";
import { FaCheck } from "react-icons/fa";

interface CodeBlockProps {
  code: string;
  language: string;
}

const CodeBlock = ({ code, language }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ position: "relative", borderRadius: "8px", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          color: "white",
          padding: "5px 10px",
          borderBottomLeftRadius: "8px",
          fontSize: "12px",
        }}
      >
        {language.toUpperCase()}
      </div>
      <button
        onClick={handleCopy}
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          background: "rgba(255, 255, 255, 0.2)",
          border: "none",
          borderRadius: "4px",
          color: "white",
          cursor: "pointer",
          padding: "5px",
        }}
      >
        {copied ? <FaCheck /> : <MdContentCopy />}
      </button>
      <SyntaxHighlighter language={language} style={a11yDark} showLineNumbers>
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
