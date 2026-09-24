const fs = require('fs');
const path = './src/app/(dashboard)/pathway-recommendations/page.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "import { useState, useEffect } from 'react';",
  "import { useState, useEffect } from 'react';\nimport { useRouter } from 'next/navigation';"
);

content = content.replace(
  "export default function PathwayRecommendationsPage() {",
  "export default function PathwayRecommendationsPage() {\n  const router = useRouter();"
);

fs.writeFileSync(path, content);
