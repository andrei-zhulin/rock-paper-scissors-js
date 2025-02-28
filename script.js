// Game configuration
const GAME_CONFIG = {
    choices: ['Rock', 'Paper', 'Scissors'],
    winConditions: {
        'Rock': 'Scissors',
        'Paper': 'Rock',
        'Scissors': 'Paper'
    },
    defaultPointsToWin: 3,
    icons: {
        'Rock': 'fa-hand-rock',
        'Paper': 'fa-hand-paper',
        'Scissors': 'fa-hand-scissors'
    }
};

// DOM Elements
const DOM = {
    buttons: document.querySelectorAll('button.rps-sel-btn'),
    results: document.getElementById('results'),
    finalResult: document.getElementById('final-result'),
    score: document.getElementById('score'),
    playerIcon: document.querySelector('.choice-icon.player'),
    computerIcon: document.querySelector('.choice-icon.computer'),
    soundToggle: document.getElementById('sound-toggle'),
    battleFlames: document.querySelector('.battle-flames'),
    sounds: {
        select: document.getElementById('sound-select'),
        thinking: document.getElementById('sound-thinking'),
        battle: document.getElementById('sound-battle'),
        win: document.getElementById('sound-win'),
        lose: document.getElementById('sound-lose'),
        tie: document.getElementById('sound-tie'),
        gameWin: document.getElementById('sound-game-win'),
        gameLose: document.getElementById('sound-game-lose')
    },
    restartBtn: (() => {
        const btn = document.createElement('button');
        btn.setAttribute('id', 'reset-button');
        btn.innerText = 'Play Again';
        return btn;
    })()
};

// Sound controller
class SoundController {
    static isMuted = false;

    static toggleMute() {
        this.isMuted = !this.isMuted;
        
        if (this.isMuted) {
            DOM.soundToggle.classList.remove('sound-on');
            DOM.soundToggle.classList.add('sound-off');
            DOM.soundToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
            
            // Stop any playing sounds
            Object.values(DOM.sounds).forEach(sound => {
                sound.pause();
                sound.currentTime = 0;
            });
        } else {
            DOM.soundToggle.classList.remove('sound-off');
            DOM.soundToggle.classList.add('sound-on');
            DOM.soundToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
        }
    }

    static play(sound) {
        if (this.isMuted) return;
        
        // Reset the sound to the beginning if it's already playing
        DOM.sounds[sound].currentTime = 0;
        DOM.sounds[sound].play().catch(e => console.log("Sound play prevented:", e));
    }

    static stop(sound) {
        DOM.sounds[sound].pause();
        DOM.sounds[sound].currentTime = 0;
    }
}

// Game state
class GameState {
    constructor(pointsToWin = GAME_CONFIG.defaultPointsToWin) {
        this.pointsToWin = pointsToWin;
        this.playerScore = 0;
        this.computerScore = 0;
        this.updateScoreDisplay(); // Initialize score display
    }

    updateScore(result) {
        if (result === true) this.playerScore++;
        else if (result === false) this.computerScore++;
        this.updateScoreDisplay();
    }

    updateScoreDisplay() {
        DOM.score.innerText = `${this.playerScore} : ${this.computerScore}`;
    }

    checkWinCondition() {
        if (this.playerScore === this.pointsToWin) {
            return 'player';
        } else if (this.computerScore === this.pointsToWin) {
            return 'computer';
        }
        return null;
    }
}

// Visual Effects Controller
class EffectsController {
    static activateBattleFlames() {
        DOM.battleFlames.style.opacity = '1';
    }

    static deactivateBattleFlames() {
        DOM.battleFlames.style.opacity = '0';
    }

    static resetIcons() {
        DOM.playerIcon.innerHTML = '';
        DOM.computerIcon.innerHTML = '';
        DOM.playerIcon.classList.remove('win', 'lose');
        DOM.computerIcon.classList.remove('win', 'lose');
    }
}

// Game logic
class GameLogic {
    static computerPlay() {
        const randomIndex = Math.floor(Math.random() * GAME_CONFIG.choices.length);
        return GAME_CONFIG.choices[randomIndex];
    }

    static async playRound(playerSelection, computerSelection) {
        // Reset any previous state
        EffectsController.resetIcons();
        
        // Play selection sound
        SoundController.play('select');
        
        // Update player icon immediately
        DOM.playerIcon.innerHTML = `<i class="fas ${GAME_CONFIG.icons[playerSelection]}"></i>`;
        
        // Show thinking animation for computer
        DOM.computerIcon.innerHTML = `<i class="fas fa-question"></i>`;
        DOM.computerIcon.classList.add('thinking');
        
        // Play thinking sound
        SoundController.play('thinking');
        
        // Dramatic pause while computer "thinks"
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        // Stop thinking sound
        SoundController.stop('thinking');
        
        // Reveal computer's choice with animation
        DOM.computerIcon.classList.remove('thinking');
        DOM.computerIcon.innerHTML = `<i class="fas ${GAME_CONFIG.icons[computerSelection]}"></i>`;
        DOM.computerIcon.classList.add('reveal');
        
        // Wait for reveal animation to complete
        await new Promise(resolve => setTimeout(resolve, 600));
        DOM.computerIcon.classList.remove('reveal');

        // Initial shake animation
        DOM.playerIcon.classList.add('shake');
        DOM.computerIcon.classList.add('shake');
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Battle animation with sound
        SoundController.play('battle');
        EffectsController.activateBattleFlames();
        DOM.playerIcon.classList.remove('shake');
        DOM.computerIcon.classList.remove('shake');
        DOM.playerIcon.classList.add('battle');
        DOM.computerIcon.classList.add('battle');

        await new Promise(resolve => setTimeout(resolve, 800));

        DOM.playerIcon.classList.remove('battle');
        DOM.computerIcon.classList.remove('battle');
        EffectsController.deactivateBattleFlames();

        const normalizedPlayer = playerSelection.toLowerCase();
        const normalizedComputer = computerSelection.toLowerCase();

        if (normalizedPlayer === normalizedComputer) {
            DOM.results.innerText = `Tie!! ${playerSelection} can't beat ${computerSelection}`;
            SoundController.play('tie');
            return null;
        }

        const isWinner = GAME_CONFIG.winConditions[playerSelection] === computerSelection;
        const message = isWinner
            ? `Yay! ${playerSelection} beats ${computerSelection}!`
            : `Ouch! ${playerSelection} beaten by ${computerSelection}!`;
        
        // Win/Lose animation with sound
        if (isWinner) {
            SoundController.play('win');
            DOM.playerIcon.classList.add('win');
            DOM.computerIcon.classList.add('lose');
        } else {
            SoundController.play('lose');
            DOM.computerIcon.classList.add('win');
            DOM.playerIcon.classList.add('lose');
        }

        await new Promise(resolve => setTimeout(resolve, 500));
        
        DOM.results.innerText = message;
        return isWinner;
    }
}

// UI Controller
class UIController {
    static endGame(result, gameState) {
        const isPlayerWin = result === 'player';
        const message = isPlayerWin
            ? `YOU WIN! ${gameState.playerScore} : ${gameState.computerScore}\n`
            : `YOU LOSE! ${gameState.playerScore} : ${gameState.computerScore}\n`;
        
        // Play game end sound
        SoundController.play(isPlayerWin ? 'gameWin' : 'gameLose');
        
        DOM.finalResult.innerText = message;
        DOM.finalResult.classList.add(isPlayerWin ? 'win' : 'lose');
        DOM.finalResult.appendChild(DOM.restartBtn);
        
        // Disable buttons
        DOM.buttons.forEach(button => {
            button.disabled = true;
        });
    }

    static initializeRestartButton() {
        DOM.restartBtn.addEventListener('click', () => {
            SoundController.play('select');
            location.reload();
        });
    }

    static initializeSoundToggle() {
        DOM.soundToggle.addEventListener('click', () => {
            SoundController.toggleMute();
        });
    }

    static initializeGameButtons(gameState) {
        DOM.results.innerText = 'Choose your weapon!';
        
        // Initially hide battle flames
        DOM.battleFlames.style.opacity = '0';
        
        DOM.buttons.forEach(button => {
            button.addEventListener('click', async () => {
                // Disable buttons during animation
                DOM.buttons.forEach(btn => btn.disabled = true);
                
                const result = await GameLogic.playRound(button.dataset.choice, GameLogic.computerPlay());
                gameState.updateScore(result);

                const winner = gameState.checkWinCondition();
                if (winner) {
                    UIController.endGame(winner, gameState);
                } else {
                    // Re-enable buttons after animation
                    DOM.buttons.forEach(btn => btn.disabled = false);
                }
            });
        });
    }
}

// Game initialization
function initializeGame(pointsToWin = GAME_CONFIG.defaultPointsToWin) {
    const gameState = new GameState(pointsToWin);
    UIController.initializeRestartButton();
    UIController.initializeSoundToggle();
    UIController.initializeGameButtons(gameState);
}

// Start the game
initializeGame(3);
