const notes = [
    { name: "ド", image: "assets/images/do.png", sound: "assets/sounds/do.mp3" },
    { name: "レ", image: "assets/images/re.png", sound: "assets/sounds/re.mp3" },
    { name: "ミ", image: "assets/images/mi.png", sound: "assets/sounds/mi.mp3" },
    { name: "ファ", image: "assets/images/fa.png", sound: "assets/sounds/fa.mp3" },
    { name: "ソ", image: "assets/images/so.png", sound: "assets/sounds/so.mp3" },
    { name: "ラ", image: "assets/images/ra.png", sound: "assets/sounds/ra.mp3" },
    { name: "シ", image: "assets/images/shi.png", sound: "assets/sounds/shi.mp3" }
];

let currentNote = null;
let remainingAnswers = 4; // 残り正解数を追跡
let timeLeft = 30; // タイムアタックの制限時間（秒）
let timer;

// Utility function to update text content of an element
function updateElementText(id, text) {
    document.getElementById(id).textContent = text;
}

// Utility function to show or hide an element
function toggleElementVisibility(id, isVisible) {
    const element = document.getElementById(id);
    element.style.display = isVisible ? "block" : "none";
}

// Utility function to set background color
function setBackgroundColor(color) {
    document.body.style.backgroundColor = color;
}

function getRandomNote() {
    return notes[Math.floor(Math.random() * notes.length)];
}

function loadNewNote() {
    currentNote = getRandomNote();
    console.log("New note loaded:", currentNote); // Debug log
    document.getElementById("noteImage").src = currentNote.image;
    console.log("Note image updated to:", currentNote.image); // Debug log
    updateElementText("result", "");
    document.activeElement.blur(); // Remove focus
}

function updateRemainingAnswers() {
    updateElementText("remaining", `${remainingAnswers}かい`);
}

function setChoiceButtonsDisabled(disabled) {
    document.querySelectorAll(".choices button").forEach(button => {
        button.disabled = disabled;
    });
}

function checkWinCondition() {
    if (remainingAnswers <= 0) {
        clearInterval(timer); // Stop timer
        setChoiceButtonsDisabled(true); // Disable buttons
        toggleElementVisibility("actionButtons", false); // Hide action buttons

        // Show celebration message
        const celebration = document.getElementById("celebration");
        celebration.style.display = "block";

        setTimeout(() => {
            celebration.style.display = "none";
            resetGame(); // Reset game state
        }, 5000); // Hide after 5 seconds
    }
}

function resetGame() {
    remainingAnswers = 4;
    timeLeft = 30;
    updateRemainingAnswers();
    updateElementText("timer", `のこりじかん: ${timeLeft}秒`);
    updateElementText("result", "");
    setBackgroundColor("");
    setChoiceButtonsDisabled(false);
    loadNewNote();
    startTimer();
}

function endGame() {
    setChoiceButtonsDisabled(true); // Disable buttons
    toggleElementVisibility("actionButtons", false); // Hide action buttons

    // Show game over message
    const celebration = document.getElementById("celebration");
    celebration.classList.add("skull");
    celebration.innerHTML = '<img src="assets/images/skull.png" alt="どくろ"><h2>ゲームオーバー</h2>';
    celebration.style.display = "block";

    setTimeout(() => {
        celebration.style.display = "none";
        celebration.classList.remove("skull");
        resetGame(); // Reset game state
    }, 5000); // Hide after 5 seconds
}

// Button click event handler
function handleButtonClick(e) {
    const target = e.currentTarget;
    const userChoice = target.getAttribute("data-note").trim();
    console.log("User choice:", userChoice); // Debug log
    console.log("Current note:", currentNote.name); // Debug log

    const resultElement = document.getElementById("result");
    if (userChoice === currentNote.name) {
        updateElementText("result", "せいかいだよ！いいね！");
        resultElement.style.color = "#28a745"; // Green
        setBackgroundColor("#d4edda"); // Light green
        toggleElementVisibility("actionButtons", true);
        toggleElementVisibility("retryButton", false);
        toggleElementVisibility("nextButton", true);
        remainingAnswers--;
        updateRemainingAnswers();
        checkWinCondition();
    } else {
        updateElementText("result", "ちがうよ、もういちど！");
        resultElement.style.color = "#dc3545"; // Red
        setBackgroundColor("#f8d7da"); // Light red
        toggleElementVisibility("actionButtons", true);
        toggleElementVisibility("retryButton", true);
        toggleElementVisibility("nextButton", false);
    }
    setChoiceButtonsDisabled(true);
}

// Initialize event listeners for choice buttons
document.querySelectorAll(".choices button").forEach(button => {
    button.addEventListener("click", handleButtonClick);
});

// Initialize event listeners for action buttons
document.getElementById("retryButton").addEventListener("click", () => {
    toggleElementVisibility("actionButtons", false);
    updateElementText("result", "");
    setBackgroundColor("");
    setChoiceButtonsDisabled(false);
});

document.getElementById("nextButton").addEventListener("click", () => {
    toggleElementVisibility("actionButtons", false);
    updateElementText("result", "");
    setBackgroundColor("");
    setChoiceButtonsDisabled(false);
    loadNewNote();
});

function startTimer() {
    timeLeft = 30; // Reset timer
    updateElementText("timer", `のこりじかん: ${timeLeft}秒`);

    timer = setInterval(() => {
        timeLeft--;
        updateElementText("timer", `のこりじかん: ${timeLeft}秒`);

        if (timeLeft <= 0) {
            clearInterval(timer);
            endGame();
        }
    }, 1000);
}

// 初期化
loadNewNote();
startTimer();
updateRemainingAnswers();