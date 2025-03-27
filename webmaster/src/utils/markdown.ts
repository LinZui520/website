import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import markedKatex from 'marked-katex-extension';
import hljs from '@/utils/highlight';
import DOMPurify from 'dompurify';
import 'katex/dist/katex.min.css';

marked.setOptions({
  gfm: true,
  breaks: true
});

// 添加代码高亮支持
marked.use(markedHighlight({
  langPrefix: 'hljs language-',
  highlight(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  }
}));

// 添加KaTeX支持
marked.use(markedKatex({ nonStandard: true }));

export const markdown = async (content: string) => DOMPurify.sanitize(await marked.parse(content));
