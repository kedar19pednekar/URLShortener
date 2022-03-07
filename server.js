const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
const app = express()

mongoose.connect('mongodb://localhost/urlShortener', {
  useNewUrlParser: true, useUnifiedTopology: true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

 // to render whole table on homepage
app.get('/', async (req, res) => {  
  const shortUrls = await ShortUrl.find()
  res.render('index', { shortUrls: shortUrls })
})

app.post('/shortUrls', async (req, res) => {
  const longURL = req.body.fullUrl.replaceAll(' ','').trim();
  const ifFound = await ShortUrl.findOne({ full: longURL });
  if(ifFound == null){
  await ShortUrl.create({ full: longURL }); 
  res.redirect('/')}
  else{
   res.redirect('/#already');
  //res.json("long url already present") // should send some message of 
    //already present long url   
  }
})

app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
  if (shortUrl == null) return res.sendStatus(404)

  shortUrl.clicks++
  shortUrl.save()

  res.redirect(shortUrl.full)
})


app.delete('/:shortkey', async (req, res)=>{
  const shortkey= req.params.shortkey;
  try{
          await ShortUrl.deleteOne({short:shortkey}); 
          res.json("shortkey deleted");
  }catch(error){
          res.json({message:error.message});
  }
})




app.listen(process.env.PORT || 3300); // URL shrinker FrontEnd url port