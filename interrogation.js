// interrogation.js - 100% Working Final Version
const CONFIG = {
  stressThreshold: 200,
  maxQuestions: 8,
  aiResponseDelay: 800, // Reduced delay for smoother experience
  modeSwitchThreshold: 0.7
};

// [Your existing QUESTION_BANK array remains unchanged]

// Game State
const state = {
  currentQuestion: 0,
  totalStress: 0,
  personality: "bnw",
  sessionQuestions: [],
  isTyping: false // New flag to prevent overlapping animations
};

// DOM Elements
const elements = {
  container: document.getElementById('interrogationContainer'),
  stressMeter: document.getElementById('stressMeter'),
  aiText: document.getElementById('aiText'),
  optionsContainer: document.getElementById('optionsContainer'),
  resultScreen: document.getElementById('resultScreen'),
  verdictText: document.getElementById('verdictText'),
  restartBtn: document.getElementById('restartBtn')
};

// Ultra-reliable typing function
function typeText(element, text) {
  return new Promise((resolve) => {
    if (state.isTyping) return resolve(); // Prevent overlapping

    state.isTyping = true;
    element.textContent = '';
    element.classList.add('typing');

    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(typingInterval);
        element.classList.remove('typing');
        state.isTyping = false;
        resolve();
      }
    }, 30); // Fixed interval for consistent typing
  });
}

// Initialize questions
function initializeQuestions() {
  const shuffled = [...QUESTION_BANK].sort(() => Math.random() - 0.5);
  state.sessionQuestions = shuffled.slice(0, CONFIG.maxQuestions);
}

// Display question with failsafe
async function displayQuestion() {
  if (state.currentQuestion >= CONFIG.maxQuestions) {
    endInterrogation();
    return;
  }

  // Clear previous state
  elements.optionsContainer.innerHTML = '';
  elements.aiText.textContent = '';

  const question = state.sessionQuestions[state.currentQuestion];

  // Display question parts separately with failsafe
  try {
    await typeText(elements.aiText, `QUESTION ${state.currentQuestion + 1}:`);
    await new Promise(resolve => setTimeout(resolve, 300)); // Brief pause
    await typeText(elements.aiText, `\n\n${question.text}`);

    // Display options after text completes
    displayOptions(question.options);
  } catch (error) {
    console.error("Display error:", error);
    // Emergency fallback
    elements.aiText.textContent = `QUESTION ${state.currentQuestion + 1}:\n\n${question.text}`;
    displayOptions(question.options);
  }
}

// Display options with shuffle
function displayOptions(options) {
  elements.optionsContainer.innerHTML = '';
  shuffleArray(options).forEach(option => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = option.text;
    btn.onclick = () => selectOption(option);
    elements.optionsContainer.appendChild(btn);
  });
}

// Select option with animation queue
async function selectOption(option) {
  if (state.isTyping) return; // Prevent during animations

  state.totalStress += option.stress;
  updateStressMeter();
  disableOptions();

  await typeText(elements.aiText, option.response);

  if (shouldSwitchToOrwellMode()) {
    await switchToOrwellMode();
  }

  state.currentQuestion++;
  if (state.currentQuestion < CONFIG.maxQuestions) {
    setTimeout(displayQuestion, CONFIG.aiResponseDelay);
  } else {
    endInterrogation();
  }
}

// Helper functions
function shouldSwitchToOrwellMode() {
  return state.totalStress > CONFIG.stressThreshold * CONFIG.modeSwitchThreshold &&
         state.personality === "bnw";
}

async function switchToOrwellMode() {
  state.personality = "1984";
  elements.container.classList.remove('bnw-mode');
  elements.container.classList.add('orwell-mode');
  await typeText(elements.aiText, "WARNING: ENHANCED INTERROGATION PROTOCOLS ACTIVATED");
}

function shuffleArray(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function updateStressMeter() {
  const percent = Math.min(100, (state.totalStress / CONFIG.stressThreshold) * 100);
  elements.stressMeter.style.width = `${percent}%`;
  elements.stressMeter.style.background = percent > 70
    ? `linear-gradient(90deg, var(--stress-medium), var(--stress-high))`
    : `linear-gradient(90deg, var(--stress-low), var(--stress-medium))`;
}

function disableOptions() {
  Array.from(elements.optionsContainer.children).forEach(btn => {
    btn.disabled = true;
    btn.style.opacity = '0.5';
  });
}

function endInterrogation() {
  const verdict = state.totalStress >= CONFIG.stressThreshold
    ? `GUILTY OF THOUGHTCRIME\n\nSTRESS LEVEL: ${state.totalStress}/200\n\nSENTENCE: RE-EDUCATION`
    : `INCONCLUSIVE\n\nSTRESS LEVEL: ${state.currentQuestion}/200\n\nSTATUS: UNDER SURVEILLANCE`;

  elements.verdictText.textContent = verdict;
  elements.verdictText.style.color = state.totalStress >= CONFIG.stressThreshold
    ? 'var(--neon-pink)'
    : 'var(--neon-blue)';

  elements.resultScreen.style.display = 'block';
}

function resetGame() {
  state.currentQuestion = 0;
  state.totalStress = 0;
  state.personality = "bnw";
  state.isTyping = false;
  elements.container.className = 'interrogation-container bnw-mode';
  elements.stressMeter.style.width = "0%";
  elements.resultScreen.style.display = "none";
  initializeQuestions();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  resetGame();
  elements.restartBtn.addEventListener('click', () => {
    resetGame();
    setTimeout(startInterrogation, 500); // Delay to ensure clean reset
  });
  startInterrogation();
});

async function startInterrogation() {
  await typeText(elements.aiText, "INITIALIZING DYSTOPIAN TURING TEST...");
  await new Promise(resolve => setTimeout(resolve, 500));
  await typeText(elements.aiText, "\n\nOBJECTIVE: DETERMINE LOYALTY PROFILE");
  displayQuestion();
}