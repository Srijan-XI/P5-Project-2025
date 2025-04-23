import math

def safe_eval(expr):
    """Secure evaluation with limited operations"""
    allowed_names = {'math': math}
    code = compile(expr, '<string>', 'eval')
    
    for name in code.co_names:
        if name not in allowed_names:
            raise NameError(f"Use of {name} not allowed")
    
    return eval(code, {'__builtins__': {}}, allowed_names)
