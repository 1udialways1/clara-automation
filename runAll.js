const { execSync } = require('child_process');

function run(command) {
    console.log(`\n🚀 Running: ${command}`);
    execSync(command, { stdio: 'inherit' });
}

try {
    run('node scripts/extractDemo.js');
    run('node scripts/generateAgent.js');
    run('node scripts/applyOnboarding.js');
    run('node scripts/generateAgent.js');
    console.log('\n✅ FULL PIPELINE COMPLETED SUCCESSFULLY!');
} catch (error) {
    console.error('\n❌ Pipeline failed.');
}