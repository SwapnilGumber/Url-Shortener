require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
const app = express()

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err))

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

// Home page - list all short URLs
app.get('/', async (req, res) => {
  const shortUrls = await ShortUrl.find()
  res.render('index', { shortUrls })
})

// Handle form submission
app.post('/shortUrls', async (req, res) => {
  let shortUrl = await ShortUrl.findOne({ full: req.body.full })
  if (!shortUrl) {
    shortUrl = await ShortUrl.create({ full: req.body.full })
  }
  res.redirect('/')
})

// Redirect route
app.get('/:shortId', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortId })
  if (!shortUrl) return res.sendStatus(404)

  shortUrl.clicks++
  await shortUrl.save()   // ✅ FIXED
  res.redirect(shortUrl.full)
})

app.listen(process.env.PORT || 5000, () => {
  console.log("🚀 Server running on http://localhost:5000")
})
