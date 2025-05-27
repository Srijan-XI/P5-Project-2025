const display = document.getElementById('display');

function insert(value) {
  display.value += value;
}

function clearDisplay() {
  display.value = '';
}

function del() {
  display.value = display.value.slice(0, -1);
}

function calculate() {
  try {
    const expression = display.value
      .replace(/π/g, Math.PI)
      .replace(/e/g, Math.E);
    display.value = eval(expression);
  } catch {
    display.value = 'Error';
  }
}

function square() {
  display.value += '**2';
}

function cube() {
  display.value += '**3';
}

function sqrt() {
  display.value += '**0.5';
}

function factorial() {
  try {
    const num = parseInt(display.value);
    let fact = 1;
    for (let i = 2; i <= num; i++) fact *= i;
    display.value = fact;
  } catch {
    display.value = 'Error';
  }
}

function func(type) {
  try {
    const val = parseFloat(display.value);
    const rad = val * Math.PI / 180;
    let result = 0;
    switch (type) {
      case 'sin': result = Math.sin(rad); break;
      case 'cos': result = Math.cos(rad); break;
      case 'tan': result = Math.tan(rad); break;
    }
    display.value = result;
  } catch {
    display.value = 'Error';
  }
}

let isInverse = false;

function toggleInverse() {
  isInverse = !isInverse;

  document.getElementById("sinBtn").innerText = isInverse ? "sin⁻¹" : "sin";
  document.getElementById("cosBtn").innerText = isInverse ? "cos⁻¹" : "cos";
  document.getElementById("tanBtn").innerText = isInverse ? "tan⁻¹" : "tan";
}

function func(type) {
  try {
    const val = parseFloat(display.value);
    const rad = val * Math.PI / 180;

    let result;
    if (!isInverse) {
      switch (type) {
        case 'sin': result = Math.sin(rad); break;
        case 'cos': result = Math.cos(rad); break;
        case 'tan': result = Math.tan(rad); break;
      }
    } else {
      switch (type) {
        case 'sin': result = Math.asin(val) * 180 / Math.PI; break;
        case 'cos': result = Math.acos(val) * 180 / Math.PI; break;
        case 'tan': result = Math.atan(val) * 180 / Math.PI; break;
      }
    }
    display.value = result;
  } catch {
    display.value = 'Error';
  }
}