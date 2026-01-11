let amount = 5;
let difficulty = "medium";
let questions = [];
let index = 0;
let score = 0;
let timer;
let timeLeft = 15;

/* Difficulty slider (LOGIC ONLY) */
const range = document.getElementById("difficultyRange");

range.addEventListener("input", () => {
  if (range.value == 0) difficulty = "easy";
  if (range.value == 1) difficulty = "medium";
  if (range.value == 2) difficulty = "hard";
});

/* Question count */
function setAmount(val, btn) {
  amount = val;
  document.querySelectorAll(".q-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
}

/* Start quiz */
function startQuiz() {
  const subject = document.getElementById("subject").value;
  const timed = document.getElementById("timed").checked;

  fetch(`https://opentdb.com/api.php?amount=${amount}&category=${subject}&difficulty=${difficulty}&type=multiple`)
    .then(res => res.json())
    .then(data => {
      questions = data.results;
      index = 0;
      score = 0;

      document.getElementById("settings").classList.add("d-none");
      document.getElementById("quiz").classList.remove("d-none");
      loadQuestion(timed);
    });
}

/* Load question */
function loadQuestion(timed) {
  if (index >= questions.length) return showResult();

  const q = questions[index];

  document.getElementById("progress").innerText =
    `Question ${index + 1} / ${questions.length}`;

  document.getElementById("question").innerHTML = q.question;

  const options = [...q.incorrect_answers, q.correct_answer]
    .sort(() => Math.random() - 0.5);

  const optDiv = document.getElementById("options");
  optDiv.innerHTML = "";

  options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "btn btn-outline-primary w-100 mb-2";
    btn.innerHTML = opt;
    btn.onclick = () => {
      if (opt === q.correct_answer) score++;
      clearInterval(timer);
      index++;
      loadQuestion(timed);
    };
    optDiv.appendChild(btn);
  });

  if (timed) startTimer(timed);
}

/* Timer */
function startTimer(timed) {
  clearInterval(timer);
  timeLeft = 15;
  document.getElementById("timer").innerText = `⏱ ${timeLeft}s`;

  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").innerText = `⏱ ${timeLeft}s`;

    if (timeLeft === 0) {
      clearInterval(timer);
      index++;
      loadQuestion(timed);
    }
  }, 1000);
}

/* Result */
function showResult() {
  document.getElementById("quiz").classList.add("d-none");
  document.getElementById("result").classList.remove("d-none");

  document.getElementById("finalScore").innerText =
    `You scored ${score} / ${questions.length}`;
}
