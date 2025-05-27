#include "../include/Library.hpp"
#include <fstream>
#include <iostream>

Library::Library(const string &filepath) : filename(filepath) {
    loadFromFile();
}

void Library::loadFromFile() {
    ifstream fin(filename);
    string line;
    Book temp;
    while (getline(fin, line)) {
        temp.deserialize(line);
        books.push_back(temp);
    }
    fin.close();
}

void Library::saveToFile() {
    ofstream fout(filename);
    for (const auto &book : books) {
        fout << book.serialize();
    }
    fout.close();
}

void Library::addBook() {
    Book newBook;
    newBook.input();
    books.push_back(newBook);
    saveToFile();
    cout << "Book added successfully.\n";
}

void Library::viewBooks() const {
    for (const auto &book : books) {
        book.display();
        cout << "-----------------------------\n";
    }
}

void Library::issueBook() {
    string id;
    cout << "Enter Book ID to issue: ";
    cin >> id;
    for (auto &book : books) {
        if (book.getID() == id) {
            if (!book.getStatus()) {
                book.issue();
                saveToFile();
                cout << "Book issued successfully.\n";
            } else {
                cout << "Book is already issued.\n";
            }
            return;
        }
    }
    cout << "Book not found.\n";
}

void Library::returnBook() {
    string id;
    cout << "Enter Book ID to return: ";
    cin >> id;
    for (auto &book : books) {
        if (book.getID() == id) {
            if (book.getStatus()) {
                book.returnBook();
                saveToFile();
                cout << "Book returned successfully.\n";
            } else {
                cout << "Book was not issued.\n";
            }
            return;
        }
    }
    cout << "Book not found.\n";
}
