function computerPlay(){
    const choices = ['rock', 'paper', 'scissors'];

    let computerChoice = Math.floor(Math.random() * choices.length);
    return choices[computerChoice];
}

function playRound(playerSelection, computerSelection){
    const winMessage = `You win!!! ${playerSelection} beats ${computerSelection}!`;
    const lossMessage = `You loose! ${playerSelection} is beaten by ${computerSelection} :(`;
    let isWinner = true;

    // Player picks "Rock"
    if (playerSelection.toLowerCase() === 'rock' && computerSelection === 'scissors'){
        console.log(winMessage);
        return isWinner;
    } else if (playerSelection.toLowerCase() === 'rock' && computerSelection === 'paper'){
        console.log(lossMessage);
        return !isWinner;
    }

    // Player picks "Scissors"
    if (playerSelection.toLowerCase() === 'scissors' && computerSelection === 'paper'){
        console.log(winMessage);
        return isWinner;
    } else if (playerSelection.toLowerCase() === 'scissors' && computerSelection === 'rock'){
        console.log(lossMessage);
        return !isWinner;
    }

    // Player picks "Paper"
    if (playerSelection.toLowerCase() === 'paper' && computerSelection === 'rock'){
        console.log(winMessage);
        return isWinner;
    } else if (playerSelection.toLowerCase() === 'paper' && computerSelection === 'scissors'){
        console.log(lossMessage);
        return !isWinner;
    }

    // Player picks same item as Computer
    if (playerSelection.toLowerCase() === computerSelection){
        console.log(`No winner!! ${playerSelection} equals ${computerSelection}`);
        return null;
    }
}

function game(numberOfRounds = 5){
    let playerScore = 0;
    let computerScore = 0;

    for (let i = 0; i < numberOfRounds; i++){
        let playerChoice = prompt(`Rock, Scissors or Paper? (round ${i+1}/${numberOfRounds})`);

        let roundResult = playRound(playerChoice, computerPlay());

        if (roundResult === true){
            playerScore++;
        }else if(roundResult === false){
            computerScore++;
        }
    }

    // Output final results
    if(playerScore > computerScore){
        console.log(`YOU WIN!!! (${playerScore} vs ${computerScore})`);
    }else if(playerScore < computerScore) {
        console.log(`YOU LOOSE! (${playerScore} vs ${computerScore})`);
    }else {
        console.log(`IT'S A TIE!! (${playerScore} vs ${computerScore})`);
    }
}

game(1);