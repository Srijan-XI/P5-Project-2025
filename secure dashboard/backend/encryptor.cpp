#include <iostream>
#include <string>
using namespace std;

int main() {
    string input;
    getline(cin, input);

    string encrypted = input;
    for (char &c : encrypted) {
        c = c + 3; // Caesar cipher (shift by 3)
    }

    cout << encrypted << endl;
    return 0;
}
