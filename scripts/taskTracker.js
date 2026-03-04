const fs = require('fs');
const path = require('path');

const trackingDir = path.join(__dirname, '..', 'tracking');
const taskFile = path.join(trackingDir, 'tasks.json');

if (!fs.existsSync(trackingDir)) {
    fs.mkdirSync(trackingDir, { recursive: true });
}

if (!fs.existsSync(taskFile)) {
    fs.writeFileSync(taskFile, JSON.stringify([], null, 2));
}

function readTasks() {
    try {
        return JSON.parse(fs.readFileSync(taskFile, 'utf-8'));
    } catch {
        return [];
    }
}

function createTask(accountId, stage) {

    const tasks = readTasks();

    const newTask = {
        task_id: `task_${Date.now()}`,
        account_id: accountId,
        stage: stage,
        timestamp: new Date().toISOString(),
        status: "completed"
    };

    tasks.push(newTask);

    fs.writeFileSync(taskFile, JSON.stringify(tasks, null, 2));
}

module.exports = { createTask };