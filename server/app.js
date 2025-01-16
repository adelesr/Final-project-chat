import express from "express";
import cors from 'cors';
import http from 'http'
import { Server } from "socket.io";
// import mongoose from "mongoose";
import { chatSocketHandler } from "./sockets/chatSocketHandler.js";
import { socketGame_RPSHandler,stopGame_RPS,roomUsersReset } from './sockets/Socket-game-RPS.js';
import { memoryGameSocketHandler} from "./sockets/MemoryGameSocketHandler.js";

const messagesHistory = [];
let PORT = 8080;
PORT = 8080;
const app = express();
const server = http.createServer(app);
const io = new Server(server,{
    cors:'*'
})

io.on("connection",(socket) => {
    console.log(`user connected in socket number ${socket.id}`);

    chatSocketHandler(io,socket)
    // socket.on('start-game',game_RPS.startGame)
    socket.on('start-game',(game_name)=>{
        if(game_name === 'RPS'){
            console.log('RPS game handler started');
            socketGame_RPSHandler(io,socket)
        }else if(game_name === 'memory'){
            console.log('memory game handler started');
            socket.on("joinGame", ({currentUserObject,chatId}) => {
                console.log("the user " + currentUserObject.userName + " joined the game");
                console.log("chatId: " + chatId);
                memoryGameSocketHandler(io, socket, currentUserObject,chatId);
            });
        }
    })
    socket.on('leave-game', (gameName) => {
        if (gameName === 'RPS') {
            console.log('RPS game handler stopped');
            stopGame_RPS(); 
        } else if (gameName === 'memory') {
            console.log('Memory game handler stopped');
            stopGame_memoryGame(socket);
        }
      });
  
    
    
    socket.on("disconnect",({gameName,chatId=""})=>{
        console.log("user disconnected");
        if(gameName === 'RPS'){
            roomUsersReset(socket)
        }
        else if (gameName === 'memory'){
            memoryGameRoomsReset(socket,chatId)
        }
    })

})


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));


server.listen(PORT,
    ()=>{
        console.log(`Listening in port ${PORT}`);
    }
)

