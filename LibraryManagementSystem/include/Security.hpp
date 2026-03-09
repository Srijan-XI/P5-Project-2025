#ifndef SECURITY_HPP
#define SECURITY_HPP

#include <string>
#include <fstream>
#include <iostream>

class Security {
private:
    const std::string ADMIN_PASSWORD_HASH = "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8"; // SHA-256 for "password" (example)

    // Simple hash function (for demonstration purposes - in production use OpenSSL)
    std::string simpleHash(const std::string& input) {
        // This is a placeholder hash logic. 
        // Ideally, we'd use a real crypto library like OpenSSL or Crypto++
        // For this demo, we'll just pretend "password" is the only correct one if passed directly,
        // or implementing a very basic rotation hash.
        
        unsigned long hash = 5381;
        for (char c : input) {
            hash = ((hash << 5) + hash) + c; /* hash * 33 + c */
        }
        return std::to_string(hash);
    }

public:
    bool verifyAdmin(const std::string& password) {
        // In a real scenario, hash the 'password' and compare with ADMIN_PASSWORD_HASH
        // For this "demo" security module:
        return password == "admin123";
    }

    void logAccess(const std::string& action, bool success) {
        std::ofstream logFile("../data/security_log.txt", std::ios::app);
        if (logFile.is_open()) {
            logFile << "Action: " << action << " | Result: " << (success ? "GRANTED" : "DENIED") << std::endl;
            logFile.close();
        }
    }
};

#endif // SECURITY_HPP
