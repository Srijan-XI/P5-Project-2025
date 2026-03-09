#include <iostream>
#include <fstream>
#include <string>
#include <cctype>

// Single-pass, memory-friendly file statistics:
// - counts characters (bytes)
// - counts lines by '\n' occurrences (and adds one if last line doesn't end with a newline)
// - counts words using a state-machine (transitions on isspace)

int main(int argc, char* argv[]) {
    if (argc < 2) {
        std::cerr << "No file specified.\n";
        return 1;
    }

    std::ifstream file(argv[1], std::ios::binary);
    if (!file.is_open()) {
        std::cerr << "Unable to open file.\n";
        return 1;
    }

    long long lines = 0, words = 0, chars = 0;
    bool in_word = false;
    char last_char = 0;

    const std::size_t BUFSIZE = 8192;
    char buffer[BUFSIZE];

    while (file.read(buffer, static_cast<std::streamsize>(BUFSIZE)) || file.gcount() > 0) {
        std::streamsize n = file.gcount();
        for (std::streamsize i = 0; i < n; ++i) {
            unsigned char c = static_cast<unsigned char>(buffer[i]);
            ++chars;
            last_char = c;
            if (c == '\n') ++lines;

            if (std::isspace(c)) {
                if (in_word) { in_word = false; ++words; }
            } else {
                in_word = true;
            }
        }
    }

    if (in_word) ++words;

    // If the file is non-empty and doesn't end with a newline, count the last line.
    if (chars > 0) {
        if (last_char != '\n') ++lines;
    }

    file.close();

    std::cout << "Lines: " << lines << "\nWords: " << words << "\nChars: " << chars << std::endl;
    return 0;
}
