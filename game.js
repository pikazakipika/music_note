const notes = [
    { name: "ド", image: "assets/images/do.png", sound: "assets/sounds/do.mp3" },
    { name: "レ", image: "assets/images/re.png", sound: "assets/sounds/re.mp3" },
    { name: "ミ", image: "assets/images/mi.png", sound: "assets/sounds/mi.mp3" },
    { name: "ファ", image: "assets/images/fa.png", sound: "assets/sounds/fa.mp3" },
];

let currentNote = null;
let score = 0;

function getRandomNote() {
    const note = notes[Math.floor(Math.random() * notes.length)];
    console.log("Random note selected:", note); // デバッグ用ログ
    return note;
}

function loadNewNote() {
    currentNote = getRandomNote();
    console.log("New note loaded:", currentNote); // デバッグ用ログ
    const noteImage = document.getElementById("noteImage");
    noteImage.src = currentNote.image;
    console.log("Note image updated to:", noteImage.src); // UI更新確認用ログ
    document.getElementById("result").textContent = "";
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

document.getElementById("playSound").addEventListener("click", playSound);

document.querySelectorAll(".choices button").forEach(button => {
    const newButton = button.cloneNode(true); // ボタンをクローンしてリスナーをリセット
    button.parentNode.replaceChild(newButton, button);
    newButton.addEventListener("click", (e) => {
        const target = e.currentTarget; // イベントリスナーが登録されたボタンを取得
        const userChoice = target.getAttribute("data-note").trim();
        const resultElement = document.getElementById("result");
        if (userChoice === currentNote.name) {
            resultElement.textContent = "せいかいだよ！いいね！";
            resultElement.style.color = "#28a745"; // 緑色
            document.body.style.backgroundColor = "#d4edda"; // 背景緑色
            score++;
        } else {
            resultElement.textContent = "ちがうよ、もういちど！";
            resultElement.style.color = "#dc3545"; // 赤色
            document.body.style.backgroundColor = "#f8d7da"; // 背景赤色
        }
        updateScore();
        setTimeout(() => {
            document.body.style.backgroundColor = ""; // 元の色に戻す
            resultElement.style.color = "#333"; // デフォルト色に戻す
            loadNewNote();
        }, 1000);
    });
});

// 初期化
loadNewNote();