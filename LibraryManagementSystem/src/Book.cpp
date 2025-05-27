#include "../include/Book.hpp"
#include <iostream>

Book::Book(string id, string t, string a, bool issued)
    : bookID(id), title(t), author(a), isIssued(issued) {}

void Book::input() {
    cout << "Enter Book ID: ";
    cin >> bookID;
    cin.ignore();
    cout << "Enter Title: ";
    getline(cin, title);
    cout << "Enter Author: ";
    getline(cin, author);
    isIssued = false;
}

void Book::display() const {
    cout << "Book ID: " << bookID << "\nTitle: " << title
         << "\nAuthor: " << author << "\nStatus: "
         << (isIssued ? "Issued" : "Available") << endl;
}

string Book::getID() const { return bookID; }

bool Book::getStatus() const { return isIssued; }

void Book::issue() { isIssued = true; }

void Book::returnBook() { isIssued = false; }

string Book::serialize() const {
    return bookID + "|" + title + "|" + author + "|" + (isIssued ? "1" : "0") + "\n";
}

void Book::deserialize(const string &data) {
    size_t p1 = data.find('|');
    size_t p2 = data.find('|', p1 + 1);
    size_t p3 = data.find('|', p2 + 1);

    bookID = data.substr(0, p1);
    title = data.substr(p1 + 1, p2 - p1 - 1);
    author = data.substr(p2 + 1, p3 - p2 - 1);
    isIssued = data[p3 + 1] == '1';
}
