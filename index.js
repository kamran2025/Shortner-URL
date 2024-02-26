const express = require('express')
const {connectMongoDb} = require('./connect')
const path = require('path')
const cookieParser = require('cookie-parser')
const {checkForAuthentication,} = require('./middlewares/auth')
const URL = require('./models/url')

const staticRoute = require('./routes/staticRouter')
const urlRoute = require('./routes/url')
const userRoute = require('./routes/user')

const app = express()
const PORT = process.env.PORT || 8801;
connectMongoDb("mongodb://127.0.0.1:27017/short-url")
.then((res)=> console.log('Connected mongo db'))

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