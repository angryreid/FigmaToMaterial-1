import { useEffect, useState } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-scss';
import 'prismjs/themes/prism-tomorrow.css';

interface CodePreviewProps {
  code: string;
  language: string;
  className?: string;
}

export default function CodePreview({ code, language, className = '' }: CodePreviewProps) {
  const [highlightedCode, setHighlightedCode] = useState('');

  useEffect(() => {
    if (code) {
      const highlighted = Prism.highlight(
        code,
        Prism.languages[language] || Prism.languages.javascript,
        language
      );
      setHighlightedCode(highlighted);
    }
  }, [code, language]);

  return (
    <div className={`code-preview overflow-x-auto bg-[#1e1e1e] text-[#d4d4d4] rounded-md p-4 ${className}`}>
      <pre className="font-mono whitespace-pre-wrap break-words">
        <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
      </pre>
    </div>
  );
}
