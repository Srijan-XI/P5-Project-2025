#include "../include/process_scheduler.h"
#include <iostream>

int main() {
    Scheduler s;
    s.addProcess(1, 0, 5);
    s.addProcess(2, 2, 3);
    s.addProcess(3, 4, 1);

    std::cout << "\n=== FCFS ===\n";
    s.FCFS();

    std::cout << "\n=== SJF ===\n";
    s.SJF();

    std::cout << "\n=== Round Robin (quantum = 2) ===\n";
    s.RoundRobin(2);

    return 0;
}
