const fs = require('fs');
const path = require('path');

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

    // Company
    const companyMatch = transcriptText.match(/this is (.+?)\./i);
    if (companyMatch) {
        memo.company_name = companyMatch[1].trim();
    } else {
        memo.questions_or_unknowns.push("Company name not specified in demo");
    }

    // Business Hours
    const hoursMatch = transcriptText.match(
        /(Monday.*?Friday).*?(\d+am).*?(\d+pm).*?(EST|CST|PST|GMT)?/i
    );

    if (hoursMatch) {
        memo.business_hours.days.push(hoursMatch[1]);
        memo.business_hours.start = hoursMatch[2];
        memo.business_hours.end = hoursMatch[3];
        memo.business_hours.timezone = hoursMatch[4] || "";
    } else {
        memo.questions_or_unknowns.push("Business hours not specified");
    }

    // Address
    const addressMatch = transcriptText.match(/located at (.+?)\./i);
    if (addressMatch) {
        memo.office_address = addressMatch[1].trim();
    }

    // Services
    const services = ["sprinkler", "fire alarm", "electrical", "hvac", "inspection"];
    services.forEach(service => {
        if (text.includes(service)) {
            memo.services_supported.push(service);
        }
    });

    if (memo.services_supported.length === 0) {
        memo.questions_or_unknowns.push("Services supported not clearly specified");
    }

    // Emergency
    if (text.includes("sprinkler leak")) {
        memo.emergency_definition.push("sprinkler leak");
        memo.emergency_routing_rules.route_to = "dispatch";
    }

    if (memo.emergency_definition.length === 0) {
        memo.questions_or_unknowns.push("Emergency definition unclear");
    }

    // Non-emergency
    if (text.includes("non emergency") || text.includes("inspection")) {
        memo.non_emergency_routing_rules = {
            collect_details: true,
            follow_up_next_business_day: true
        };
    }

    // Transfer timeout
    const timeoutMatch = transcriptText.match(/(\d+)\s*seconds/i);
    if (timeoutMatch) {
        memo.call_transfer_rules.timeout_seconds = parseInt(timeoutMatch[1]);
    }

    memo.office_hours_flow_summary =
        "Greet → Ask purpose → Collect name & number → Route/Transfer → Fallback → Close";

    memo.after_hours_flow_summary =
        "Greet → Confirm emergency → If emergency collect details immediately → Attempt transfer → Fallback → Non-emergency collect details → Close";

    return memo;
}

// Batch
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

    console.log(`✅ v1 generated for ${accountId}`);
});