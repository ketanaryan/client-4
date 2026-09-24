const fs = require('fs');
const path = './src/app/(dashboard)/quiz/[domainId]/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const newHook = `  useEffect(() => {
    let isMounted = true;
    
    async function initializeQuiz() {
      try {
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Timeout")), 15000)
        );
        
        const fetchLogic = async () => {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) {
            router.push('/login');
            return;
          }

          const { data: profile } = await supabase
            .from('profiles')
            .select('academic_level, prior_knowledge')
            .eq('id', user.id)
            .single();

          const domainId = params?.domainId as string;
          const decodedDomain = decodeURIComponent(domainId || '');

          const response = await fetch('/api/generate-quiz', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              targetDomain: decodedDomain,
              academicLevel: profile?.academic_level || 'Beginner',
              priorKnowledge: profile?.prior_knowledge || []
            })
          });

          const data = await response.json();
          
          if (response.ok && data.quiz) {
            if (isMounted) setQuestions(data.quiz);
          } else {
            if (isMounted) toast({ title: "Generation Failed", description: data.error || "Failed to generate AI quiz.", variant: "destructive" });
          }
        };

        await Promise.race([fetchLogic(), timeoutPromise]);
      } catch (error) {
        console.error("Quiz Init Error:", error);
        if (isMounted) toast({ title: "Error", description: "An unexpected error occurred connecting to the AI engine.", variant: "destructive" });
      } finally {
        if (isMounted) setIsInitializing(false);
      }
    }

    initializeQuiz();
    return () => { isMounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.domainId]);`;

content = content.replace(/useEffect\(\(\) => \{[\s\S]*?\}, \[params\?\.domainId\]\);/m, newHook);
fs.writeFileSync(path, content);
