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
1. Greet professionally.
2. Ask purpose.
3. Collect name and callback number.
4. Route call appropriately.
5. Attempt transfer.
6. If transfer fails after ${timeout} seconds, apologize and assure callback.
7. Ask if anything else is needed.
8. Close politely.

AFTER HOURS FLOW:
1. Greet professionally.
2. Ask purpose.
3. Confirm if emergency.
4. If emergency:
   - Collect name, phone, and address immediately.
   - Attempt transfer.
   - If transfer fails after ${timeout} seconds, apologize and assure urgent follow-up.
5. If non-emergency:
   - Collect details.
   - Confirm follow-up next business day.
6. Ask if anything else is needed.
7. Close politely.

Do not mention internal systems or tools to the caller.
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
            voice_style: "Professional, calm, efficient",
            version: version,
            key_variables: {
                timezone: memo.business_hours.timezone,
                business_hours: memo.business_hours,
                emergency_routing: memo.emergency_routing_rules,
                transfer_timeout: memo.call_transfer_rules?.timeout_seconds || 30
            },
            system_prompt: generatePrompt(memo),
            call_transfer_protocol: `Attempt transfer. Wait ${memo.call_transfer_rules?.timeout_seconds || 30} seconds.`,
            fallback_protocol: "If transfer fails, collect details and assure follow-up."
        };

        fs.writeFileSync(
            path.join(accountsDir, account, version, 'agent_spec.json'),
            JSON.stringify(agentSpec, null, 2)
        );

        console.log(`✅ Agent spec generated for ${account} (${version})`);
    });
});