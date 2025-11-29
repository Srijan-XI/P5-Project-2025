#ifndef PROCESS_SCHEDULER_H
#define PROCESS_SCHEDULER_H

#include <vector>

struct Process {
    int pid;
    int arrival_time;
    int burst_time;
    int priority; // Lower value = Higher priority
    int remaining_time;
    int completion_time;
    int turnaround_time;
    int waiting_time;
};

class Scheduler {
public:
    void addProcess(int pid, int arrival_time, int burst_time, int priority = 0);
    void FCFS();
    void SJF();
    void Priority();
    void PriorityPreemptive();
    void MultilevelQueue(int quantum_high, int quantum_low);
    void RoundRobin(int quantum);
    void displayProcesses();

private:
    std::vector<Process> processes;
    void resetProcesses();
};

#endif // PROCESS_SCHEDULER_H
