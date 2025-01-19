let roomsMemoryGame = {};

export const memoryGameRoomsReset = (chatId) => {
    console.log("memory game rooms reset started");
    delete roomsMemoryGame[chatId];
}

export const memoryGameSocketHandler = (io, socket, currentUserObject, chatId) => {
    if (!io || typeof io.to !== 'function') {
        console.error("Invalid io object");
        return;
    }

    const { userName,id } = currentUserObject;

    //אם החדר לא במשחק עדיין וזה המשתנה הראשון
    if (!roomsMemoryGame[chatId]) {
        roomsMemoryGame[chatId] = [];
        roomsMemoryGame[chatId].push(currentUserObject);
        socket.join(chatId);
    }
    else if (roomsMemoryGame[chatId].length === 1 && roomsMemoryGame[chatId][0].id !== id) {
        roomsMemoryGame[chatId].push(currentUserObject);
        socket.join(chatId);        
        io.to(chatId).emit("playerJoined", ["Game started", roomsMemoryGame[chatId]]);
    } 
       
    socket.on("sendSelectedCards",({card1,card2,user})=>{
        socket.broadcast.to(chatId).emit("enemyMove",{card1,card2,user});
    })

    socket.on("gameOver",({player1, player2})=>{
         if(player1.score+player2.score===18 )
        {   
            var msg="";
            if(player1.score>player2.score)
            {
               msg=`${player1.userName} is the winner!🎉🎇`;
            }
            else if(player1.score<player2.score)
            {
               msg=`${player2.userName} is the winner!🎉🎇`;
            }
            else {msg="It's a tie!🤝";}
            io.to(chatId).emit("gameOverMessage",msg);
        }
    })

    socket.on("leaveGame",()=>{
        socket.broadcast.emit("playerLeftMessage");
        socket.emit("exitFromGame");
        memoryGameRoomsReset(chatId);
    })
}
export const stopGame_memoryGame = (socket) =>{
    socket.removeAllListeners('playerJoined');
    socket.removeAllListeners('joinGame');
    socket.removeAllListeners('sendSelectedCards');
    socket.removeAllListeners('gameOver');
    socket.removeAllListeners('leaveGame');
}