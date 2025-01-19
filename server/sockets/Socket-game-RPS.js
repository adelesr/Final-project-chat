import { Socket } from "socket.io"
 
let playerHand = 0
let enemyHand = 0
let victory = undefined
let gameUsersAndHands = []
let activeRooms = {}
let roomUsers = {}
 
 
export function roomUsersReset(socket) {
    if (roomUsers[socket.id]) {
        delete roomUsers[socket.id];
    }
}
function joinRoom(socket, room) {
    socket.join(room)
    console.log(`socket-- ${socket.id} added to RPS game room name -- ${room}`);
    activeRooms[room] = activeRooms[room] ? activeRooms[room]+1 : 1
  }
 
const winningCalculationRPS = (playerOneHand, playerTwoHand)=>{
    if(playerOneHand.hand===playerTwoHand.hand){
        victory = 0
    }else if(playerOneHand.hand==0 && playerTwoHand.hand==2){
        victory = playerOneHand.userId
    }else if(playerOneHand.hand==0 && playerTwoHand.hand==1){
        victory = playerTwoHand.userId
    }else if(playerOneHand.hand==1 && playerTwoHand.hand==0){
        victory = playerOneHand.userId
    }else if(playerOneHand.hand==1 && playerTwoHand.hand==2){
        victory = playerTwoHand.userId
    }else if(playerOneHand.hand==2 && playerTwoHand.hand==1){
        victory = playerOneHand.userId
    }else if(playerOneHand.hand==2 && playerTwoHand.hand==0){
        victory = playerTwoHand.userId
    }
    console.log('victory is',victory);
}
 
export const socketGame_RPSHandler = (io,socket) =>{
    console.log('roomUsers',roomUsers);
 
    socket.on('join-room',(room)=>{
        const roomIsFull = activeRooms[room] && activeRooms[room]>2
        const socketExist = roomUsers[socket.id]
        if(roomIsFull){
            console.log("room is full");
        }else if (socketExist) {
            const socketInTheRoom = roomUsers[socket.id].includes(room)
            if (socketInTheRoom) {
                console.log("User is already in room");
            } else {
                roomUsers[socket.id].push(room);
                joinRoom(socket, room)
            }
        } else if(!socketExist){
            roomUsers[socket.id] = [room];
            joinRoom(socket, room)
        }        
        console.log("roomUsers",roomUsers);        
       
    })
 
    socket.on("playerHand",(hand)=>{
        console.log("player hand",hand);
        // socket.broadcast.emit("enemyHand",hand) ----{userId,hand}
        gameUsersAndHands.push(hand)
        if(gameUsersAndHands.length===2){
            console.log("enter the game result if calculation");            
            console.log("gameUsersAndHands",gameUsersAndHands);
            io.emit("handsState", gameUsersAndHands)
            winningCalculationRPS(hand,gameUsersAndHands[0])
            io.emit("gameResult", victory)  
            gameUsersAndHands = []
        }
    })
}
 
export const stopGame_RPS = (socket) =>{
    roomUsersReset(socket)
    gameUsersAndHands = []
}
 
 
