#include "../include/process_scheduler.h"
#include <iostream>
#include <algorithm>
#include <queue>
#include <climits>
#include <iomanip>

void Scheduler::addProcess(int pid, int arrival, int burst, int priority) {
    processes.push_back({pid, arrival, burst, priority, burst, 0, 0, 0});
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

void Scheduler::Priority() {
    resetProcesses();
    int time = 0, completed = 0;
    std::vector<bool> done(processes.size(), false);

    while (completed < processes.size()) {
        int idx = -1, min_pri = INT_MAX;
        for (int i = 0; i < processes.size(); ++i) {
            if (!done[i] && processes[i].arrival_time <= time && processes[i].priority < min_pri) {
                min_pri = processes[i].priority;
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

    std::cout << "Priority Scheduling (Non-Preemptive) Complete\n";
    displayProcesses();
}

void Scheduler::PriorityPreemptive() {
    resetProcesses();
    int time = 0, completed = 0;
    int n = processes.size();
    
    while (completed < n) {
        int idx = -1;
        int min_pri = INT_MAX;

        // Find process with highest priority (lowest value) that has arrived
        for (int i = 0; i < n; ++i) {
            if (processes[i].arrival_time <= time && processes[i].remaining_time > 0) {
                if (processes[i].priority < min_pri) {
                    min_pri = processes[i].priority;
                    idx = i;
                }
                // Tie-breaking: FCFS (implicitly handled by loop order if we don't update on equal)
            }
        }

        if (idx != -1) {
            processes[idx].remaining_time--;
            time++;
            
            if (processes[idx].remaining_time == 0) {
                processes[idx].completion_time = time;
                completed++;
            }
        } else {
            time++;
        }
    }

    std::cout << "Priority Scheduling (Preemptive) Complete\n";
    displayProcesses();
}

void Scheduler::MultilevelQueue(int quantum_high, int quantum_low) {
    resetProcesses();
    std::queue<int> q_high; // High priority queue (Round Robin)
    std::queue<int> q_low;  // Low priority queue (FCFS or Round Robin with different quantum)
    
    int time = 0;
    int completed = 0;
    int n = processes.size();
    std::vector<bool> in_queue(n, false);

    // Split processes based on priority (e.g., priority <= 2 goes to high, else low)
    // For this simulation, let's assume priority <= 2 is High Priority (System processes)
    // and priority > 2 is Low Priority (User processes)
    
    while (completed < n) {
        // Check for new arrivals
        for (int i = 0; i < n; ++i) {
            if (!in_queue[i] && processes[i].arrival_time <= time) {
                if (processes[i].priority <= 2) {
                    q_high.push(i);
                } else {
                    q_low.push(i);
                }
                in_queue[i] = true;
            }
        }

        if (!q_high.empty()) {
            // Execute High Priority Queue (Round Robin)
            int i = q_high.front(); q_high.pop();
            int exec_time = std::min(quantum_high, processes[i].remaining_time);
            processes[i].remaining_time -= exec_time;
            time += exec_time;
            
            // Check for new arrivals during execution
            for (int j = 0; j < n; ++j) {
                if (!in_queue[j] && processes[j].arrival_time <= time) {
                    if (processes[j].priority <= 2) {
                        q_high.push(j);
                    } else {
                        q_low.push(j);
                    }
                    in_queue[j] = true;
                }
            }

            if (processes[i].remaining_time > 0) {
                q_high.push(i);
            } else {
                processes[i].completion_time = time;
                completed++;
            }
        } else if (!q_low.empty()) {
            // Execute Low Priority Queue (Round Robin with different quantum)
            int i = q_low.front(); q_low.pop();
            int exec_time = std::min(quantum_low, processes[i].remaining_time);
            processes[i].remaining_time -= exec_time;
            time += exec_time;

            // Check for new arrivals
            for (int j = 0; j < n; ++j) {
                if (!in_queue[j] && processes[j].arrival_time <= time) {
                    if (processes[j].priority <= 2) {
                        q_high.push(j);
                    } else {
                        q_low.push(j);
                    }
                    in_queue[j] = true;
                }
            }

            if (processes[i].remaining_time > 0) {
                q_low.push(i);
            } else {
                processes[i].completion_time = time;
                completed++;
            }
        } else {
            time++;
        }
    }

    std::cout << "Multilevel Queue Scheduling Complete\n";
    std::cout << "High Priority (<=2): RR (q=" << quantum_high << ")\n";
    std::cout << "Low Priority (>2): RR (q=" << quantum_low << ")\n";
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
    double total_tat = 0, total_wt = 0;
    int n = processes.size();

    std::cout << "\n" 
              << std::left << std::setw(10) << "PID"
              << std::setw(10) << "Arrival"
              << std::setw(10) << "Burst"
              << std::setw(10) << "Priority"
              << std::setw(15) << "Completion"
              << std::setw(15) << "Turnaround"
              << std::setw(10) << "Waiting" << "\n";
              
    std::cout << std::string(80, '-') << "\n";

    for (auto &p : processes) {
        p.turnaround_time = p.completion_time - p.arrival_time;
        p.waiting_time = p.turnaround_time - p.burst_time;
        
        total_tat += p.turnaround_time;
        total_wt += p.waiting_time;

        std::cout << std::left << std::setw(10) << p.pid
                  << std::setw(10) << p.arrival_time
                  << std::setw(10) << p.burst_time
                  << std::setw(10) << p.priority
                  << std::setw(15) << p.completion_time
                  << std::setw(15) << p.turnaround_time
                  << std::setw(10) << p.waiting_time << "\n";
    }
    
    if (n > 0) {
        std::cout << "\nAverage Turnaround Time: " << total_tat / n << "\n";
        std::cout << "Average Waiting Time: " << total_wt / n << "\n";
    }
}
