// Student Management System - Enhanced with Data Persistence and Better Structure
class StudentManager {
  constructor() {
    this.students = this.loadStudentsFromStorage();
    this.form = document.getElementById('enrollmentForm');
    this.studentList = document.getElementById('studentList');
    this.initializeEventListeners();
    this.renderAllStudents();
  }

  // Initialize event listeners
  initializeEventListeners() {
    this.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
  }

  // Handle form submission
  handleFormSubmit(e) {
    e.preventDefault();

    const studentData = this.getFormData();
    
    if (!this.validateFormData(studentData)) {
      return;
    }

    // Check for duplicate student ID
    if (this.isStudentIdExists(studentData.id)) {
      alert('Student ID already exists. Please use a unique ID.');
      return;
    }

    this.addStudent(studentData);
    this.form.reset();
    alert('Student successfully enrolled!');
  }

  // Get form data
  getFormData() {
    return {
      name: document.getElementById('studentName').value.trim(),
      id: document.getElementById('studentID').value.trim(),
      course: document.getElementById('course').value.trim(),
      dob: document.getElementById('dob').value.trim(),
      enrollDate: document.getElementById('enrollDate').value.trim(),
      address: document.getElementById('address').value.trim(),
      completed: document.getElementById('completed').value,
      enrollmentTimestamp: new Date().toISOString()
    };
  }

  // Enhanced validation using ValidationUtils
  validateFormData(data) {
    // Sanitize input data
    const sanitizedData = {
      name: ValidationUtils.sanitizeInput(data.name?.trim()),
      id: ValidationUtils.sanitizeInput(data.id?.trim()),
      course: ValidationUtils.sanitizeInput(data.course?.trim()),
      dob: data.dob?.trim(),
      enrollDate: data.enrollDate?.trim(),
      address: ValidationUtils.sanitizeInput(data.address?.trim()),
      completed: data.completed
    };

    // Check if all fields are filled
    if (!sanitizedData.name || !sanitizedData.id || !sanitizedData.course || 
        !sanitizedData.dob || !sanitizedData.enrollDate || !sanitizedData.address || !sanitizedData.completed) {
      alert('Please fill out all fields.');
      return false;
    }

    // Use comprehensive validation
    const validation = ValidationUtils.validateStudentData(sanitizedData);
    
    if (!validation.isValid) {
      alert('Validation Error:\n• ' + validation.errors.join('\n• '));
      return false;
    }

    // Update the original data with sanitized values
    Object.assign(data, sanitizedData);
    return true;
  }

  // Check if student ID already exists
  isStudentIdExists(studentId) {
    return this.students.some(student => student.id === studentId);
  }

  // Add student to the system
  addStudent(studentData) {
    this.students.push(studentData);
    this.saveStudentsToStorage();
    this.renderStudent(studentData);
  }

  // Load students from localStorage
  loadStudentsFromStorage() {
    try {
      const stored = localStorage.getItem('studentEnrollments');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading students from storage:', error);
      return [];
    }
  }

  // Save students to localStorage
  saveStudentsToStorage() {
    try {
      localStorage.setItem('studentEnrollments', JSON.stringify(this.students));
    } catch (error) {
      console.error('Error saving students to storage:', error);
    }
  }

  // Render all students
  renderAllStudents() {
    this.studentList.innerHTML = '';
    this.students.forEach(student => this.renderStudent(student));
  }

  // Remove student
  removeStudent(studentId) {
    const studentIndex = this.students.findIndex(s => s.id === studentId);
    if (studentIndex !== -1) {
      const student = this.students[studentIndex];
      if (confirm(`Remove ${student.name}?`)) {
        this.students.splice(studentIndex, 1);
        this.saveStudentsToStorage();
        this.renderAllStudents();
        alert('Student removed!');
      }
    }
  }

  // Update student
  updateStudent(oldId, updatedData) {
    const studentIndex = this.students.findIndex(s => s.id === oldId);
    if (studentIndex !== -1) {
      this.students[studentIndex] = { ...updatedData, enrollmentTimestamp: this.students[studentIndex].enrollmentTimestamp };
      this.saveStudentsToStorage();
      this.renderAllStudents();
      alert('Changes saved!');
    }
  }

  // Regex & Logical Validator
  isValidFullDate(dateStr) {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = dateStr.match(regex);
    if (!match) return false;

    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);

    // Check valid month and day range
    if (month < 1 || month > 12 || day < 1 || day > 31) return false;

    // Now create a Date object using zero-based month
    const date = new Date(year, month - 1, day);

    // Validate whether the Date object matches the input (catches overflows like 31/02/2023)
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  }

  // Render a single student card
  renderStudent(student) {
    const card = document.createElement('div');
    card.className = 'student-card';
    card.dataset.studentId = student.id;

    const info = document.createElement('div');
    info.className = 'student-info';
    info.innerHTML = `
      <strong>${this.escapeHtml(student.name)}</strong>
      ID: ${this.escapeHtml(student.id)}<br>
      Course: ${this.escapeHtml(student.course)}<br>
      DOB: ${this.escapeHtml(student.dob)}<br>
      Enrolled: ${this.escapeHtml(student.enrollDate)}<br>
      Address: ${this.escapeHtml(student.address)}<br>
      Completed: ${student.completed}<br>
      <small>Enrolled on: ${new Date(student.enrollmentTimestamp).toLocaleString()}</small>
    `;

    const removeBtn = this.createButton('Remove', '#ff4d4f', () => {
      this.removeStudent(student.id);
    });

    const editBtn = this.createButton('Edit', '#f0ad4e', () => {
      this.enterEditMode(card, student);
    });

    const btnGroup = document.createElement('div');
    btnGroup.className = 'action-buttons';
    btnGroup.append(editBtn, removeBtn);

    card.append(info, btnGroup);
    this.studentList.appendChild(card);
  }

  // Button generator
  createButton(text, bgColor, onClick) {
    const button = document.createElement('button');
    button.className = 'remove-btn';
    button.style.backgroundColor = bgColor;
    button.textContent = text;
    button.onclick = onClick;
    return button;
  }

  // Escape HTML to prevent XSS attacks
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Edit Mode Functionality
  enterEditMode(card, student) {
    card.innerHTML = '';

    const nameInput = this.createInput(student.name);
    const idInput = this.createInput(student.id);
    const courseInput = this.createInput(student.course);
    const dobInput = this.createInput(student.dob, 'text');
    const enrollInput = this.createInput(student.enrollDate, 'text');
    const addrInput = this.createInput(student.address);
    const completedSelect = this.createSelectInput(student.completed);

    const saveBtn = this.createButton('Save', '#5cb85c', () => {
      const updatedData = {
        name: nameInput.value.trim(),
        id: idInput.value.trim(),
        course: courseInput.value.trim(),
        dob: dobInput.value.trim(),
        enrollDate: enrollInput.value.trim(),
        address: addrInput.value.trim(),
        completed: completedSelect.value
      };

      if (!this.validateFormData(updatedData)) {
        return;
      }

      // Check for duplicate ID if ID was changed
      if (updatedData.id !== student.id && this.isStudentIdExists(updatedData.id)) {
        alert('Student ID already exists. Please use a unique ID.');
        return;
      }

      this.updateStudent(student.id, updatedData);
    });

    const cancelBtn = this.createButton('Cancel', '#6c757d', () => {
      this.renderAllStudents();
    });

    card.append(
      nameInput,
      idInput,
      courseInput,
      dobInput,
      enrollInput,
      addrInput,
      completedSelect,
      saveBtn,
      cancelBtn
    );
  }

  // Helper Input Creator
  createInput(value, type = 'text') {
    const input = document.createElement('input');
    input.type = type;
    input.value = value;
    input.className = 'edit-input';
    return input;
  }

  // Helper Select Creator
  createSelectInput(selectedValue) {
    const select = document.createElement('select');
    select.className = 'edit-input';
    ['Yes', 'No'].forEach(opt => {
      const option = document.createElement('option');
      option.value = opt;
      option.textContent = opt;
      if (opt === selectedValue) option.selected = true;
      select.appendChild(option);
    });
    return select;
  }

  // Initialize API Bridge and add import/export controls
  initializeAPIBridge() {
    this.apiBridge = new APIBridge();
    const controlsContainer = document.getElementById('importExportButtons');
    
    const exportBtn = this.apiBridge.createExportButton(() => this.students);
    const importBtn = this.apiBridge.createImportButton((importedStudents) => {
      this.handleImportedStudents(importedStudents);
    });
    
    controlsContainer.appendChild(exportBtn);
    controlsContainer.appendChild(importBtn);
  }

  // Handle imported students from C++ backend
  handleImportedStudents(importedStudents) {
    if (importedStudents.length === 0) {
      alert('No students found in the imported file.');
      return;
    }

    const syncReport = this.apiBridge.generateSyncReport(this.students, importedStudents);
    
    let message = `Import Summary:\n`;
    message += `- Web Frontend: ${syncReport.webCount} students\n`;
    message += `- C++ Backend: ${syncReport.backendCount} students\n`;
    message += `- Common IDs: ${syncReport.commonIds.length}\n`;
    message += `- Web Only: ${syncReport.webOnlyIds.length}\n`;
    message += `- Backend Only: ${syncReport.backendOnlyIds.length}\n`;
    message += `- Conflicts: ${syncReport.conflicts.length}\n\n`;
    
    if (syncReport.conflicts.length > 0) {
      message += `Conflicts detected for IDs: ${syncReport.conflicts.map(c => c.id).join(', ')}\n`;
      message += `Backend data will overwrite web data for conflicts.\n\n`;
    }
    
    message += `Do you want to proceed with the import?`;
    
    if (confirm(message)) {
      // Merge the data - backend takes precedence for conflicts
      const mergedStudents = [...this.students];
      
      importedStudents.forEach(importedStudent => {
        const existingIndex = mergedStudents.findIndex(s => s.id === importedStudent.id);
        if (existingIndex !== -1) {
          mergedStudents[existingIndex] = importedStudent;
        } else {
          mergedStudents.push(importedStudent);
        }
      });
      
      this.students = mergedStudents;
      this.saveStudentsToStorage();
      this.renderAllStudents();
      this.updateStatistics();
      
      alert(`Import completed successfully!\nTotal students: ${this.students.length}`);
    }
  }

  // Update student statistics
  updateStatistics() {
    const totalCount = this.students.length;
    const completedCount = this.students.filter(s => s.completed === 'Yes').length;
    
    document.getElementById('studentCount').textContent = totalCount;
    document.getElementById('completedCount').textContent = completedCount;
  }

  // Enhanced renderAllStudents with statistics update
  renderAllStudents() {
    this.studentList.innerHTML = '';
    this.students.forEach(student => this.renderStudent(student));
    this.updateStatistics();
  }

  // Enhanced addStudent with statistics update
  addStudent(studentData) {
    this.students.push(studentData);
    this.saveStudentsToStorage();
    this.renderStudent(studentData);
    this.updateStatistics();
  }

  // Enhanced removeStudent with statistics update
  removeStudent(studentId) {
    const studentIndex = this.students.findIndex(s => s.id === studentId);
    if (studentIndex !== -1) {
      const student = this.students[studentIndex];
      if (confirm(`Remove ${student.name}?`)) {
        this.students.splice(studentIndex, 1);
        this.saveStudentsToStorage();
        this.renderAllStudents();
        alert('Student removed!');
      }
    }
  }

  // Enhanced updateStudent with statistics update
  updateStudent(oldId, updatedData) {
    const studentIndex = this.students.findIndex(s => s.id === oldId);
    if (studentIndex !== -1) {
      this.students[studentIndex] = { ...updatedData, enrollmentTimestamp: this.students[studentIndex].enrollmentTimestamp };
      this.saveStudentsToStorage();
      this.renderAllStudents();
      alert('Changes saved!');
    }
  }
}

// Initialize the Student Management System
const studentManager = new StudentManager();
studentManager.initializeAPIBridge();
studentManager.updateStatistics();
