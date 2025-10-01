# Advanced Calculator Backend Logic
import math
import re
from typing import Union

class SecureCalculator:
    """Secure calculator with advanced mathematical operations"""
    
    def __init__(self):
        self.allowed_functions = {
            'abs', 'round', 'min', 'max',
            'sin', 'cos', 'tan', 'asin', 'acos', 'atan',
            'sinh', 'cosh', 'tanh', 'asinh', 'acosh', 'atanh',
            'log', 'log10', 'log2', 'exp', 'sqrt', 'pow',
            'degrees', 'radians', 'factorial', 'gcd', 'lcm',
            'floor', 'ceil', 'trunc'
        }
        
        self.math_constants = {
            'pi': math.pi,
            'e': math.e,
            'tau': math.tau,
            'inf': math.inf,
            'nan': math.nan
        }
    
    def safe_eval(self, expr: str) -> Union[float, int, str]:
        """Secure evaluation with limited operations"""
        try:
            # Remove spaces and validate characters
            expr = re.sub(r'\s+', '', expr)
            
            # Check for dangerous patterns
            dangerous_patterns = ['import', 'exec', 'eval', '__', 'open', 'file']
            if any(pattern in expr.lower() for pattern in dangerous_patterns):
                raise ValueError("Dangerous operation detected")
            
            # Replace mathematical constants
            for const, value in self.math_constants.items():
                expr = expr.replace(const, str(value))
            
            # Create safe namespace
            safe_dict = {'__builtins__': {}}
            
            # Add math functions
            for func_name in self.allowed_functions:
                if hasattr(math, func_name):
                    safe_dict[func_name] = getattr(math, func_name)
            
            # Compile and evaluate
            code = compile(expr, '<string>', 'eval')
            
            # Validate all names are allowed
            for name in code.co_names:
                if name not in safe_dict and name not in self.math_constants:
                    raise NameError(f"Use of '{name}' not allowed")
            
            result = eval(code, safe_dict)
            
            # Handle special cases
            if isinstance(result, complex):
                if result.imag == 0:
                    return result.real
                return f"{result.real}+{result.imag}i"
            
            return result
            
        except ZeroDivisionError:
            return "Error: Division by zero"
        except ValueError as e:
            return f"Error: {str(e)}"
        except Exception as e:
            return f"Error: Invalid expression"
    
    def convert_number_base(self, number: str, from_base: int, to_base: int) -> str:
        """Convert number between different bases (2, 8, 10, 16)"""
        try:
            # Convert to decimal first
            decimal_value = int(number, from_base)
            
            if to_base == 10:
                return str(decimal_value)
            elif to_base == 2:
                return bin(decimal_value)[2:]
            elif to_base == 8:
                return oct(decimal_value)[2:]
            elif to_base == 16:
                return hex(decimal_value)[2:].upper()
            else:
                return "Error: Unsupported base"
        except ValueError:
            return "Error: Invalid number for base"

# Global calculator instance
calculator = SecureCalculator()
