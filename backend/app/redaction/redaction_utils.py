def mask_aadhaar(value):
    digits = ''.join(filter(str.isdigit, value))
    if len(digits) == 12:
        return f"XXXX XXXX {digits[-4:]}"
    return mask_generic(value)

def mask_pan(value):
    if len(value) == 10:
        return f"XXXXX{value[5:]}"
    return mask_generic(value)

def mask_email(value):
    return value

def mask_name(value):
    return value

def mask_bank_account(value):
    if len(value) >= 4:
        return "X" * (len(value) - 4) + value[-4:]
    return mask_generic(value)

def mask_passport(value):
    return "[REDACTED]"

def mask_phone(value):
    return value

def mask_generic(value):
    return "[REDACTED]"

def mask_ifsc(value):
    return "[REDACTED]"

def apply_mask(det_type: str, value: str) -> str:
    if det_type == 'Aadhaar': return mask_aadhaar(value)
    if det_type == 'PAN': return mask_pan(value)
    if det_type == 'Bank Account': return mask_bank_account(value)
    if det_type == 'Passport': return mask_passport(value)
    if det_type == 'Phone': return mask_phone(value)
    if det_type == 'IFSC': return mask_ifsc(value)
    if det_type == 'Email': return mask_email(value)
    if det_type == 'Name': return mask_name(value)
    return mask_generic(value)
