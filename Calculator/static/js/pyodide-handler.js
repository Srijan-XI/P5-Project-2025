// Pyodide Integration for Client-side Python Execution
class PyodideHandler {
    constructor() {
        this.pyodide = null;
        this.isLoading = false;
        this.isReady = false;
    }

    async loadPyodide() {
        if (this.isReady) return true;
        if (this.isLoading) return false;

        this.isLoading = true;
        try {
            // Load Pyodide from CDN
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
            document.head.appendChild(script);

            await new Promise((resolve, reject) => {
                script.onload = resolve;
                script.onerror = reject;
            });

            // Initialize Pyodide
            this.pyodide = await loadPyodide();
            
            // Install necessary packages
            await this.pyodide.loadPackage(['numpy', 'sympy']);
            
            this.isReady = true;
            this.isLoading = false;
            console.log('Pyodide loaded successfully');
            return true;
        } catch (error) {
            console.error('Failed to load Pyodide:', error);
            this.isLoading = false;
            return false;
        }
    }

    async executePython(code) {
        if (!this.isReady) {
            const loaded = await this.loadPyodide();
            if (!loaded) {
                throw new Error('Pyodide failed to load');
            }
        }

        try {
            // Execute Python code
            const result = this.pyodide.runPython(code);
            return result;
        } catch (error) {
            throw new Error(`Python execution error: ${error.message}`);
        }
    }

    async evaluateExpression(expression) {
        const pythonCode = `
import math
import numpy as np
try:
    result = eval("${expression}")
    print(result)
except Exception as e:
    print(f"Error: {e}")
        `;
        
        return await this.executePython(pythonCode);
    }
}

// Global Pyodide handler instance
window.pyodideHandler = new PyodideHandler();