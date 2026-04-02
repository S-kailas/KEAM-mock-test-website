class Renderer {
    constructor(container) {
        this.container = container;
    }


    renderQuestion(questionObj, questionNumber, subjectName, state) {
        document.getElementById('current-q-num').textContent = questionNumber;
        document.getElementById('subject-badge').textContent = subjectName;

        const qText = document.getElementById('question-text');
        qText.innerHTML = questionObj.question;

        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = '';

        questionObj.options.forEach((optText, i) => {
            const label = document.createElement('label');
            label.className = 'option-label';
            if (state.selected === i) label.classList.add('selected');

            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'option';
            radio.value = i;
            if (state.selected === i) radio.checked = true;

            // ✅ UPDATED: toggle selection (click again → unselect)
            radio.addEventListener('click', () => {
                const isAlreadySelected =
                    window.temporarySelection === i || state.selected === i;

                if (isAlreadySelected) {
                    radio.checked = false;
                    label.classList.remove('selected');
                    window.temporarySelection = null;
                } else {
                    document.querySelectorAll('.option-label').forEach(el => el.classList.remove('selected'));
                    label.classList.add('selected');
                    window.temporarySelection = i;
                }
            });

            const span = document.createElement('span');
            span.innerHTML = optText;

            label.appendChild(radio);
            label.appendChild(span);
            optionsContainer.appendChild(label);
        });

        // KaTeX rendering
        if (window.renderMathInElement) {
            const config = {
                delimiters: [
                    { left: "$$", right: "$$", display: true },
                    { left: "$", right: "$", display: false }
                ],
                throwOnError: false
            };

            window.renderMathInElement(qText, config);
            window.renderMathInElement(optionsContainer, config);
        }
    }

    renderPalette(totalQuestions, testData, subjectRanges, answers) {
        const grid = document.getElementById('palette-grid');
        grid.innerHTML = '';

        subjectRanges.forEach((range) => {
            const rangeTitle = document.createElement('div');
            rangeTitle.style.gridColumn = '1 / -1';
            rangeTitle.style.fontWeight = 'bold';
            rangeTitle.style.marginTop = '10px';
            rangeTitle.style.color = 'var(--text-muted)';
            rangeTitle.textContent = range.name;
            grid.appendChild(rangeTitle);

            for (let i = range.start; i <= range.end; i++) {
                const btn = document.createElement('button');
                btn.className = 'palette-btn pb-default';
                btn.textContent = i + 1;
                btn.id = `palette-btn-${i}`;

                this.updatePaletteButtonClass(btn, answers[i]);

                btn.onclick = () => window.navigateToQuestion(i);
                grid.appendChild(btn);
            }
        });
    }

    updatePaletteButtonClass(btn, ans) {
        btn.className = 'palette-btn';

        if (!ans) {
            btn.classList.add('pb-default');
            return;
        }

        const isAnswered = ans.selected !== null && ans.selected !== undefined;
        const isMarked = ans.marked;

        if (isMarked && isAnswered) {
            btn.classList.add('pb-marked-answered');
        } else if (isMarked && !isAnswered) {
            btn.classList.add('pb-marked-unanswered');
        } else if (isAnswered) {
            btn.classList.add('pb-answered');
        } else {
            btn.classList.add('pb-default');
        }
    }

    highlightActivePalette(index) {
        document.querySelectorAll('.palette-btn').forEach(btn => btn.classList.remove('pb-active'));
        const actBtn = document.getElementById(`palette-btn-${index}`);
        if (actBtn) actBtn.classList.add('pb-active');
    }


}
