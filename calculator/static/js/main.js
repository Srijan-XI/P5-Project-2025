const display = document.querySelector('.display');
const buttons = document.querySelectorAll('button');

let currentInput = '';
let shouldReset = false;

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.getAttribute('data-value');

        if (value === 'AC') {
            currentInput = '';
            display.classList.remove('error');
        } else if (value === 'DEL') {
            currentInput = currentInput.slice(0, -1);
        } else if (value === '=') {
            try {
                currentInput = eval(currentInput).toString();
                
            } catch (error) {
                currentInput = 'Error';
                display.classList.add('error');
            }
            shouldReset = true;
        } else {
            if (shouldReset) {
                currentInput = '';
                shouldReset = false;
                display.classList.remove('error');
            }
            currentInput += value;
        }

        display.value = currentInput;
    });
});


document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9' || e.key === '.') {
        document.querySelector(`button[data-value="${e.key}"]`).click();
    } else if (e.key === 'Enter') {
        document.querySelector('button[data-value="="]').click();
    } else if (e.key === 'Backspace') {
        document.querySelector('button[data-value="DEL"]').click();
    } else if (e.key === 'Escape') {
        document.querySelector('button[data-value="AC"]').click();
    } else if (['+', '-', '*', '/', '%'].includes(e.key)) {
        document.querySelector(`button[data-value="${e.key}"]`).click();
    }
});
