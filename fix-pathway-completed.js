const fs = require('fs');
const path = './src/app/(dashboard)/pathway-recommendations/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Import useSearchParams
if (!content.includes('useSearchParams')) {
  content = content.replace(
    "import { useRouter } from 'next/navigation';",
    "import { useRouter, useSearchParams } from 'next/navigation';"
  );
}

// 2. Initialize searchParams
if (!content.includes('const searchParams = useSearchParams();')) {
  content = content.replace(
    "const router = useRouter();",
    "const router = useRouter();\n  const searchParams = useSearchParams();"
  );
}

// 3. Add useEffect to handle completed logic
const effectLogic = `
  // Handle course completion from URL parameter
  useEffect(() => {
    if (searchParams.get('completed') === 'true' && courses.length > 0 && profile) {
      const updatedCourses = [...courses];
      
      // Find the first non-completed course
      const currentIndex = updatedCourses.findIndex(c => c.status !== 'Completed');
      
      if (currentIndex !== -1) {
        // Mark current as completed
        updatedCourses[currentIndex].status = 'Completed';
        updatedCourses[currentIndex].flaws = [];
        
        // Unlock next course if it exists
        if (currentIndex + 1 < updatedCourses.length) {
          updatedCourses[currentIndex + 1].status = 'Next';
        }
        
        setCourses(updatedCourses);
        
        // Save to database
        supabase
          .from('profiles')
          .update({ cached_course_pathway: updatedCourses })
          .eq('id', profile.id)
          .then(() => {
            // Remove the query param silently
            router.replace('/pathway-recommendations');
          });
      }
    }
  }, [searchParams, courses, profile, router, supabase]);
`;

if (!content.includes('searchParams.get(\'completed\')')) {
  // Inject right before handleMarkUnderstood
  content = content.replace(
    /  const handleMarkUnderstood = async/g,
    effectLogic + '\n  const handleMarkUnderstood = async'
  );
}

// 4. Update the Button rendering in the UI to handle 'Completed' status
// Currently it only handles Next and Locked
const btnRegex = /<Button variant=\{course\.status === 'Next' \|\| idx === 0 \? 'default' : 'outline'\}[\s\S]*?<\/Button>/g;
const newBtn = `<Button 
  variant={course.status === 'Completed' ? 'secondary' : (course.status === 'Next' || idx === 0 ? 'default' : 'outline')} 
  className={course.status === 'Completed' ? 'bg-green-50 text-green-700 hover:bg-green-100 border-green-200' : (course.status === 'Next' || idx === 0 ? 'bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm' : '')} 
  disabled={course.status === 'Locked' && idx !== 0} 
  onClick={() => router.push(\`/course/\${encodeURIComponent(course.title)}\`)}
>
  {course.status === 'Completed' ? (
    <><CheckCircle2 className="h-4 w-4 mr-2 text-green-600" /> Completed</>
  ) : (
    course.status === 'Locked' && idx !== 0 ? 'Locked' : 'Start Course'
  )}
</Button>`;

content = content.replace(btnRegex, newBtn);

fs.writeFileSync(path, content);
