#include "../include/process_scheduler.h"
#include <iostream>
#include <vector>

void runDemo(Scheduler& s) {
    s.addProcess(1, 0, 5, 2);
    s.addProcess(2, 2, 3, 1);
    s.addProcess(3, 4, 1, 3);

    std::cout << "\n=== FCFS ===\n";
    s.FCFS();

    std::cout << "\n=== SJF ===\n";
    s.SJF();

    std::cout << "\n=== Priority (Non-Preemptive) ===\n";
    s.Priority();

    std::cout << "\n=== Priority (Preemptive) ===\n";
    s.PriorityPreemptive();

    std::cout << "\n=== Multilevel Queue (High: RR(2), Low: RR(4)) ===\n";
    s.MultilevelQueue(2, 4);

    std::cout << "\n=== Round Robin (quantum = 2) ===\n";
    s.RoundRobin(2);
}

void runInteractive(Scheduler& s) {
    int n;
    std::cout << "Enter number of processes: ";
    std::cin >> n;

    for (int i = 0; i < n; ++i) {
        int pid, arrival, burst, priority;
        std::cout << "Process " << i + 1 << " (PID Arrival Burst Priority): ";
        std::cin >> pid >> arrival >> burst >> priority;
        s.addProcess(pid, arrival, burst, priority);
    }

    int choice;
    std::cout << "\nSelect Algorithm:\n";
    std::cout << "1. FCFS\n";
    std::cout << "2. SJF\n";
    std::cout << "3. Priority (Non-Preemptive)\n";
    std::cout << "4. Priority (Preemptive)\n";
    std::cout << "5. Multilevel Queue\n";
    std::cout << "6. Round Robin\n";
    std::cout << "7. Run All\n";
    std::cout << "Choice: ";
    std::cin >> choice;

    if (choice == 1 || choice == 7) {
        std::cout << "\n=== FCFS ===\n";
        s.FCFS();
    }
    if (choice == 2 || choice == 7) {
        std::cout << "\n=== SJF ===\n";
        s.SJF();
    }
    if (choice == 3 || choice == 7) {
        std::cout << "\n=== Priority (Non-Preemptive) ===\n";
        s.Priority();
    }
    if (choice == 4 || choice == 7) {
        std::cout << "\n=== Priority (Preemptive) ===\n";
        s.PriorityPreemptive();
    }
    if (choice == 5 || choice == 7) {
        int q1, q2;
        std::cout << "Enter Time Quantum for High Priority Queue: ";
        std::cin >> q1;
        std::cout << "Enter Time Quantum for Low Priority Queue: ";
        std::cin >> q2;
        std::cout << "\n=== Multilevel Queue (High: RR(" << q1 << "), Low: RR(" << q2 << ")) ===\n";
        s.MultilevelQueue(q1, q2);
    }
    if (choice == 6 || choice == 7) {
        int quantum;
        std::cout << "Enter Time Quantum for Round Robin: ";
        std::cin >> quantum;
        std::cout << "\n=== Round Robin (quantum = " << quantum << ") ===\n";
        s.RoundRobin(quantum);
    }
}

int main() {
    Scheduler s;
    int mode;
    
    std::cout << "Mini OS Simulator - Process Scheduler\n";
    std::cout << "1. Demo Mode\n";
    std::cout << "2. Interactive Mode\n";
    std::cout << "Select Mode: ";
    std::cin >> mode;

    if (mode == 2) {
        runInteractive(s);
    } else {
        runDemo(s);
    }

    return 0;
}
