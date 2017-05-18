var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res, next) {
  
  // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var userName = req.body.username;
    var bObjs = req.body.b_objs;
    
    // Set our collection
    var collection = db.get('business_objects');
    
    // Submit to the DB
    collection.update({
        "username" : userName
    },{"b_objs":bObjs,"username":userName},{upsert:true}, function (err, doc) {
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

router.get('/:username', function(req, res, next) {
    
    var userName = req.params.username;
    console.log("userName: " + userName);
    var db = req.db;
    
    // Set our collection
    var collection = db.get('business_objects');
    //console.log(collection);
    var obj = collection.findOne({username:userName},function(err,data){
        
        if(err)
        {
            console.log(err);
            res.status(500).send(err);
            return;
        }
        console.log(data);
        res.send(data);
    });
    console.log(obj);
    
});


module.exports = router;
