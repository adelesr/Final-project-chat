
const cardsArray =[
    {id:1,imgSrc:"daisyDuck.png",status:""},
    {id:2,imgSrc:"dambo.png",status:""},
    {id:3,imgSrc:"disniePrincess.png",status:""},
    {id:4,imgSrc:"donaldDuck.png",status:""},
    {id:5,imgSrc:"Mickey_Mouse.png",status:""},
    {id:6,imgSrc:"dambo.png",status:""},
    {id:7,imgSrc:"disniePrincess.png",status:""},
    {id:8,imgSrc:"donaldDuck.png",status:""},
    {id:9,imgSrc:"daisyDuck.png",status:""},
    {id:10,imgSrc:"Mickey_Mouse.png",status:""},
    {id:11,imgSrc:"spongBob.png",status:""},
    {id:12,imgSrc:"spongBob.png",status:""},
    {id:13,imgSrc:"miniMaus.png",status:""},
    {id:14,imgSrc:"miniMaus.png",status:""},
    {id:15,imgSrc:"pluto.png",status:""},
    {id:16,imgSrc:"pluto.png",status:""},
    {id:17,imgSrc:"katan.png",status:""},
    {id:18,imgSrc:"katan.png",status:""},
    {id:19,imgSrc:"tinkerble.png",status:""},
    {id:20,imgSrc:"tinkerble.png",status:""}
]

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export const shuffledCardsArray = shuffleArray(cardsArray);