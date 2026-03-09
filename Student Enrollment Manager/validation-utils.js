// Data Validation Utilities for Student Enrollment Manager
// Shared validation functions for consistent data handling

class ValidationUtils {
  // Validate date format DD/MM/YYYY
  static isValidDate(dateStr) {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = dateStr.match(regex);
    if (!match) return false;

    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);

    // Check valid month and day range
    if (month < 1 || month > 12 || day < 1 || day > 31) return false;

    // Create Date object using zero-based month
    const date = new Date(year, month - 1, day);

    // Validate whether the Date object matches the input
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  }

  // Validate student ID format (alphanumeric, 3-20 characters)
  static isValidStudentId(id) {
    const regex = /^[a-zA-Z0-9]{3,20}$/;
    return regex.test(id);
  }

  // Validate name (letters, spaces, hyphens, apostrophes)
  static isValidName(name) {
    const regex = /^[a-zA-Z\s\-']{2,50}$/;
    return regex.test(name.trim());
  }

  // Validate course name
  static isValidCourse(course) {
    const regex = /^[a-zA-Z0-9\s\-&()]{2,100}$/;
    return regex.test(course.trim());
  }

  // Validate address
  static isValidAddress(address) {
    return address.trim().length >= 5 && address.trim().length <= 200;
  }

  // Validate completion status
  static isValidCompleted(completed) {
    return completed === 'Yes' || completed === 'No';
  }

  // Comprehensive student data validation
  static validateStudentData(student) {
    const errors = [];

    if (!student.id || !this.isValidStudentId(student.id)) {
      errors.push('Student ID must be 3-20 alphanumeric characters');
    }

    if (!student.name || !this.isValidName(student.name)) {
      errors.push('Name must be 2-50 characters, letters only');
    }

    if (!student.course || !this.isValidCourse(student.course)) {
      errors.push('Course name must be 2-100 characters');
    }

    if (!student.dob || !this.isValidDate(student.dob)) {
      errors.push('Date of Birth must be in DD/MM/YYYY format');
    }

    if (!student.enrollDate || !this.isValidDate(student.enrollDate)) {
      errors.push('Enrollment Date must be in DD/MM/YYYY format');
    }

    if (!student.address || !this.isValidAddress(student.address)) {
      errors.push('Address must be 5-200 characters');
    }

    if (!student.completed || !this.isValidCompleted(student.completed)) {
      errors.push('Completion status must be Yes or No');
    }

    // Check if enrollment date is not before birth date
    if (this.isValidDate(student.dob) && this.isValidDate(student.enrollDate)) {
      const birthDate = this.parseDate(student.dob);
      const enrollmentDate = this.parseDate(student.enrollDate);
      
      if (enrollmentDate < birthDate) {
        errors.push('Enrollment date cannot be before birth date');
      }

      // Check if birth date is not in the future
      if (birthDate > new Date()) {
        errors.push('Birth date cannot be in the future');
      }

      // Check if student is at least 16 years old at enrollment
      const minAge = new Date(birthDate);
      minAge.setFullYear(minAge.getFullYear() + 16);
      
      if (enrollmentDate < minAge) {
        errors.push('Student must be at least 16 years old at enrollment');
      }
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  // Parse DD/MM/YYYY date string to Date object
  static parseDate(dateStr) {
    const [day, month, year] = dateStr.split('/').map(num => parseInt(num, 10));
    return new Date(year, month - 1, day);
  }

  // Format Date object to DD/MM/YYYY string
  static formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // Sanitize input to prevent XSS
  static sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  // Generate validation summary
  static getValidationSummary(students) {
    const summary = {
      total: students.length,
      valid: 0,
      invalid: 0,
      issues: []
    };

    students.forEach((student, index) => {
      const validation = this.validateStudentData(student);
      if (validation.isValid) {
        summary.valid++;
      } else {
        summary.invalid++;
        summary.issues.push({
          index: index,
          id: student.id,
          name: student.name,
          errors: validation.errors
        });
      }
    });

    return summary;
  }

  // Data consistency checks
  static checkDataConsistency(students) {
    const issues = [];
    const idMap = new Map();
    
    students.forEach((student, index) => {
      // Check for duplicate IDs
      if (idMap.has(student.id)) {
        issues.push({
          type: 'duplicate_id',
          message: `Duplicate Student ID: ${student.id}`,
          indices: [idMap.get(student.id), index]
        });
      } else {
        idMap.set(student.id, index);
      }

      // Check for suspicious data patterns
      if (student.name && student.name.length < 2) {
        issues.push({
          type: 'short_name',
          message: `Unusually short name: ${student.name}`,
          index: index
        });
      }

      if (student.course && student.course.toLowerCase() === student.name.toLowerCase()) {
        issues.push({
          type: 'name_course_match',
          message: `Name and course are identical: ${student.name}`,
          index: index
        });
      }
    });

    return issues;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ValidationUtils;
} else {
  window.ValidationUtils = ValidationUtils;
}