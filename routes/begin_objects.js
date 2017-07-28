var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res, next) {
  
  // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var userName = req.body.username;
    var project = req.body.project;
    var bObjs = req.body.begin_objs;
    
    // Set our collection
    var collection = db.get('begin_objects');
    
    // Submit to the DB
    collection.update({
        "username" : userName,
        "project":project
    },{"begin_objs":bObjs,"username":userName,"project":project},{upsert:true}, function (err, doc) {
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
    var collection = db.get('begin_objects');
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

router.get('/:username/:project', function(req, res, next) {
    
    var userName = req.params.username;
    var project = req.params.project;
    console.log("userName: " + userName);
    console.log("project: " + project);
    var db = req.db;
    
    // Set our collection
    var collection = db.get('begin_objects');
    //console.log(collection);
    var obj = collection.findOne({"username":userName,"project":project},function(err,data){
        
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
