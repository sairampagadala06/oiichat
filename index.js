import express from "express";
import http from "http";
import {Server as Socket} from "socket.io";
import cors from "cors";
import router from "./router.js";
import { addUser, removeUser, getUser, getUsersInRoom } from "./users.js";
import { configDotenv } from "dotenv";
const app=express();
const port=process.env.PORT || 3055;
app.use(router);
const server=http.createServer(app);
const io=new Socket(server,{
    cors: {
            origin: "*"
    }
});

io.on("connection",(socket)=>{
    socket.on('join', ({ name, room,pass}, callback) => {
        const { error, user } = addUser({pass , name, room,id:socket.id});
    
        if(error) return callback(error);
    
        socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.`});
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });
    
        socket.join(user.room);
        callback();
      });
    
      socket.on('sendMessage', ({message,pass},callback) => {

        const user = getUser(pass);
        console.log(user.pass);
        console.log(user.room);
        io.to(user['room']).emit('message', { user: user.name, text: message });
    
        callback();
      });
    
      socket.on('disconnect', () => {
        const user = removeUser(socket.id);
    
        if(user) {
          io.to(user['room']).emit('message', { user: 'Admin', text: `${user.name} has left.` });
          io.to(user['room']).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
        }
      })
})
server.listen(port,()=>{
    console.log(`server is running on ${port}`);
})
