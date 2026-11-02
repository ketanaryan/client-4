import urllib.request
import urllib.parse
import os

def download_graphviz(dot_code, filename):
    url = "https://quickchart.io/graphviz"
    data = urllib.parse.urlencode({'graph': dot_code}).encode('utf-8')
    req = urllib.request.Request(url, data=data)
    with urllib.request.urlopen(req) as response:
        with open(filename, 'wb') as f:
            f.write(response.read())

sys_arch = """
digraph G {
  rankdir=LR;
  node [shape=box, style=filled, fillcolor=lightblue, fontname="Arial"];
  User [shape=ellipse, fillcolor=lightgreen];
  NextJS [label="Next.js App Router\\n(Frontend & API)"];
  Gemini [label="Gemini 3.5 Flash\\n(Diagnostic LLM)"];
  Supabase [label="Supabase PostgreSQL\\n(Cache & Auth)"];
  
  User -> NextJS [label="Takes Quiz"];
  NextJS -> Gemini [label="Streams Text"];
  Gemini -> NextJS [label="JSON Pathway"];
  NextJS -> Supabase [label="Saves State"];
  Supabase -> NextJS [label="Loads State"];
  NextJS -> User [label="Renders UI"];
}
"""

dfd0 = """
digraph G {
  node [shape=box, fontname="Arial", style=filled, fillcolor=lightyellow];
  Student [shape=ellipse, fillcolor=lightgreen];
  Student -> "EduPredict System" [label="Answers"];
  "EduPredict System" -> Student [label="Dynamic Pathway"];
}
"""

dfd1 = """
digraph G {
  node [shape=box, fontname="Arial", style=filled, fillcolor=lightyellow];
  Student [shape=ellipse, fillcolor=lightgreen];
  Student -> "1. Auth" [label="Credentials"];
  "1. Auth" -> "2. Diagnostic Quiz" [label="Token"];
  Student -> "2. Diagnostic Quiz" [label="Answers"];
  "2. Diagnostic Quiz" -> "3. Flaw Extraction" [label="Transcript"];
  "3. Flaw Extraction" -> "4. Pathway Generation" [label="Flaws"];
  "4. Pathway Generation" -> "5. Database" [label="Pathway JSON"];
  "5. Database" -> "6. Dashboard" [label="Cached State"];
  "6. Dashboard" -> Student [label="Course UI"];
}
"""

use_case = """
digraph G {
  rankdir=LR;
  node [shape=ellipse, fontname="Arial", style=filled, fillcolor=lightyellow];
  Student [shape=box, fillcolor=lightgreen];
  Student -> "Login";
  Student -> "Take Diagnostic Quiz";
  Student -> "View Pathway";
  Student -> "Remediate Flaws";
  Student -> "Complete Lessons";
}
"""

er_diagram = """
digraph G {
  node [shape=record, fontname="Arial", style=filled, fillcolor=lightblue];
  Users [label="{Users | id (PK) | email | created_at}"];
  Profiles [label="{Profiles | id (FK) | mastery_score | cached_course_pathway (JSONB)}"];
  Users -> Profiles;
}
"""

download_graphviz(sys_arch, "arch.png")
download_graphviz(dfd0, "dfd0.png")
download_graphviz(dfd1, "dfd1.png")
download_graphviz(use_case, "usecase.png")
download_graphviz(er_diagram, "er.png")

print("Diagrams generated!")
