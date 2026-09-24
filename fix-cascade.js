const fs = require('fs');
const path = './src/app/(dashboard)/pathway-recommendations/page.tsx';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes('const processingCompletion = useRef(false);')) {
  // Add useRef import
  content = content.replace(
    "import { useState, useEffect } from 'react';",
    "import { useState, useEffect, useRef } from 'react';"
  );
  
  // Add ref inside component
  content = content.replace(
    "const searchParams = useSearchParams();",
    "const searchParams = useSearchParams();\n  const processingCompletion = useRef(false);"
  );
  
  // Update the if condition
  content = content.replace(
    "if (searchParams.get('completed') === 'true' && courses.length > 0 && profile) {",
    "if (searchParams.get('completed') === 'true' && courses.length > 0 && profile && !processingCompletion.current) {\n      processingCompletion.current = true;"
  );
  
  // Wait, what if they click another course? We need to remove the completed param from the URL synchronously
  // using window.history so it doesn't stay there.
  content = content.replace(
    "router.replace('/pathway-recommendations');",
    "window.history.replaceState(null, '', '/pathway-recommendations');"
  );
  
  fs.writeFileSync(path, content);
}
