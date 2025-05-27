function append(value) {
    document.getElementById("display").value += value;
  }
  
  function clearAll() {
    document.getElementById("display").value = "";
  }
  
  function deleteLast() {
    let display = document.getElementById("display");
    display.value = display.value.slice(0, -1);
  }
  
  function calculate() {
    let display = document.getElementById("display");
    try {
      display.value = eval(display.value);
    } catch {
      display.value = "Error";
    }
  }
  
  function calculateSqrt() {
    let display = document.getElementById("display");
    try {
      display.value = Math.sqrt(eval(display.value));
    } catch {
      display.value = "Error";
    }
  }
  function calculateSquare() {
    let display = document.getElementById("display");
    try {
      let value = eval(display.value);
      display.value = Math.pow(value, 2);
    } catch {
      display.value = "Error";
    }
  }
  function calculateCube() {
    let display = document.getElementById("display");
    try {
      let value = eval(display.value);
      display.value = Math.pow(value, 3);
    } catch {
      display.value = "Error";
    }
  }
  function append(value) {
    document.getElementById("display").value += value;
  }
  
  function calculate() {
    try {
      document.getElementById("display").value = eval(document.getElementById("display").value);
    } catch {
      document.getElementById("display").value = "Error";
    }
  }
  