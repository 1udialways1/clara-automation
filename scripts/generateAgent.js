const fs = require('fs');
const path = require('path');

function generatePrompt(memo) {

    const timeout = memo.call_transfer_rules?.timeout_seconds || 30;

    return `
You are Clara, the AI voice assistant for ${memo.company_name}.

BUSINESS HOURS:
${memo.business_hours.days.join(", ")}
${memo.business_hours.start} - ${memo.business_hours.end} ${memo.business_hours.timezone}

OFFICE HOURS FLOW:
1. Greet professionally
2. Ask caller purpose
3. Collect name and callback number
4. Route call appropriately
5. Attempt transfer
6. If transfer fails after ${timeout} seconds, apologize and assure callback
7. Close politely

AFTER HOURS FLOW:
1. Greet professionally
2. Ask purpose
3. Confirm emergency
4. If emergency collect name, phone and address
5. Attempt transfer
6. If transfer fails after ${timeout} seconds assure urgent follow-up
7. Otherwise record details for next business day

Never mention internal systems to the caller.
`;
}

const accountsDir = path.join(__dirname, '..', 'outputs');
const accounts = fs.readdirSync(accountsDir);

accounts.forEach(account => {

    ['v1', 'v2'].forEach(version => {

        const memoPath = path.join(accountsDir, account, version, 'memo.json');
        if (!fs.existsSync(memoPath)) return;

        const memo = JSON.parse(fs.readFileSync(memoPath));

        const agentSpec = {
            agent_name: `Clara - ${memo.company_name}`,
            version: version,
            voice_style: "Professional, calm, efficient",
            key_variables: {
                business_hours: memo.business_hours,
                transfer_timeout: memo.call_transfer_rules?.timeout_seconds || 30
            },
            system_prompt: generatePrompt(memo),
            fallback_protocol: "If transfer fails collect details and assure callback."
        };

        fs.writeFileSync(
            path.join(accountsDir, account, version, 'agent_spec.json'),
            JSON.stringify(agentSpec, null, 2)
        );

        console.log(`✅ Agent spec generated for ${account} (${version})`);
    });
});