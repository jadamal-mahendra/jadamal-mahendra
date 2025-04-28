import React, { useState } from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import styles from '../../styles/Blog.module.css'; // Use relative path for styles
import { LuCopy, LuCheck } from "react-icons/lu";

// Simplify props - ReactMarkdown passes props for <code> element
interface CodeBlockProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
  // Implicitly includes other props passed by ReactMarkdown like node
}

// Use the simplified type, remove unused node prop destructuring
const CodeBlock = ({ inline, className, children, ...props }: CodeBlockProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : 'text';
  const codeText = String(children).replace(/\n$/, '');

  const handleCopy = () => {
    navigator.clipboard.writeText(codeText).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1500);
    }, (err) => {
      console.error('Failed to copy text: ', err);
    });
  };

  if (inline) {
    // Ensure styles.inlineCode exists in Blog.module.css or use a default
    return <code className={styles.inlineCode || ''} {...props}>{children}</code>;
  }

  return (
    <Highlight code={codeText} language={language} theme={themes.dracula}>
      {({ className: highlightClassName, style, tokens, getLineProps, getTokenProps }) => (
        <div className={styles.codeBlockWrapper}> 
          <pre className={`${highlightClassName} ${styles.codeBlockPre}`} style={style}>
            {tokens.map((line, i) => {
              const lineProps = getLineProps({ line });
              return (
                <div key={i} {...lineProps}>
                  {line.map((token, key) => {
                    const tokenProps = getTokenProps({ token });
                    return (
                      <span key={key} {...tokenProps} />
                    );
                  })}
                </div>
              );
            })}
          </pre>
          <button
            onClick={handleCopy}
            className={styles.copyButton}
            aria-label={isCopied ? 'Copied' : 'Copy code'}
          >
            {isCopied ? <LuCheck size={16}/> : <LuCopy size={16}/>}
          </button>
        </div>
      )}
    </Highlight>
  );
};

export default CodeBlock; 