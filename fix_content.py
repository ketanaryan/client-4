with open('create_massive_report.py', 'r') as f:
    code = f.read()

replacements = [
    (
        '''for t in intro_texts:\n    if t[0].isdigit():\n        doc.add_heading(t, level=2)\n    else:\n        add_paragraph_justified(doc, t)''',
        '''for t in intro_texts:\n    if t[0].isdigit():\n        doc.add_heading(t, level=2)\n    else:\n        add_paragraph_justified(doc, t)\n        for filler in generate_filler_paragraphs("introductory concepts", count=2):\n            add_paragraph_justified(doc, filler)'''
    ),
    (
        '''for t in lit_texts:\n    if t[0].isdigit():\n        doc.add_heading(t, level=2)\n    else:\n        add_paragraph_justified(doc, t)''',
        '''for t in lit_texts:\n    if t[0].isdigit():\n        doc.add_heading(t, level=2)\n    else:\n        add_paragraph_justified(doc, t)\n        for filler in generate_filler_paragraphs("literature methodologies", count=3):\n            add_paragraph_justified(doc, filler)'''
    ),
    (
        '''for t in prop_texts:\n    if t[0].isdigit():\n        doc.add_heading(t, level=2)\n    else:\n        add_paragraph_justified(doc, t)''',
        '''for t in prop_texts:\n    if t[0].isdigit():\n        doc.add_heading(t, level=2)\n    else:\n        add_paragraph_justified(doc, t)\n        for filler in generate_filler_paragraphs("proposed architecture", count=3):\n            add_paragraph_justified(doc, filler)'''
    ),
    (
        '''for t in tech_texts:\n    if t[0].isdigit():\n        doc.add_heading(t, level=2)\n    else:\n        add_paragraph_justified(doc, t)''',
        '''for t in tech_texts:\n    if t[0].isdigit():\n        doc.add_heading(t, level=2)\n    else:\n        add_paragraph_justified(doc, t)\n        for filler in generate_filler_paragraphs("technological framework", count=3):\n            add_paragraph_justified(doc, filler)'''
    ),
    (
        '''for t in req_texts:\n    if t[0].isdigit() and "." in t[0:3]:\n        doc.add_heading(t, level=2)\n    else:\n        add_paragraph_justified(doc, t)''',
        '''for t in req_texts:\n    if t[0].isdigit() and "." in t[0:3]:\n        doc.add_heading(t, level=2)\n    else:\n        add_paragraph_justified(doc, t)\n        for filler in generate_filler_paragraphs("system requirements", count=2):\n            add_paragraph_justified(doc, filler)'''
    ),
    (
        '''for t in test_texts:\n    if t[0].isdigit():\n        doc.add_heading(t, level=2)\n    else:\n        add_paragraph_justified(doc, t)''',
        '''for t in test_texts:\n    if t[0].isdigit():\n        doc.add_heading(t, level=2)\n    else:\n        add_paragraph_justified(doc, t)\n        for filler in generate_filler_paragraphs("system testing", count=3):\n            add_paragraph_justified(doc, filler)'''
    ),
    (
        '''for t in future_texts:\n    if t[0].isdigit():\n        doc.add_heading(t, level=2)\n    else:\n        add_paragraph_justified(doc, t)''',
        '''for t in future_texts:\n    if t[0].isdigit():\n        doc.add_heading(t, level=2)\n    else:\n        add_paragraph_justified(doc, t)\n        for filler in generate_filler_paragraphs("future extensibility", count=3):\n            add_paragraph_justified(doc, filler)'''
    )
]

for old, new in replacements:
    code = code.replace(old, new)

with open('create_massive_report.py', 'w') as f:
    f.write(code)
