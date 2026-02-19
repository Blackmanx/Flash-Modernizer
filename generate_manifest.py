import os
import json

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_PATH = os.path.join(SCRIPT_DIR, "public", "assets-flash")
OUTPUT_FILE = os.path.join(SCRIPT_DIR, "src", "manifest.json")

def scan():
    courses = []
    seen_courses = set()
    
    # Get all subdirectories (courses/grades) automatically
    grades = [d for d in os.listdir(BASE_PATH) if os.path.isdir(os.path.join(BASE_PATH, d))]
    
    for grade in grades:
        grade_path = os.path.join(BASE_PATH, grade)
        if not os.path.exists(grade_path):
            continue
            
        for root, dirs, files in os.walk(grade_path):
            rel_path = os.path.relpath(root, BASE_PATH)
            
            # Application/interactive entry points (only add once per root relative to grade if we want, or per rel_path)
            entry_points = ["Main.swf", "index.swf", "app.swf", "bugs_cd3_shell.swf", "BUGS.SWF"]
            
            for ep in entry_points:
                # Case insensitive checking for some files, or just exact match for now
                if ep in files or ep.lower() in [f.lower() for f in files]:
                    if rel_path not in seen_courses:
                        course_name = os.path.basename(root)
                        if course_name.startswith("CDROM-"):
                            course_name = course_name.replace("CDROM-", "")
                        
                        # Find the actual filename to preserve case
                        actual_ep = ep
                        for f in files:
                            if f.lower() == ep.lower():
                                actual_ep = f
                                break
                        
                        courses.append({
                            "id": rel_path.replace("/", "-"),
                            "grade": grade,
                            "name": course_name,
                            "path": os.path.join(rel_path, actual_ep),
                            "type": "Interactive" if ep != "Main.swf" else "Quest",
                            "description": f"English Course Component - {grade}"
                        })
                        seen_courses.add(rel_path)
                        break # Only add one entry point per directory
                
            # Scan for loose documents (PDF, DOCX) in EVERY folder
            for f_name in files:
                if f_name.lower().endswith(('.pdf', '.doc', '.docx')):
                    doc_id = os.path.join(rel_path, f_name).replace("/", "-").replace(".", "-")
                    courses.append({
                        "id": doc_id,
                        "grade": grade,
                        "name": f_name,
                        "path": os.path.join(rel_path, f_name),
                        "type": "Document",
                        "description": f"Reading Material - {grade}"
                    })

    with open(OUTPUT_FILE, "w") as f:
        json.dump(courses, f, indent=2)
    
    print(f"Manifest generated with {len(courses)} items.")

if __name__ == "__main__":
    scan()
