var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/:username/:proj/:id', function(req, res, next) {
  var db = req.db;
  var collection = db.get('mscomp_handling');
    

    var obj = collection.findOne({"username":req.params.username,"proj":req.params.proj,"id":req.params.id},function(err,data){
        if(err)
        {
            res.status(500).send(err);
            return;
        }
        res.send(data);
    });
});

router.post('/', function(req, res, next) {
  var db = req.db;
  var collection = db.get('mscomp_handling');
    

    var obj = collection.update({"username":req.body.username,"proj":req.body.proj,"id":req.body.id},{"username":req.body.username,"proj":req.body.proj,"id":req.body.id,"mscomp":req.body.mscomp,"msname":req.body.msname},{upsert:true},function(err,data){
        if(err)
        {
            res.status(500).send(err);
            return;
        }
        res.send(data);
    });
});



module.exports = router;
