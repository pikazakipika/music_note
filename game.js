// ト音記号モード用
const notes_tone = [
    { name: "ド", image: "assets/images/tone_do.png", sound: "assets/sounds/tone_do.mp3" },
    { name: "レ", image: "assets/images/tone_re.png", sound: "assets/sounds/tone_re.mp3" },
    { name: "ミ", image: "assets/images/tone_mi.png", sound: "assets/sounds/tone_mi.mp3" },
    { name: "ファ", image: "assets/images/tone_fa.png", sound: "assets/sounds/tone_fa.mp3" },
    { name: "ソ", image: "assets/images/tone_so.png", sound: "assets/sounds/tone_so.mp3" },
    { name: "ラ", image: "assets/images/tone_ra.png", sound: "assets/sounds/tone_ra.mp3" },
    { name: "シ", image: "assets/images/tone_shi.png", sound: "assets/sounds/tone_shi.mp3" }
];
// ヘ音記号モード用
const notes_heon = [
    { name: "ド", image: "assets/images/heon_do.png", sound: "assets/sounds/tone_do.mp3" },
    { name: "レ", image: "assets/images/heon_re.png", sound: "assets/sounds/tone_re.mp3" },
    { name: "ミ", image: "assets/images/heon_mi.png", sound: "assets/sounds/tone_mi.mp3" },
    { name: "ファ", image: "assets/images/heon_fa.png", sound: "assets/sounds/tone_fa.mp3" },
    { name: "ソ", image: "assets/images/heon_so.png", sound: "assets/sounds/tone_so.mp3" },
    { name: "ラ", image: "assets/images/heon_ra.png", sound: "assets/sounds/tone_ra.mp3" },
    { name: "シ", image: "assets/images/heon_shi.png", sound: "assets/sounds/tone_shi.mp3" }
];

// 現在のモードに応じて出題するnotes配列を返す
function getCurrentNotes() {
    const mode = document.querySelector('input[name="mode"]:checked').value;
    return mode === "heon" ? notes_heon : notes_tone;
}

let currentNote = null;
let remainingAnswers = 4; // 残り正解数を追跡
let timeLeft = 15; // タイムアタックの制限時間（秒）
let timer;

// テキスト要素の内容を更新するユーティリティ関数
function updateElementText(id, text) {
    document.getElementById(id).textContent = text;
}

// 要素の表示・非表示を切り替えるユーティリティ関数
function toggleElementVisibility(id, isVisible) {
    const element = document.getElementById(id);
    element.style.display = isVisible ? "block" : "none";
}

// ページ全体の背景色を変更するユーティリティ関数
function setBackgroundColor(color) {
    document.body.style.backgroundColor = color;
}

// 複数の要素の表示・非表示をまとめて切り替えるユーティリティ関数
function toggleElementsVisibility(ids, isVisible) {
    ids.forEach(id => toggleElementVisibility(id, isVisible));
}

// アクションボタン（もういちど/つぎ）を表示・非表示切り替え
function showActionButtons(showRetry, showNext) {
    toggleElementsVisibility(["retryButton", "nextButton"], false);
    if (showRetry) toggleElementVisibility("retryButton", true);
    if (showNext) toggleElementVisibility("nextButton", true);
}

// ランダムな音符データを取得
function getRandomNote() {
    const notes = getCurrentNotes();
    return notes[Math.floor(Math.random() * notes.length)];
}

// 新しい問題（音符画像）を表示
function loadNewNote() {
    currentNote = getRandomNote();
    console.log("New note loaded:", currentNote); // デバッグ用
    document.getElementById("noteImage").src = currentNote.image;
    console.log("Note image updated to:", currentNote.image); // デバッグ用
    updateElementText("result", "");
    document.activeElement.blur(); // フォーカスを外す
}

// 残り正解回数の表示を更新
function updateRemainingAnswers() {
    updateElementText("remaining", `${remainingAnswers}かい`);
}

// ドレミファソラシドのボタンを有効/無効にする
function setChoiceButtonsDisabled(disabled) {
    document.querySelectorAll(".choices button").forEach(button => {
        button.disabled = disabled;
    });
}

// ゲームの状態（残り回数・タイマー）を初期化
function resetGameState() {
    remainingAnswers = 4;
    timeLeft = 15;
    updateRemainingAnswers();
    updateElementText("timer", `のこりじかん: ${timeLeft}秒`);
}

// 初期画面に戻す（画像・ボタン・タイマー・回数リセット）
function resetToInitialScreen() {
    document.getElementById("noteImage").src = "assets/images/quiz.png";
    setChoiceButtonsDisabled(true);
    toggleElementVisibility("startButton", true);
    // モード切り替えを再度有効化
    document.querySelectorAll('input[name="mode"]').forEach(r => r.disabled = false);
    resetGameState();
    clearInterval(timer); // タイマー停止
}

// ゲーム中の画面をリセット（背景色・ボタン有効化）
function resetGameVisuals() {
    setBackgroundColor("");
    setChoiceButtonsDisabled(false);
}

// ゲームを完全リセットして新しい問題を出す
function resetGame() {
    resetGameState();
    resetGameVisuals();
    loadNewNote();
    startTimer();
}

// 「もういちど」「つぎのもんだいへ」ボタンの処理
function handleRetryOrNext(isRetry) {
    toggleElementVisibility("actionButtons", false);
    resetGameVisuals();
    if (!isRetry) loadNewNote();
}

// 音符ボタンが押されたときの処理
function handleButtonClick(e) {
    const target = e.currentTarget;
    const userChoice = target.getAttribute("data-note").trim();
    console.log("User choice:", userChoice); // デバッグ用
    console.log("Current note:", currentNote.name); // デバッグ用

    if (userChoice === currentNote.name) {
        setBackgroundColor("#d4edda"); // 正解時の背景色
        toggleElementVisibility("actionButtons", true);
        showActionButtons(false, true);
        remainingAnswers--;
        updateRemainingAnswers();
        checkWinCondition();
    } else {
        setBackgroundColor("#f8d7da"); // 不正解時の背景色
        toggleElementVisibility("actionButtons", true);
        showActionButtons(true, false);
    }
    setChoiceButtonsDisabled(true);
}

// 残り回数が0になったときの勝利判定
function checkWinCondition() {
    if (remainingAnswers <= 0) {
        clearInterval(timer); // タイマー停止
        setChoiceButtonsDisabled(true);
        toggleElementVisibility("actionButtons", false);
        // お祝いメッセージ表示
        const celebration = document.getElementById("celebration");
        celebration.style.display = "block";
        setTimeout(() => {
            celebration.style.display = "none";
            resetToInitialScreen();
        }, 5000);
    }
}

// ゲームオーバー時の処理
function endGame() {
    setChoiceButtonsDisabled(true);
    toggleElementVisibility("actionButtons", false);
    // ゲームオーバーメッセージ表示
    const celebration = document.getElementById("celebration");
    celebration.classList.add("skull");
    celebration.innerHTML = '<img src="assets/images/skull.png" alt="どくろ"><h2>ゲームオーバー</h2>';
    celebration.style.display = "block";
    setTimeout(() => {
        celebration.style.display = "none";
        celebration.classList.remove("skull");
        resetToInitialScreen();
    }, 5000);
}

// タイマー開始
function startTimer() {
    timeLeft = 15;
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

// イベントリスナー登録
// 音符ボタン
document.querySelectorAll(".choices button").forEach(button => {
    button.addEventListener("click", handleButtonClick);
});

// アクションボタン
document.getElementById("retryButton").addEventListener("click", () => handleRetryOrNext(true));
document.getElementById("nextButton").addEventListener("click", () => handleRetryOrNext(false));

document.getElementById("startButton").addEventListener("click", () => {
    // ゲーム中はモード切り替え不可
    document.querySelectorAll('input[name="mode"]').forEach(r => r.disabled = true);
    toggleElementVisibility("startButton", false); // スタートボタン非表示
    setChoiceButtonsDisabled(false); // 選択ボタン有効化
    loadNewNote(); // 最初の問題を読み込み
    startTimer(); // タイマー開始
    updateRemainingAnswers(); // 残り正解数表示を更新
});

// 初期状態で選択ボタンを無効化
setChoiceButtonsDisabled(true);