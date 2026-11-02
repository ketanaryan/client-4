import urllib.request
import zlib
import base64

def download_kroki(text, filename, type='plantuml'):
    compressed = zlib.compress(text.encode('utf-8'), 9)
    encoded = base64.urlsafe_b64encode(compressed).decode('utf-8')
    url = f'https://kroki.io/{type}/png/{encoded}'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as response:
        with open(filename, 'wb') as f:
            f.write(response.read())

puml = '''
@startuml
rectangle User
rectangle NextJS [Next.js App Router]
rectangle Gemini [Gemini 3.5 Flash]
database Supabase [Supabase PostgreSQL]

User -> NextJS : Takes Quiz
NextJS -> Gemini : Streams Text
Gemini -> NextJS : JSON Pathway
NextJS -> Supabase : Saves State
Supabase -> NextJS : Loads State
NextJS -> User : Renders UI
@enduml
'''
download_kroki(puml, 'arch.png')

dfd0 = '''
@startuml
actor Student
rectangle "EduPredict System" as Sys
Student -> Sys : Answers
Sys -> Student : Dynamic Pathway
@enduml
'''
download_kroki(dfd0, 'dfd0.png')

er = '''
@startuml
entity Users {
    * id (PK)
    --
    email
    created_at
}
entity Profiles {
    * id (FK)
    --
    mastery_score
    cached_course_pathway (JSONB)
}
Users ||--o| Profiles
@enduml
'''
download_kroki(er, 'er.png')

print('Diagrams generated successfully!')
