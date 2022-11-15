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

app.get("/list/:username", async (req,res)=>{

  res.send("Hi");

})
   
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
