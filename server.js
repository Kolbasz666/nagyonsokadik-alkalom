const express = require('express')
const dbHandler = require('./dbHandler')
const cors = require('cors')
const routes = require('./routes')

require('dotenv').config()

//dbHandler.user.sync({alter: true})
//dbHandler.artwork.sync({alter: true})

const PORT = process.env.PORT
const server = express()

server.use(cors())
server.use(express.json())
server.use('/',routes)

server.listen(PORT,() => console.log("A szerver fut :)"))