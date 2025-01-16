import {io} from  'socket.io-client'

const token = document.cookie.split('=')[1]; // get the token from the cookie
export const socket  = io("http://localhost:8080",{autoConnect: true})
// , {query: { token }}