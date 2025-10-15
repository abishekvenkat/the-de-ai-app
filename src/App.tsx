import { useRef, useState } from 'react';
import { Github } from 'lucide-react';
import { RichTextBox, RichTextBoxHandle } from './components/RichTextBox';
import { replaceInHTML } from './utils/textNodes';

function App() {
  const inputRef = useRef<RichTextBoxHandle>(null);
  const outputRef = useRef<RichTextBoxHandle>(null);
  const [showCopyToast, setShowCopyToast] = useState(false);

  const githubUrl = import.meta.env.VITE_GITHUB_URL;

  const handleDeAI = () => {
    if (!inputRef.current || !outputRef.current) return;

    const inputHTML = inputRef.current.getHTML();
    const processedHTML = replaceInHTML(inputHTML);

    outputRef.current.setHTML(processedHTML);
  };

  const handleRemoveFormatting = () => {
    if (!inputRef.current) return;

    const plainText = inputRef.current.getPlainText();
    inputRef.current.setPlainText(plainText);
  };

  const handleCopyProcessed = async () => {
    if (!outputRef.current) return;

    const processedHTML = outputRef.current.getHTML();
    const plainText = outputRef.current.getPlainText();

    try {
      if (navigator.clipboard && window.ClipboardItem) {
        const htmlBlob = new Blob([processedHTML], { type: 'text/html' });
        const textBlob = new Blob([plainText], { type: 'text/plain' });

        const clipboardItem = new ClipboardItem({
          'text/html': htmlBlob,
          'text/plain': textBlob,
        });

        await navigator.clipboard.write([clipboardItem]);
      } else {
        await navigator.clipboard.writeText(plainText);
      }

      setShowCopyToast(true);
      setTimeout(() => setShowCopyToast(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                The De-AI App
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Remove Commonly Used Words and Phrases in AI Generated Content
              </p>
            </div>
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors"
              aria-label="View on GitHub"
            >
              <Github size={20} />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col">
            <RichTextBox
              ref={inputRef}
              label="Original"
              placeholder="Paste your text here..."
            />
          </div>

          <div className="flex flex-col gap-4">
            <RichTextBox
              ref={outputRef}
              label="Processed"
              readOnly
            />
            <button
              onClick={handleCopyProcessed}
              className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors"
            >
              Copy Processed Text
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <button
            onClick={handleDeAI}
            className="px-6 py-2.5 bg-gray-900 text-white rounded-md font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors"
          >
            De-AI
          </button>

          <button
            onClick={handleRemoveFormatting}
            className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors"
          >
            Remove formatting
          </button>

          <span className="text-xs text-gray-500">
            Formatting is preserved by default.
          </span>
        </div>
      </main>

      {showCopyToast && (
        <div className="fixed bottom-8 right-8 bg-gray-900 text-white px-6 py-3 rounded-md shadow-lg animate-fade-in">
          Copied!
        </div>
      )}

      <footer className="border-t border-gray-200 bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-xs text-center text-gray-500">
            Built with React + TypeScript
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
