var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  var db = req.db;
  var collection = db.get('service_registry');
    

    var obj = collection.find({},function(err,data){
        if(err)
        {
            res.status(500).send(err);
            return;
        }
        res.send(data);
    });
});


router.get('/:projname', function(req, res, next) {
  var db = req.db;
  var collection = db.get('service_registry');
    

    var obj = collection.findOne({"project":req.params.projname},function(err,data){
        if(err)
        {
            res.status(500).send(err);
            return;
        }
        res.send(data);
    });
});



module.exports = router;
