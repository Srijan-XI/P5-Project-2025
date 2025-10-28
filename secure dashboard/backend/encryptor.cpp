#include <iostream>
#include <string>
#include <cctype>

// Read entire stdin, apply a Caesar cipher shift of 3 to alphabetic characters
// preserving case and wrapping (A->D, X->A, a->d, x->a). Non-letter bytes are left unchanged.

int main() {
    std::string input;
    // Read whole stdin into a string efficiently
    {
        std::istreambuf_iterator<char> it(std::cin);
        std::istreambuf_iterator<char> end;
        input.assign(it, end);
    }

    for (char &c : input) {
        unsigned char uc = static_cast<unsigned char>(c);
        if (std::isupper(uc)) {
            c = static_cast<char>('A' + (uc - 'A' + 3) % 26);
        } else if (std::islower(uc)) {
            c = static_cast<char>('a' + (uc - 'a' + 3) % 26);
        } else {
            // leave digits, punctuation, whitespace unchanged
        }
    }

    std::cout << input;
    return 0;
}
