var express = require('express');
var router = express.Router();

var exec = require('child_process').exec;
var cLocCmd = 'pwd';
var cdCmd = 'cd ';
var cpCmd = '/bin/cp -rf template_app/msapp ';
var dockerCmd = 'docker build -t sajithdil/testapp template_app/testapp';
var dockerStopCmd = 'docker stop $(docker ps -q --filter ancestor=sajithdil/testapp )';
var dockerExecCmd = 'docker run -p 49160:3000 -d sajithdil/testapp';

var fs = require('fs')

var xmldoc = require('xmldoc');

/* GET users listing. */
router.post('/', function(req, res, next) {
  
//  exec(cLocCmd, function(error, stdout, stderr) {
//  // command output is in stdout
//      
//       if (error !== null) {
//            console.log('exec error: ' + error);
//           res.status(500).send('Error executing command: ' + error);
//           
//          }
//      console.log("stdout: " + stdout);
//      
//      var existingLoc = stdout;
//      
//      //res.status(200).send(stdout);
//      
//      exec(cdCmd+'template_app', function(error, stdout1, stderr) {
//      // command output is in stdout
//
//           if (error !== null) {
//                console.log('exec error: ' + error);
//               res.status(500).send('Error executing command: ' + error);
//
//              }
//          
//          console.log("stdout1: " + stdout1);
//          exec(cpCmd+'template_app/testapp', function(error, stdout2, stderr) {
//          // command output is in stdout
//
//               if (error !== null) {
//                    console.log('exec error: ' + error);
//                   res.status(500).send('Error executing command: ' + error);
//
//                  }
//               console.log("stdout2: " + stdout2);
//                exec(cdCmd+'testapp', function(error, stdout3, stderr) {
//                  // command output is in stdout
//
//                       if (error !== null) {
//                            console.log('exec error: ' + error);
//                           res.status(500).send('Error executing command: ' + error);
//
//                          }
//                    console.log("stdout3: " + stdout3);
//                    exec(dockerCmd, function(error, stdout4, stderr) {
//                      // command output is in stdout
//
//                           if (error !== null) {
//                                console.log('exec error: ' + error);
//                               res.status(500).send('Error executing command: ' + error);
//
//                              }
//                        console.log("stdout4: " + stdout4);
//                        exec(dockerCmd, function(error, stdout, stderr) {
//                          // command output is in stdout
//
//                               if (error !== null) {
//                                    console.log('exec error: ' + error);
//                                   res.status(500).send('Error executing command: ' + error);
//
//                                  }
//
//                            exec(cdCmd+existingLoc, function(error, stdout5, stderr) {
//                              // command output is in stdout
//
//                                   if (error !== null) {
//                                        console.log('exec error: ' + error);
//                                       res.status(500).send('Error executing command: ' + error);
//
//                                      }
//
//
//                                console.log("stdout5: " + stdout5);
//                                res.status(200).send("OK");
//                              });
//
//                          });
//
//                      });
//
//                  });
//
//          });
//          
//      });
//      
//  });
    
    exec(cpCmd+'template_app/testapp', function(error, stdout, stderr) {
    // command output is in stdout
    
         if (error !== null) {
              console.log('exec error: ' + error);
             res.status(500).send('Error executing command: ' + error);
    
            }
        console.log("stdout: " + stdout);
		exec(dockerCmd, function(error, stdout1, stderr) {
			// command output is in stdout
			
				 if (error !== null) {
					  console.log('exec error: ' + error);
					 res.status(500).send('Error executing command: ' + error);
			
					}
			     console.log("stdout1: " + stdout1);
				//res.status(200).send("OK");
            
            exec(dockerExecCmd, function(error, stdout2, stderr) {
                // command output is in stdout

                     if (error !== null) {
                          console.log('exec error: ' + error);
                         res.status(500).send('Error executing command: ' + error);

                        }
                     console.log("stdout2: " + stdout2);
                    res.status(200).send("OK");

            });
			
		});
    
    });
    
});

router.post('/:user/:proj', function(req, res, next) {
    
    var appString = "";
    
    var projid = req.params.projid;
    
    // Set our internal DB variable
    var db = req.db;

    
    // Set our collection
    var collection = db.get('projects');
    console.log(collection);
    var obj = collection.find({"username":req.params.user,"projectname":req.params.proj},function(err,data){
        if(err)
        {
            console.log("projects find err: ",err);
            
            res.status(500).send(err);
            return;
        }
        
        //get project
        var proj = data[0];
        
        console.log('Dataflow: '+ proj.dataflow);
        var document = new xmldoc.XmlDocument(proj.dataflow);
        
        console.log("Doc: " + document);
        
        var rootd = document.childNamed("root");
        
        var compNode = [];
        var connNode = [];
        console.log("chilren length: " + rootd.children.length);
        for(var i=0;i<rootd.children.length;i++)
        {
            console.log("noodeing: " + rootd.children[i]);
            if(rootd.children[i].name!="Diagram" && rootd.children[i].name!="Layer")
            {
                console.log("not diagram: " + rootd.children[i].name);
                if(rootd.children[i].name!="Connector")
                {
                    compNode.push(rootd.children[i]);
                }
                else
                {
                    connNode.push(rootd.children[i]);
                }
            }
            else
            {
                console.log("rejeccted node: " + rootd.children[i].name);
            }
        }
        
        console.log("compNode length: " + compNode.length);
        console.log("connNode length: " + connNode.length);
        console.log("-----------------------------");
        var boDb = db.get('business_objects');
        
        console.log("req.params.user: " + req.params.user);
        console.log("req.params.proj: " + req.params.proj);
        console.log("boDb: " + boDb);
        boDb.findOne({"username":req.params.user,"project":req.params.proj},function(boObjerr,boObjdata){
            
            if(err)
            {
                console.log("boObjs err: "+boObjerr);
                res.status(500).send('boObjerr: ' + boObjerr);
                
            }
            
            console.log("boObjdata: " +boObjdata);
            
            
            //get begin id
        
            var beginid=0;
            console.log("looking for begin id");
            for(var i=0;i<compNode.length;i++)
            {
                console.log("compNode[i].name: " +compNode[i].name);
                if(compNode[i].name=="Begin")
                {
                    beginid=compNode[i].attr.id;
                    console.log("beginid: " + beginid);
                    break;
                }
            }
            
            var targetAttr = 0;
            console.log("looking for begin comp")
            for(var i=0;i<connNode.length;i++)
            {
                //console.log("conn source: "+ connNode[i].firstChild.attr.source);
                var childNode = {};
                for(var m=0;m<connNode[i].children.length;m++)
                {
                    if(connNode[i].children[m].name=="mxCell")
                    {
                        childNode = connNode[i].children[m];
                        break;
                    }
                }
                console.log("conn source: " + childNode.attr.source);
                if(childNode.attr.source == beginid)
                {
                    //set begin variables
                    console.log("found begin");
                    for(var j=0;j<boObjdata.b_objs.length;j++)
                    {
                        appString+="var "+boObjdata.b_objs[j].name+" = '';\n";
                    }
                    console.log("appString: " +appString);
                    //set target attr
                    targetAttr = childNode.attr.target;
                    console.log("setting target: "+ targetAttr);
                    break;
                }
            }
            console.log("finding next target");
            loop1: for(var i=0;i<connNode.length;i++)
            {
                console.log("finding target: "+targetAttr);
                var childNode = {};
                for(var m=0;m<connNode[i].children.length;m++)
                {
                    if(connNode[i].children[m].name=="mxCell")
                    {
                        childNode = connNode[i].children[m];
                        break;
                    }
                }
                console.log("target source: "+childNode.attr.source);
                if(childNode.attr.source == targetAttr)
                {
                    console.log("target matched, looking for component");
                    console.log("running loop 2");
                    //console.log("compNode: " + compNode);
                    loop2:for(var x=0;x<compNode.length;x++)
                    {
                        console.log("compNode[x].name: " + compNode[x].name);
                        if(compNode[x].name!="" && compNode[x].name!=undefined)
                        {
                            console.log("------------------------");
                        
                            console.log("looking comp node: " + compNode[x].attr.id);
                            //console.log("//////");
                            if(compNode[x].attr.id==targetAttr)
                            {
                                console.log('found matching target');
                                executingValidationOfComponents(x,targetAttr,compNode);
                            }
                            
                            console.log("///////////////////////////////////////////////////");
                        }
                    }
                    //set next target
                    targetAttr = childNode.attr.target;
                    i=0;
                }
            }
            
            console.log("logic creation complete");
            //app logic creation complete
            //now building and executing app
            exec(cpCmd+'template_app/testapp', function(error, stdout, stderr) {
            // command output is in stdout
            
                 if (error !== null) {
                      console.log('exec error: ' + error);
                     res.status(500).send('Error executing command: ' + error);
            
                }
                console.log("stdout: " + stdout);
                //copy complete, add appString   
                
                fs.readFile('template_app/testapp/routes/execute.js', 'utf8', function (errf,data) {
                      if (errf) {
                        console.log(errf);
                        res.status(500).send('Error reading file: ' + errf);
                      }
                    console.log("data: " + data);
                      console.log("appString: " + appString);
                      var result = data.replace(/<<@@logic@@>>/g, appString);
                    console.log("result: " +result);
                      fs.writeFile('template_app/testapp/routes/execute.js', result, 'utf8', function (errw) {
                         if (errf) {
                            console.log(errw);
                            res.status(500).send('Error writing file: ' + errw);
                          }
                          
                          exec(dockerStopCmd, function(error, stdout3, stderr) {
                              if (error !== null) {
                                  console.log('exec error: ' + error);
                                  console.log("this failure does not matter");
                                 //res.status(500).send('Error executing command: ' + error);

                                }
                              console.log("stdout3: " + stdout3);
                              
                              exec(dockerCmd, function(error, stdout1, stderr) {
                                // command output is in stdout

                                     if (error !== null) {
                                          console.log('exec error: ' + error);
                                         res.status(500).send('Error executing command: ' + error);

                                        }
                                     console.log("stdout1: " + stdout1);
                                    //res.status(200).send("OK");

                                exec(dockerExecCmd, function(error, stdout2, stderr) {
                                    // command output is in stdout

                                         if (error !== null) {
                                              console.log('exec error: ' + error);
                                             res.status(500).send('Error executing command: ' + error);

                                            }
                                         console.log("stdout2: " + stdout2);
                                        res.status(200).send("OK");

                                });

                            });
                              
                          });
                          
                    });
                });
                  
            });
            
            
            
            
            
        });
        
        //res.status(200).send('OK');
    });
    
});

function executingValidationOfComponents(x,targetAttr,compNode){
    console.log("executing fun x:" +x +" targetAttr: " +targetAttr);
    if(compNode[x].name=="End")
    {
        console.log("found end");
        //export end variables. and end
        
    }
    else if(compNode[x].name=="Switch")
    {
        console.log("found switch");
//        var switchid = 0;
//        var tarIds = [];
//        for(var k=0;k<connNode.length;k++)
//        {
//            console.log("conn source: "+ connNode[k].firstChild.attr.source);
//            if(connNode[k].firstChild.attr.source == switchid)
//            {
//                tarIds.push(connNode[k].firstChild.attr.target);
//            }
//        }
//        console.log("target ids: "+tarIds);
    }
    else if(compNode[x].name=="Decision")
    {
        console.log("found dec");
//        var switchid = 0;
//        var tarIds = [];
//        for(var k=0;k<connNode.length;k++)
//        {
//            console.log("conn source: "+ connNode[k].firstChild.attr.source);
//            if(connNode[k].firstChild.attr.source == switchid)
//            {
//                tarIds.push(connNode[k].firstChild.attr.target);
//            }
//        }
//        console.log("target ids: "+tarIds);
    }
    else
    {
        console.log("found component");
        switch (compNode[x].name)
        {
            case "Script":
               break;
            case "Decision":
               break;
            case "REST":
               break;
            case "Database":
               break;
        }
    }
//    else
//    {
//        console.log("could not match component id:" + compNode[x].attr.id +" to target: " +compNode[x].attr.id);
//    }
    
}


module.exports = router;
