const fs = require('fs');
const path = './src/app/(dashboard)/pathway-recommendations/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Remove the entire Dialog block for AI Remediation
const dialogRegex = /\{\/\* The Flaw Button \*\/\}\s*<Dialog>[\s\S]*?<\/Dialog>/;
content = content.replace(dialogRegex, '');

// 2. Make the first course ALWAYS startable regardless of Locked status
const btnRegex = /<Button variant=\{course\.status === 'Next' \? 'default' : 'outline'\}\s*className=\{course\.status === 'Next' \? 'bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm' : ''\}\s*disabled=\{course\.status === 'Locked'\}\s*onClick=\{\(\) => router\.push\(`\/course\/\$\{encodeURIComponent\(course\.title\)\}`\)\}>\s*\{course\.status === 'Locked' \? 'Locked' : 'Start Course'\}\s*<\/Button>/g;

const newBtn = `<Button variant={course.status === 'Next' || idx === 0 ? 'default' : 'outline'} 
className={course.status === 'Next' || idx === 0 ? 'bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm' : ''} 
disabled={course.status === 'Locked' && idx !== 0} onClick={() => router.push(\`/course/\${encodeURIComponent(course.title)}\`)}>
  {course.status === 'Locked' && idx !== 0 ? 'Locked' : 'Start Course'}
</Button>`;

content = content.replace(btnRegex, newBtn);

fs.writeFileSync(path, content);
