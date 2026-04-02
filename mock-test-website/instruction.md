# instruction.md

## 1. Project Overview

Build a static exam mock test web app (KEAM style) using:

* HTML
* CSS
* Vanilla JavaScript
* KaTeX (for LaTeX rendering)

The app runs fully client-side and is deployable on GitHub Pages.

---

## 2. Test Types

### Engineering Test

* Duration: 180 minutes
* Questions: 150

  * Maths: Q1–75
  * Physics: Q76–120
  * Chemistry: Q121–150
* Total marks: 600

### BPharm Test

* Duration: 90 minutes
* Questions: 75

  * Chemistry: Q1–45
  * Physics: Q46–75
* Total marks: 150

---

## 3. Marking Scheme

* Correct: +4
* Wrong: -1
* Unanswered: 0

---

## 4. JSON Format (STRICT)

Each test JSON follows:

```json
{
  "test_id": "string",
  "duration_minutes": number,
  "marks_correct": number,
  "marks_wrong": number,
  "questions": [
    {
      "id": number,
      "question": "string (contains LaTeX with $...$)",
      "options": ["A","B","C","D","E"],
      "correct": number (0–4)
    }
  ]
}
```

### Rules:

* Always 5 options
* `correct` is 0-based index
* Questions are already ordered
* Question text may contain numbering → DO NOT remove

---

## 5. Subject Mapping

### Engineering

* 1–75 → Maths
* 76–120 → Physics
* 121–150 → Chemistry

### BPharm

* 1–45 → Chemistry
* 46–75 → Physics

---

## 6. UI Pages

### 6.1 Home Page

* Title: **KEAM MOCK TEST**
* Two buttons:

  * Engineering
  * BPharm
* After selecting → show 3 test options
* Clicking a test → starts test immediately (no intermediate screen)

---

### 6.2 Test Interface

#### Layout Sections:

1. Question display
2. Options (radio buttons)
3. Navigation buttons
4. Question palette
5. Legend
6. Timer
7. Submit button

---

## 7. Question Rendering

* Only ONE question visible at a time
* Render LaTeX using KaTeX
* Support `$...$` only

---

## 8. Buttons Behavior

### 8.1 Save & Next

* Save selected option (if any)
* Move to next question
* If last question → go to first
* Update palette color:

  * Answered → Green
  * Not answered → White

---

### 8.2 Save & Previous

* Save selected option (if any)
* Move to previous question
* If first → go to last
* Same color rules as above

---

### 8.3 Mark / Unmark for Review (Toggle)

#### Case 1: With selected option

* Mark → Blue
* Unmark → White (NOT green)

#### Case 2: Without selected option

* Mark → Yellow
* Unmark → White

#### Special Rule:

* After unmark → color becomes White regardless of answer state
* Only Save buttons can convert it to Green

---

### 8.4 Palette Navigation

* Clicking a question number:

  * Navigate directly
  * DO NOT save current selection
  * Temporary selection is discarded

---

### 8.5 Submit Button

* Show confirmation popup:

  * "Do you want to end the exam?"
* If confirmed → submit test

---

## 9. Question State Model

Each question must track:

```js
{
  selected: number | null,
  marked: boolean
}
```

---

## 10. Palette Color Logic

| Condition             | Color  |
| --------------------- | ------ |
| Default               | White  |
| Answered (after Save) | Green  |
| Marked + Answered     | Blue   |
| Marked + Not Answered | Yellow |
| Unmarked              | White  |

### Important:

* No "visited" state
* White includes both:

  * Unvisited
  * Visited but not saved

---

## 11. Timer

* Countdown timer
* Use `end_timestamp`

### Storage:

```js
endTime = currentTime + duration
```

### Behavior:

* Timer continues using real time
* Refresh → timer resumes correctly
* If time ≤ 0 → auto submit

---

## 12. Local Storage

### Key format:

```js
keam_<test_id>
```

### Stored data:

```js
{
  answers: { [questionId]: { selected, marked } },
  endTime: timestamp
}
```

---

## 13. Reset Behavior

### MUST reset when:

* User clicks "Return to Home" from result page

### MUST NOT persist:

* Previous answers
* Palette colors
* Timer

---

## 14. Result Page

Show:

* Total score
* Subject-wise score

### Calculation:

* Compare `selected` vs `correct`
* Use marking scheme from JSON

### Subject split:

* Based on index ranges

### Button:

* "Return to Home"

  * Clears localStorage for this test

---

## 15. Performance

* Load ONE question at a time
* Do NOT render all questions at once

---

## 16. Responsiveness

* Must work on:

  * Mobile
  * Tablet
  * Desktop

### Requirements:

* Palette scrollable on small screens
* Buttons stack vertically on mobile

---

## 17. File Structure (MANDATORY)

```
/project-root
│
├── index.html
├── test.html
├── result.html
│
├── /css
│   └── styles.css
│
├── /js
│   ├── app.js
│   ├── storage.js
│   ├── timer.js
│   ├── renderer.js
│   ├── navigation.js
│   └── evaluation.js
│
├── /data
│   ├── engineering_mock1.json
│   ├── engineering_mock2.json
│   ├── engineering_mock3.json
│   ├── bpharm_mock1.json
│   ├── bpharm_mock2.json
│   └── bpharm_mock3.json
│
└── /lib
    └── katex (CDN or local)
```

---

## 18. Strict Rules for Generator

* Do NOT invent features
* Do NOT add visited/red states
* Do NOT persist temporary selections
* Do NOT auto-save on palette navigation
* Do NOT modify JSON structure
* Follow color logic EXACTLY
* Use only client-side logic

---

## END
