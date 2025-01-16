let roomsMemoryGame = {};

export const memoryGameRoomsReset = (socket,chatId) => {
    console.log("memory game rooms reset started");
    delete [chatId];
    // socket.emit("leaveGameMessage");
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
        console.log("room created");
        console.log("first user added to room, user name: " + userName);  
    }
    else if (roomsMemoryGame[chatId].length === 1 && roomsMemoryGame[chatId][0].id !== id) {
        roomsMemoryGame[chatId].push(currentUserObject);
        socket.join(chatId);        
        io.to(chatId).emit("playerJoined", ["Game started", roomsMemoryGame[chatId]]);
    } 
   
    console.log(roomsMemoryGame);
    

    // else if (roomsMemoryGame[chatId].length === 1 && roomsMemoryGame[chatId][0] === userName) {
    // socket.emit("player", "you already in :)"); // Problometic error
    // } 
    // else if (participents.length >= 2) {
    // socket.emit("player", "game is already started");
    // }

    //----------------------------------------------------------------
    socket.on("sendSelectedCards",({card1,card2,user})=>{
        console.log("--------------------start--------------------");

        console.log("sendSelectedCards:",card1,card2,user);
        console.log("turn: ",user);
        socket.broadcast.to(chatId).emit("enemyMove",{card1,card2,user});
    })

    socket.on("gameOver",({player1, player2})=>{
        console.log("player1 score: " + player1.score + ", player2 score: " + player2.score);
         if(player1.score+player2.score===18 )
        {   
            console.log("enter game over");
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
            console.log(msg);
            io.to(chatId).emit("gameOverMessage",msg);
        }
    })

    socket.on("leaveGame",()=>{
        socket.broadcast.emit("playerLeftMessage");
        socket.emit("exitFromGame");
        let gameName= "memory";
        // socket.emit("disconnect",{gameName,chatId});
    })
}
export const stopGame_memoryGame = (socket) =>{
    socket.removeAllListeners('playerJoined');
    socket.removeAllListeners('joinGame');
    socket.removeAllListeners('sendSelectedCards');
    socket.removeAllListeners('gameOver');
    socket.removeAllListeners('leaveGame');
}