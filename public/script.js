const input = document.querySelector("#input-text");
const canvas = document.querySelector(".game-container");
const resetBtn = document.querySelector(".reset-btn");
const c = canvas.getContext("2d");
const url = "https://api.dicionario-aberto.net/random";
const numberWords = 50;
const wordsFetch = [];
const words = [];
let isRunning = true;
let intervalID;

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

class Word {
    constructor(value, x, y, velocity) {
        this.value = value;
        this.x = x;
        this.y = y;
        this.velocity = velocity;
    }

    draw() {
        c.save();
        c.fillStyle = "black";
        c.font = "50px arial";
        c.fillText(this.value, this.x, this.y);
        c.restore();
    }

    update() {
        this.draw();
        this.x += this.velocity;
    }
}

async function fetchData() {
    for (let i = 0; i < numberWords; i++) {
        const data = await fetch(url);
        const dataJson = await data.json();

        wordsFetch.push(dataJson.word);
    }
}

document.addEventListener("keydown", (e) => {
    if (e.key === "Backspace") {
        input.value = input.value.slice(0, input.value.length - 1);
    } else if (e.key === "Enter") {
        if (input.value === words[0]?.value) {
            words.shift(); // Remove a palavra se estiver correta
        }
        input.value = ""; // Limpa o input
    } else if (e.key.length === 1) {
        input.value += e.key;
    }
});

function spawnWord() {
    intervalID = setInterval(() => {
        if (wordsFetch.length > 0) {
            words.push(new Word(wordsFetch[0], -300, Math.random() * (canvas.height - 50), 4));
            wordsFetch.shift();
        }
    }, 3000);
}

let animationID;

function animate() {
    animationID = requestAnimationFrame(animate);
    c.fillStyle = "white";
    c.fillRect(0, 0, canvas.width, canvas.height); // Limpa o canvas a cada frame

    words.forEach(word => {
        if (word.x >= canvas.width) {
            cancelAnimationFrame(animationID); // Para a animação se a palavra sair da tela
            clearInterval(intervalID);
            isRunning = false;
            alert("Game Over! Você perdeu.");
        }
        word.update(); // Atualiza a posição da palavra
    });
}

resetBtn.addEventListener("click", () => {
    if (!isRunning) {
        startGame(); // Reinicia o jogo
    }
});

async function startGame() {
    words.length = 0; // Limpa as palavras atuais
    wordsFetch.length = 0; // Limpa as palavras a serem buscadas
    input.value = ""; // Limpa o input
    isRunning = true;
    await fetchData(); // Aguarda o carregamento das palavras
    animate();
    spawnWord();
}

// Começa o jogo
startGame();
