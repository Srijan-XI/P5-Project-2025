#include <iostream>
#include <fstream>
#include <sstream>
#include <vector>
#include <string>
#include <iomanip>
#include <ctime>
using namespace std;

struct Student {
    string studentId;
    string name;
    string course;
    string dob;           // Date of Birth in DD/MM/YYYY format
    string enrollDate;    // Enrollment Date in DD/MM/YYYY format
    string address;
    string completed;     // "Yes" or "No"
    string enrollmentTimestamp;
    
    // Constructor for easy initialization
    Student() : completed("No") {
        enrollmentTimestamp = getCurrentTimestamp();
    }
    
    Student(string id, string n, string c, string d, string ed, string addr, string comp) 
        : studentId(id), name(n), course(c), dob(d), enrollDate(ed), address(addr), completed(comp) {
        enrollmentTimestamp = getCurrentTimestamp();
    }
    
    string getCurrentTimestamp() {
        time_t now = time(0);
        char buffer[80];
        struct tm* timeinfo = localtime(&now);
        strftime(buffer, sizeof(buffer), "%Y-%m-%d %H:%M:%S", timeinfo);
        return string(buffer);
    }
};

// Helper: Read all students from file (CSV format)
vector<Student> readStudentsFromFile(const string& filename) {
    vector<Student> students;
    ifstream file(filename);
    string line;
    
    // Skip header line if it exists
    if (getline(file, line) && line.find("StudentID") == string::npos) {
        file.seekg(0, ios::beg);
    }
    
    while (getline(file, line)) {
        if (line.empty()) continue;
        
        Student s;
        stringstream ss(line);
        string item;
        
        // Parse CSV format: ID,Name,Course,DOB,EnrollDate,Address,Completed,Timestamp
        if (getline(ss, s.studentId, ',') &&
            getline(ss, s.name, ',') &&
            getline(ss, s.course, ',') &&
            getline(ss, s.dob, ',') &&
            getline(ss, s.enrollDate, ',') &&
            getline(ss, s.address, ',') &&
            getline(ss, s.completed, ',') &&
            getline(ss, s.enrollmentTimestamp, ',')) {
            students.push_back(s);
        }
    }
    return students;
}

// Helper: Write all students to file (CSV format)
void writeStudentsToFile(const vector<Student>& students, const string& filename) {
    ofstream file(filename);
    
    // Write header
    file << "StudentID,Name,Course,DOB,EnrollDate,Address,Completed,Timestamp\n";
    
    for (const auto& s : students) {
        file << s.studentId << "," << s.name << "," << s.course << "," 
             << s.dob << "," << s.enrollDate << "," << s.address << "," 
             << s.completed << "," << s.enrollmentTimestamp << "\n";
    }
}

// Helper: Export students to JSON format for web integration
void exportStudentsToJSON(const vector<Student>& students, const string& filename) {
    ofstream file(filename);
    file << "[\n";
    
    for (size_t i = 0; i < students.size(); ++i) {
        const auto& s = students[i];
        file << "  {\n"
             << "    \"id\": \"" << s.studentId << "\",\n"
             << "    \"name\": \"" << s.name << "\",\n"
             << "    \"course\": \"" << s.course << "\",\n"
             << "    \"dob\": \"" << s.dob << "\",\n"
             << "    \"enrollDate\": \"" << s.enrollDate << "\",\n"
             << "    \"address\": \"" << s.address << "\",\n"
             << "    \"completed\": \"" << s.completed << "\",\n"
             << "    \"enrollmentTimestamp\": \"" << s.enrollmentTimestamp << "\"\n"
             << "  }";
        
        if (i < students.size() - 1) file << ",";
        file << "\n";
    }
    
    file << "]\n";
    cout << "Students exported to JSON file: " << filename << "\n";
}

// Add new student
void addStudent(const string& filename) {
    Student s;
    cout << "Enter Student ID: "; 
    cin.ignore(); // Clear input buffer
    getline(cin, s.studentId);
    
    cout << "Enter Name: "; 
    getline(cin, s.name);
    
    cout << "Enter Course: "; 
    getline(cin, s.course);
    
    cout << "Enter Date of Birth (DD/MM/YYYY): "; 
    getline(cin, s.dob);
    
    cout << "Enter Enrollment Date (DD/MM/YYYY): "; 
    getline(cin, s.enrollDate);
    
    cout << "Enter Address: "; 
    getline(cin, s.address);
    
    cout << "Course Completed? (Yes/No): "; 
    getline(cin, s.completed);
    
    // Set timestamp
    s.enrollmentTimestamp = s.getCurrentTimestamp();
    
    // Check for duplicate ID
    vector<Student> existing = readStudentsFromFile(filename);
    for (const auto& existing_student : existing) {
        if (existing_student.studentId == s.studentId) {
            cout << "Error: Student ID already exists!\n";
            return;
        }
    }
    
    existing.push_back(s);
    writeStudentsToFile(existing, filename);
    cout << "Student added successfully.\n";
}

// Display all students
void displayAll(const string& filename) {
    vector<Student> students = readStudentsFromFile(filename);
    if (students.empty()) {
        cout << "No student records found.\n";
        return;
    }
    
    cout << "\n" << setw(80) << setfill('=') << "" << setfill(' ') << "\n";
    cout << "                    STUDENT ENROLLMENT RECORDS\n";
    cout << setw(80) << setfill('=') << "" << setfill(' ') << "\n\n";
    
    for (const auto& s : students) {
        cout << "Student ID: " << s.studentId
             << "\nName: " << s.name
             << "\nCourse: " << s.course
             << "\nDate of Birth: " << s.dob
             << "\nEnrollment Date: " << s.enrollDate
             << "\nAddress: " << s.address
             << "\nCompleted: " << s.completed
             << "\nEnrolled on: " << s.enrollmentTimestamp
             << "\n" << setw(50) << setfill('-') << "" << setfill(' ') << "\n\n";
    }
}

// Search by Student ID
void searchStudent(const string& filename, const string& studentId) {
    vector<Student> students = readStudentsFromFile(filename);
    bool found = false;
    for (const auto& s : students) {
        if (s.studentId == studentId) {
            cout << "\nStudent ID: " << s.studentId
                 << "\nName: " << s.name
                 << "\nCourse: " << s.course
                 << "\nDate of Birth: " << s.dob
                 << "\nEnrollment Date: " << s.enrollDate
                 << "\nAddress: " << s.address
                 << "\nCompleted: " << s.completed
                 << "\nEnrolled on: " << s.enrollmentTimestamp << "\n";
            found = true;
            break;
        }
    }
    if (!found) cout << "Student not found.\n";
}

// Delete student by Student ID
void deleteStudent(const string& filename, const string& studentId) {
    vector<Student> students = readStudentsFromFile(filename);
    bool deleted = false;
    vector<Student> updated;

    for (const auto& s : students) {
        if (s.studentId == studentId) {
            deleted = true;
            cout << "Deleting student: " << s.name << "\n";
        } else {
            updated.push_back(s);
        }
    }

    writeStudentsToFile(updated, filename);
    if (deleted)
        cout << "Student deleted successfully.\n";
    else
        cout << "Student ID not found.\n";
}

// Edit student by Student ID
void editStudent(const string& filename, const string& studentId) {
    vector<Student> students = readStudentsFromFile(filename);
    bool updated = false;

    for (auto& s : students) {
        if (s.studentId == studentId) {
            cout << "Editing student: " << s.name << "\n";
            cout << "Enter new Name: "; 
            cin.ignore();
            getline(cin, s.name);
            
            cout << "Enter new Course: "; 
            getline(cin, s.course);
            
            cout << "Enter new Date of Birth (DD/MM/YYYY): "; 
            getline(cin, s.dob);
            
            cout << "Enter new Enrollment Date (DD/MM/YYYY): "; 
            getline(cin, s.enrollDate);
            
            cout << "Enter new Address: "; 
            getline(cin, s.address);
            
            cout << "Course Completed? (Yes/No): "; 
            getline(cin, s.completed);
            
            updated = true;
            break;
        }
    }

    writeStudentsToFile(students, filename);
    if (updated)
        cout << "Student record updated successfully.\n";
    else
        cout << "Student ID not found.\n";
}

int main() {
    const string filename = "students.csv";
    const string jsonFilename = "students.json";
    int choice;
    string studentId;

    cout << "\n" << setw(60) << setfill('=') << "" << setfill(' ') << "\n";
    cout << "       STUDENT ENROLLMENT MANAGEMENT SYSTEM\n";
    cout << "           Enhanced C++ Backend v2.0\n";
    cout << setw(60) << setfill('=') << "" << setfill(' ') << "\n";

    do {
        cout << "\n--- Student Information Management System ---\n";
        cout << "1. Add Student\n";
        cout << "2. Display All Students\n";
        cout << "3. Search Student\n";
        cout << "4. Delete Student\n";
        cout << "5. Edit Student\n";
        cout << "6. Export to JSON (for Web Integration)\n";
        cout << "7. Exit\n";
        cout << "Enter your choice: ";
        cin >> choice;

        switch (choice) {
        case 1:
            addStudent(filename);
            break;
        case 2:
            displayAll(filename);
            break;
        case 3:
            cout << "Enter Student ID to search: ";
            cin.ignore();
            getline(cin, studentId);
            searchStudent(filename, studentId);
            break;
        case 4:
            cout << "Enter Student ID to delete: ";
            cin.ignore();
            getline(cin, studentId);
            deleteStudent(filename, studentId);
            break;
        case 5:
            cout << "Enter Student ID to edit: ";
            cin.ignore();
            getline(cin, studentId);
            editStudent(filename, studentId);
            break;
        case 6: {
            vector<Student> students = readStudentsFromFile(filename);
            exportStudentsToJSON(students, jsonFilename);
            break;
        }
        case 7:
            cout << "Exiting system. Thank you for using Student Enrollment Manager!\n";
            break;
        default:
            cout << "Invalid choice. Please try again.\n";
        }

    } while (choice != 7);

    return 0;
}
