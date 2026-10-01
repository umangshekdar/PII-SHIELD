import csv

def process_csv(filepath: str) -> str:
    text = ""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            reader = csv.reader(f)
            for row in reader:
                text += " ".join(row) + "\n"
    except Exception as e:
        print(f"Error CSV: {e}")
    return text
