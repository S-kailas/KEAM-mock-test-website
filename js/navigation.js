let currentTestId = null;
let currentTestType = null;
let testData = null;
let currentQuestionIndex = 0;
let answers = {};
let subjectRanges = [];
let renderer = null;
let timer = null;

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    currentTestId = urlParams.get('test_id');
    currentTestType = urlParams.get('type');


    if (!currentTestId) {
        window.location.href = 'index.html';
        return;
    }

    try {
        const response = await fetch(`data/${currentTestId}`);
        testData = await response.json();
    } catch (e) {
        alert("Failed to load test data");
        return;
    }

    const tt = document.getElementById('test-title');
    if (tt && testData.test_id) {
        tt.textContent = testData.test_id.replace('.json', '').replace('_', ' ').toUpperCase();
    }

    renderer = new Renderer();

    if (currentTestType === 'engineering') {
        subjectRanges = [
            { name: 'Maths', start: 0, end: 74 },
            { name: 'Physics', start: 75, end: 119 },
            { name: 'Chemistry', start: 120, end: 149 }
        ];
    } else if (currentTestType === 'bpharm') {
        subjectRanges = [
            { name: 'Chemistry', start: 0, end: 44 },
            { name: 'Physics', start: 45, end: 74 }
        ];
    }

    answers = StorageUtil.getAnswers(currentTestId);

    timer = new Timer(currentTestId, testData.duration_minutes, submitTest);
    timer.start();

    renderer.renderPalette(testData.questions.length, testData, subjectRanges, answers);

    window.navigateToQuestion(0);


});

window.navigateToQuestion = (index) => {
    currentQuestionIndex = index;
    window.temporarySelection = null;


    const q = testData.questions[index];
    const state = answers[index] || { selected: null, marked: false };

    let subjName = '';
    for (const r of subjectRanges) {
        if (index >= r.start && index <= r.end) {
            subjName = r.name;
            break;
        }
    }

    renderer.renderQuestion(q, index + 1, subjName, state);
    renderer.highlightActivePalette(index);
    updateReviewButtonText();


};

function getTemporaryOrSavedSelection() {
    if (window.temporarySelection !== null && window.temporarySelection !== undefined) {
        return window.temporarySelection;
    }
    const state = answers[currentQuestionIndex];
    return state ? state.selected : null;
}

// ✅ ALWAYS move next
window.handleSaveAndNext = () => {
    saveCurrentAnswer();
    const nextIdx = (currentQuestionIndex + 1) % testData.questions.length;
    window.navigateToQuestion(nextIdx);
};

window.handleSaveAndPrevious = () => {
    saveCurrentAnswer();
    const prevIdx = currentQuestionIndex === 0
        ? testData.questions.length - 1
        : currentQuestionIndex - 1;
    window.navigateToQuestion(prevIdx);
};

function saveCurrentAnswer() {
    const selected = getTemporaryOrSavedSelection();


    StorageUtil.saveAnswer(currentTestId, currentQuestionIndex, selected, false);
    answers[currentQuestionIndex] = { selected, marked: false };

    const btn = document.getElementById(`palette-btn-${currentQuestionIndex}`);
    if (btn) renderer.updatePaletteButtonClass(btn, answers[currentQuestionIndex]);


}

// ✅ FIXED MARK LOGIC
window.handleMarkForReview = () => {
    let state = answers[currentQuestionIndex] || { selected: null, marked: false };


    const newMarked = !state.marked;

    let finalSelected = window.temporarySelection !== null && window.temporarySelection !== undefined
        ? window.temporarySelection
        : state.selected;

    if (!newMarked) {
        finalSelected = null;
        window.temporarySelection = null;
    }

    StorageUtil.saveAnswer(currentTestId, currentQuestionIndex, finalSelected, newMarked);
    answers[currentQuestionIndex] = { selected: finalSelected, marked: newMarked };

    const btn = document.getElementById(`palette-btn-${currentQuestionIndex}`);
    if (btn) renderer.updatePaletteButtonClass(btn, answers[currentQuestionIndex]);

    updateReviewButtonText();

    // 🔥 CRITICAL FIX: delay navigation slightly
    if (newMarked) {
        setTimeout(() => {
            const nextIdx = (currentQuestionIndex + 1) % testData.questions.length;
            window.navigateToQuestion(nextIdx);
        }, 0);
    }


};


function updateReviewButtonText() {
    const state = answers[currentQuestionIndex] || { selected: null, marked: false };
    const revBtn = document.getElementById('btn-mark-review');
    revBtn.textContent = state.marked ? "Unmark for Review" : "Mark for Review";
}

window.handleSubmit = () => {
    document.getElementById('submit-modal').classList.remove('hidden');
};

window.closeSubmitModal = () => {
    document.getElementById('submit-modal').classList.add('hidden');
};

window.confirmSubmit = () => {
    submitTest();
};

function submitTest() {
    if (timer) timer.stop();
    window.location.href = `result.html?test_id=${currentTestId}&type=${currentTestType}`;
}
