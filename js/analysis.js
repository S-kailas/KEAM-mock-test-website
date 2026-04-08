document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const testId = urlParams.get('test_id');

    if (!testId) {
        window.location.href = 'index.html';
        return;
    }

    // Storage missing checking
    if (!localStorage.getItem(StorageUtil.getKey(testId))) {
        window.location.href = 'index.html';
        return;
    }

    const answers = StorageUtil.getAnswers(testId);

    fetch(`data/${testId}`)
        .then(res => {
            if (!res.ok) throw new Error('Failed to load JSON');
            return res.json();
        })
        .then(testData => {
            renderAnalysis(testData.questions, answers);

            // Apply KaTeX
            if (window.renderMathInElement) {
                window.renderMathInElement(document.getElementById('analysis-container'), {
                    delimiters: [
                        { left: "$$", right: "$$", display: true },
                        { left: "$", right: "$", display: false }
                    ],
                    throwOnError: false
                });
            }
        })
        .catch(err => {
            console.error(err);
            document.getElementById('analysis-container').innerHTML =
                '<p class="text-center" style="color: var(--danger);">Error loading test data. Please try again.</p>';
        });
});

function renderAnalysis(questions, answers) {
    const container = document.getElementById('analysis-container');
    container.innerHTML = '';

    let incorrectQuestionsFound = false;

    questions.forEach((q, idx) => {
        const ans = answers[idx];
        const selected = ans && ans.selected !== undefined && ans.selected !== null ? ans.selected : null;

        if (selected !== q.correct) {
            incorrectQuestionsFound = true;

            const qBlock = document.createElement('div');
            qBlock.style.background = 'var(--panel-bg)';
            qBlock.style.border = '1px solid var(--glass-border)';
            qBlock.style.borderRadius = 'var(--radius)';
            qBlock.style.padding = '1.5rem';
            qBlock.style.marginBottom = '1.5rem';
            qBlock.style.boxShadow = 'var(--glass-shadow)';

            const qHeader = document.createElement('h3');
            qHeader.style.color = 'var(--info)';
            qHeader.style.marginBottom = '1rem';
            qHeader.textContent = `Question ${idx + 1}`;

            const qText = document.createElement('div');
            qText.style.fontSize = '1.1rem';
            qText.style.marginBottom = '1.5rem';
            qText.innerHTML = q.question;

            qBlock.appendChild(qHeader);
            qBlock.appendChild(qText);

            const optionsDiv = document.createElement('div');
            optionsDiv.style.display = 'flex';
            optionsDiv.style.flexDirection = 'column';
            optionsDiv.style.gap = '1rem';

            // Show only correct option if unanswered
            if (selected === null) {
                const correctOpt = document.createElement('div');
                correctOpt.className = 'option-label';
                // BLUE color style for correct
                correctOpt.style.borderColor = 'var(--info)';
                correctOpt.style.background = 'rgba(59, 130, 246, 0.15)';
                correctOpt.style.boxShadow = '0 0 10px rgba(59, 130, 246, 0.2)';
                correctOpt.style.cursor = 'default';
                correctOpt.innerHTML = `<strong style="color: var(--info); margin-right: 1rem;">Correct:</strong> <span>${q.options[q.correct]}</span>`;
                optionsDiv.appendChild(correctOpt);
            } else {
                // Show selected (wrong) and correct
                const wrongOpt = document.createElement('div');
                wrongOpt.className = 'option-label';
                // RED color style for selected wrong
                wrongOpt.style.borderColor = 'var(--primary)';
                wrongOpt.style.background = 'rgba(140, 20, 33, 0.15)';
                wrongOpt.style.boxShadow = '0 0 10px rgba(140, 20, 33, 0.2)';
                wrongOpt.style.cursor = 'default';
                wrongOpt.innerHTML = `<strong style="color: var(--danger); margin-right: 1rem;">Your Answer:</strong> <span>${q.options[selected]}</span>`;
                optionsDiv.appendChild(wrongOpt);

                const correctOpt = document.createElement('div');
                correctOpt.className = 'option-label';
                // BLUE color style for correct
                correctOpt.style.borderColor = 'var(--info)';
                correctOpt.style.background = 'rgba(59, 130, 246, 0.15)';
                correctOpt.style.boxShadow = '0 0 10px rgba(59, 130, 246, 0.2)';
                correctOpt.style.cursor = 'default';
                correctOpt.innerHTML = `<strong style="color: var(--info); margin-right: 1rem;">Correct:</strong> <span>${q.options[q.correct]}</span>`;
                optionsDiv.appendChild(correctOpt);
            }

            qBlock.appendChild(optionsDiv);
            container.appendChild(qBlock);
        }
    });

    if (!incorrectQuestionsFound) {
        container.innerHTML = '<p class="text-center" style="font-size: 1.2rem; color: var(--success); padding: 2rem; background: var(--panel-bg); border-radius: var(--radius); border: 1px solid var(--glass-border);">Perfect score! No incorrect or unattempted questions.</p>';
    }
}

function returnToHome() {
    const urlParams = new URLSearchParams(window.location.search);
    const testId = urlParams.get('test_id');
    if (testId) {
        StorageUtil.clearTestSession(testId);
    }
    window.location.href = 'index.html';
}
