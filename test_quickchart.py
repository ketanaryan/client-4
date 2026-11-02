import urllib.request
import json

def download_graphviz(dot_code, filename):
    url = "https://quickchart.io/graphviz"
    data = json.dumps({"graph": dot_code}).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req) as response:
        with open(filename, "wb") as f:
            f.write(response.read())

try:
    download_graphviz('digraph G { A -> B }', 'test.png')
    print('Success')
except Exception as e:
    print('Error:', e)
