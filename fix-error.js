const fs = require('fs');
const path = './src/app/(dashboard)/quiz/[domainId]/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const newCatch = \      } catch (error: any) {
        console.error("Quiz Init Error:", error);
        if (isMounted) toast({ title: "Error", description: error?.message || "An unexpected error occurred connecting to the AI engine.", variant: "destructive" });
      } finally {\;

content = content.replace(/\s*\} catch \(error\) \{\s*console\.error\("Quiz Init Error:", error\);\s*if \(isMounted\) toast\(\{ title: "Error", description: "An unexpected error occurred connecting to the AI engine\.", variant: "destructive" \}\);\s*\} finally \{/g, newCatch);

fs.writeFileSync(path, content);
