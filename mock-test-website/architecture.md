# architecture.md

## 1. Architecture Overview

This is a **fully client-side Single Page Flow (multi-HTML entry points)** app.

Pages:

* `index.html` → Home
* `test.html` → Exam interface
* `result.html` → Result display

All logic is handled using modular JavaScript files.

---

## 2. Core Design Principles

1. **Single Source of Truth**

   * All question state must come from a central in-memory object synced with localStorage

2. **Deterministic UI**

   * UI must always be derived from state, never the reverse

3. **No Implicit Saving**

   * Only Save buttons persist answers

4. **Stateless Navigation**

   * Rendering depends only on:

     * current question index
     * stored state

---

## 3. Global State Model

### In-Memory State

```js
const state = {
  testId: string,
  questions: [],

  currentIndex: number,

  answers: {
    [questionId]: {
      selected: number | null,
      marked: boolean
    }
  },

  endTime: number
};
```

---

## 4. Data Flow

### Initial Load (test.html)

1. Read `test_id` from URL
2. Fetch corresponding JSON from `/data`
3. Initialize state:

   * Load from localStorage if exists
   * Else create fresh state
4. Start timer
5. Render UI

---

## 5. Module Responsibilities

---

### 5.1 app.js

**Entry point**

Responsibilities:

* Initialize app
* Load JSON
* Initialize state
* Call renderer
* Bind global events

---

### 5.2 storage.js

Responsibilities:

* Save state to localStorage
* Load state from localStorage
* Clear state

Functions:

```js
saveState(state)
loadState(testId)
clearState(testId)
getStorageKey(testId)
```

---

### 5.3 timer.js

Responsibilities:

* Manage countdown using `endTime`

Functions:

```js
startTimer(endTime, onExpire)
getRemainingTime(endTime)
formatTime(ms)
```

Behavior:

* Uses real-time comparison (`Date.now()`)
* On expiry → trigger submit

---

### 5.4 renderer.js

Responsibilities:

* Render UI from state

Functions:

```js
renderQuestion(state)
renderOptions(state)
renderPalette(state)
renderLegend()
renderTimer()
```

### Important:

* Must re-render on every state change
* Must apply KaTeX rendering after injecting HTML

---

### 5.5 navigation.js

Responsibilities:

* Handle question movement

Functions:

```js
goToNext(state)
goToPrevious(state)
goToIndex(state, index)
```

Rules:

* Wrap around (first ↔ last)
* Palette navigation does NOT save

---

### 5.6 evaluation.js

Responsibilities:

* Calculate result

Functions:

```js
calculateScore(state, questions, config)
getSubjectWiseScore(state, questions)
```

---

## 6. Event Flow

---

### 6.1 Selecting Option

* Update temporary UI selection ONLY
* DO NOT update state.answers

---

### 6.2 Save & Next / Previous

Flow:

1. Read selected option
2. Update:

```js
answers[qid].selected = value
```

3. Preserve `marked` state
4. Save to localStorage
5. Navigate
6. Re-render

---

### 6.3 Mark / Unmark

Flow:

1. Toggle `marked`
2. If unmark:

   * keep selected internally
   * UI becomes WHITE
3. Save state
4. Re-render palette

---

### 6.4 Palette Click

Flow:

1. Change `currentIndex`
2. DO NOT save current selection
3. Re-render

---

### 6.5 Submit

Flow:

1. Show confirmation popup
2. If confirmed:

   * Calculate score
   * Store result (optional temporary)
   * Redirect to `result.html`

---

### 6.6 Timer Expiry

Flow:

1. Auto-submit
2. Redirect to result page

---

## 7. Palette Rendering Logic

Function:

```js
getColor(questionState)
```

Rules:

```js
if (marked && selected !== null) → blue
else if (marked && selected === null) → yellow
else if (!marked && selected !== null) → green
else → white
```

### Important override:

* If user unmarks → force WHITE visually
* Green only appears after Save action

---

## 8. Subject Mapping Logic

### Function:

```js
getSubject(index, testType)
```

### Engineering:

* index < 75 → Maths
* index < 120 → Physics
* else → Chemistry

### BPharm:

* index < 45 → Chemistry
* else → Physics

---

## 9. Result Computation

### Algorithm:

```js
if selected === null → 0
if selected === correct → +marks_correct
else → marks_wrong
```

### Output:

```js
{
  totalScore,
  subjectScores: {
    maths?,
    physics,
    chemistry
  }
}
```

---

## 10. Routing Strategy

### index.html → test.html

Pass:

```id="r8e3pf"
?test=bpharm_mock1.json
```

### test.html → result.html

Pass:

```id="s7m2dl"
?test=bpharm_mock1.json
```

---

## 11. LocalStorage Lifecycle

### On Test Start:

* If no data → initialize
* If data exists → resume

### On Return to Home:

* `clearState(testId)`

---

## 12. Error Handling

* If JSON fails to load:

  * Show error message
* If corrupted localStorage:

  * Reset state

---

## 13. Rendering Cycle

Every state change triggers:

```js
renderQuestion()
renderOptions()
renderPalette()
renderTimer()
```

---

## 14. KaTeX Integration

* After rendering question/options:

```js
katex.render(...)
```

OR auto-render:

```js
renderMathInElement(container)
```

---

## 15. Performance Strategy

* Only render:

  * Current question
  * Full palette (lightweight)

* Avoid:

  * Rendering all questions

---

## 16. Mobile Responsiveness Strategy

* Palette:

  * Grid layout
  * Scrollable container

* Buttons:

  * Stack vertically on small screens

---

## 17. Security Considerations

* No eval()
* No dynamic script injection
* Treat JSON as trusted static asset

---

## 18. Non-Negotiable Constraints

* No backend
* No frameworks
* No deviation from state model
* No implicit saves
* No extra states (like visited/red)

---

## END
