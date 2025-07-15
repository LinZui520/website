import hljs from 'highlight.js/lib/core';

// 导入指定的语言
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
import java from 'highlight.js/lib/languages/java';
import cpp from 'highlight.js/lib/languages/cpp';
import c from 'highlight.js/lib/languages/c';
import go from 'highlight.js/lib/languages/go';
import rust from 'highlight.js/lib/languages/rust';
import csharp from 'highlight.js/lib/languages/csharp';
// HTML 使用 XML 高亮
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import scss from 'highlight.js/lib/languages/scss';
import sql from 'highlight.js/lib/languages/sql';
import json from 'highlight.js/lib/languages/json';
import yaml from 'highlight.js/lib/languages/yaml';
// TOML 使用 INI 高亮
import toml from 'highlight.js/lib/languages/ini';
import dockerfile from 'highlight.js/lib/languages/dockerfile';
import matlab from 'highlight.js/lib/languages/matlab';
import latex from 'highlight.js/lib/languages/latex';
import shell from 'highlight.js/lib/languages/shell';
import bash from 'highlight.js/lib/languages/bash';

import plaintext from 'highlight.js/lib/languages/plaintext';

// 注册所有语言
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('js', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('ts', typescript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('py', python);
hljs.registerLanguage('java', java);
hljs.registerLanguage('cpp', cpp);
hljs.registerLanguage('c', c);
hljs.registerLanguage('go', go);
hljs.registerLanguage('rust', rust);
hljs.registerLanguage('csharp', csharp);
hljs.registerLanguage('cs', csharp);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('css', css);
hljs.registerLanguage('scss', scss);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('json', json);
hljs.registerLanguage('yaml', yaml);
hljs.registerLanguage('yml', yaml);
hljs.registerLanguage('toml', toml);
hljs.registerLanguage('dockerfile', dockerfile);
hljs.registerLanguage('matlab', matlab);
hljs.registerLanguage('latex', latex);
hljs.registerLanguage('tex', latex);
hljs.registerLanguage('shell', shell);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('sh', bash);
hljs.registerLanguage('plaintext', plaintext);

export default hljs;
