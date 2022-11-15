const express = require("express")
const app = express()
const cors = require("cors")
const http = require('http').Server(app);
const PORT = process.env.PORT || 4000
const socketIO = require('socket.io')(http, {
    cors: {
        origin: "https://nikchat2.herokuapp.com"
    },
    cookie: true
});
const fs = require('fs');

app.use(cors())
let users = []

require("./db/conn");
var Todo = require("./models/schema")

socketIO.on('connection', (socket) => { 
  
  console.log(" whener socket connection establish then we are get this log ");

    socket.on("message", data => {
      
      console.log(" whener user are send message then we are get this log ");

      socketIO.emit("messageResponse", data)

    })

    // socket.on("typing", data => (
    //   socket.broadcast.emit("typingResponse", data)
    // ))

    socket.on("newUser", async (data) => {

      try{
          
        let data2 = new Todo({

          username: data.userName,
          socketID:1
  
        })
  
      await data2.save();

      }catch(errr){

        var updateuser = await Todo.findOneAndUpdate({ username: data.userName }, { $set: { socketID: 1 } });
        await updateuser.save();

      }

    users.push(data)
        
      console.log(" whener user are joint room then we are get this log ");
      
      socketIO.emit("newUserResponse", users)
    })
 
    socket.on('disconnect', async () => {

      console.log(" whener user are leave room then we are get this log ");

      var userarray = [];

      for(var i=0;i<users.length;i++){
        userarray.push(users[i].userName);
      }

      users = users.filter(user => user.socketID !== socket.id)

      for(var j=0;j<users.length;j++){
        
        var value = users[j].userName

        userarray = userarray.filter(function(item) {
            return item !== value
        })

      }

      var aa = await Todo.find({username:userarray[0]})

      if(aa.length == 0){

        let data3 = new Todo({

          username: userarray[0],
          socketID:0
  
        })
  
      await data3.save();

      }else{

        if(aa[0].socketID == 1){

          var updateuser = await Todo.findOneAndUpdate({ username: userarray[0] }, { $set: { socketID: 0 } });
          await updateuser.save();

        }

      }

      socketIO.emit("newUserResponse", users)
      socket.disconnect()

    });
    
});

app.get('/find', async (req, res) => {

  var a = await Todo.find()
    
  res.json(a);

});

app.get('/delete', async (req, res) => {

  var b = await Todo.find().deleteOne();
    
  res.json(b);

});

app.get('/add', async (req, res) => {

  let data3 = new Todo({

    username: "Ghoghari",
    socketID:0

  })

await data3.save();

res.send("data added");

});

http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
