import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FaRegCopy } from "react-icons/fa";


interface Props {
  language?: string;
  header?: string;
  children: string;
}

const CodeBlockWithCopy: React.FC<Props> = ({ header, children, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="position-relative my-1 border rounded-4 overflow-hidden">
      <div className="d-flex justify-content-between align-items-center bg-dark text-white px-3 py-2 small fw-semibold border-bottom "
        style={{
          minHeight: "45px"
        }}
      >
        <span>{header || language}</span>
        <button
          onClick={handleCopy}
          className="btn btn-sm btn-dark d-flex align-items-center gap-1"
          disabled={copied}
        >
          {copied ? <span className="fw-light" style={{fontSize: "0.7rem"}}><i>Copied!</i></span> : <FaRegCopy />}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{ lineHeight: 1.5, margin: 0, padding: "1rem" }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlockWithCopy;
