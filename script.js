// ==================== CONFIGURATION ====================
const CONFIG = {
  particleCount: 50,
  starCount: 100,
  heartInterval: 400,
  typingSpeed: 50
};

// ==================== STATE MANAGEMENT ====================
let currentSection = 0;
let isTyping = false;
let musicPlaying = false;

// Memory Game State
let memoryCards = [];
let flippedCards = [];
let matchedPairs = 0;
let memoryMoves = 0;
let memoryTimer = 0;
let memoryInterval = null;

// Quiz State
let quizScore = 0;
let currentQuizQuestion = 0;

// Puzzle State
let puzzleBoard = [];
let emptyIndex = 8;
let puzzleMoves = 0;
let puzzleTimer = 0;
let puzzleInterval = null;

// ==================== MEMORY GAME DATA ====================
const memoryGameData = [
  { id: 1, image: './image1.jpeg', text: 'First Story', pair: 'date1' },
  { id: 2, image: './image1.jpeg', text: 'Oct 13, 2023', pair: 'date1' },
  { id: 3, image: './image2.jpeg', text: 'Proposal', pair: 'date2' },
  { id: 4, image: './image2.jpeg', text: 'Jan 11, 2024', pair: 'date2' },
  { id: 5, image: './image3.jpeg', text: 'First Kiss', pair: 'date3' },
  { id: 6, image: './image3.jpeg', text: 'Nov 27, 2023', pair: 'date3' }
];

// ==================== QUIZ DATA ====================
const quizQuestions = [
  {
    question: "What was the first thing I noticed about you?",
    options: ["Your smile", "Your eyes", "Your Face", "Your kindness"],
    correct: 0
  },
  {
    question: "What's our favorite activity to do together?",
    options: ["Watching movies", "Cooking together", "Going for walks", "Playing games"],
    correct: 1
  },
  {
    question: "What do I love most about you?",
    options: ["Your beauty", "Your heart", "Your intelligence", "Everything"],
    correct: 3
  },
  {
    question: "What's our song?",
    options: ["Perfect", "All of Me", "Thinking Out Loud", "A Thousand Years"],
    correct: 2
  },
  {
    question: "How do you make me feel?",
    options: ["Happy", "Loved", "Complete", "All of the above"],
    correct: 3
  }
];

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
  initWelcomeScreen();
  initParticles();
  initStars();
  initFloatingHearts();
  initScrollEffects();
  initMemoryGame();
  initQuiz();
  initPuzzleGame();
  initMusicControl();       // ← Added proper music initialization
});

// ==================== WELCOME SCREEN ====================
function initWelcomeScreen() {
  const enterBtn = document.getElementById('enterBtn');
  const welcomeScreen = document.getElementById('welcomeScreen');
  const mainContent = document.getElementById('mainContent');
  
  enterBtn.addEventListener('click', () => {
    welcomeScreen.style.opacity = '0';
    
    setTimeout(() => {
      welcomeScreen.style.display = 'none';
      mainContent.classList.remove('hidden');
      startTypingAnimation();
      // No automatic music start here anymore
    }, 1000);
  });
}

// ==================== MUSIC CONTROL ====================
function initMusicControl() {
  const bgMusic = document.getElementById('bgMusic');
  const musicToggle = document.getElementById('musicToggle');

  if (!bgMusic || !musicToggle) return;

  bgMusic.volume = 0.3;
  
  // Start in muted/off state
  musicToggle.innerHTML = '<span class="music-icon">🔇</span>';
  musicPlaying = false;

  musicToggle.addEventListener('click', () => {
    if (bgMusic.paused) {
      bgMusic.play().then(() => {
        musicToggle.innerHTML = '<span class="music-icon">🎵</span>';
        musicPlaying = true;
      }).catch(err => {
        console.log("Playback failed:", err);
      });
    } else {
      bgMusic.pause();
      musicToggle.innerHTML = '<span class="music-icon">🔇</span>';
      musicPlaying = false;
    }
  });
}

// ==================== PARTICLE SYSTEM ====================
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const particles = [];
  
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 3 + 1;
      this.speedX = Math.random() * 0.5 - 0.25;
      this.speedY = Math.random() * 0.5 - 0.25;
      this.opacity = Math.random() * 0.5 + 0.2;
    }
    
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      
      if (this.x > canvas.width) this.x = 0;
      if (this.x < 0) this.x = canvas.width;
      if (this.y > canvas.height) this.y = 0;
      if (this.y < 0) this.y = canvas.height;
    }
    
    draw() {
      ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  for (let i = 0; i < CONFIG.particleCount; i++) {
    particles.push(new Particle());
  }
  
  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });
    
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance / 100)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    
    requestAnimationFrame(animateParticles);
  }
  
  animateParticles();
  
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// ==================== STARS BACKGROUND ====================
function initStars() {
  const starsContainer = document.getElementById('stars');
  
  for (let i = 0; i < CONFIG.starCount; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.animationDelay = Math.random() * 3 + 's';
    star.style.animationDuration = (Math.random() * 2 + 2) + 's';
    starsContainer.appendChild(star);
  }
}

// ==================== FLOATING HEARTS ====================
function initFloatingHearts() {
  const container = document.getElementById('floatingHearts');
  
  function createHeart() {
    const heart = document.createElement('div');
    const hearts = ['❤️', '💕', '💖', '💗', '💓', '💝'];
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.className = 'floating-heart';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = (Math.random() * 3 + 5) + 's';
    heart.style.fontSize = (Math.random() * 15 + 20) + 'px';
    
    container.appendChild(heart);
    
    setTimeout(() => {
      heart.remove();
    }, 8000);
  }
  
  setInterval(createHeart, CONFIG.heartInterval);
}

// ==================== SCROLL EFFECTS ====================
function initScrollEffects() {
  const progressBar = document.getElementById('progressBar');
  const navDots = document.querySelectorAll('.nav-dot');
  
  window.addEventListener('scroll', () => {
    // Update progress bar
    const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    progressBar.style.width = scrollPercent + '%';
    
    // Update active nav dot
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
        navDots.forEach(dot => dot.classList.remove('active'));
        navDots[index].classList.add('active');
      }
    });
  });
  
  // Smooth scroll for nav dots
  navDots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = dot.getAttribute('data-section');
      document.getElementById(targetId).scrollIntoView({ behavior: 'smooth' });
    });
  });
}

// ==================== TYPING ANIMATION ====================
function startTypingAnimation() {
  const text = `When I had nothing, you gave me everything.
Not just love — but strength, patience, and belief.
You are my answered prayer. 🙏`;
  
  typeText('loveText1', text, CONFIG.typingSpeed);
}

function typeText(elementId, text, speed) {
  if (isTyping) return;
  
  const element = document.getElementById(elementId);
  element.innerHTML = '';
  let index = 0;
  isTyping = true;
  
  function type() {
    if (index < text.length) {
      const char = text.charAt(index);
      element.innerHTML += char === '\n' ? '<br>' : char;
      index++;
      setTimeout(type, speed);
    } else {
      isTyping = false;
    }
  }
  
  type();
}

// ==================== MEMORY MATCHING GAME ====================
function initMemoryGame() {
  const gameContainer = document.getElementById('memoryGame');
  const resetBtn = document.getElementById('resetMemoryGame');
  
  resetBtn.addEventListener('click', resetMemoryGame);
  
  resetMemoryGame();
}

function resetMemoryGame() {
  const gameContainer = document.getElementById('memoryGame');
  gameContainer.innerHTML = '';
  
  memoryCards = [...memoryGameData, ...memoryGameData].sort(() => Math.random() - 0.5);
  flippedCards = [];
  matchedPairs = 0;
  memoryMoves = 0;
  memoryTimer = 0;
  
  document.getElementById('matchMoves').textContent = '0';
  document.getElementById('matchPairs').textContent = '0/8';
  document.getElementById('matchTime').textContent = '0:00';
  document.getElementById('gameWinMessage').classList.add('hidden');
  
  if (memoryInterval) clearInterval(memoryInterval);
  memoryInterval = setInterval(updateMemoryTimer, 1000);
  
  memoryCards.forEach((card, index) => {
    const cardElement = document.createElement('div');
    cardElement.className = 'memory-card';
    cardElement.dataset.pair = card.pair;
    cardElement.dataset.index = index;
    
    cardElement.innerHTML = `
      <div class="card-inner">
        <div class="card-front">💝</div>
        <div class="card-back">
       <img src="${card.image}" alt="${card.text}" class="card-image" style="width: 100%; height: 100%; object-fit: cover;">
          <div class="card-text">${card.text}</div>
        </div>
      </div>
    `;
    
    cardElement.addEventListener('click', () => flipCard(cardElement, index));
    gameContainer.appendChild(cardElement);
  });
}

function flipCard(cardElement, index) {
  if (flippedCards.length >= 2 || cardElement.classList.contains('flipped') || cardElement.classList.contains('matched')) {
    return;
  }
  
  cardElement.classList.add('flipped');
  flippedCards.push({ element: cardElement, index: index, pair: cardElement.dataset.pair });
  
  if (flippedCards.length === 2) {
    memoryMoves++;
    document.getElementById('matchMoves').textContent = memoryMoves;
    
    setTimeout(checkMatch, 800);
  }
}

function checkMatch() {
  const [card1, card2] = flippedCards;
  
  if (card1.pair === card2.pair && card1.index !== card2.index) {
    card1.element.classList.add('matched');
    card2.element.classList.add('matched');
    matchedPairs++;
    document.getElementById('matchPairs').textContent = `${matchedPairs}/8`;
    
    if (matchedPairs === 8) {
      clearInterval(memoryInterval);
      setTimeout(() => {
        document.getElementById('gameWinMessage').classList.remove('hidden');
        createCelebrationFireworks();
      }, 500);
    }
  } else {
    card1.element.classList.remove('flipped');
    card2.element.classList.remove('flipped');
  }
  
  flippedCards = [];
}

function updateMemoryTimer() {
  memoryTimer++;
  const minutes = Math.floor(memoryTimer / 60);
  const seconds = memoryTimer % 60;
  document.getElementById('matchTime').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// ==================== LOVE QUIZ GAME ====================
function initQuiz() {
  displayQuiz();
  
  document.getElementById('retryQuiz').addEventListener('click', () => {
    quizScore = 0;
    currentQuizQuestion = 0;
    document.getElementById('quizResult').classList.add('hidden');
    displayQuiz();
  });
}

function displayQuiz() {
  const container = document.getElementById('quizContainer');
  container.innerHTML = '';
  
  quizQuestions.forEach((q, qIndex) => {
    const questionDiv = document.createElement('div');
    questionDiv.className = 'quiz-question';
    questionDiv.style.animationDelay = `${qIndex * 0.1}s`;
    
    let optionsHTML = '<div class="quiz-options">';
    q.options.forEach((option, oIndex) => {
      optionsHTML += `
        <div class="quiz-option" data-question="${qIndex}" data-option="${oIndex}">
          ${option}
        </div>
      `;
    });
    optionsHTML += '</div>';
    
    questionDiv.innerHTML = `
      <h3>Question ${qIndex + 1}</h3>
      <p class="text-white/90 mb-4">${q.question}</p>
      ${optionsHTML}
    `;
    
    container.appendChild(questionDiv);
  });
  
  const options = document.querySelectorAll('.quiz-option');
  options.forEach(option => {
    option.addEventListener('click', handleQuizAnswer);
  });
}

function handleQuizAnswer(e) {
  const questionIndex = parseInt(e.target.dataset.question);
  const optionIndex = parseInt(e.target.dataset.option);
  const question = quizQuestions[questionIndex];
  
  const allOptions = document.querySelectorAll(`[data-question="${questionIndex}"]`);
  allOptions.forEach(opt => {
    opt.style.pointerEvents = 'none';
    if (parseInt(opt.dataset.option) === question.correct) {
      opt.classList.add('correct');
    }
  });
  
  e.target.classList.add('selected');
  
  if (optionIndex === question.correct) {
    quizScore++;
  } else {
    e.target.classList.add('incorrect');
  }
  
  const answeredAll = document.querySelectorAll('.quiz-option.selected').length === quizQuestions.length;
  
  if (answeredAll) {
    setTimeout(showQuizResults, 1000);
  }
}

function showQuizResults() {
  document.getElementById('quizContainer').style.display = 'none';
  document.getElementById('quizResult').classList.remove('hidden');
  document.getElementById('quizScore').textContent = quizScore;
  
  let message = '';
  if (quizScore === 5) {
    message = "Perfect! You know us so well! ❤️";
  } else if (quizScore >= 3) {
    message = "Great job! You really understand our love! 💕";
  } else {
    message = "We still have so much to learn about each other! 💖";
  }
  
  document.getElementById('quizMessage').textContent = message;
}

// ==================== SLIDING PUZZLE GAME ====================
function initPuzzleGame() {
  const resetBtn = document.getElementById('resetPuzzle');
  const solveBtn = document.getElementById('solvePuzzle');
  
  resetBtn.addEventListener('click', resetPuzzle);
  solveBtn.addEventListener('click', solvePuzzle);
  
  resetPuzzle();
}

function resetPuzzle() {
  const container = document.getElementById('puzzleGame');
  container.innerHTML = '';
  
  puzzleBoard = [1, 2, 3, 4, 5, 6, 7, 8, 0];
  emptyIndex = 8;
  puzzleMoves = 0;
  puzzleTimer = 0;
  
  document.getElementById('puzzleMoves').textContent = '0';
  document.getElementById('puzzleTime').textContent = '0:00';
  document.getElementById('puzzleWinMessage').classList.add('hidden');
  
  if (puzzleInterval) clearInterval(puzzleInterval);
  puzzleInterval = setInterval(updatePuzzleTimer, 1000);
  
  shufflePuzzle();
  renderPuzzle();
}

function shufflePuzzle() {
  for (let i = 0; i < 100; i++) {
    const validMoves = getValidMoves();
    const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
    swapPuzzlePieces(emptyIndex, randomMove, false);
  }
}

function getValidMoves() {
  const moves = [];
  const row = Math.floor(emptyIndex / 3);
  const col = emptyIndex % 3;
  
  if (row > 0) moves.push(emptyIndex - 3); // Up
  if (row < 2) moves.push(emptyIndex + 3); // Down
  if (col > 0) moves.push(emptyIndex - 1); // Left
  if (col < 2) moves.push(emptyIndex + 1); // Right
  
  return moves;
}

function swapPuzzlePieces(index1, index2, countMove = true) {
  [puzzleBoard[index1], puzzleBoard[index2]] = [puzzleBoard[index2], puzzleBoard[index1]];
  emptyIndex = index2;
  
  if (countMove) {
    puzzleMoves++;
    document.getElementById('puzzleMoves').textContent = puzzleMoves;
  }
}

function renderPuzzle() {
  const container = document.getElementById('puzzleGame');
  container.innerHTML = '';
  
  puzzleBoard.forEach((value, index) => {
    const piece = document.createElement('div');
    piece.className = value === 0 ? 'puzzle-piece empty' : 'puzzle-piece';
    piece.textContent = value === 0 ? '' : value;
    piece.dataset.index = index;
    
    if (value !== 0) {
      piece.addEventListener('click', () => handlePuzzleClick(index));
    }
    
    container.appendChild(piece);
  });
}

function handlePuzzleClick(index) {
  const validMoves = getValidMoves();
  
  if (validMoves.includes(index)) {
    swapPuzzlePieces(emptyIndex, index);
    renderPuzzle();
    checkPuzzleWin();
  }
}

function checkPuzzleWin() {
  const solved = puzzleBoard.every((val, idx) => val === idx + 1 || (idx === 8 && val === 0));
  
  if (solved) {
    clearInterval(puzzleInterval);
    document.getElementById('puzzleWinMessage').classList.remove('hidden');
    createCelebrationFireworks();
  }
}

function solvePuzzle() {
  puzzleBoard = [1, 2, 3, 4, 5, 6, 7, 8, 0];
  emptyIndex = 8;
  renderPuzzle();
  clearInterval(puzzleInterval);
  document.getElementById('puzzleWinMessage').classList.remove('hidden');
}

function updatePuzzleTimer() {
  puzzleTimer++;
  const minutes = Math.floor(puzzleTimer / 60);
  const seconds = puzzleTimer % 60;
  document.getElementById('puzzleTime').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// ==================== CELEBRATION EFFECTS ====================
function createCelebrationFireworks() {
  for (let i = 0; i < 30; i++) {
    setTimeout(() => {
      const firework = document.createElement('div');
      const emojis = ['✨', '💫', '⭐', '💝', '❤️', '💕', '🎉'];
      firework.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      firework.style.position = 'fixed';
      firework.style.left = Math.random() * 100 + 'vw';
      firework.style.top = Math.random() * 100 + 'vh';
      firework.style.fontSize = (Math.random() * 20 + 20) + 'px';
      firework.style.pointerEvents = 'none';
      firework.style.zIndex = '10000';
      
      document.body.appendChild(firework);
      
      let opacity = 1;
      let scale = 0;
      
      function animate() {
        scale += 0.05;
        opacity -= 0.02;
        
        firework.style.opacity = opacity;
        firework.style.transform = `scale(${scale})`;
        
        if (opacity > 0) {
          requestAnimationFrame(animate);
        } else {
          firework.remove();
        }
      }
      
      animate();
    }, i * 100);
  }
}

// ==================== INTERACTIVE HEART ====================
document.addEventListener('click', (e) => {
  const heart = document.querySelector('.beating-heart');
  if (heart && e.target === heart) {
    createHeartBurst(heart);
  }
});

function createHeartBurst(element) {
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  for (let i = 0; i < 15; i++) {
    const miniHeart = document.createElement('div');
    miniHeart.textContent = '❤️';
    miniHeart.style.position = 'fixed';
    miniHeart.style.left = centerX + 'px';
    miniHeart.style.top = centerY + 'px';
    miniHeart.style.fontSize = '30px';
    miniHeart.style.pointerEvents = 'none';
    miniHeart.style.zIndex = '1000';
    
    document.body.appendChild(miniHeart);
    
    const angle = (Math.PI * 2 * i) / 15;
    const distance = 150;
    const targetX = centerX + Math.cos(angle) * distance;
    const targetY = centerY + Math.sin(angle) * distance;
    
    let progress = 0;
    
    function animate() {
      progress += 0.02;
      
      if (progress <= 1) {
        const currentX = centerX + (targetX - centerX) * progress;
        const currentY = centerY + (targetY - centerY) * progress;
        
        miniHeart.style.left = currentX + 'px';
        miniHeart.style.top = currentY + 'px';
        miniHeart.style.opacity = 1 - progress;
        miniHeart.style.transform = `scale(${1 + progress})`;
        
        requestAnimationFrame(animate);
      } else {
        miniHeart.remove();
      }
    }
    
    animate();
  }
}

// ==================== PERFORMANCE OPTIMIZATION ====================
if (window.innerWidth < 768) {
  CONFIG.particleCount = 20;
  CONFIG.starCount = 50;
}

// ==================== CONSOLE EASTER EGG ====================
console.log('%c❤️ Love Message ❤️', 'color: #ff1493; font-size: 24px; font-weight: bold;');
console.log('%cThank you for being my everything. This page was made with infinite love for you.', 'color: #ff69b4; font-size: 14px;');
console.log('%c💕 Forever and Always 💕', 'color: #ff1493; font-size: 18px; font-weight: bold;');