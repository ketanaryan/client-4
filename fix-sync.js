const fs = require('fs');
const path = './src/app/(dashboard)/pathway-recommendations/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const replacement = `  // Sync locked courses with current flaws if loaded from cache
  useEffect(() => {
    if (courses.length > 0 && courses[0].status === 'Locked' && flaws.length === 0 && !isLoading) {
      setCourses(prev => prev.map((c, idx) => idx === 0 ? { ...c, status: 'Next', flaws: [] } : c));
    }
  }, [courses, flaws, isLoading]);

  const handleRemediate = async (flaw: string) => {`;

content = content.replace(/  const handleRemediate = async \(flaw: string\) => \{/m, replacement);

fs.writeFileSync(path, content);
