var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res, next) {
  
  // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var userName = req.body.username;
    var password = req.body.password;
    
    // Set our collection
    var collection = db.get('users');
    
    // Submit to the DB
    collection.insert({
        "username" : userName,
        "password" : password
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
    var collection = db.get('users');
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


module.exports = router;
