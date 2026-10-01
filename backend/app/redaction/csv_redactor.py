import csv

def redact_csv(input_path: str, output_path: str, redactions: list):
    try:
        data = []
        with open(input_path, 'r', encoding='utf-8') as f:
            reader = csv.reader(f)
            for row in reader:
                new_row = []
                for cell in row:
                    val = cell
                    for r in redactions:
                        if r['value'] in val:
                            val = val.replace(r['value'], r['masked_value'])
                    new_row.append(val)
                data.append(new_row)
        with open(output_path, 'w', encoding='utf-8', newline='') as f:
            writer = csv.writer(f)
            writer.writerows(data)
    except Exception as e:
        print(f"CSV Redact Error: {e}")
