const express = require('express')
const app = express()
const router = require('./routes/router')
const errorHandler = require("./middleware/errorHandler")
const middlewareLogRequest = require('./middleware/logs')

app.use(express.json())
app.use(express.urlencoded({ extended: true })) 

app.use(middlewareLogRequest)

app.use(router)

app.use(errorHandler);

module.exports = app