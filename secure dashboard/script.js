// Samplefront Design System - Extracted JavaScript

// Initialize Lucide Icons (to render the icon tags)
lucide.createIcons();

// Global Utility Functions
function showMessage(text, duration = 2000) {
    const box = document.getElementById('message-box');
    document.getElementById('message-text').textContent = text;
    box.classList.remove('hidden');
    box.style.opacity = 1;
    setTimeout(() => {
        box.style.opacity = 0;
        // Wait for fade out transition before hiding
        setTimeout(() => box.classList.add('hidden'), 300);
    }, duration);
}

function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    let textToCopy;

    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        textToCopy = element.value;
    } else {
        textToCopy = element.textContent;
    }

    if (!textToCopy) {
        showMessage('Nothing to copy!', 1500);
        return;
    }

    try {
        // Use execCommand('copy') as navigator.clipboard might not work in some iframe environments
        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = textToCopy;
        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        document.execCommand('copy');
        document.body.removeChild(tempTextArea);
        showMessage('Copied to clipboard!', 1500);
    } catch (err) {
        console.error('Could not copy text: ', err);
        showMessage('Copy failed. Please copy manually.', 2500);
    }
}

// --- Dashboard Navigation Logic ---
const navLinks = document.querySelectorAll('.nav-link');
const toolContents = document.querySelectorAll('.tool-content');
const sidebar = document.getElementById('sidebar');
const openSidebarBtn = document.getElementById('open-sidebar');
const closeSidebarBtn = document.getElementById('close-sidebar');
const chartSelector = document.getElementById('chart-selector');
const chartDescription = document.getElementById('chart-description');

function activateTool(toolId) {
    // Deactivate all content sections and links
    toolContents.forEach(content => content.classList.remove('active'));
    navLinks.forEach(link => link.classList.remove('active-link', 'bg-gray-700'));

    // Activate the selected tool content
    const targetContent = document.getElementById(`${toolId}-content`);
    if (targetContent) {
        targetContent.classList.add('active');
    }

    // Highlight the active link
    const targetLink = document.querySelector(`.nav-link[data-tool="${toolId}"]`);
    if (targetLink) {
        targetLink.classList.add('active-link', 'bg-gray-700');
    }
    
    // If the Analytics tool is activated, render the chart
    if (toolId === 'analytics') {
        // Get the current selected chart type
        const selectedChart = chartSelector ? chartSelector.value : 'severity_bar';
        renderChart(selectedChart);
    }
}

// Event Listeners for tool switching
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const toolId = link.getAttribute('data-tool');
        activateTool(toolId);

        // Hide sidebar on mobile after clicking a link
        if (window.innerWidth < 640) { // Tailwind 'sm' breakpoint
            sidebar.classList.add('-translate-x-full');
        }
    });
});

// Event Listener for Chart Selector
if (chartSelector) {
    chartSelector.addEventListener('change', (e) => {
        renderChart(e.target.value);
    });
}

// Mobile sidebar toggle logic
openSidebarBtn.addEventListener('click', () => {
    sidebar.classList.remove('-translate-x-full');
});
closeSidebarBtn.addEventListener('click', () => {
    sidebar.classList.add('-translate-x-full');
});

// --- Tool-specific Logic: Password Generator ---
const passwordLengthSlider = document.getElementById('password-length');
const lengthDisplay = document.getElementById('length-display');

if (passwordLengthSlider && lengthDisplay) {
    passwordLengthSlider.addEventListener('input', (e) => {
        lengthDisplay.textContent = e.target.value;
    });
}

// --- Tool-specific Logic: File Analysis ---
const fileInput = document.getElementById('file-input');
const analyzeFileBtn = document.getElementById('analyze-file-btn');
const outputData = document.getElementById('output-data');
const fileStatus = document.getElementById('file-status');

analyzeFileBtn.addEventListener('click', () => {
    const file = fileInput.files[0];
    if (!file) {
        showMessage('Please select a file to analyze.', 2500);
        return;
    }

    fileStatus.textContent = `Processing ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)...`;

    // Simulate reading the file to calculate a hash/signature
    const reader = new FileReader();

    reader.onload = function(e) {
        // In a real app, e.target.result (ArrayBuffer) would be used to calculate SHA-256 hash.
        // Here, we just output metadata as a placeholder for the heavy analysis result.
        
        const fileSize = (file.size / (1024 * 1024)).toFixed(2);
        const resultText = `--- File Analysis Complete ---\n` + 
                           `File Name: ${file.name}\n` +
                           `File Size: ${fileSize} MB\n` +
                           `MIME Type: ${file.type || 'unknown'}\n` +
                           `Last Modified: ${new Date(file.lastModified).toLocaleString()}\n\n` +
                           `Simulated SHA-256 Hash:\n` +
                           `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`;
                           
        outputData.value = resultText;
        fileStatus.textContent = `Analysis of ${file.name} successful. Result displayed below.`;
        showMessage('File analysis complete!', 2000);
    };

    reader.onerror = function(e) {
        console.error("File read error:", e);
        fileStatus.textContent = `Error reading file: ${e.message}`;
        showMessage('Error reading file.', 3000);
    };

    // Read the file as an ArrayBuffer, necessary for cryptographic operations
    reader.readAsArrayBuffer(file);
});

// --- Tool-specific Logic: Data Analytics (D3 Charts) ---

/**
 * Renders the appropriate chart based on the type selected.
 * @param {string} chartType - The identifier for the chart to render.
 */
function renderChart(chartType) {
    if (!document.getElementById('analytics-content').classList.contains('active')) return;
    
    const container = d3.select("#chart-svg-container");
    container.selectAll("*").remove(); // Clear any existing chart

    switch (chartType) {
        case 'severity_bar':
            chartDescription.textContent = "Visualization of recent security events by severity (past 24 hours):";
            renderSeverityBarChart(container);
            break;
        case 'load_trend':
            chartDescription.textContent = "Trend of the average system load (past 6 hours, normalized to 100):";
            renderLoadLineChart(container);
            break;
        default:
            container.append("p").text("Select a chart type to view data.");
            break;
    }
}

/**
 * Renders the Security Events Bar Chart.
 * @param {d3.Selection} container - The D3 selection of the SVG container element.
 */
function renderSeverityBarChart(container) {
    const data = [
        { severity: 'CRITICAL', count: 12 },
        { severity: 'ERROR', count: 28 },
        { severity: 'WARNING', count: 45 },
        { severity: 'INFO', count: 98 },
        { severity: 'SUCCESS', count: 155 }
    ];

    const margin = { top: 20, right: 20, bottom: 50, left: 60 };
    const containerWidth = document.getElementById('chart-svg-container').clientWidth;
    const containerHeight = document.getElementById('chart-svg-container').clientHeight;
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;

    const svg = container.append("svg")
        .attr("width", containerWidth)
        .attr("height", containerHeight)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Scales
    const x = d3.scaleBand()
        .range([0, width])
        .padding(0.1)
        .domain(data.map(d => d.severity));

    const y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(data, d => d.count) + 10]);

    // Define bar colors
    const colorScale = d3.scaleOrdinal()
        .domain(['CRITICAL', 'ERROR', 'WARNING', 'INFO', 'SUCCESS'])
        .range(['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#a78bfa']); // Tailwind colors

    // Draw X axis
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("fill", "#9ca3af"); 

    // Draw Y axis
    svg.append("g")
        .call(d3.axisLeft(y).ticks(5))
        .selectAll("text")
        .attr("fill", "#9ca3af");

    // Y-axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .attr("fill", "#e5e7eb") 
        .text("Number of Events");

    // Draw bars
    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.severity))
        .attr("width", x.bandwidth())
        .attr("y", d => y(0)) 
        .attr("height", d => height - y(0)) 
        .attr("fill", d => colorScale(d.severity))
        .attr("rx", 4) 
        .transition()
        .duration(800)
        .delay((d, i) => i * 100)
        .attr("y", d => y(d.count))
        .attr("height", d => height - y(d.count));

    // Add value labels on top of the bars
    svg.selectAll(".text")
        .data(data)
        .enter().append("text")
        .attr("class", "label")
        .attr("x", d => x(d.severity) + x.bandwidth() / 2)
        .attr("y", d => y(d.count) - 5)
        .attr("text-anchor", "middle")
        .attr("fill", "#e5e7eb") 
        .attr("font-size", "12px")
        .text(d => d.count);
}

/**
 * Renders the System Load Line Chart.
 * @param {d3.Selection} container - The D3 selection of the SVG container element.
 */
function renderLoadLineChart(container) {
    const data = [
        { time: '00:00', load: 35 },
        { time: '01:00', load: 42 },
        { time: '02:00', load: 78 },
        { time: '03:00', load: 60 },
        { time: '04:00', load: 55 },
        { time: '05:00', load: 92 },
    ];
    
    const margin = { top: 20, right: 30, bottom: 50, left: 60 };
    const containerWidth = document.getElementById('chart-svg-container').clientWidth;
    const containerHeight = document.getElementById('chart-svg-container').clientHeight;
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;

    const svg = container.append("svg")
        .attr("width", containerWidth)
        .attr("height", containerHeight)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Scales
    const x = d3.scalePoint()
        .range([0, width])
        .padding(0.5)
        .domain(data.map(d => d.time));

    const y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, 100]); // Load is normalized to 100%

    // Line generator
    const line = d3.line()
        .x(d => x(d.time))
        .y(d => y(d.load))
        .curve(d3.curveMonotoneX);

    // Draw X axis
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("fill", "#9ca3af");

    // Draw Y axis
    svg.append("g")
        .call(d3.axisLeft(y).ticks(5).tickFormat(d => `${d}%`))
        .selectAll("text")
        .attr("fill", "#9ca3af");
    
    // Y-axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .attr("fill", "#e5e7eb")
        .text("System Load (%)");

    // Draw the line path
    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#a78bfa") // Indigo color
        .attr("stroke-width", 3)
        .attr("d", line)
        .style("opacity", 0) // Start invisible for animation
        .transition()
        .duration(1000)
        .style("opacity", 1);
    
    // Add circles for data points
    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", d => x(d.time))
        .attr("cy", d => y(d.load))
        .attr("r", 5) // Radius of the circle
        .attr("fill", "#a78bfa")
        .attr("stroke", "#1f2937") // Dark border for visibility
        .attr("stroke-width", 2);

    // Add text labels for data points
    svg.selectAll(".label")
        .data(data)
        .enter().append("text")
        .attr("class", "label")
        .attr("x", d => x(d.time))
        .attr("y", d => y(d.load) - 10) // Position above the circle
        .attr("text-anchor", "middle")
        .attr("fill", "#e5e7eb")
        .attr("font-size", "12px")
        .text(d => `${d.load}%`);
}

// --- Initial Setup ---
window.onload = () => {
     // Re-render icons 
     lucide.createIcons();
     
     // Initial activation is already set to 'crypto' in HTML.
     // If we want the chart to load immediately on the analytics page, 
     // we manually check and render the default chart if that tool is active.
     const analyticsContent = document.getElementById('analytics-content');
     if (analyticsContent.classList.contains('active') && chartSelector) {
         renderChart(chartSelector.value);
     }
};

// Re-render chart on window resize to maintain responsiveness
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (document.getElementById('analytics-content').classList.contains('active') && chartSelector) {
            renderChart(chartSelector.value);
        }
    }, 250);
});