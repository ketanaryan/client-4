const fs = require('fs');
const path = './src/app/(dashboard)/pathway-recommendations/page.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  /onClick=\{\(\) => alert\("Presentation Demo: This would open the interactive LMS module for " \+ course\.title \+ " \(Coming in v2\)\."\)\}/g,
  "onClick={() => router.push(`/course/${encodeURIComponent(course.title)}`)}"
);

fs.writeFileSync(path, content);
