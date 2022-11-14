const express = require("express")
const app = express()
const cors = require("cors")
const http = require('http').Server(app);
const PORT = process.env.PORT || 4000
const socketIO = require('socket.io')(http, {
    cors: {
        origin: "https://nikchat2.herokuapp.com"
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
    
    var a = socket.id ;
    
    function Display(a) { 
       
        await Todo.find({username:"Nikunj"}).deleteOne();
        
    }

    Display();
    
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

        let data2 = new Todo({

          username: data.userName,
          socketID:data.socketID

        })

      await data2.save();
          
      users.push(data);
          
        socketIO.emit("newUserResponse", users)
          
      })
   
      socket.on('disconnect', () => {
          
        users = users.filter(user => user.socketID !== socket.id)
          
        socketIO.emit("newUserResponse", users)
          
        socket.disconnect()
          
      });

    }catch(err){
      console.log(err);
    }

});
    
app.get('/find', async (req, res) => {

  var a = await Todo.find()
    
  res.json(a);

});

app.get('/delete', async (req, res) => {

  var a = "Nikunj"
  var b = await Todo.find({username:a}).deleteOne();
    
  res.json(b);

});

   
http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
