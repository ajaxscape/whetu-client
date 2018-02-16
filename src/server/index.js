const heartBeat = require('./heart-beat')
const express = require('express')
const app = express()

heartBeat.start()

app.use(express.static('public'))

app.get('/', function (req, res) {
  res.sendfile(`${__dirname}/../../client/views/index.html`)
})

const PORT = process.env.PORT || 5000
app.listen(PORT, function () {
  console.log(`Example app listening on port ${PORT}!`)
})
