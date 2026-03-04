const fs = require('fs');
const path = require('path');
const { createTask } = require('./taskTracker');

function mergeWithConflict(oldMemo, patch) {

    const changes = [];

    Object.keys(patch).forEach(field => {

        if (!oldMemo[field]) {
            oldMemo[field] = patch[field];
            return;
        }

        if (JSON.stringify(oldMemo[field]) !== JSON.stringify(patch[field])) {

            changes.push({
                field: field,
                old: oldMemo[field],
                new: patch[field],
                reason: "Updated from onboarding transcript"
            });

            oldMemo[field] = patch[field];
        }
    });

    return { updatedMemo: oldMemo, changes };
}

const onboardingDir = path.join(__dirname, '..', 'data', 'onboarding');
const files = fs.readdirSync(onboardingDir);

files.forEach(file => {

    const accountId = file.replace('.txt', '').toLowerCase();

    const v1Path = path.join(__dirname, '..', 'outputs', accountId, 'v1', 'memo.json');
    if (!fs.existsSync(v1Path)) return;

    const v1Memo = JSON.parse(fs.readFileSync(v1Path));

    const transcript = fs.readFileSync(path.join(onboardingDir, file), 'utf-8');

    const patch = {};

    if (transcript.toLowerCase().includes("8am")) {
        patch.business_hours = {
            days: ["Monday-Friday"],
            start: "8am",
            end: "6pm",
            timezone: "EST"
        };
    }

    const { updatedMemo, changes } = mergeWithConflict(v1Memo, patch);

    const v2Dir = path.join(__dirname, '..', 'outputs', accountId, 'v2');
    fs.mkdirSync(v2Dir, { recursive: true });

    fs.writeFileSync(
        path.join(v2Dir, 'memo.json'),
        JSON.stringify(updatedMemo, null, 2)
    );

    fs.writeFileSync(
        path.join(__dirname, '..', 'outputs', accountId, 'changes.json'),
        JSON.stringify({
            version_from: "v1",
            version_to: "v2",
            detailed_changes: changes
        }, null, 2)
    );

    createTask(accountId, "onboarding_processed");

    console.log(`✅ v2 generated for ${accountId}`);
});