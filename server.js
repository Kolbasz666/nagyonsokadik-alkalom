const express = require('express')
const dbHandler = require('./dbHandler')
const cors = require('cors')
const routes = require('./routes')

require('dotenv').config()

dbHandler.user.sync({force: true})

const PORT = process.env.PORT
const server = express()

//csak tesztelésre!!!!
server.use(express.static('public'))

server.use(cors())
server.use(express.json())
server.use('/',routes)

server.listen(PORT,() => console.log("A szerver fut :)"))