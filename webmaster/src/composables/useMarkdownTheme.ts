import { onMounted, ref } from 'vue';
import 'github-markdown-css/github-markdown.css';

const useMarkdownTheme = () => {
  const styleElement = ref<HTMLStyleElement | null>(null);
  const lightThemeCSS = ref<string>('');
  const darkThemeCSS = ref<string>('');

  const toggleMarkdownTheme = (isDark: boolean) => {
    if (styleElement.value) {
      styleElement.value.textContent = isDark ? darkThemeCSS.value : lightThemeCSS.value;
    } else {
      setTimeout(() => toggleMarkdownTheme(isDark), 100);
    }
  };

  onMounted(async () => {
    const [lightModule, darkModule] = await Promise.all([
      import('highlight.js/styles/github.css?raw'),
      import('highlight.js/styles/github-dark.css?raw')
    ]);

    lightThemeCSS.value = lightModule.default;
    darkThemeCSS.value = darkModule.default;

    styleElement.value = document.createElement('style');
    styleElement.value.id = 'highlight-theme';
    document.head.appendChild(styleElement.value);
  });

  return {
    toggleMarkdownTheme
  };
};

export default useMarkdownTheme;
