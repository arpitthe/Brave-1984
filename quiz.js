const quizQuestions = [
  {
    question: "How do you handle stress?",
    options: [
      { text: "Take a pill or distraction (soma, entertainment)", character: "Lenina" },
      { text: "Question the system and seek truth", character: "Winston" },
      { text: "Embrace suffering as part of life", character: "John" },
      { text: "Control others to regain power", character: "O’Brien" }
    ]
  },
  {
    question: "What’s your view on government?",
    options: [
      { text: "It keeps society stable, even if restrictive", character: "Lenina" },
      { text: "It’s corrupt and must be resisted", character: "Winston" },
      { text: "It destroys human spirit", character: "John" },
      { text: "It must rule with absolute power", character: "O’Brien" }
    ]
  },
  // Add 3-5 more questions...
];

let userAnswers = [];

function startQuiz() {
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("quiz-screen").style.display = "block";
  loadQuestion(0);
}

function loadQuestion(index) {
  const question = quizQuestions[index];
  document.getElementById("question").textContent = question.question;

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  question.options.forEach((option, i) => {
    const button = document.createElement("button");
    button.textContent = option.text;
    button.onclick = () => selectOption(index, option.character);
    optionsDiv.appendChild(button);
  });
}

function selectOption(qIndex, character) {
  userAnswers.push(character);

  if (qIndex < quizQuestions.length - 1) {
    loadQuestion(qIndex + 1);
  } else {
    showResult();
  }
}

function showResult() {
  const result = tallyResults();
  document.getElementById("quiz-screen").style.display = "none";
  document.getElementById("result-screen").style.display = "block";
  document.getElementById("result").textContent = `You are most like: ${result}`;
}

function tallyResults() {
  const counts = {};
  userAnswers.forEach(char => counts[char] = (counts[char] || 0) + 1);
  return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
}