const express = require('express')
const server = express()

const projectRouter = require('./routers/project-router')
const actionRouter = require('./routers/action-router')

server.use(express.json())
server.use(projectRouter)
server.use(actionRouter)

module.exports = server