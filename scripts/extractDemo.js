const fs = require('fs');
const path = require('path');
const { createTask } = require('./taskTracker');

function extractDemo(transcriptText) {

    const text = transcriptText.toLowerCase();

    const memo = {
        account_id: "",
        company_name: "",
        business_hours: { days: [], start: "", end: "", timezone: "" },
        office_address: "",
        services_supported: [],
        emergency_definition: [],
        emergency_routing_rules: {},
        non_emergency_routing_rules: {},
        call_transfer_rules: {},
        integration_constraints: [],
        after_hours_flow_summary: "",
        office_hours_flow_summary: "",
        questions_or_unknowns: [],
        notes: "Generated from demo transcript (v1)"
    };

    // Company name detection
    const companyPatterns = [
        /this is (.+?)\./i,
        /welcome to (.+?)\./i,
        /thank you for calling (.+?)\./i
    ];

    for (let pattern of companyPatterns) {
        const match = transcriptText.match(pattern);
        if (match) {
            memo.company_name = match[1].trim();
            break;
        }
    }

    if (!memo.company_name) {
        memo.questions_or_unknowns.push("Company name not found");
    }

    // Business hours
    const hoursMatch = transcriptText.match(
        /(monday.*?friday).*?(\d+\s*am).*?(\d+\s*pm).*?(est|cst|pst|gmt)?/i
    );

    if (hoursMatch) {
        memo.business_hours.days.push(hoursMatch[1]);
        memo.business_hours.start = hoursMatch[2];
        memo.business_hours.end = hoursMatch[3];
        memo.business_hours.timezone = hoursMatch[4] || "";
    }

    // Address
    const addressMatch = transcriptText.match(/located at (.+?)\./i);
    if (addressMatch) {
        memo.office_address = addressMatch[1].trim();
    }

    // Services
    const serviceKeywords = [
        "sprinkler",
        "fire alarm",
        "inspection",
        "repair",
        "maintenance",
        "hvac",
        "electrical"
    ];

    serviceKeywords.forEach(service => {
        if (text.includes(service)) {
            memo.services_supported.push(service);
        }
    });

    // Emergency keywords
    const emergencyKeywords = [
        "sprinkler leak",
        "fire alarm failure",
        "gas leak",
        "fire emergency"
    ];

    emergencyKeywords.forEach(keyword => {
        if (text.includes(keyword)) {
            memo.emergency_definition.push(keyword);
        }
    });

    if (memo.emergency_definition.length > 0) {
        memo.emergency_routing_rules = {
            route_to: "dispatch",
            priority: "high"
        };
    }

    // Transfer timeout
    const timeoutMatch = transcriptText.match(/(\d+)\s*seconds/i);
    memo.call_transfer_rules.timeout_seconds = timeoutMatch
        ? parseInt(timeoutMatch[1])
        : 30;

    memo.office_hours_flow_summary =
        "Greet → Ask purpose → Collect name & number → Route call → Attempt transfer → Close politely";

    memo.after_hours_flow_summary =
        "Greet → Confirm emergency → If emergency collect details → Attempt transfer → Otherwise record request → Close";

    return memo;
}

// Batch processing
const demoDir = path.join(__dirname, '..', 'data', 'demo');
const demoFiles = fs.readdirSync(demoDir);

demoFiles.forEach(file => {

    const transcript = fs.readFileSync(path.join(demoDir, file), 'utf-8');
    const memo = extractDemo(transcript);

    const accountId = file.replace('.txt', '').toLowerCase();
    memo.account_id = accountId;

    const outputDir = path.join(__dirname, '..', 'outputs', accountId, 'v1');
    fs.mkdirSync(outputDir, { recursive: true });

    fs.writeFileSync(
        path.join(outputDir, 'memo.json'),
        JSON.stringify(memo, null, 2)
    );

    createTask(accountId, "demo_processed");

    console.log(`✅ v1 generated for ${accountId}`);
});