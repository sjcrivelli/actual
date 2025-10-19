// Auto-sync script for /docs → /dashboard/docs.json
const fs = require('fs');
const path = require('path');
const docsDir = path.join(__dirname, '../docs');
const outFile = path.join(__dirname, '../dashboard/docs.json');
const md = require('marked');

function getHeadings(content) {
  return Array.from(content.matchAll(/^#+\s+(.*)$/gm)).map(m => m[1]);
}

function getTitle(filename, content) {
  const m = content.match(/^#\s+(.*)$/m);
  return m ? m[1] : path.basename(filename, '.md');
}

function buildDocsJson() {
  const files = fs.readdirSync(docsDir).filter(f => f.endsWith('.md'));
  const docs = files.map(file => {
    const content = fs.readFileSync(path.join(docsDir, file), 'utf8');
    return {
      file,
      title: getTitle(file, content),
      headings: getHeadings(content),
      content
    };
  });
  fs.writeFileSync(outFile, JSON.stringify(docs, null, 2));
}

buildDocsJson();

fs.watch(docsDir, {recursive: false}, (event, filename) => {
  if (filename && filename.endsWith('.md')) {
    buildDocsJson();
    console.log('docs.json updated');
  }
});
