// Simple test script to check if API is working
(async () => {
    try {
        console.log('⏳ Testing /jobs API endpoint...\n');
        
        const response = await fetch('http://localhost:3000/jobs');
        const data = await response.json();
        
        console.log('✅ API Response Status:', response.status);
        console.log('✅ Success:', data.success);
        console.log('✅ Jobs Count:', data.data?.length || 0);
        
        if (data.data && data.data.length > 0) {
            console.log('\n📌 First Job Structure:');
            const firstJob = data.data[0];
            console.log('  - _id:', firstJob._id ? '✅ Present' : '❌ MISSING');
            console.log('  - title:', firstJob.title ? '✅ Present' : '❌ MISSING');
            console.log('  - location:', firstJob.location ? '✅ Present' : '❌ MISSING');
            console.log('  - salary:', firstJob.salary ? '✅ Present' : '❌ MISSING');
            console.log('  - skills:', Array.isArray(firstJob.skills) ? '✅ Present' : '❌ MISSING');
            
            console.log('\n📋 Full First Job:');
            console.log(JSON.stringify(firstJob, null, 2));
            
            // Test single job endpoint
            console.log(`\n⏳ Testing /jobs/${firstJob._id} endpoint...\n`);
            const singleResponse = await fetch(`http://localhost:3000/jobs/${firstJob._id}`);
            const singleJob = await singleResponse.json();
            console.log('✅ Single Job Status:', singleResponse.status);
            console.log('📋 Single Job Details:');
            console.log(JSON.stringify(singleJob, null, 2));
        } else {
            console.log('\n⚠️ No jobs found in database!');
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
})();
