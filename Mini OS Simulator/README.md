# Mini OS Simulator

A C++ based simulation of an Operating System's Process Scheduler. This project demonstrates various CPU scheduling algorithms and calculates performance metrics like Turnaround Time and Waiting Time.

## Features

### Scheduling Algorithms
The simulator supports the following algorithms:
1.  **First-Come, First-Served (FCFS)**: Processes are executed in the order they arrive.
2.  **Shortest Job First (SJF)**: Non-preemptive algorithm that selects the process with the smallest burst time.
3.  **Priority Scheduling (Non-Preemptive)**: Selects the process with the highest priority (lowest numerical value).
4.  **Priority Scheduling (Preemptive)**: Similar to non-preemptive, but a running process can be interrupted if a higher priority process arrives.
5.  **Multilevel Queue Scheduling**:
    -   **High Priority Queue**: Uses Round Robin (configurable quantum).
    -   **Low Priority Queue**: Uses Round Robin (configurable quantum).
    -   Processes with priority <= 2 are assigned to the High Priority Queue.
6.  **Round Robin (RR)**: Preemptive algorithm where each process gets a fixed time quantum.

### Metrics
For each simulation, the following metrics are calculated and displayed in a formatted table:
-   **Completion Time**
-   **Turnaround Time** (Completion Time - Arrival Time)
-   **Waiting Time** (Turnaround Time - Burst Time)
-   **Average Turnaround Time**
-   **Average Waiting Time**

### Modes
-   **Demo Mode**: Runs a predefined set of processes across all algorithms to showcase functionality.
-   **Interactive Mode**: Allows users to input the number of processes, their details (PID, Arrival Time, Burst Time, Priority), and select specific algorithms to run.

## Project Structure

```
Mini OS Simulator/
├── build/              # Compiled executables
├── docs/               # Documentation
├── include/            # Header files
│   └── process_scheduler.h
├── src/                # Source code
│   ├── main.cpp
│   └── process_scheduler.cpp
├── test/               # Test files
├── build_and_run.bat   # Build script for Windows
└── README.md           # Project documentation
```

## How to Build and Run

### Prerequisites
-   A C++ compiler (e.g., g++ via MinGW).
-   Windows OS (for the batch script).

### Steps
1.  Open a terminal in the project root directory.
2.  Run the build script:
    ```cmd
    .\build_and_run.bat
    ```
3.  Follow the on-screen prompts to select Demo or Interactive mode.

## Example Output

```text
=== Priority (Preemptive) ===
Priority Scheduling (Preemptive) Complete

PID       Arrival   Burst     Priority  Completion     Turnaround     Waiting
--------------------------------------------------------------------------------
1         0         5         2         8              8              3
2         2         3         1         5              3              0
3         4         1         3         9              5              4

Average Turnaround Time: 5.33333
Average Waiting Time: 2.33333
```
