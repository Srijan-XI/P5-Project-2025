#include <iostream>
#include <fstream>
#include <sstream>
#include <vector>
#include <string>
using namespace std;

struct Student {
    int rollNo;
    string name;
    string course;
    int year;
};

// Helper: Read all students from file
vector<Student> readStudentsFromFile(const string& filename) {
    vector<Student> students;
    ifstream file(filename);
    Student s;
    while (file >> s.rollNo >> s.name >> s.course >> s.year) {
        students.push_back(s);
    }
    return students;
}

// Helper: Write all students to file
void writeStudentsToFile(const vector<Student>& students, const string& filename) {
    ofstream file(filename);
    for (const auto& s : students) {
        file << s.rollNo << " " << s.name << " " << s.course << " " << s.year << "\n";
    }
}

// Add new student
void addStudent(const string& filename) {
    Student s;
    cout << "Enter Roll Number: "; cin >> s.rollNo;
    cout << "Enter Name (no space): "; cin >> s.name;
    cout << "Enter Course: "; cin >> s.course;
    cout << "Enter Year: "; cin >> s.year;

    ofstream file(filename, ios::app);
    file << s.rollNo << " " << s.name << " " << s.course << " " << s.year << "\n";
    cout << "Student added successfully.\n";
}

// Display all students
void displayAll(const string& filename) {
    vector<Student> students = readStudentsFromFile(filename);
    if (students.empty()) {
        cout << "No student records found.\n";
        return;
    }
    for (const auto& s : students) {
        cout << "\nRoll No: " << s.rollNo
             << "\nName: " << s.name
             << "\nCourse: " << s.course
             << "\nYear: " << s.year << "\n";
    }
}

// Search by Roll Number
void searchStudent(const string& filename, int rollNo) {
    vector<Student> students = readStudentsFromFile(filename);
    bool found = false;
    for (const auto& s : students) {
        if (s.rollNo == rollNo) {
            cout << "\nRoll No: " << s.rollNo
                 << "\nName: " << s.name
                 << "\nCourse: " << s.course
                 << "\nYear: " << s.year << "\n";
            found = true;
            break;
        }
    }
    if (!found) cout << "Student not found.\n";
}

// Delete student by Roll Number
void deleteStudent(const string& filename, int rollNo) {
    vector<Student> students = readStudentsFromFile(filename);
    bool deleted = false;
    vector<Student> updated;

    for (const auto& s : students) {
        if (s.rollNo == rollNo) {
            deleted = true;
        } else {
            updated.push_back(s);
        }
    }

    writeStudentsToFile(updated, filename);
    if (deleted)
        cout << "Student deleted successfully.\n";
    else
        cout << "Roll Number not found.\n";
}

// Edit student by Roll Number
void editStudent(const string& filename, int rollNo) {
    vector<Student> students = readStudentsFromFile(filename);
    bool updated = false;

    for (auto& s : students) {
        if (s.rollNo == rollNo) {
            cout << "Editing student: " << s.name << "\n";
            cout << "Enter new Name (no space): "; cin >> s.name;
            cout << "Enter new Course: "; cin >> s.course;
            cout << "Enter new Year: "; cin >> s.year;
            updated = true;
            break;
        }
    }

    writeStudentsToFile(students, filename);
    if (updated)
        cout << "Student record updated successfully.\n";
    else
        cout << "Roll Number not found.\n";
}

int main() {
    const string filename = "students.txt";
    int choice, rollNo;

    do {
        cout << "\n--- Student Information Management System ---\n";
        cout << "1. Add Student\n2. Display All Students\n3. Search Student\n";
        cout << "4. Delete Student\n5. Edit Student\n6. Exit\n";
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
            cout << "Enter Roll No to search: ";
            cin >> rollNo;
            searchStudent(filename, rollNo);
            break;
        case 4:
            cout << "Enter Roll No to delete: ";
            cin >> rollNo;
            deleteStudent(filename, rollNo);
            break;
        case 5:
            cout << "Enter Roll No to edit: ";
            cin >> rollNo;
            editStudent(filename, rollNo);
            break;
        case 6:
            cout << "Exiting system. Goodbye!\n";
            break;
        default:
            cout << "Invalid choice. Try again.\n";
        }

    } while (choice != 6);

    return 0;
}
