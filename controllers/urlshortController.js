require('dotenv').config()
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var connectionOptions={
    useNewUrlParser: true
};
var itemsInDb;
var urlencodedParser = bodyParser.urlencoded({extended: false});
var dns = require('dns');
const url = require('url');
var validUrl = require('valid-url');

// Connect to db
mongoose.connect(process.env.MONGODB_URI+'',connectionOptions,(err)=>{
    if(err){
        console.log(err);
    }else{
        console.log('connected to db!');
    }
});

// Create a Schema
var urlshortSchema = new mongoose.Schema({
    url:String,
    urlShortened:String
});

var shortUrl = mongoose.model('shortUrl', urlshortSchema);

module.exports = function(app){

    app.get('/', function(req, res){
      res.redirect('/api/shorturl/new');
        });

    app.get('/api/shorturl/new', function(req, res){
        res.render('index');

    });

    app.get('/api/shorturl/new/:url(*)',urlencodedParser, function(req, res){
        updateNumOfItems();
        var newUrl = url.parse(req.params.url);
        if(validUrl.isUri(newUrl.href)){
          console.log(req.params.url+': Valid');
        dns.lookup(newUrl.hostname,function(err, address, familly){
            console.log(newUrl+' ip: '+address);
              if(address !== undefined){

                   console.log('Items in db: '+itemsInDb);

                  shortUrl.findOne({url:newUrl.href},function(err, data){

                    if(data === null){
                  var newShortUrl = shortUrl({url:newUrl.href, urlShortened:itemsInDb+1})
                  .save(function(err){
                      if(err) throw err;
                      res.json({Original_url:newUrl.href, short_url:itemsInDb+1});
                      console.log(newUrl.href+' has been saved succesfully!')
                  });

              }
              else if(data.url === newUrl.href){
             console.log(data.url+' is already saved with new url: '+data.urlShortened);
               res.json({Original_url:data.url, short_url:data.urlShortened});
               }


          });


              } else{
                  res.json({error:"invalid URL"});
               }

          });


        }else{
          console.log(req.body.url+': invalid');
          res.json({error:"invalid URL"});
        }
        console.log(newUrl);



     });

    app.get('/api/shorturl/:num', function(req, res){
        console.log(req.params.num);
        shortUrl.findOne({urlShortened:req.params.num},function(err, data){
            console.log('data: '+data);
            if(data === null){
                console.log('Not even trying to redirect');
                res.json({error:"invalid URL"});
            }else{
                console.log('Trying to redirect to: '+data.url);
                res.redirect(data.url);
            }
        });

    });





        function updateNumOfItems(){
            shortUrl.countDocuments(function(err,c){
                itemsInDb = c;
            });
        };



    }
