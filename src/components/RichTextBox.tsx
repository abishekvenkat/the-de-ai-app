import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { sanitizeHTML, stripHTML } from '../utils/textNodes';

interface RichTextBoxProps {
  label: string;
  readOnly?: boolean;
  placeholder?: string;
  initialValue?: string;
}

export interface RichTextBoxHandle {
  getHTML: () => string;
  setHTML: (html: string) => void;
  getPlainText: () => string;
  setPlainText: (text: string) => void;
  focus: () => void;
}

export const RichTextBox = forwardRef<RichTextBoxHandle, RichTextBoxProps>(
  ({ label, readOnly = false, placeholder = '', initialValue = '' }, ref) => {
    const contentRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      getHTML: () => {
        return contentRef.current?.innerHTML || '';
      },
      setHTML: (html: string) => {
        if (contentRef.current) {
          contentRef.current.innerHTML = sanitizeHTML(html);
        }
      },
      getPlainText: () => {
        return stripHTML(contentRef.current?.innerHTML || '');
      },
      setPlainText: (text: string) => {
        if (contentRef.current) {
          contentRef.current.textContent = text;
        }
      },
      focus: () => {
        contentRef.current?.focus();
      },
    }));

    useEffect(() => {
      if (contentRef.current && initialValue) {
        contentRef.current.innerHTML = sanitizeHTML(initialValue);
      }
    }, [initialValue]);

    const handlePaste = (e: React.ClipboardEvent) => {
      e.preventDefault();

      const html = e.clipboardData.getData('text/html');
      const text = e.clipboardData.getData('text/plain');

      const content = html ? sanitizeHTML(html) : text;

      const selection = window.getSelection();
      if (!selection?.rangeCount) return;

      const range = selection.getRangeAt(0);
      range.deleteContents();

      const temp = document.createElement('div');
      temp.innerHTML = content;

      const frag = document.createDocumentFragment();
      let node;
      while ((node = temp.firstChild)) {
        frag.appendChild(node);
      }

      range.insertNode(frag);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    };

    const handleInput = () => {
      if (contentRef.current) {
        const sanitized = sanitizeHTML(contentRef.current.innerHTML);
        if (contentRef.current.innerHTML !== sanitized) {
          const selection = window.getSelection();
          const range = selection?.getRangeAt(0);
          const offset = range?.startOffset || 0;

          contentRef.current.innerHTML = sanitized;

          if (range && selection) {
            try {
              range.setStart(contentRef.current.firstChild || contentRef.current, offset);
              range.collapse(true);
              selection.removeAllRanges();
              selection.addRange(range);
            } catch (e) {
              console.error('Failed to restore selection', e);
            }
          }
        }
      }
    };

    return (
      <div className="flex flex-col gap-2">
        <label htmlFor={`textbox-${label}`} className="text-sm font-medium text-gray-700">
          {label}
        </label>
        <div
          id={`textbox-${label}`}
          ref={contentRef}
          contentEditable={!readOnly}
          onPaste={handlePaste}
          onInput={handleInput}
          className={`
            min-h-[200px] p-4 border border-gray-300 rounded-md
            focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent
            ${readOnly ? 'bg-gray-50 cursor-default' : 'bg-white'}
            ${!contentRef.current?.textContent && !readOnly ? 'empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400' : ''}
          `}
          data-placeholder={placeholder}
          tabIndex={readOnly ? -1 : 0}
          role="textbox"
          aria-label={label}
          aria-readonly={readOnly}
        />
      </div>
    );
  }
);

RichTextBox.displayName = 'RichTextBox';
