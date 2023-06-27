const startButton = document.getElementById('start');
const questionElement = document.getElementById('question');
const choicesElement = document.getElementById('choices');
const timeElement = document.getElementById('time');
const resultElement = document.getElementById('result');
const scoresElement = document.getElementById('scores');
const initialsForm = document.getElementById('initialsForm');
const initialsInput = document.getElementById('initials');
// Time limit and score
let currentQuestionIndex = 0;
let time = 60;
let timerInterval;
let score = 0;

//  the quiz questions with the answers
const questions  = [
  {
    question: 'How many pistol rounds are in CSGO',
    choices: ['1', '2', '3'],
    correctAnswer: '2'
  },
  {
    question: 'What is the best turnstile album?',
    choices: ['Glown on', 'Time + Space', 'Nonstop Feeling'],
    correctAnswer: 'Time + Space'
  },
  {
    question: 'What color is the sky?',
    choices: ['orange', 'blue', 'red'],
    correctAnswer: 'blue'
  },
 {
  question: 'what is  2 + 2',
  choices: ['4', '5', '6'],
  correctAnswer: '4'
 }
];

startButton.addEventListener('click', startQuiz);
initialsForm.addEventListener('submit', saveScore);
// function for when the quiz starts, the timer stars too
function startQuiz() {
  startButton.disabled = true;
  startTimer();
  displayQuestion();
}

function startTimer() {
  timerInterval = setInterval(function() {
    time--;
    timeElement.textContent = time;

    if (time <= 0) {
      endQuiz();
    }
  }, 1000);
}

function displayQuestion() {
  const question = questions[currentQuestionIndex];
  questionElement.textContent = question.question;
  choicesElement.innerHTML = '';

  question.choices.forEach(function(choice) {
    const button = document.createElement('button');
    button.textContent = choice;
    button.addEventListener('click', function() {
      checkAnswer(choice, question.correctAnswer);
    });
    choicesElement.appendChild(button);
  });
}

function checkAnswer(choice, correctAnswer) {
  if (choice === correctAnswer) {
    score++;
    resultElement.textContent = 'Correct!';
  } else {
    time -= 10; // when selected wrong answer time is subtracted by 10 seconds
    if (time < 0) {
      time = 0;
    }
    resultElement.textContent = 'Wrong!';
  }

  currentQuestionIndex++;

  if (currentQuestionIndex < questions.length) {
    displayQuestion();
  } else {
    endQuiz();
  }
}

function endQuiz() {
  clearInterval(timerInterval);
  questionElement.textContent = 'Quiz Over';
  choicesElement.innerHTML = '';
  resultElement.textContent = '';

  // Display the final score that the user taking the quiz gets
  const scoreText = `Final Score: ${score}`;
  resultElement.textContent = scoreText;

  // Show the scoreboard and previous user scores
  document.getElementById('scoreboard').style.display = 'block';
  displayScores();
}

function displayScores() {
  scoresElement.innerHTML = '';

  // gets the previous scores and then uploads them when a new user takes quiz
  const scores = JSON.parse(localStorage.getItem('scores')) || [];

  scores.forEach(function(score) {
    const li = document.createElement('li');
    li.textContent = `${score.initials}: ${score.score}`;
    scoresElement.appendChild(li);
  });
}

function saveScore(event) {
  event.preventDefault();
  const initials = initialsInput.value.trim();

  if (initials !== '') {
    // Save the current score
    const scoreData = { initials, score };
    const scores = JSON.parse(localStorage.getItem('scores')) || [];
    scores.push(scoreData);
    localStorage.setItem('scores', JSON.stringify(scores));

    // Display updated scores
    displayScores();

    // Clear the initials input
    initialsInput.value = '';
  }
}
