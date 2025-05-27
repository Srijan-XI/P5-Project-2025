#ifndef PROCESS_SCHEDULER_H
#define PROCESS_SCHEDULER_H

#include <vector>

struct Process {
    int pid;
    int arrival_time;
    int burst_time;
    int remaining_time;
    int completion_time;
};

class Scheduler {
public:
    void addProcess(int pid, int arrival_time, int burst_time);
    void FCFS();
    void SJF();
    void RoundRobin(int quantum);
    void displayProcesses();

private:
    std::vector<Process> processes;
    void resetProcesses();
};

#endif // PROCESS_SCHEDULER_H
