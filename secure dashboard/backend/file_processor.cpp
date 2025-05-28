#include <iostream>
#include <fstream>
#include <string>
using namespace std;

int main(int argc, char* argv[]) {
    if (argc < 2) {
        cout << "No file specified.\n";
        return 1;
    }

    ifstream file(argv[1]);
    if (!file.is_open()) {
        cout << "Unable to open file.\n";
        return 1;
    }

    string line;
    int lines = 0, words = 0, chars = 0;

    while (getline(file, line)) {
        lines++;
        chars += line.length();
        for (size_t i = 0; i < line.length(); i++) {
            if (isspace(line[i])) words++;
        }
        words++; // count last word per line
    }

    file.close();

    cout << "Lines: " << lines << "\nWords: " << words << "\nChars: " << chars << endl;
    return 0;
}
