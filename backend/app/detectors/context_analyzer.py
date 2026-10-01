def has_context(text: str, start: int, end: int, keywords: list, window: int = 50) -> bool:
    start_window = max(0, start - window)
    end_window = min(len(text), end + window)
    context_text = text[start_window:end_window].lower()
    return any(k.lower() in context_text for k in keywords)
