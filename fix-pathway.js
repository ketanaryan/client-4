const fs = require('fs');
const path = './src/app/(dashboard)/pathway-recommendations/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const replacement = `          } catch (e) {
            console.error("Failed to generate course pathway:", e);
            // Frontend Fallback to prevent infinite loops
            setCourses([
              {
                id: 'c1',
                title: 'Foundations of Modern Architectures',
                type: 'Course',
                status: flaws.length > 0 ? 'Locked' : 'Next',
                flaws: flaws.map(f => f.concept_name),
                reasoning: 'Since your diagnostic score revealed specific gaps in core concepts, this course is designed to rebuild your foundational logic.'
              },
              {
                id: 'c2',
                title: 'Advanced State Synchronization',
                type: 'Course',
                status: 'Locked',
                flaws: [],
                reasoning: 'A direct continuation of C1, ensuring you can manage highly complex real-time applications.'
              },
              {
                id: 'c3',
                title: 'Distributed System Integration',
                type: 'Course',
                status: 'Locked',
                flaws: [],
                reasoning: 'Prepares you for enterprise-level scale by introducing microservices and event-driven patterns.'
              },
              {
                id: 'c4',
                title: 'Performance & Optimization Tuning',
                type: 'Course',
                status: 'Locked',
                flaws: [],
                reasoning: 'The final capstone ensuring your software runs efficiently within memory and CPU constraints.'
              }
            ]);
          } finally {`;

content = content.replace(/          \} catch \(e\) \{\s*console\.error\("Failed to generate course pathway:", e\);\s*\} finally \{/m, replacement);

fs.writeFileSync(path, content);
