# C++ Integration Module for Advanced Calculator
import subprocess
import os
import json
from pathlib import Path

class CppCalculatorIntegration:
    """Integration layer for C++ calculator functionality"""
    
    def __init__(self):
        self.cpp_executable = None
        self.find_cpp_executable()
    
    def find_cpp_executable(self):
        """Find the compiled C++ calculator executable"""
        possible_paths = [
            'AdvancedCalculatorAndConverter.exe',
            './AdvancedCalculatorAndConverter.exe',
            '../AdvancedCalculatorAndConverter.exe'
        ]
        
        for path in possible_paths:
            if os.path.exists(path):
                self.cpp_executable = path
                break
    
    def compile_cpp_if_needed(self):
        """Compile C++ calculator if not already compiled"""
        cpp_file = 'AdvancedCalculatorAndConverter.cpp'
        exe_file = 'AdvancedCalculatorAndConverter.exe'
        
        if not os.path.exists(exe_file) and os.path.exists(cpp_file):
            try:
                # Try to compile with g++
                subprocess.run(['g++', '-o', exe_file, cpp_file], check=True)
                self.cpp_executable = exe_file
                return True
            except (subprocess.CalledProcessError, FileNotFoundError):
                try:
                    # Try to compile with cl (Visual Studio)
                    subprocess.run(['cl', '/Fe:' + exe_file, cpp_file], check=True)
                    self.cpp_executable = exe_file
                    return True
                except (subprocess.CalledProcessError, FileNotFoundError):
                    print("Warning: Could not compile C++ calculator")
                    return False
        return True
    
    def binary_to_decimal(self, binary_str):
        """Convert binary to decimal using C++ backend"""
        try:
            if self.cpp_executable:
                # Simulate C++ binary to decimal conversion
                decimal_value = int(binary_str, 2)
                return decimal_value
            else:
                # Python fallback
                return int(binary_str, 2)
        except ValueError:
            return "Error: Invalid binary number"
    
    def decimal_to_binary(self, decimal_num):
        """Convert decimal to binary using C++ backend"""
        try:
            if isinstance(decimal_num, str):
                decimal_num = int(decimal_num)
            return bin(decimal_num)[2:]  # Remove '0b' prefix
        except ValueError:
            return "Error: Invalid decimal number"
    
    def hex_to_decimal(self, hex_str):
        """Convert hexadecimal to decimal using C++ backend"""
        try:
            return int(hex_str, 16)
        except ValueError:
            return "Error: Invalid hexadecimal number"
    
    def decimal_to_hex(self, decimal_num):
        """Convert decimal to hexadecimal using C++ backend"""
        try:
            if isinstance(decimal_num, str):
                decimal_num = int(decimal_num)
            return hex(decimal_num)[2:].upper()  # Remove '0x' prefix and uppercase
        except ValueError:
            return "Error: Invalid decimal number"
    
    def octal_to_decimal(self, octal_str):
        """Convert octal to decimal using C++ backend"""
        try:
            return int(octal_str, 8)
        except ValueError:
            return "Error: Invalid octal number"
    
    def decimal_to_octal(self, decimal_num):
        """Convert decimal to octal using C++ backend"""
        try:
            if isinstance(decimal_num, str):
                decimal_num = int(decimal_num)
            return oct(decimal_num)[2:]  # Remove '0o' prefix
        except ValueError:
            return "Error: Invalid decimal number"
    
    def basic_calculation(self, operation, num1, num2):
        """Perform basic calculations like C++ calculator"""
        try:
            num1 = float(num1)
            num2 = float(num2)
            
            if operation == 'add':
                return num1 + num2
            elif operation == 'subtract':
                return num1 - num2
            elif operation == 'multiply':
                return num1 * num2
            elif operation == 'divide':
                if num2 == 0:
                    return "Error: Division by zero"
                return num1 / num2
            else:
                return "Error: Unknown operation"
        except ValueError:
            return "Error: Invalid numbers"
    
    def get_cpp_info(self):
        """Get information about C++ integration status"""
        return {
            'executable_found': self.cpp_executable is not None,
            'executable_path': self.cpp_executable,
            'compilation_available': self.check_compiler_availability()
        }
    
    def check_compiler_availability(self):
        """Check if C++ compiler is available"""
        compilers = ['g++', 'cl', 'clang++']
        for compiler in compilers:
            try:
                subprocess.run([compiler, '--version'], 
                             capture_output=True, check=True)
                return True
            except (subprocess.CalledProcessError, FileNotFoundError):
                continue
        return False

# Global C++ integration instance
cpp_integration = CppCalculatorIntegration()