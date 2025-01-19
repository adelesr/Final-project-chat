import express from "express";
import cors from 'cors';
import { config } from 'dotenv';
import http from 'http'
import { Server } from "socket.io";
import mongoose from "mongoose";
import useRouter from './Routers/useRouter.js';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { chatSocketHandler } from "./sockets/chatSocketHandler.js";
import { socketGame_RPSHandler,stopGame_RPS,roomUsersReset } from './sockets/Socket-game-RPS.js';
import { memoryGameSocketHandler} from "./sockets/MemoryGameSocketHandler.js";

const messagesHistory = [];
config();
const PORT = process.env.PORT || 8080;

const app = express();
const server = http.createServer(app);
const io = new Server(server,{ cors:'*'  });


io.on("connection",(socket) => {
    chatSocketHandler(io,socket)
    socket.on('start-game',(game_name)=>{
        if(game_name === 'RPS'){
            socketGame_RPSHandler(io,socket)
        }else if(game_name === 'memory'){
            socket.on("joinGame", ({currentUserObject,chatId}) => {
                memoryGameSocketHandler(io, socket, currentUserObject,chatId);
            });
        }
    })
    socket.on('leave-game', (gameName) => {
        if (gameName === 'RPS') {
            stopGame_RPS(); 
        } else if (gameName === 'memory') {
            stopGame_memoryGame(socket);
        }
      });
  
    
    
    socket.on("disconnect",({gameName,chatId=""})=>{
        if(gameName === 'RPS'){
            roomUsersReset(socket)
        }
        else if (gameName === 'memory'){
            memoryGameRoomsReset(socket,chatId)
        }
    })

})

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'] ,  credentials: true}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use('/api/v1/users',useRouter);


mongoose.connect(process.env.MONGODB_CONNECTION).then(()=>{
    server.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
}).catch(err => console.error(err));

