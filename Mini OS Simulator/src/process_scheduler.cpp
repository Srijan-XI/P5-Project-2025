#include "../include/process_scheduler.h"
#include <iostream>
#include <algorithm>
#include <queue>
#include <climits>

void Scheduler::addProcess(int pid, int arrival, int burst) {
    processes.push_back({pid, arrival, burst, burst, 0});
}

void Scheduler::resetProcesses() {
    for (auto &p : processes)
        p.remaining_time = p.burst_time;
}

void Scheduler::FCFS() {
    resetProcesses();
    std::sort(processes.begin(), processes.end(), [](Process a, Process b) {
        return a.arrival_time < b.arrival_time;
    });

    int time = 0;
    for (auto &p : processes) {
        if (time < p.arrival_time) time = p.arrival_time;
        time += p.burst_time;
        p.completion_time = time;
    }

    std::cout << "FCFS Scheduling Complete\n";
    displayProcesses();
}

void Scheduler::SJF() {
    resetProcesses();
    int time = 0, completed = 0;
    std::vector<bool> done(processes.size(), false);

    while (completed < processes.size()) {
        int idx = -1, min_bt = INT_MAX;
        for (int i = 0; i < processes.size(); ++i) {
            if (!done[i] && processes[i].arrival_time <= time && processes[i].burst_time < min_bt) {
                min_bt = processes[i].burst_time;
                idx = i;
            }
        }

        if (idx != -1) {
            time += processes[idx].burst_time;
            processes[idx].completion_time = time;
            done[idx] = true;
            completed++;
        } else {
            time++;
        }
    }

    std::cout << "SJF Scheduling Complete\n";
    displayProcesses();
}

void Scheduler::RoundRobin(int quantum) {
    resetProcesses();
    std::queue<int> q;
    int time = 0;
    std::vector<bool> in_queue(processes.size(), false);
    int completed = 0;

    while (completed < processes.size()) {
        for (int i = 0; i < processes.size(); ++i) {
            if (!in_queue[i] && processes[i].arrival_time <= time && processes[i].remaining_time > 0) {
                q.push(i);
                in_queue[i] = true;
            }
        }

        if (q.empty()) {
            time++;
            continue;
        }

        int i = q.front(); q.pop();
        int exec_time = std::min(quantum, processes[i].remaining_time);
        processes[i].remaining_time -= exec_time;
        time += exec_time;

        for (int j = 0; j < processes.size(); ++j) {
            if (!in_queue[j] && processes[j].arrival_time <= time && processes[j].remaining_time > 0) {
                q.push(j);
                in_queue[j] = true;
            }
        }

        if (processes[i].remaining_time > 0) {
            q.push(i);
        } else {
            processes[i].completion_time = time;
            completed++;
        }
    }

    std::cout << "Round Robin Scheduling Complete\n";
    displayProcesses();
}

void Scheduler::displayProcesses() {
    std::cout << "\nPID\tArrival\tBurst\tCompletion\n";
    for (auto &p : processes)
        std::cout << p.pid << "\t" << p.arrival_time << "\t" << p.burst_time << "\t" << p.completion_time << "\n";
}
