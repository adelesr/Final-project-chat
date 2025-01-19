/* eslint-disable react/prop-types */
import React from 'react'

const GameResult = ({ victoryState, playAgainClickHandler,returnToChat }) => {
    let result;

    switch (victoryState) {
        case 0:
            result = (
                <>
                    <img className='gameResultImage' src="../src/assets/RPS-game images/score-tie.png" alt="gameResult" />
                    <h1>🤝️Its a tie🤝️</h1>
                    <button className='again-button' onClick={playAgainClickHandler}>🔄️play again🔄️</button>
                    <button className='again-button' onClick={returnToChat} >🔙️return to chat🔙️</button>

                </>
            )
            break;
        case 1:
            result = (
                <>
                    <img className='gameResultImage' src="../src/assets/RPS-game images/wining-images/winner-avatar-4.png" alt="gameResult" />
                    <h1>🎉️You win🎉️</h1>
                    <button className='again-button' onClick={playAgainClickHandler}>🔄️play again🔄️</button>
                    <button className='again-button' onClick={returnToChat} >🔙️return to chat🔙️</button>
                </>
            )
            break;
        case 2:
            result = (
                <>
                    <img className='gameResultImage' src="../src/assets/RPS-game images/defeat-images/defeat-4.png" alt="gameResult" />
                    <h1>😞️You lose😞️</h1>
                    <button className='again-button' onClick={playAgainClickHandler}>🔄️play again🔄️</button>
                    <button className='again-button' onClick={returnToChat} >🔙️return to chat🔙️</button>
                </>
            )
            break;
        default:
            result = null;
    }

    return (
        <div className='gameResult'>
            {result}
        </div>
    )
}

export default GameResult;