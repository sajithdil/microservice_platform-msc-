var express = require('express');
var router = express.Router();


router.post('/', function(req, res, next) {
  
  // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var userName = req.body.username;
    var projectname = req.body.projectname;
    
    console.log("userName: " + userName);
    console.log("projectname: " + projectname);
    
    // Set our collection
    var collection = db.get('projects');
    
    // Submit to the DB
    collection.insert({
        "username" : userName,
        "projectname" : projectname
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
    var collection = db.get('projects');
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

router.get('/:user', function(req, res, next) {
    
    var db = req.db;
    
    // Set our collection
    var collection = db.get('projects');
    console.log(collection);
    var obj = collection.find({"username":req.params.user},function(err,data){
        if(err)
        {
            res.status(500).send(err);
            return;
        }
        res.send(data);
    });
    console.log(obj);
    
});

router.get('/:user/:proj', function(req, res, next) {
    
    var db = req.db;
    
    // Set our collection
    var collection = db.get('projects');
    console.log(collection);
    var obj = collection.find({"username":req.params.user,"projectname":req.params.proj},function(err,data){
        if(err)
        {
            res.status(500).send(err);
            return;
        }
        res.send(data);
    });
    console.log(obj);
    
});




router.post('/save', function(req, res, next) {
  
  // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var userName = req.body.username;
    var projectname = req.body.projectname;
    var dataflow = req.body.dataflow;
    
    console.log("userName: " + userName);
    console.log("projectname: " + projectname);
    
    
    // Set our collection
    var collection = db.get('projects');
    
    // Submit to the DB
    collection.update({
        "username" : userName,
        "projectname" : projectname
    },{"dataflow":dataflow, "username" : userName, "projectname" : projectname}, function (err, doc) {
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


module.exports = router;
