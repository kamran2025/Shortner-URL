const express = require('express')
const {connectMongoDb} = require('./connect')
require('dotenv').config()
const path = require('path')
const cookieParser = require('cookie-parser')
const {checkForAuthentication,} = require('./middlewares/auth')
const URL = require('./models/url')

const staticRoute = require('./routes/staticRouter')
const urlRoute = require('./routes/url')
const userRoute = require('./routes/user')

const app = express()
const PORT = process.env.PORT
const databaseUrl = process.env.DATABASE_URI
connectMongoDb(databaseUrl)

app.set('view engine', 'ejs')
app.set('views', path.resolve('./views'))

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(checkForAuthentication)

app.use('/url', urlRoute)
app.use('/user', userRoute)
app.use('/', staticRoute) 

app.get('/url/:shortId', async (req, res)=>{
  const shortId = req.params.shortId
  const entry = await URL.findOneAndUpdate(
    {shortId}, 
    {$push: {
      visitHistory: {timestamp: Date.now()}
    }},
  )
  res.redirect(entry.redirectURL)
})

app.listen(PORT, ()=>{
  console.log(`listning Port on : http://localhost:${PORT}`)
})