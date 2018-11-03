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

    app.get('/api/shorturl/new', function(req, res){
        res.render('index');

    });

    app.post('/api/shorturl/new',urlencodedParser, function(req, res){
        var newUrl = url.parse(req.body.url);
        console.log(newUrl);

        dns.lookup(newUrl.hostname,function(err, address, familly){
          console.log(newUrl+' ip: '+address);
            if(address !== undefined){
                updateNumOfItems();
                 console.log('Items in db: '+itemsInDb);

                shortUrl.findOne({url:newUrl},function(err, data){

                  if(data === null){
                  if(newUrl.charAt(0)+newUrl.charAt(1)+newUrl.charAt(2) == 'www'){
                    newUrl = 'http://'+newUrl;
                    console.log('Url that had www : '+newUrl);
                  }else{
                    newUrl = 'http://www.'+newUrl;
                    console.log('Url without www : '+newUrl);
                  }
                var newShortUrl = shortUrl({url:newUrl, urlShortened:itemsInDb+1})
                .save(function(err){
                    if(err) throw err;
                    res.json({Original_url:newUrl, short_url:itemsInDb+1});
                    console.log(newUrl+' has been saved succesfully!')
                });

            }
            else if(data.url === newUrl){
           console.log(data.url+' is already saved with new url: '+data.urlShortened);
             res.json({Original_url:data.url, short_url:data.urlShortened});
             }


        });


            } else{
                res.json({error:"invalid URL"});
             }

        });

     });

    app.get('/api/shorturl/new/:num', function(req, res){
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
