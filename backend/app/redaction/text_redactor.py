def redact_text(input_path: str, output_path: str, redactions: list):
    try:
        with open(input_path, 'r', encoding='utf-8') as f:
            text = f.read()
        for r in redactions:
            text = text.replace(r['value'], r['masked_value'])
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(text)
    except Exception as e:
        print(f"Text Redact Error: {e}")
