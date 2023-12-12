import json
import os

script_dir = os.path.dirname(os.path.abspath(__file__))
challenges_file_str = os.path.join(script_dir, "challenges.json")
challenges_file = open(challenges_file_str)
challenges = json.load(challenges_file)

difficulty = {}
coverage = {}
code_file = {}
for c in challenges:
    if (c["difficulty"] in difficulty):
        difficulty[c["difficulty"]] = difficulty[c["difficulty"]] + 1
    else:
        difficulty[c["difficulty"]] = 1

    if (c["challenge_type"] in coverage):
        coverage[c["challenge_type"]] = coverage[c["challenge_type"]] + 1
    else:
        coverage[c["challenge_type"]] = 1 

    if ("code_file_" + str(c["code_file"]) in code_file):
        code_file["code_file_" + str(c["code_file"])] = code_file["code_file_" + str(c["code_file"])] + 1
    else:
        code_file["code_file_" + str(c["code_file"])] = 1 

total = sum(list(difficulty.values()))

def calculate_percentage(value, total):
    return round((value / total)*100, 2)

difficulty = {k: calculate_percentage(v, total) for k, v in difficulty.items()}
coverage = {k: calculate_percentage(v, total) for k, v in coverage.items()}
code_file = {k: calculate_percentage(v, total) for k, v in code_file.items()}


print(difficulty)
print(coverage)
print(code_file)