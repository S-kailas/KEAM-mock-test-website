const EvaluationUtil = {
    evaluate: (testData, answers, testType) => {
        let totalScore = 0;
        let correctCount = 0;
        let wrongCount = 0;
        let attempted = 0;
        
        const marksCorrect = testData.marks_correct;
        const marksWrong = testData.marks_wrong;
        const questionsCount = testData.questions.length;
        const maxScore = questionsCount * marksCorrect;

        let subjects = {};
        
        // Define subject ranges based on type
        let subjectRanges = [];
        if (testType === 'engineering') {
            subjectRanges = [
                { name: 'Maths', start: 0, end: 74 },
                { name: 'Physics', start: 75, end: 119 },
                { name: 'Chemistry', start: 120, end: 149 }
            ];
        } else if (testType === 'bpharm') {
            subjectRanges = [
                { name: 'Chemistry', start: 0, end: 44 },
                { name: 'Physics', start: 45, end: 74 }
            ];
        }

        subjectRanges.forEach(s => {
            const count = (s.end - s.start) + 1;
            subjects[s.name] = { score: 0, maxScore: count * marksCorrect, correct: 0, wrong: 0, attempted: 0 };
        });

        testData.questions.forEach((q, idx) => {
            // Find which subject this question belongs to
            let subjName = '';
            for (const r of subjectRanges) {
                if (idx >= r.start && idx <= r.end) {
                    subjName = r.name;
                    break;
                }
            }

            const ans = answers[idx];
            if (ans && ans.selected !== null && ans.selected !== undefined) {
                attempted++;
                subjects[subjName].attempted++;
                
                if (ans.selected === q.correct) {
                    totalScore += marksCorrect;
                    correctCount++;
                    subjects[subjName].score += marksCorrect;
                    subjects[subjName].correct++;
                } else {
                    totalScore += marksWrong;
                    wrongCount++;
                    subjects[subjName].score += marksWrong;
                    subjects[subjName].wrong++;
                }
            }
        });

        return {
            totalScore,
            maxScore,
            correctCount,
            wrongCount,
            attempted,
            subjects
        };
    }
};
