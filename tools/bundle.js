/* Inlines every stylesheet and script into one self-contained file.
   Produces two flavours:
     dist/index.html     a complete standalone document
     dist/artifact.html  page content only (the host supplies the skeleton)   */
'use strict';
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

const src = read('index.html');

const cssFiles = [...src.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map((m) => m[1]);
const jsFiles = [...src.matchAll(/<script src="([^"]+)"><\/script>/g)].map((m) => m[1]);
const fontLink = (src.match(/<link href="https:\/\/fonts\.googleapis[^>]+>/) || [''])[0];

const css = cssFiles.map((f) => '/* ' + f + ' */\n' + read(f)).join('\n');
const js = jsFiles.map((f) => '/* ' + f + ' */\n' + read(f)).join('\n;\n');

/* everything between <body> and the first <script> is the page markup */
const body = src.slice(src.indexOf('<body>') + 6, src.indexOf('<script src=')).trim();

const favicon = (src.match(/<link rel="icon"[^>]+>/) || [''])[0];
const desc = 'A narrative thriller about a retail trader who finds the seams in a coordinated pump. Fiction. Not financial advice.';

fs.mkdirSync(path.join(root, 'dist'), { recursive: true });

fs.writeFileSync(path.join(root, 'dist/index.html'),
`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<title>The Last Candle</title>
<meta name="description" content="${desc}" />
<meta name="color-scheme" content="dark" />
${favicon}
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
${fontLink}
<style>
${css}
</style>
</head>
<body>
${body}
<script>
${js}
</script>
</body>
</html>
`);

fs.writeFileSync(path.join(root, 'dist/artifact.html'),
`<title>The Last Candle</title>
<meta name="description" content="${desc}" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
${fontLink}
<style>
${css}
</style>
${body}
<script>
${js}
</script>
`);

const kb = (p) => (fs.statSync(path.join(root, p)).size / 1024).toFixed(0) + ' KB';
console.log('bundled ' + cssFiles.length + ' stylesheets + ' + jsFiles.length + ' scripts');
console.log('  dist/index.html     ' + kb('dist/index.html'));
console.log('  dist/artifact.html  ' + kb('dist/artifact.html'));
