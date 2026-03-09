// API Bridge for Student Enrollment Manager
// This module provides functionality to sync data between web frontend and C++ backend

class APIBridge {
  constructor() {
    this.csvFilePath = 'students.csv';
    this.jsonFilePath = 'students.json';
  }

  // Export current web data to CSV format compatible with C++ backend
  async exportToCSV(students) {
    try {
      let csvContent = "StudentID,Name,Course,DOB,EnrollDate,Address,Completed,Timestamp\n";
      
      students.forEach(student => {
        const escapeCsvField = (field) => {
          if (field.includes(',') || field.includes('"') || field.includes('\n')) {
            return '"' + field.replace(/"/g, '""') + '"';
          }
          return field;
        };

        csvContent += [
          escapeCsvField(student.id),
          escapeCsvField(student.name),
          escapeCsvField(student.course),
          escapeCsvField(student.dob),
          escapeCsvField(student.enrollDate),
          escapeCsvField(student.address),
          escapeCsvField(student.completed),
          escapeCsvField(student.enrollmentTimestamp || new Date().toISOString())
        ].join(',') + '\n';
      });

      // Create and download CSV file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'students_export.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return true;
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      return false;
    }
  }

  // Import CSV data from C++ backend
  async importFromCSV(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const csvData = e.target.result;
          const students = this.parseCSV(csvData);
          resolve(students);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  // Parse CSV data into student objects
  parseCSV(csvData) {
    const lines = csvData.split('\n');
    const students = [];
    
    // Skip header line
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line) {
        const fields = this.parseCSVLine(line);
        if (fields.length >= 7) {
          students.push({
            id: fields[0],
            name: fields[1],
            course: fields[2],
            dob: fields[3],
            enrollDate: fields[4],
            address: fields[5],
            completed: fields[6],
            enrollmentTimestamp: fields[7] || new Date().toISOString()
          });
        }
      }
    }
    
    return students;
  }

  // Parse a single CSV line handling quoted fields
  parseCSVLine(line) {
    const fields = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++; // Skip next quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        fields.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    fields.push(current);
    return fields;
  }

  // Generate data synchronization report
  generateSyncReport(webStudents, backendStudents) {
    const report = {
      webCount: webStudents.length,
      backendCount: backendStudents.length,
      commonIds: [],
      webOnlyIds: [],
      backendOnlyIds: [],
      conflicts: []
    };

    const webIds = new Set(webStudents.map(s => s.id));
    const backendIds = new Set(backendStudents.map(s => s.id));

    // Find common IDs
    webIds.forEach(id => {
      if (backendIds.has(id)) {
        report.commonIds.push(id);
        
        // Check for conflicts
        const webStudent = webStudents.find(s => s.id === id);
        const backendStudent = backendStudents.find(s => s.id === id);
        
        if (webStudent.name !== backendStudent.name ||
            webStudent.course !== backendStudent.course ||
            webStudent.dob !== backendStudent.dob) {
          report.conflicts.push({
            id: id,
            web: webStudent,
            backend: backendStudent
          });
        }
      } else {
        report.webOnlyIds.push(id);
      }
    });

    // Find backend-only IDs
    backendIds.forEach(id => {
      if (!webIds.has(id)) {
        report.backendOnlyIds.push(id);
      }
    });

    return report;
  }

  // Create file input for importing CSV
  createImportButton(onImport) {
    const button = document.createElement('button');
    button.textContent = 'Import from C++ Backend';
    button.className = 'import-btn';
    button.style.cssText = `
      background-color: #28a745;
      color: white;
      padding: 10px 15px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      margin: 10px 5px;
      font-weight: bold;
    `;

    button.onclick = () => {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.csv';
      fileInput.style.display = 'none';
      
      fileInput.onchange = async (e) => {
        const file = e.target.files[0];
        if (file) {
          try {
            const students = await this.importFromCSV(file);
            onImport(students);
          } catch (error) {
            alert('Error importing file: ' + error.message);
          }
        }
      };
      
      document.body.appendChild(fileInput);
      fileInput.click();
      document.body.removeChild(fileInput);
    };

    return button;
  }

  // Create export button
  createExportButton(getStudents) {
    const button = document.createElement('button');
    button.textContent = 'Export to C++ Backend';
    button.className = 'export-btn';
    button.style.cssText = `
      background-color: #007bff;
      color: white;
      padding: 10px 15px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      margin: 10px 5px;
      font-weight: bold;
    `;

    button.onclick = async () => {
      try {
        const students = getStudents();
        const success = await this.exportToCSV(students);
        if (success) {
          alert('Students data exported successfully! Load this file in the C++ application.');
        } else {
          alert('Failed to export data.');
        }
      } catch (error) {
        alert('Error exporting data: ' + error.message);
      }
    };

    return button;
  }
}

// Make APIBridge available globally
window.APIBridge = APIBridge;