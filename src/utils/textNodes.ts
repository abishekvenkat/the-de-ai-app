import DOMPurify from 'dompurify';
import { applyReplacements } from '../replacements';

const ALLOWED_TAGS = ['b', 'strong', 'i', 'em', 'u', 'a', 'span', 'br', 'p', 'div', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
const ALLOWED_ATTR = ['href', 'target', 'rel'];

export function sanitizeHTML(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    KEEP_CONTENT: true,
  });
}

export function stripHTML(html: string): string {
  const temp = document.createElement('div');
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || '';
}

function walkTextNodes(node: Node, callback: (textNode: Text) => void): void {
  if (node.nodeType === Node.TEXT_NODE) {
    callback(node as Text);
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    const element = node as Element;
    if (element.tagName.toLowerCase() === 'code' || element.tagName.toLowerCase() === 'pre') {
      return;
    }

    const children = Array.from(node.childNodes);
    children.forEach(child => walkTextNodes(child, callback));
  }
}

export function replaceInHTML(html: string): string {
  const sanitized = sanitizeHTML(html);

  const temp = document.createElement('div');
  temp.innerHTML = sanitized;

  walkTextNodes(temp, (textNode) => {
    const originalText = textNode.nodeValue || '';
    const replacedText = applyReplacements(originalText);

    if (replacedText !== originalText) {
      textNode.nodeValue = replacedText;
    }
  });

  return temp.innerHTML;
}
