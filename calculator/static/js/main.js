// Professional Calculator Frontend Logic
class AdvancedCalculator {
    constructor() {
        this.display = document.querySelector('.display');
        this.buttons = document.querySelectorAll('button');
        this.currentInput = '';
        this.shouldReset = false;
        this.history = [];
        this.useServerCalculation = false;
        
        this.init();
    }

    init() {
        this.attachEventListeners();
        this.loadHistory();
        this.display.value = '0';
    }

    attachEventListeners() {
        this.buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleButtonClick(e.target);
            });
        });

        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });

        // Add toggle for server calculation
        this.createToggleButton();
    }

    createToggleButton() {
        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = 'Client Mode';
        toggleBtn.className = 'mode-toggle';
        toggleBtn.addEventListener('click', () => {
            this.useServerCalculation = !this.useServerCalculation;
            toggleBtn.textContent = this.useServerCalculation ? 'Server Mode' : 'Client Mode';
            toggleBtn.style.background = this.useServerCalculation ? '#ff6b6b' : '#4ecdc4';
        });
        
        document.querySelector('.calculator').appendChild(toggleBtn);
    }

    handleButtonClick(button) {
        const value = button.getAttribute('data-value');
        
        if (!value) return;

        switch (value) {
            case 'AC':
                this.clearAll();
                break;
            case 'DEL':
                this.deleteLast();
                break;
            case '=':
                this.calculate();
                break;
            default:
                this.appendValue(value);
        }
    }

    clearAll() {
        this.currentInput = '';
        this.shouldReset = false;
        this.display.classList.remove('error');
        this.updateDisplay('0');
    }

    deleteLast() {
        if (this.currentInput.length > 0) {
            this.currentInput = this.currentInput.slice(0, -1);
            this.updateDisplay(this.currentInput || '0');
        }
    }

    appendValue(value) {
        if (this.shouldReset) {
            this.currentInput = '';
            this.shouldReset = false;
            this.display.classList.remove('error');
        }

        // Validate input
        if (this.isValidInput(value)) {
            this.currentInput += value;
            this.updateDisplay(this.currentInput);
        }
    }

    isValidInput(value) {
        // Prevent multiple operators in a row
        const lastChar = this.currentInput.slice(-1);
        const operators = ['+', '-', '*', '/', '%'];
        
        if (operators.includes(value) && operators.includes(lastChar)) {
            return false;
        }
        
        // Prevent multiple decimal points in the same number
        if (value === '.') {
            const parts = this.currentInput.split(/[+\-*/]/);
            const lastPart = parts[parts.length - 1];
            if (lastPart.includes('.')) {
                return false;
            }
        }
        
        return true;
    }

    async calculate() {
        if (!this.currentInput) return;

        try {
            let result;
            
            if (this.useServerCalculation) {
                result = await this.serverCalculate(this.currentInput);
            } else {
                result = await this.clientCalculate(this.currentInput);
            }

            this.addToHistory(this.currentInput, result);
            this.currentInput = result.toString();
            this.shouldReset = true;
            this.updateDisplay(result);
            
        } catch (error) {
            console.error('Calculation error:', error);
            this.showError('Error');
        }
    }

    async serverCalculate(expression) {
        const response = await fetch('/api/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ expression })
        });

        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error);
        }
        
        return data.result;
    }

    async clientCalculate(expression) {
        // Secure client-side calculation
        try {
            // Replace ^ with ** for power operations
            expression = expression.replace(/\^/g, '**');
            
            // Use Function constructor for safer evaluation
            const safeEval = new Function('return ' + expression);
            const result = safeEval();
            
            if (!isFinite(result)) {
                throw new Error('Invalid result');
            }
            
            return result;
        } catch (error) {
            throw new Error('Invalid expression');
        }
    }

    updateDisplay(value) {
        this.display.value = value;
    }

    showError(message) {
        this.currentInput = '';
        this.shouldReset = true;
        this.display.classList.add('error');
        this.updateDisplay(message);
    }

    addToHistory(expression, result) {
        this.history.push({ expression, result, timestamp: new Date() });
        this.saveHistory();
    }

    saveHistory() {
        localStorage.setItem('calculatorHistory', JSON.stringify(this.history.slice(-10)));
    }

    loadHistory() {
        const saved = localStorage.getItem('calculatorHistory');
        if (saved) {
            this.history = JSON.parse(saved);
        }
    }

    handleKeyboard(event) {
        const key = event.key;
        
        // Prevent default for calculator keys
        if (/[0-9+\-*/.%=]/.test(key) || ['Enter', 'Backspace', 'Escape'].includes(key)) {
            event.preventDefault();
        }

        if (key >= '0' && key <= '9' || key === '.') {
            this.appendValue(key);
        } else if (key === 'Enter') {
            this.calculate();
        } else if (key === 'Backspace') {
            this.deleteLast();
        } else if (key === 'Escape') {
            this.clearAll();
        } else if (['+', '-', '*', '/', '%'].includes(key)) {
            this.appendValue(key);
        }
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.calculator = new AdvancedCalculator();
});
