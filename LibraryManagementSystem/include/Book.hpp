#ifndef BOOK_HPP
#define BOOK_HPP

#include <string>
using namespace std;

class Book {
private:
    string bookID;
    string title;
    string author;
    bool isIssued;

public:
    Book(string id = "", string t = "", string a = "", bool issued = false);

    void input();
    void display() const;
    string getID() const;
    bool getStatus() const;
    void issue();
    void returnBook();
    string serialize() const;
    void deserialize(const string &data);
};

#endif
