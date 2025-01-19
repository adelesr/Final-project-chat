
export function chatSocketHandler(io, socket){

        socket.on("sendMessage",(message,room)=> {
            const messageObject = {
                userObject: message.currentUserObject,
                messageId: Date.now(),
                timeSent: new Date(Date.now()).toLocaleTimeString('en-US',{
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false}),
                content :message.userMsg
            }
            if(room){
                socket.to(room).emit("receivePrivateMessage",messageObject)
            }else
                io.emit("receiveMessage",messageObject)
            
        })
        socket.on('join-room',(room)=>{
            socket.join(room)
        })
        
    
}