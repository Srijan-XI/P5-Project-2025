# Professional Calculator Flask Backend
from flask import Flask, render_template, request, jsonify
from static.py.calculations import calculator
from static.py.cpp_integration import cpp_integration
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(24)

@app.route('/')
def index():
    """Main calculator interface"""
    return render_template('index.html')

@app.route('/api/calculate', methods=['POST'])
def calculate():
    """API endpoint for calculations"""
    try:
        data = request.get_json()
        if not data or 'expression' not in data:
            return jsonify({'error': 'Missing expression'}), 400
        
        expression = data['expression']
        result = calculator.safe_eval(expression)
        
        return jsonify({
            'success': True,
            'result': str(result),
            'expression': expression
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Server error: {str(e)}'
        }), 500

@app.route('/api/convert', methods=['POST'])
def convert_base():
    """API endpoint for number base conversion"""
    try:
        data = request.get_json()
        if not all(key in data for key in ['number', 'from_base', 'to_base']):
            return jsonify({'error': 'Missing conversion parameters'}), 400
        
        # Use C++ integration for conversion if available
        from_base = int(data['from_base'])
        to_base = int(data['to_base'])
        number = data['number']
        
        if from_base == 10 and to_base == 2:
            result = cpp_integration.decimal_to_binary(number)
        elif from_base == 2 and to_base == 10:
            result = cpp_integration.binary_to_decimal(number)
        elif from_base == 10 and to_base == 16:
            result = cpp_integration.decimal_to_hex(number)
        elif from_base == 16 and to_base == 10:
            result = cpp_integration.hex_to_decimal(number)
        elif from_base == 10 and to_base == 8:
            result = cpp_integration.decimal_to_octal(number)
        elif from_base == 8 and to_base == 10:
            result = cpp_integration.octal_to_decimal(number)
        else:
            # Fallback to Python calculator
            result = calculator.convert_number_base(number, from_base, to_base)
        
        return jsonify({
            'success': True,
            'result': str(result),
            'original': number,
            'from_base': from_base,
            'to_base': to_base,
            'cpp_integration': cpp_integration.cpp_executable is not None
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Conversion error: {str(e)}'
        }), 500

@app.route('/api/cpp-calculate', methods=['POST'])
def cpp_calculate():
    """API endpoint for C++ calculator operations"""
    try:
        data = request.get_json()
        if not all(key in data for key in ['operation', 'num1', 'num2']):
            return jsonify({'error': 'Missing calculation parameters'}), 400
        
        result = cpp_integration.basic_calculation(
            data['operation'],
            data['num1'],
            data['num2']
        )
        
        return jsonify({
            'success': True,
            'result': str(result),
            'operation': data['operation'],
            'operand1': data['num1'],
            'operand2': data['num2'],
            'cpp_integration': True
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'C++ calculation error: {str(e)}'
        }), 500

@app.route('/api/system-info', methods=['GET'])
def system_info():
    """Get system information about available integrations"""
    cpp_info = cpp_integration.get_cpp_info()
    
    return jsonify({
        'cpp_integration': cpp_info,
        'python_calculator': True,
        'version': '2.0.0',
        'features': [
            'Basic arithmetic',
            'Scientific functions',
            'Number base conversion',
            'History tracking',
            'Secure evaluation',
            'C++ integration',
            'Responsive design'
        ]
    })

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
