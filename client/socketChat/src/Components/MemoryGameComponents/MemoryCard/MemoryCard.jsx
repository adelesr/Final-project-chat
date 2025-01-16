import React, { useState } from 'react'
import './MemoryCard.css'
const MemoryCard = ({currentCard,indexCard,onClickCard}) => {

  // const cardClass= currentCard.status ? "active "+ currentCard.status : ""; 
  return (
    <div className={'card '+ currentCard.status}  onClick={()=>onClickCard(indexCard)} >
       {currentCard.status.includes("active") ? (<img src={"../src/assets/Images/cardsImg/"+`${currentCard.imgSrc}`} alt="memory card" className='img' />):('') }
    </div>

  )
}

export default MemoryCard