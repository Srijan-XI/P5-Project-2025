#include "../include/Library.hpp"
#include "../include/Security.hpp"
#include <iostream>
#include <string>
#include <cstring>
using namespace std;

int main(int argc, char* argv[]) {
    // Usage: library_mgmt.exe [mode] [args...]
    // Mode "auth": library_mgmt.exe auth <password>
    
    if (argc < 2) {
        // Fallback to legacy interactive mode if no args provided
        Library lib("../data/library.dat");
        int choice;

        do {
            cout << "\n===== Library Management System (Legacy Mode) =====\n";
            cout << "1. Add Book\n2. View All Books\n3. Issue Book\n4. Return Book\n5. Exit\n";
            cout << "Enter choice: ";
            cin >> choice;

            switch (choice) {
                case 1: lib.addBook(); break;
                case 2: lib.viewBooks(); break;
                case 3: lib.issueBook(); break;
                case 4: lib.returnBook(); break;
                case 5: cout << "Exiting system. Thank you.\n"; break;
                default: cout << "Invalid choice. Try again.\n";
            }
        } while (choice != 5);
        
        return 0;
    }

    std::string mode = argv[1];
    Security sec;

    if (mode == "auth") {
        if (argc < 3) {
            cout << "Error: Password required" << endl;
            return 1;
        }
        std::string password = argv[2];
        if (sec.verifyAdmin(password)) {
            sec.logAccess("Authentication", true);
            cout << "SUCCESS" << endl;
            return 0; // Exit code 0 means success
        } else {
            sec.logAccess("Authentication", false);
            cout << "FAILURE" << endl;
            return 1; // Exit code 1 means failure
        }
    }

    return 0;
}
