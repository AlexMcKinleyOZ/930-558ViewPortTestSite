// Game state
let score = 0;
let matchedShapes = new Set();
const totalShapes = 4;

// DOM elements
const scoreDisplay = document.getElementById('score');
const resetBtn = document.getElementById('resetBtn');
const feedback = document.getElementById('feedback');
const shapesContainer = document.getElementById('shapesContainer');
const shapes = document.querySelectorAll('.shape');
const dropZones = document.querySelectorAll('.drop-zone');

// Sound feedback (visual alternatives for silent mode)
const celebrationEmojis = ['🎉', '✨', '🌟', '⭐', '🎊', '🏆', '🎈'];

// Initialize game
function initGame() {
  score = 0;
  matchedShapes.clear();
  updateScore();
  
  // Reset all shapes
  shapes.forEach(shape => {
    shape.classList.remove('matched');
    shape.style.display = 'flex';
    shape.setAttribute('draggable', 'true');
  });
  
  // Reset all drop zones
  dropZones.forEach(zone => {
    zone.classList.remove('matched');
    const existingShape = zone.querySelector('.shape');
    if (existingShape) {
      shapesContainer.appendChild(existingShape);
    }
  });
  
  // Shuffle shapes
  shuffleShapes();
}

// Shuffle shapes in container
function shuffleShapes() {
  const shapesArray = Array.from(shapes);
  shapesArray.sort(() => Math.random() - 0.5);
  shapesArray.forEach(shape => shapesContainer.appendChild(shape));
}

// Update score display
function updateScore() {
  scoreDisplay.textContent = score;
}

// Show feedback message
function showFeedback(message, isWin = false) {
  feedback.textContent = message;
  feedback.classList.add('show');
  if (isWin) {
    feedback.classList.add('win');
  }
  
  setTimeout(() => {
    feedback.classList.remove('show');
    setTimeout(() => {
      feedback.classList.remove('win');
    }, 400);
  }, 1500);
}

// Check if game is won
function checkWin() {
  if (matchedShapes.size === totalShapes) {
    setTimeout(() => {
      const randomEmoji = celebrationEmojis[Math.floor(Math.random() * celebrationEmojis.length)];
      showFeedback(`${randomEmoji} You Win! ${randomEmoji}`, true);
    }, 500);
  }
}

// Drag and drop handlers
shapes.forEach(shape => {
  shape.addEventListener('dragstart', handleDragStart);
  shape.addEventListener('dragend', handleDragEnd);
  
  // Touch support
  shape.addEventListener('touchstart', handleTouchStart, { passive: false });
  shape.addEventListener('touchmove', handleTouchMove, { passive: false });
  shape.addEventListener('touchend', handleTouchEnd);
});

dropZones.forEach(zone => {
  zone.addEventListener('dragover', handleDragOver);
  zone.addEventListener('drop', handleDrop);
  zone.addEventListener('dragleave', handleDragLeave);
});

let draggedElement = null;
let touchClone = null;

function handleDragStart(e) {
  if (this.classList.contains('matched')) return;
  draggedElement = this;
  this.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd(e) {
  this.classList.remove('dragging');
  dropZones.forEach(zone => zone.classList.remove('drag-over'));
}

function handleDragOver(e) {
  e.preventDefault();
  if (this.classList.contains('matched')) return;
  e.dataTransfer.dropEffect = 'move';
  this.classList.add('drag-over');
}

function handleDragLeave(e) {
  this.classList.remove('drag-over');
}

function handleDrop(e) {
  e.preventDefault();
  this.classList.remove('drag-over');
  
  if (this.classList.contains('matched')) return;
  
  const shapeType = draggedElement.getAttribute('data-shape');
  const zoneType = this.getAttribute('data-shape');
  
  if (shapeType === zoneType) {
    // Correct match!
    this.appendChild(draggedElement);
    draggedElement.classList.add('matched');
    draggedElement.setAttribute('draggable', 'false');
    this.classList.add('matched');
    matchedShapes.add(shapeType);
    
    score += 10;
    updateScore();
    showFeedback('Great Job! 🎉');
    checkWin();
  } else {
    // Wrong match
    showFeedback('Try Again! 💪');
  }
}

// Touch support
function handleTouchStart(e) {
  if (this.classList.contains('matched')) return;
  e.preventDefault();
  
  draggedElement = this;
  touchClone = this.cloneNode(true);
  touchClone.style.position = 'fixed';
  touchClone.style.pointerEvents = 'none';
  touchClone.style.zIndex = '1000';
  touchClone.style.opacity = '0.8';
  document.body.appendChild(touchClone);
  
  this.style.opacity = '0.3';
  
  const touch = e.touches[0];
  touchClone.style.left = (touch.clientX - 60) + 'px';
  touchClone.style.top = (touch.clientY - 60) + 'px';
}

function handleTouchMove(e) {
  if (!touchClone) return;
  e.preventDefault();
  
  const touch = e.touches[0];
  touchClone.style.left = (touch.clientX - 60) + 'px';
  touchClone.style.top = (touch.clientY - 60) + 'px';
  
  // Check which drop zone we're over
  const element = document.elementFromPoint(touch.clientX, touch.clientY);
  dropZones.forEach(zone => zone.classList.remove('drag-over'));
  
  if (element) {
    const dropZone = element.closest('.drop-zone');
    if (dropZone && !dropZone.classList.contains('matched')) {
      dropZone.classList.add('drag-over');
    }
  }
}

function handleTouchEnd(e) {
  if (!touchClone) return;
  e.preventDefault();
  
  const touch = e.changedTouches[0];
  const element = document.elementFromPoint(touch.clientX, touch.clientY);
  const dropZone = element ? element.closest('.drop-zone') : null;
  
  dropZones.forEach(zone => zone.classList.remove('drag-over'));
  
  if (dropZone && !dropZone.classList.contains('matched')) {
    const shapeType = draggedElement.getAttribute('data-shape');
    const zoneType = dropZone.getAttribute('data-shape');
    
    if (shapeType === zoneType) {
      // Correct match!
      dropZone.appendChild(draggedElement);
      draggedElement.classList.add('matched');
      draggedElement.setAttribute('draggable', 'false');
      dropZone.classList.add('matched');
        dropZone.style.display = 'none';
      matchedShapes.add(shapeType);
      
      score += 10;
      updateScore();
      showFeedback('Great Job! 🎉');
      checkWin();
    } else {
      // Wrong match
      showFeedback('Try Again! 💪');
      draggedElement.style.opacity = '1';
    }
  } else {
    draggedElement.style.opacity = '1';
  }
  
  if (touchClone) {
    document.body.removeChild(touchClone);
    touchClone = null;
  }
  draggedElement = null;
}

// Reset button
resetBtn.addEventListener('click', () => {
  showFeedback('New Game! 🎮');
  setTimeout(initGame, 500);
    dropZones.forEach(z => z.style.display = 'flex');
});

// Initialize on load
initGame();