const express = require("express")
const app = express()
const cors = require("cors")
const http = require('http').Server(app);
const PORT = process.env.PORT || 4000
const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000"
    }
});
const fs = require('fs');
const rawData = fs.readFileSync('messages.json');
const messagesData = JSON.parse(rawData);

app.use(cors())
let users = []

require("./db/conn");
var Todo = require("./models/schema")

socketIO.on('connection', (socket) => {

    try{
      socket.on("message", data => {
        /** 
        Uncomment to save the messages to the message.json file 
        */
  
        // messagesData["messages"].push(data)
        // const stringData = JSON.stringify(messagesData, null, 2)
        // fs.writeFile("messages.json", stringData, (err)=> {
        //     console.error(err)
        //   })

        socketIO.emit("messageResponse", data)
      })
  
      socket.on("typing", data => (
        socket.broadcast.emit("typingResponse", data)
      ))
  
      socket.on("newUser", async (data) => {

        users.push(data)

        let data2 = new Todo({

          username: data

      })

      await data2.save();

        socketIO.emit("newUserResponse", users)
      })
   
      socket.on('disconnect', () => {
        console.log('🔥: A user disconnected');
        users = users.filter(user => user.socketID !== socket.id)
        socketIO.emit("newUserResponse", users)
        socket.disconnect()
      });

    }catch(err){
      console.log(err);
    }

});
    
app.get('/find', async (req, res) => {

  res.send("Hi");

});

   
http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
