const buttons = document.querySelectorAll("button.rps-sel-btn");
const results = document.getElementById("results");
const finalResult = document.getElementById("final-result");
const score = document.getElementById("score");

const restartBtn = document.createElement("button");
restartBtn.setAttribute("id", "reset-button");
restartBtn.innerText = "Restart";

function computerPlay() {
  const choices = ["Rock", "Paper", "Scissors"];

  let computerChoice = Math.floor(Math.random() * choices.length);
  return choices[computerChoice];
}

function playRound(playerSelection, computerSelection) {
  const winMessage = `Yay! Your ${playerSelection} beats their ${computerSelection}!`;
  const lossMessage = `Ouch! Your ${playerSelection} is beaten by their ${computerSelection}!`;
  let isWinner = true;

  // Player picks "Rock"
  if (
    playerSelection.toLowerCase() === "rock" &&
    computerSelection.toLowerCase() === "scissors"
  ) {
    results.innerText = winMessage;
    return isWinner;
  } else if (
    playerSelection.toLowerCase() === "rock" &&
    computerSelection.toLowerCase() === "paper"
  ) {
    results.innerText = lossMessage;
    return !isWinner;
  }

  // Player picks "Scissors"
  if (
    playerSelection.toLowerCase() === "scissors" &&
    computerSelection.toLowerCase() === "paper"
  ) {
    results.innerText = winMessage;
    return isWinner;
  } else if (
    playerSelection.toLowerCase() === "scissors" &&
    computerSelection.toLowerCase() === "rock"
  ) {
    results.innerText = lossMessage;
    return !isWinner;
  }

  // Player picks "Paper"
  if (
    playerSelection.toLowerCase() === "paper" &&
    computerSelection.toLowerCase() === "rock"
  ) {
    results.innerText = winMessage;
    return isWinner;
  } else if (
    playerSelection.toLowerCase() === "paper" &&
    computerSelection.toLowerCase() === "scissors"
  ) {
    results.innerText = lossMessage;
    return !isWinner;
  }

  // Player picks same item as Computer
  if (playerSelection.toLowerCase() === computerSelection.toLowerCase()) {
    results.innerText = `Tie!! ${playerSelection} can't beat ${computerSelection}`;
    return null;
  }
}

function endOfGame() {
  score.remove();
  buttons.forEach((button) => {
    button.disabled = true;
  });

  finalResult.appendChild(restartBtn);
  restartBtn.addEventListener("click", () => {
    location.reload();
  });
}

function game(pointsToWin = 5) {
  let playerScore = 0;
  let computerScore = 0;

  results.innerText = "Rock, Paper or Scissors?";

  buttons.forEach((element) => {
    const playerSelection = element.innerText;
    element.addEventListener("click", () => {
      let win = playRound(playerSelection, computerPlay());
      if (win === true) {
        playerScore++;
      } else if (win === false) {
        computerScore++;
      }
      score.innerText = `Score ${playerScore} : ${computerScore}`;

      if (playerScore == pointsToWin && computerScore != pointsToWin) {
        finalResult.innerText = `YOU WIN!!! ${playerScore} : ${computerScore}\n`;
        endOfGame();
      } else if (playerScore !== pointsToWin && computerScore === pointsToWin) {
        finalResult.innerText = `YOU LOOSE! ${playerScore} : ${computerScore}\n`;
        endOfGame();
      }
    });
  });
}

game(3);
