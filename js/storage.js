// Storage Utility
const StorageUtil = {
    getKey: (testId) => `keam_${testId}`,

    initSession: (testId, durationMinutes) => {
        const key = StorageUtil.getKey(testId);
        let session = JSON.parse(localStorage.getItem(key));
        
        if (!session) {
            session = {
                answers: {},
                endTime: Date.now() + (durationMinutes * 60 * 1000)
            };
            localStorage.setItem(key, JSON.stringify(session));
        }
        return session;
    },

    saveAnswer: (testId, questionIndex, selected, marked) => {
        const key = StorageUtil.getKey(testId);
        let session = JSON.parse(localStorage.getItem(key));
        if (session) {
            session.answers[questionIndex] = { selected, marked };
            localStorage.setItem(key, JSON.stringify(session));
        }
    },

    getAnswers: (testId) => {
        const key = StorageUtil.getKey(testId);
        const session = JSON.parse(localStorage.getItem(key));
        return session ? session.answers : {};
    },

    getEndTime: (testId) => {
        const key = StorageUtil.getKey(testId);
        const session = JSON.parse(localStorage.getItem(key));
        return session ? session.endTime : null;
    },

    clearTestSession: (testId) => {
        localStorage.removeItem(StorageUtil.getKey(testId));
    }
};
