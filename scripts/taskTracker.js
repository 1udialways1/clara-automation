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

function createTask(accountId, stage) {

    const tasks = JSON.parse(fs.readFileSync(taskFile));

    const newTask = {
        account_id: accountId,
        stage: stage, // demo_processed or onboarding_processed
        timestamp: new Date().toISOString(),
        status: "completed"
    };

    tasks.push(newTask);

    fs.writeFileSync(taskFile, JSON.stringify(tasks, null, 2));
}

module.exports = { createTask };