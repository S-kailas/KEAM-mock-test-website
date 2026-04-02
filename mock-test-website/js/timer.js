class Timer {
    constructor(testId, durationMinutes, onTimeUp) {
        this.testId = testId;
        this.onTimeUp = onTimeUp;
        
        const session = StorageUtil.initSession(testId, durationMinutes);
        this.endTime = session.endTime;
        this.interval = null;
    }

    start() {
        this.updateDisplay();
        this.interval = setInterval(() => {
            this.updateDisplay();
        }, 1000);
    }

    updateDisplay() {
        const now = Date.now();
        let remaining = this.endTime - now;
        
        if (remaining <= 0) {
            clearInterval(this.interval);
            document.getElementById('time-left').textContent = '00:00:00';
            if (this.onTimeUp) this.onTimeUp();
            return;
        }

        const h = Math.floor(remaining / (1000 * 60 * 60));
        const m = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((remaining % (1000 * 60)) / 1000);

        document.getElementById('time-left').textContent = 
            `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }

    stop() {
        if (this.interval) clearInterval(this.interval);
    }
}
