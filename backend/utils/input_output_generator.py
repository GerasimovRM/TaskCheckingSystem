import sys
from pprint import pprint


def get_base_node(input_lines, output_lines):
    return {
        "attachment_type": "input_output",
        "data": {
            "input": input_lines,
            "output": output_lines
        }
    }


res = []
res_is_ready = False
while True:
    input_lines = []
    for line in sys.stdin:
        line = line.strip()
        if line == '`':
            break
        elif line == '``':
            res_is_ready = True
            break
        input_lines.append(line)
    if res_is_ready:
        break

    output_lines = []
    for line in sys.stdin:
        line = line.strip()
        if line == '`':
            break
        elif line == '``':
            res_is_ready = True
            break
        output_lines.append(line)
    if res_is_ready:
        break
    res.append(get_base_node(input_lines, output_lines))

print(str(res).replace("\'", "\""))

