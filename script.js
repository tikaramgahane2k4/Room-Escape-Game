// Game State
let gameState = {
    currentRoom: 1,
    inventory: [],
    puzzles: {
        sequence: { solved: false, progress: [] },
        mirror: { solved: false, found: false },
        numberLock: { solved: false },
        colorPattern: { solved: false, progress: [] },
        wordScramble: { solved: false },
        mathRiddle: { solved: false },
        finalExit: { solved: false }
    },
    rating: 0
};

// Puzzle Solutions
const solutions = {
    sequence: [1, 3, 2],
    numberLock: 6,
    colorPattern: ['red', 'yellow', 'green', 'blue'],
    wordScramble: 'ESCAPE',
    mathRiddle: 9 // 2 + 3*4 - 5 = 2 + 12 - 5 = 9
};

// Initialize Game
document.addEventListener('DOMContentLoaded', function() {
    updateGameStatus();
    setupFeedbackForm();
});

// Utility Functions
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    const toastText = document.getElementById('toast-text');
    
    // Set message and type-specific styling
    toastText.textContent = message;
    toast.className = 'toast visible';
    
    if (type === 'success') {
        toast.style.borderColor = '#10b981';
        toast.style.background = 'rgba(16, 185, 129, 0.1)';
    } else if (type === 'error') {
        toast.style.borderColor = '#ef4444';
        toast.style.background = 'rgba(239, 68, 68, 0.1)';
    } else {
        toast.style.borderColor = '#06b6d4';
        toast.style.background = 'rgba(30, 41, 59, 0.95)';
    }
    
    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('visible');
    }, 3000);
}

function updateGameStatus() {
    // Update key count
    document.getElementById('key-count').textContent = gameState.inventory.length;
    
    // Update progress dots
    let completedCount = 0;
    Object.keys(gameState.puzzles).forEach((key, index) => {
        const dot = document.getElementById(`dot-${index + 1}`);
        const checkIcon = document.getElementById(`check-${index + 1}`);
        const puzzleCard = document.getElementById(`puzzle-${index + 1}`);
        
        if (gameState.puzzles[key].solved) {
            dot.classList.add('completed');
            checkIcon.textContent = '✅';
            checkIcon.classList.add('visible');
            puzzleCard.classList.add('completed');
            completedCount++;
        }
    });
    
    // Update inventory display
    updateInventoryDisplay();
    
    // Check if game is complete
    if (completedCount === 7) {
        setTimeout(() => showSuccessModal(), 1000);
    }
    
    // Update final puzzle button
    updateFinalPuzzle();
}

function updateInventoryDisplay() {
    const inventory = document.getElementById('inventory');
    inventory.innerHTML = '';
    
    gameState.inventory.forEach(item => {
        const keyBadge = document.createElement('div');
        keyBadge.className = 'key-badge';
        keyBadge.innerHTML = `🔑 ${item}`;
        inventory.appendChild(keyBadge);
    });
}

function updateFinalPuzzle() {
    const keyCount = gameState.inventory.length;
    const escapeBtn = document.getElementById('escape-btn');
    
    // Fill key slots based on collected keys
    for (let i = 1; i <= 6; i++) {
        const slot = document.getElementById(`slot-${i}`);
        if (i <= keyCount) {
            slot.classList.add('filled');
        }
    }
    
    // Enable escape button if all keys collected
    if (keyCount >= 6) {
        escapeBtn.disabled = false;
        escapeBtn.style.animation = 'pulse 1s infinite';
    }
}

// Puzzle 1: Sequence Lock
function handleSequence(num) {
    if (gameState.puzzles.sequence.solved) return;
    
    gameState.puzzles.sequence.progress.push(num);
    updateSequenceDisplay();
    
    if (gameState.puzzles.sequence.progress.length === 3) {
        if (JSON.stringify(gameState.puzzles.sequence.progress) === JSON.stringify(solutions.sequence)) {
            gameState.puzzles.sequence.solved = true;
            gameState.inventory.push('Golden Key');
            showToast('✅ Puzzle 1 Solved! You found the Golden Key!', 'success');
            updateGameStatus();
        } else {
            showToast('❌ Wrong Sequence! Try again.', 'error');
        }
        gameState.puzzles.sequence.progress = [];
        updateSequenceDisplay();
    }
}

function updateSequenceDisplay() {
    const display = document.getElementById('sequence-display');
    display.textContent = gameState.puzzles.sequence.progress.join(' → ') || 'None';
}

// Puzzle 2: Hidden Mirror
function revealHiddenClue() {
    if (gameState.puzzles.mirror.solved) return;
    
    if (!gameState.puzzles.mirror.found) {
        gameState.puzzles.mirror.found = true;
        gameState.puzzles.mirror.solved = true;
        gameState.inventory.push('Silver Key');
        
        document.getElementById('mirror-text').textContent = 'Secret Found!';
        document.getElementById('hidden-message').classList.add('visible');
        
        showToast('✅ Puzzle 2 Solved! You found the Silver Key!', 'success');
        updateGameStatus();
    }
}

// Puzzle 3: Number Lock
function checkNumberLock() {
    if (gameState.puzzles.numberLock.solved) return;
    
    const input = document.getElementById('number-input');
    const value = parseInt(input.value);
    
    if (value === solutions.numberLock) {
        gameState.puzzles.numberLock.solved = true;
        gameState.inventory.push('Bronze Key');
        input.disabled = true;
        showToast('✅ Puzzle 3 Solved! You found the Bronze Key!', 'success');
        updateGameStatus();
    } else {
        showToast('❌ Wrong Code! The number lock didn\'t open.', 'error');
        input.value = '';
    }
}

// Puzzle 4: Color Pattern
function handleColor(color) {
    if (gameState.puzzles.colorPattern.solved) return;
    
    gameState.puzzles.colorPattern.progress.push(color);
    updateColorDisplay();
    
    if (gameState.puzzles.colorPattern.progress.length === 4) {
        if (JSON.stringify(gameState.puzzles.colorPattern.progress) === JSON.stringify(solutions.colorPattern)) {
            gameState.puzzles.colorPattern.solved = true;
            gameState.inventory.push('Crystal Key');
            showToast('✅ Puzzle 4 Solved! You found the Crystal Key!', 'success');
            updateGameStatus();
        } else {
            showToast('❌ Wrong Pattern! Follow the rainbow order.', 'error');
        }
        gameState.puzzles.colorPattern.progress = [];
        updateColorDisplay();
    }
}

function updateColorDisplay() {
    const display = document.getElementById('color-display');
    const colors = gameState.puzzles.colorPattern.progress;
    display.innerHTML = colors.map(color => `<span style="color: ${color}">●</span>`).join(' → ') || 'None';
}

// Puzzle 5: Word Scramble
function checkWord() {
    if (gameState.puzzles.wordScramble.solved) return;
    
    const input = document.getElementById('word-input');
    const value = input.value.toUpperCase().trim();
    
    if (value === solutions.wordScramble) {
        gameState.puzzles.wordScramble.solved = true;
        gameState.inventory.push('Diamond Key');
        input.disabled = true;
        showToast('✅ Puzzle 5 Solved! You found the Diamond Key!', 'success');
        updateGameStatus();
    } else {
        showToast('❌ Wrong Word! Think about what you\'re trying to do...', 'error');
        input.value = '';
    }
}

// Puzzle 6: Math Riddle
function checkMath() {
    if (gameState.puzzles.mathRiddle.solved) return;
    
    const input = document.getElementById('math-input');
    const value = parseInt(input.value);
    
    if (value === solutions.mathRiddle) {
        gameState.puzzles.mathRiddle.solved = true;
        gameState.inventory.push('Ruby Key');
        input.disabled = true;
        showToast('✅ Puzzle 6 Solved! You found the Ruby Key!', 'success');
        updateGameStatus();
    } else {
        showToast('❌ Wrong Answer! Remember order of operations.', 'error');
        input.value = '';
    }
}

// Puzzle 7: Final Exit
function attemptEscape() {
    if (gameState.inventory.length >= 6) {
        gameState.puzzles.finalExit.solved = true;
        gameState.inventory.push('Master Key');
        showToast('🎉 All keys used! The door is opening...', 'success');
        updateGameStatus();
    } else {
        showToast('❌ You need all 6 keys to escape!', 'error');
    }
}

// Hint System
function toggleHint(puzzleNumber) {
    const hintBox = document.getElementById(`hint-${puzzleNumber}`);
    const button = event.target;
    
    if (hintBox.classList.contains('visible')) {
        hintBox.classList.remove('visible');
        button.textContent = 'Show Hint';
    } else {
        hintBox.classList.add('visible');
        button.textContent = 'Hide Hint';
    }
}

// Success Modal
function showSuccessModal() {
    const modal = document.getElementById('success-modal');
    const finalKeys = document.getElementById('final-keys');
    
    // Show all collected keys
    finalKeys.innerHTML = '';
    gameState.inventory.forEach(key => {
        const keyBadge = document.createElement('div');
        keyBadge.className = 'key-badge';
        keyBadge.innerHTML = `🔑 ${key}`;
        finalKeys.appendChild(keyBadge);
    });
    
    modal.classList.add('visible');
}

// Reset Game
function resetGame() {
    // Reset game state
    gameState = {
        currentRoom: 1,
        inventory: [],
        puzzles: {
            sequence: { solved: false, progress: [] },
            mirror: { solved: false, found: false },
            numberLock: { solved: false },
            colorPattern: { solved: false, progress: [] },
            wordScramble: { solved: false },
            mathRiddle: { solved: false },
            finalExit: { solved: false }
        },
        rating: 0
    };
    
    // Reset UI elements
    document.getElementById('success-modal').classList.remove('visible');
    
    // Reset inputs
    document.getElementById('number-input').disabled = false;
    document.getElementById('number-input').value = '';
    document.getElementById('word-input').disabled = false;
    document.getElementById('word-input').value = '';
    document.getElementById('math-input').disabled = false;
    document.getElementById('math-input').value = '';
    document.getElementById('escape-btn').disabled = true;
    
    // Reset mirror
    document.getElementById('mirror-text').textContent = 'Hover to reveal';
    document.getElementById('hidden-message').classList.remove('visible');
    
    // Reset displays
    updateSequenceDisplay();
    updateColorDisplay();
    
    // Reset visual states
    for (let i = 1; i <= 7; i++) {
        document.getElementById(`dot-${i}`).classList.remove('completed');
        document.getElementById(`check-${i}`).textContent = '';
        document.getElementById(`check-${i}`).classList.remove('visible');
        document.getElementById(`puzzle-${i}`).classList.remove('completed');
    }
    
    // Reset key slots
    for (let i = 1; i <= 6; i++) {
        document.getElementById(`slot-${i}`).classList.remove('filled');
    }
    
    updateGameStatus();
    showToast('🔄 Game Reset! Good luck!', 'info');
}

// Feedback Form Functions
function setRating(rating) {
    gameState.rating = rating;
    const stars = document.querySelectorAll('.star');
    
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

function setupFeedbackForm() {
    const form = document.getElementById('feedback-form');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            rating: gameState.rating,
            message: formData.get('message'),
            game: 'Hidden Room Escape - 7 Steps'
        };
        
        try {
            // Using Formspree for email handling
            const response = await fetch('https://formspree.io/f/xpwzgqpp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                showToast('✅ Feedback sent! Thank you for playing!', 'success');
                form.reset();
                gameState.rating = 0;
                document.querySelectorAll('.star').forEach(star => star.classList.remove('active'));
            } else {
                throw new Error('Failed to send feedback');
            }
        } catch (error) {
            showToast('❌ Failed to send feedback. Please try again.', 'error');
        }
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // ESC to close hints
    if (e.key === 'Escape') {
        document.querySelectorAll('.hint-box.visible').forEach(hint => {
            hint.classList.remove('visible');
        });
        document.querySelectorAll('.hint-btn').forEach(btn => {
            btn.textContent = 'Show Hint';
        });
    }
    
    // Enter to submit forms
    if (e.key === 'Enter') {
        const focused = document.activeElement;
        if (focused.id === 'number-input') {
            checkNumberLock();
        } else if (focused.id === 'word-input') {
            checkWord();
        } else if (focused.id === 'math-input') {
            checkMath();
        }
    }
});

// Prevent context menu on game elements
document.addEventListener('contextmenu', function(e) {
    if (e.target.closest('.puzzle-card') || e.target.closest('.game-container')) {
        e.preventDefault();
    }
});

// Add some easter eggs
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.code);
    if (konamiCode.length > konamiPattern.length) {
        konamiCode.shift();
    }
    
    if (JSON.stringify(konamiCode) === JSON.stringify(konamiPattern)) {
        showToast('🎮 Konami Code activated! You\'re a true gamer!', 'success');
        // Add some visual effect
        document.body.style.animation = 'glitch 0.5s ease-in-out 3';
        konamiCode = [];
    }
});

// Auto-save progress to localStorage
function saveProgress() {
    localStorage.setItem('escapeGameProgress', JSON.stringify(gameState));
}

function loadProgress() {
    const saved = localStorage.getItem('escapeGameProgress');
    if (saved) {
        try {
            const savedState = JSON.parse(saved);
            // Only load if not completed
            if (!savedState.puzzles.finalExit.solved) {
                gameState = savedState;
                updateGameStatus();
                showToast('📁 Progress loaded!', 'info');
            }
        } catch (error) {
            console.log('Could not load saved progress');
        }
    }
}

// Save progress whenever game state changes
function saveGameState() {
    saveProgress();
}

// Load progress on page load
window.addEventListener('load', loadProgress);

// Save progress before page unload
window.addEventListener('beforeunload', saveProgress);