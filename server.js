const express = require('express')
const server = express()

const projectsRouter = require('./routers/project-router')

server.use(express.json())
server.use(projectsRouter)

module.exports = server