
import re
import json

with open(r'p:\CODE-XI\P5-Project-2025\Fun Fact Generator Web App\fun-fact.json', 'r', encoding='utf-8') as f:
    file_content = f.read()

facts = re.findall(r'"([^"]*)"', file_content)
unique_facts = sorted(list(set(facts)))

# Remove keys like "fun_facts", "fact_1", etc.
keys_to_remove = ["fun_facts", "fact_1", "fact_2", "fact_3", "fact_4", "fact_5"]
cleaned_facts = [fact for fact in unique_facts if fact not in keys_to_remove]

output_json = {
    "fun_facts": cleaned_facts
}

with open(r'p:\CODE-XI\P5-Project-2025\Fun Fact Generator Web App\fun-fact.json', 'w', encoding='utf-8') as f:
    json.dump(output_json, f, indent=2)

print("Successfully cleaned fun-fact.json")
