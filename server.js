const { log } = require("console")
const express = require("express")
const http = require("http")
const {Server} = require("socket.io")
const app = express()
const server = http.createServer(app)
const path = require("path")
const io = new Server(server, {pingInterval: 2000, pingTimeout: 5000})

const port = 3000

app.use(express.static(__dirname + "/public"))


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname , "public/views/lobby.html"))
})

app.get("/index", (req, res) => {
    res.sendFile(path.join(__dirname + "/public/views/index.html"))
})



server.listen(port, () => {
    console.log("server is running")
})