#include "../include/Library.hpp"
#include <iostream>
using namespace std;

int main() {
    Library lib("../data/library.dat");
    int choice;

    do {
        cout << "\n===== Library Management System =====\n";
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
