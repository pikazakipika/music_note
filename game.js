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
let score = 0;

function getRandomNote() {
    return notes[Math.floor(Math.random() * notes.length)];
}

function loadNewNote() {
    currentNote = getRandomNote();
    console.log("New note loaded:", currentNote); // デバッグ用ログ
    const noteImage = document.getElementById("noteImage");
    noteImage.src = currentNote.image;
    console.log("Note image updated to:", noteImage.src); // UI更新確認用ログ
    document.getElementById("result").textContent = "";

    // フォーカスを外す
    document.activeElement.blur();
}

function playSound() {
    if (currentNote) {
        const audio = new Audio(currentNote.sound);
        audio.play();
    }
}

function updateScore() {
    document.getElementById("score").textContent = score;
}

function showToast(message, color) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.style.backgroundColor = color;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}

document.getElementById("playSound").addEventListener("click", playSound);

document.querySelectorAll(".choices button").forEach(button => {
    button.addEventListener("click", (e) => {
        const target = e.currentTarget; // イベントリスナーが登録されたボタンを取得
        const userChoice = target.getAttribute("data-note").trim();
        console.log("User choice:", userChoice); // デバッグ用ログ
        console.log("Current note:", currentNote.name); // デバッグ用ログ

        const resultElement = document.getElementById("result");
        if (userChoice === currentNote.name) {
            showToast("せいかいだよ！いいね！", "#28a745"); // 緑色のトースト通知
            document.body.style.backgroundColor = "#d4edda"; // 背景緑色
            score++;
        } else {
            showToast("ちがうよ、もういちど！", "#dc3545"); // 赤色のトースト通知
            document.body.style.backgroundColor = "#f8d7da"; // 背景赤色
        }
        updateScore();
        setTimeout(() => {
            document.body.style.backgroundColor = ""; // 元の色に戻す
            loadNewNote();
        }, 1000);
    });
});

// 初期化
loadNewNote();