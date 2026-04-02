// Home Page Logic
const tests = {
    engineering: [
        { id: 'eng_mock1.json', name: 'Engineering Mock Test 1' },
        { id: 'eng_mock2.json', name: 'Engineering Mock Test 2' },
        { id: 'eng_mock3.json', name: 'Engineering Mock Test 3' }
    ],
    bpharm: [
        { id: 'bpharm_mock1.json', name: 'BPharm Mock Test 1' },
        { id: 'bpharm_mock2.json', name: 'BPharm Mock Test 2' },
        { id: 'bpharm_mock3.json', name: 'BPharm Mock Test 3' }
    ]
};

function showTests(type) {
    document.getElementById('course-selection').classList.add('hidden');
    const testSelection = document.getElementById('test-selection');
    testSelection.classList.remove('hidden');
    
    const testList = document.getElementById('test-list');
    testList.innerHTML = '';
    
    tests[type].forEach(test => {
        const div = document.createElement('div');
        div.className = 'test-card';
        div.innerHTML = `<h3>${test.name}</h3>`;
        div.onclick = () => {
            startTest(test.id, type);
        };
        testList.appendChild(div);
    });
}

function goBack() {
    document.getElementById('test-selection').classList.add('hidden');
    document.getElementById('course-selection').classList.remove('hidden');
}

function startTest(testId, type) {
    // Navigate straight to test UI
    window.location.href = `test.html?test_id=${testId}&type=${type}`;
}
