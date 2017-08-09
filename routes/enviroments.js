var express = require('express');
var router = express.Router();


router.post('/', function(req, res, next) {
  
  // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var name = req.body.name;
    var loc = req.body.loc;
    var port = req.body.port;
    var dport = req.body.dport;
    
    // Set our collection
    var collection = db.get('env');
    
    // Submit to the DB
    collection.insert({
        "name" : name,
        "loc" : loc,
        "port":port,
        "dport":dport
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.status(500).send('Could not save to mongodb');
        }
        else {
            // And forward to success page
            //res.redirect("userlist");
            res.sendStatus(200);
        }
    });
  //res.send('respond with a resource');
});

router.get('/', function(req, res, next) {
    
    var db = req.db;
    
    // Set our collection
    var collection = db.get('env');
    console.log(collection);
    var obj = collection.find({},function(err,data){
        if(err)
        {
            res.status(500).send(err);
            return;
        }
        res.send(data);
    });
    console.log(obj);
    
});

router.get('/:name', function(req, res, next) {
    
    var db = req.db;
    
    // Set our collection
    var collection = db.get('env');
    console.log(collection);
    var obj = collection.findOne({"name":req.params.name},function(err,data){
        if(err)
        {
            res.status(500).send(err);
            return;
        }
        res.send(data);
    });
    console.log(obj);
    
});



module.exports = router;
