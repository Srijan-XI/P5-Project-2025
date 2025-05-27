#ifndef LIBRARY_HPP
#define LIBRARY_HPP

#include "Book.hpp"
#include <vector>
#include <string>
using namespace std;

class Library {
private:
    vector<Book> books;
    const string filename;

    void loadFromFile();
    void saveToFile();

public:
    Library(const string &filepath);
    void addBook();
    void viewBooks() const;
    void issueBook();
    void returnBook();
};

#endif
