import 'github-markdown-css/github-markdown.css';
import lightThemeCSS from 'highlight.js/styles/github.css?raw';
import darkThemeCSS from 'highlight.js/styles/github-dark.css?raw';
import { useEffect, useRef } from 'react';

const useMarkdownTheme = () => {
  const styleElement = useRef<HTMLStyleElement | null>(null);

  useEffect(() => {
    styleElement.current = document.createElement('style');
    styleElement.current.id = 'highlight-theme';
    document.head.appendChild(styleElement.current);

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMediaChange = (event: MediaQueryListEvent | MediaQueryList) => {
      if (styleElement.current) {
        styleElement.current.textContent = event.matches ? darkThemeCSS : lightThemeCSS;
      } else {
        setTimeout(() => handleMediaChange(event), 100);
      }
    };

    handleMediaChange(media);
    media.addEventListener('change', handleMediaChange);
    return () => {
      media.removeEventListener('change', handleMediaChange);
      styleElement.current?.remove();
    };
  }, []);
};

export default useMarkdownTheme;
