const connectToMongo = require('./DB');
const express = require('express')

connectToMongo();
const app = express()
const port = 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// My Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/auth', require('./routes/notes'))


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})