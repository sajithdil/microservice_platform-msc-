var express = require('express');
var requestify = require('requestify');
var ip = require('ip');
var router = express.Router();

var exec = require('child_process').exec;
var cLocCmd = 'pwd';
var cdCmd = 'cd ';
//var cpCmd = '/bin/cp -rf template_app/msapp ';
//var dockerCmd = 'docker build -t sajithdil/testapp template_app/testapp';
//var dockerStopCmd = 'docker stop $(docker ps -q --filter ancestor=sajithdil/testapp )';
//var dockerExecCmd = 'docker run -p 49160:3000 -d sajithdil/testapp';

var cpCmd = '/bin/cp -rf template_app/msapp ';
var dockerCmd = 'docker build -t sajithdil/<<appname>> template_app/<<appname>>';
var dockerStopCmd = 'docker stop $(docker ps -q --filter ancestor=sajithdil/<<appname>>)';
var dockerExecCmd = 'docker run -p <<dockerport>>:<<port>> -d sajithdil/<<appname>>';

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

router.post('/:user/:proj/:env', function(req, res, next) {
    
    var appString = "";
    
    //var projid = req.params.projid;
    
    // Set our internal DB variable
    var db = req.db;
    
//    var cpCmd = '/bin/cp -rf template_app/<<appname>> ';
//    var dockerCmd = 'docker build -t sajithdil/<<appname>> template_app/<<appname>>';
//    var dockerStopCmd = 'docker stop $(docker ps -q --filter ancestor=sajithdil/<<appname>> )';
//    var dockerExecCmd = 'docker run -p 49160:3000 -d sajithdil/<<appname>>';
    
    var projname = req.params.proj;
    
    var env = req.params.env;
    console.log("projname: " + projname);
    console.log("env: " + env);
    
    var envColl = db.get('env');
    //console.log(collection);
    
    var envObj = envColl.findOne({"name":env},function(errenv,envdata){
        if(errenv)
        {
            console.log("env find err: ",errenv);
            
            res.status(500).send(errenv);
            return;
        }
        
        //cpCmd = cpCmd.replace("<<appname>>",projname);
        dockerCmd = dockerCmd.replace("<<appname>>",projname);
        dockerCmd = dockerCmd.replace("<<appname>>",projname);
        dockerStopCmd = dockerStopCmd.replace("<<appname>>",projname);
        dockerExecCmd = dockerExecCmd.replace("<<appname>>",projname);
        dockerExecCmd = dockerExecCmd.replace("<<dockerport>>",envdata.dport);
        dockerExecCmd = dockerExecCmd.replace("<<port>>",envdata.port);

        console.log("cpCmd: " +cpCmd);
        //console.log("dockerCmd: " +dockerCmd);
        //console.log("dockerStopCmd: " +dockerCmd);
        //console.log("dockerExecCmd: " +dockerExecCmd);
        
        // Set our collection
        var collection = db.get('projects');
        //console.log(collection);
        var obj = collection.find({"username":req.params.user,"projectname":req.params.proj},function(err,data){
            if(err)
            {
                console.log("projects find err: ",err);

                res.status(500).send(err);
                return;
            }

            //get project
            var proj = data[0];

            //console.log('Dataflow: '+ proj.dataflow);
            var document = new xmldoc.XmlDocument(proj.dataflow);

            //console.log("Doc: " + document);
            
            var swaggerString = "";
            
            swaggerString+="/**\n";
            swaggerString+="  * @swagger\n";
            swaggerString+=" * /execute:\n";
            swaggerString+=" *   post:\n";
            swaggerString+=" *     tags:\n";
            swaggerString+=" *       - Object\n";
            swaggerString+=" *     description: \n";
            swaggerString+=" *     produces:\n";
            swaggerString+=" *       - application/json\n";
            swaggerString+=" *     parameters:\n";
            swaggerString+=" *       - name: Object\n";
            swaggerString+=" *         description: \n";
            swaggerString+=" *         in: body\n";
            swaggerString+=" *         required: true\n";
            swaggerString+=" *         schema:\n";
            swaggerString+=" *           $ref: '#/definitions/BeginObject'\n";
            swaggerString+=" *     responses:\n";
            swaggerString+=" *       200:\n";
            swaggerString+=" *         description: \n";
            swaggerString+=" *         schema:\n";
            swaggerString+=" *           $ref: '#/definitions/EndObject'\n";
            swaggerString+=" */\n";
            
            var beginSwString="";
            var endSwString="";

            var swaggerPromiseArr = [];
            var beginPromise = new Promise((resolve, reject) => {
                var beginObjcollection = db.get('begin_objects');
                //console.log(collection);
                var beginObjcollectionobj = beginObjcollection.findOne({"username":req.params.user,"project":req.params.proj},function(err,data){

                    if(err)
                    {
                        console.log(err); 
                        res.status(500).send(err);
                        return;
                    }
                    console.log("about to build begin swagger object");
                    beginSwString+="/**\n";
                    beginSwString+=" * @swagger\n";
                    beginSwString+=" * definition:\n";
                    beginSwString+=" *   BeginObject:\n";
                    beginSwString+=" *     properties:\n";
//                    beginSwString+=" *       name:\n";
//                    beginSwString+=" *         type: string\n";
//                    beginSwString+=" *       breed:\n";
//                    beginSwString+=" *         type: string\n";
//                    beginSwString+=" *       age:\n";
//                    beginSwString+=" *         type: integer\n";
//                    beginSwString+=" *       sex:\n";
//                    beginSwString+=" *         type: string\n";
                    
                    for(var r=0;r<data.begin_objs.length;r++)
                    {
                        beginSwString+=" *       "+data.begin_objs[r].name+":\n";
                        beginSwString+=" *         type: "+data.begin_objs[r].type+"\n";
                    }
                    
                    beginSwString+=" */\n";
                    
                    console.log("beginSwString: "+beginSwString);

                    resolve(beginSwString);
                });
            });
            
            swaggerPromiseArr.push(beginPromise);
            
            var endPromise = new Promise((resolve, reject) => {
                var endObjcollection = db.get('end_objects');
                //console.log(collection);
                var endObjcollectionobj = endObjcollection.findOne({"username":req.params.user,"project":req.params.proj},function(err,data){

                    if(err)
                    {
                        console.log(err);
                        res.status(500).send(err);
                        return;
                    }
                    console.log("about to build end swagger object");
                    endSwString+="/**\n";
                    endSwString+=" * @swagger\n";
                    endSwString+=" * definition:\n";
                    endSwString+=" *   EndObject:\n";
                    endSwString+=" *     properties:\n";
//                    endSwString+=" *       name:\n";
//                    endSwString+=" *         type: string\n";
//                    endSwString+=" *       breed:\n";
//                    endSwString+=" *         type: string\n";
//                    endSwString+=" *       age:\n";
//                    endSwString+=" *         type: integer\n";
//                    endSwString+=" *       sex:\n";
//                    endSwString+=" *         type: string\n";
                    
                    for(var r=0;r<data.end_objs.length;r++)
                    {
                        endSwString+=" *       "+data.end_objs[r].name+":\n";
                        endSwString+=" *         type: "+data.end_objs[r].type+"\n";
                    }
                    
                    endSwString+=" */\n";
                    
                    console.log("endSwString: " +endSwString);

                    resolve(endSwString);
                });
            });
            
            swaggerPromiseArr.push(endPromise);
            
            var finalSwaggerString = "";
            
            Promise.all(swaggerPromiseArr).then(values => {
             
                finalSwaggerString+=values[0];
                finalSwaggerString+=values[1];
                finalSwaggerString+=swaggerString;
                
                console.log("finalSwaggerString: " +finalSwaggerString);
                
                var rootd = document.childNamed("root");

                var compNode = [];
                var connNode = [];
                var decConnNode = [];
                //console.log("chilren length: " + rootd.children.length);
                for(var i=0;i<rootd.children.length;i++)
                {
                    //console.log("noodeing: " + rootd.children[i]);
                    if(rootd.children[i].name!="Diagram" && rootd.children[i].name!="Layer")
                    {
                        //console.log("not diagram: " + rootd.children[i].name);
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
                        //console.log("rejeccted node: " + rootd.children[i].name);
                    }
                }

                //building decConnNodes
                console.log("searching dec conn nodes -----------------------------");
                for(var i=0;i<connNode.length;i++)
                {
                    //console.log("conn source: "+ connNode[i].firstChild.attr.source);

                     console.log("connNode[i].label: " +connNode[i].attr.label);
                    if(connNode[i].attr.label!="")
                    {
                        for(var m=0;m<connNode[i].children.length;m++)
                        {
                            if(connNode[i].children[m].name=="mxCell")
                            {
                                var childNode = {};
                                //childNode = connNode[i].children[m];
                                childNode.label = connNode[i].attr.label;
                                childNode.source = connNode[i].children[m].attr.source;
                                childNode.target = connNode[i].children[m].attr.target;
                                console.log("target: " +connNode[i].children[m].attr.target);
                                decConnNode.push(childNode);
                                break;
                            }
                        }
                    }

                }

                console.log("decConnNode.length: " +decConnNode.length);
                console.log("----------------------------------------------------------");

    //            console.log("compNode length: " + compNode.length);
    //            console.log("connNode length: " + connNode.length);
    //            console.log("-----------------------------");
                var boDb = db.get('business_objects');

    //            console.log("req.params.user: " + req.params.user);
    //            console.log("req.params.proj: " + req.params.proj);
    //            console.log("boDb: " + boDb);
                boDb.findOne({"username":req.params.user,"project":req.params.proj},function(boObjerr,boObjdata){

                    if(err)
                    {
                        console.log("boObjs err: "+boObjerr);
                        res.status(500).send('boObjerr: ' + boObjerr);

                    }

                    
                    var beDb = db.get('begin_objects');
                    
                    beDb.findOne({"username":req.params.user,"project":req.params.proj},function(boObjerr,beObjdata){
                        
                        
                        //console.log("boObjdata: " +boObjdata);

                        for(var j=0;j<boObjdata.b_objs.length;j++)
                        {
                            appString+="var "+boObjdata.b_objs[j].name+" = '';\n";
                        }

                        //console.log("boObjdata: " +boObjdata);
                        appString+="\n";
                        appString+="\n";
                        
                        for(var j=0;j<beObjdata.begin_objs.length;j++)
                        {
                           
                            appString+=beObjdata.begin_objs[j].valName+" = req.body."+beObjdata.begin_objs[j].name+";\n";
                        }
                        
                        appString+="\n";
                        appString+="\n";

                        //get begin id

                        var beginid=0;
                        //console.log("looking for begin id");
                        for(var i=0;i<compNode.length;i++)
                        {
                            //console.log("compNode[i].name: " +compNode[i].name);
                            if(compNode[i].name=="Begin")
                            {
                                beginid=compNode[i].attr.id;
                                console.log("beginid: " + beginid);
                                break;
                            }
                        }
                        console.log("finding begin target")
                        for(var i=0;i<connNode.length;i++)
                        {
                            //console.log("conn source: "+ connNode[i].firstChild.attr.source);
                            //console.log("connNode[i].name: " +connNode[i].name);
                            var childNode = {};
                            for(var m=0;m<connNode[i].children.length;m++)
                            {
                                if(connNode[i].children[m].name=="mxCell")
                                {

                                    childNode = connNode[i].children[m];
                                    break;
                                }
                            }
                            //console.log("conn source: " + childNode.attr.source);
                            if(childNode.attr.source == beginid)
                            {
                                console.log("found begin target");
                                appString+="\n";
                                appString+="exec"+childNode.attr.target+"();";
                                appString+="\n";

                                break;
                            }
                        }

                        var PromiseArray = [];
                        loop1: for(var v=0;v<connNode.length;v++)
                        {
                            //console.log("finding target: "+targetAttr);
                            console.log("v: "+v);
                            var childNode = {};

                            for(var m=0;m<connNode[v].children.length;m++)
                            {
                                if(connNode[v].children[m].name=="mxCell")
                                {
                                    childNode = connNode[v].children[m];
                                    break;
                                }
                            }
                            console.log("target source: "+childNode.attr.source);

                            for(var x=0;x<compNode.length;x++)
                            {
                                if(compNode[x].name!="" && compNode[x].name!=undefined)
                                {

                                    //console.log("//////");
                                    if(compNode[x].attr.id==childNode.attr.source)
                                    {
                                        if(compNode[x].name=="Begin")
                                        {
                                            //skip begin
                                            break;
                                        }

                                        if(compNode[x].used == undefined)
                                        {
                                            compNode[x].used = false;
                                        }

                                        if(!compNode[x].used)
                                        {
                                            PromiseArray.push(executingValidationOfComponents(x,childNode.attr.target,compNode,db,res,compNode[x].attr.id,req.params.proj,req.params.user,decConnNode));

                                            compNode[x].used = true;
                                        }

                                        break;

                                    }
                                }

                            }
                        }

                        //end component setting
                        console.log("looking for end");
                        for(var x=0;x<compNode.length;x++)
                        {
                            if(compNode[x].name!="" && compNode[x].name!=undefined && compNode[x].name=="End")
                            {


                                console.log('found matching end target');

                                PromiseArray.push(executingValidationOfComponents(x,0,compNode,db,res,compNode[x].attr.id,req.params.proj,req.params.user));

                                break;


                            }
                        }

                        //console.log("logic creation complete");

                        Promise.all(PromiseArray).then(values => { 

                            for(var i =0;i<values.length;i++)
                            {
                                appString+=values[i];
                            }

                            console.log("logic creation complete");
                            //app logic creation complete
                            //now building and executing app

                            exec('rm -rf template_app/'+projname, function(delerror, stdout, stderr) {

                                if (delerror !== null) {
                                          console.log('delerror error: ' + delerror);
                                         res.status(500).send('Error executing command: ' + delerror);

                                    }

                                exec(cpCmd+'template_app/'+projname, function(error, stdout, stderr) {
                                // command output is in stdout

                                     if (error !== null) {
                                          console.log('exec error: ' + error);
                                         res.status(500).send('Error executing command: ' + error);

                                    }
                                    console.log("stdout: " + stdout);
                                    //copy complete, add appString   

                                    fs.readFile('template_app/'+projname+'/routes/execute.js', 'utf8', function (errf,data) {
                                            if (errf) {
                                                console.log(errf);
                                                res.status(500).send('Error reading file: ' + errf);
                                            }
                                            //console.log("data: " + data);
                                            //console.log("appString: " + appString);
                                            var result = data.replace(/<<@@logic@@>>/g, appString);
                                            var result2 = result.replace(/<<swagger>>/g, finalSwaggerString);
                                            console.log("result2: " +result2);
                                            fs.writeFile('template_app/'+projname+'/routes/execute.js', result2, 'utf8', function (errw) {
                                                if (errf) {
                                                    console.log(errw);
                                                    res.status(500).send('Error writing file: ' + errw);
                                                }

                                                fs.readFile('template_app/'+projname+'/bin/www', 'utf8', function (errf,wwwdata) {
                                                    if (errf) {
                                                          console.log(errf);
                                                        res.status(500).send('Error reading file: ' + errf);
                                                    }
                                                    //console.log("wwwdata: " + wwwdata);
                                                    var wwwresult = wwwdata.replace(/<<port>>/g, envdata.port);
                                                    console.log("wwwresult: " +wwwresult);
                                                    fs.writeFile('template_app/'+projname+'/bin/www', wwwresult, 'utf8', function (errwww) {
                                                        if (errwww) {
                                                            console.log(errwww);
                                                            res.status(500).send('Error writing file: ' + errw);
                                                        }


                                                        fs.readFile('template_app/'+projname+'/Dockerfile', 'utf8', function (errdo,ddata) {
                                                            if (errdo) {
                                                                console.log(errdo);
                                                                res.status(500).send('Error reading file: ' + errdo);
                                                            }
                                                            //console.log("ddata: " + ddata);
                                                            var ddresult = ddata.replace(/<<port>>/g, envdata.port);
                                                            console.log("ddresult: " +ddresult);
                                                            fs.writeFile('template_app/'+projname+'/Dockerfile', ddresult, 'utf8', function (errddd) {
                                                                if (errddd) {
                                                                    console.log(errddd);
                                                                    res.status(500).send('Error writing file: ' + errddd);
                                                                }


                                                                fs.readFile('template_app/'+projname+'/app.js', 'utf8', function (errapp,appdata) {
                                                                    if (errapp) {
                                                                        console.log(errapp);
                                                                        res.status(500).send('Error reading file: ' + errapp);
                                                                    }
                                                                    //console.log("ddata: " + ddata);
                                                                    var appresult = appdata.replace(/<<port>>/g, envdata.port);
                                                                    console.log("appresult: " +appresult);
                                                                    fs.writeFile('template_app/'+projname+'/app.js', appresult, 'utf8', function (erraaaa) {
                                                                            if (erraaaa) {
                                                                                console.log(erraaaa);
                                                                                res.status(500).send('Error writing file: ' + erraaaa);
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
                                                                                        //res.status(200).send("OK");

                                                                                        var serreg = db.get('service_registry');

                                                                                        // Submit to the DB
                                                                                        serreg.update({
                                                                                            "project" : projname,
                                                                                            "env":env
                                                                                        },{"project" : projname,
                                                                                            "env":env},{upsert:true}, function (err, doc) {
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

                                                                                });

                                                                            });

                                                                        });


                                                                    });


                                                                });



                                                            });


                                                        });



                                                    });


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

        });
    
    
    });    

    
    
    
});

function executingValidationOfComponents(x,targetAttr,compNode,db,res,id,proj,username,decConnNodeTemp){
    
    var appString = "";
    
    var decConnNode = decConnNodeTemp;
    
    console.log("executing fun x:" +x +" targetAttr: " +targetAttr);
    console.log("executing fun x:" +x +" id: " +id);
    console.log("executing fun x:" +x +" proj: " +proj);
    console.log("executing fun x:" +x +" username: " +username);
    
    
    return new Promise((resolve, reject) => {
      if(compNode[x].name=="End")
        {
            console.log("found end");
            //export end variables. and end
            //skip this
            //handling this above with begin component variables and begin & end var swagger

            var collection = db.get('end_handling');
            var obj = collection.findOne({"username":username,"proj":proj,"id":id},function(err,data){
                if(err)
                {
                    res.status(500).send(err);
                    return;
                }

                appString+="\n";
                appString+="function exec"+id+"(){\n";
                appString+="\n";
                appString+="res.status(200).send("+data.endVar.end+");";
                appString+="\n";
                appString+="}\n"
                appString+="\n";
                
                console.log("end appString: " +appString);
                
                resolve(appString);

            });


        }

        else if(compNode[x].name=="Decision")
        {
            console.log("found dec");

            var collection = db.get('decision_handling');
            var obj = collection.findOne({"username":username,"proj":proj,"id":id},function(err,data){
                if(err)
                {
                    res.status(500).send(err);
                    return;
                }
                
                console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
                
                 appString+="\n";
                appString+="function exec"+id+"(){\n";
                appString+="\n";
               
                for(var i=0;i<data.decision.length;i++)
                {
                    console.log("data.decision[i].pathName: " +data.decision[i].pathName);
                    appString+="if("+data.decision[i].varName+" "+data.decision[i].act + " ";
                    console.log("data.decision[i].valType: " +data.decision[i].valType);
                    if(data.decision[i].valType=="Value")
                    {
                        
                        appString+="'"+data.decision[i].valName+"')"
                    }
                    else
                    {
                        //variable
                        appString+=""+data.decision[i].valName+")"
                    }
                    appString+="\n";
                    appString+="{\n";
                    
                    
                    appString+="exec";
                    console.log("about to decconnnode");
                    console.log("decConnNode.length: " +decConnNode);
                    for(var u=0;u<decConnNode.length;u++)
                    {
                        console.log("decConnNode[u].label: " +decConnNode[u].label);
                        console.log("data.decision[i].pathName: " +data.decision[i].pathName);
                        if(decConnNode[u].label==data.decision[i].pathName)
                        {
                             appString+=decConnNode[u].target+"();\n";
                            break;
                        }
                    }
                    
                    appString+="}\n";
                    
                    
                }
                
                
                appString+="\n";
                appString+="\n";
                //appString+="exec"+targetAttr+"();\n";
                appString+="\n";
                appString+="}\n"
                appString+="\n";
                
                console.log("decision appString: " +appString);
                
                console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
                
                resolve(appString);

            });
        }
        else if(compNode[x].name=="Script")
        {
            console.log("found Script");

            var collection = db.get('scripts_handling');
            var obj = collection.findOne({"username":username,"proj":proj,"id":id},function(err,data){
                if(err)
                {
                    console.log("scripts_handling failed: " +err);
                    res.status(500).send(err);
                    return;
                }
                
                console.log("script data: "+data);

                appString+="\n";
                appString+="function exec"+id+"(){\n";
                appString+="\n";
                appString+=data.script;
                appString+="\n";
                appString+="\n";
                appString+="exec"+targetAttr+"();\n";
                appString+="\n";
                appString+="}\n"
                appString+="\n";
                
                 console.log("script appString: "+appString);
                
                resolve(appString);

            });
        }
        else if(compNode[x].name=="REST")
        {
            console.log("found REST");

            var collection = db.get('rest_handling');
            var obj = collection.findOne({"username":username,"proj":proj,"id":id},function(err,data){
                if(err)
                {
                    res.status(500).send(err);
                    return;
                }
                console.log("REST data:");
                console.log(data);
                
                appString+="\n";
                appString+="function exec"+id+"(){\n";
                appString+="\n";
                console.log("data.rType: "+data.rest.rType);
                if(data.rest.rType=="GET")
                {
                    console.log("GET type");
                    appString+="requestify.get('"+data.rest.loc+"').then(function(response) {\n";
                        appString+=data.rest.resVar+"= response.getBody();\n";
                        appString+="\n";
                        appString+="exec"+targetAttr+"();\n";
                        appString+="\n";
                    
                        appString+="});\n";
                }
                else if(data.rest.rType=="POST")
                {
                    appString+="requestify.post('"+data.rest.loc+"', '"+data.rest.valName+"')\n";
                    appString+=".then(function(response) {\n";
                        appString+=data.rest.resVar +"= response.getBody();\n";
                        appString+="\n";
                        appString+="exec"+targetAttr+"();\n";
                        appString+="\n";

                    appString+="});\n";
                }
                else if(data.rType=="PUT")
                {
                    appString+="requestify.put('"+data.rest.loc+"', '"+data.rest.valName+"')\n"+
                    ".then(function(response) {\n"+
                        data.rest.resVar +"= response.getBody();\n";
                        appString+="\n";
                        appString+="exec"+targetAttr+"();\n";
                        appString+="\n";

                    appString+="});\n";
                }
                else if(data.rType=="DELETE")
                {
                    appString+="requestify.get('"+data.rest.loc+"').then(function(response) {\n"+
                        data.rest.resVar +"= response.getBody();\n";
                        appString+="\n";
                        appString+="exec"+targetAttr+"();\n";
                        appString+="\n";                
                    appString+="});\n";
                }
                appString+="\n";

                
                appString+="}\n"
                appString+="\n";
                
                console.log("rest appString: "+appString);
                
                resolve(appString);
            });
        }

        else if(compNode[x].name=="Database")
        {
            console.log("found Database");

            var collection = db.get('db_handling');
            var obj = collection.findOne({"username":username,"proj":proj,"id":id},function(err,datah){
                if(err)
                {
                    res.status(500).send(err);
                    return;
                }

                appString+="\n";
                appString+="function exec"+id+"(){\n";
                appString+="\n";
                
                var data = datah.db;

                appString+="var connection = mysql.createConnection({\n"+
                  "host     : '"+ data.dbLoc+"',\n"+
                  "port     : '"+data.dbPort+"',\n"+
                  "user     : '"+data.dbuser+"',\n"+
                  "password : '"+data.dbpass+"',\n"+
                  "database : '"+data.dbName+"',\n"+
                "});\n";

                appString+="connection.connect();\n";

                var query = "";

                if(data.qType=="INSERT")
                {
                    query+="INSERT INTO ";

                    var colString = "(";

                    for(var i=0;i<data.sqlVals.length;i++)
                    {
                        if(i==data.sqlVals.length-1)
                        {
                            colString+=data.sqlVals[i].colName;
                        }
                        else
                        {
                            colString+=data.sqlVals[i].colName+",";
                        }
                    }

                    colString+=")";

                    var valString = "(";

                    for(var i=0;i<data.sqlVals.length;i++)
                    {
                        if(i==data.sqlVals.length-1)
                        {
                            valString+='\\\'\'+'+data.sqlVals[i].valName+'+\'\\\'';
                        }
                        else
                        {
                            valString+='\\\'\'+'+data.sqlVals[i].valName+"+\'\\\',";
                        }
                    }

                    valString+=")";



                    appString+="connection.query('"+query+" "+data.tbName+" "+colString+" VALUES "+valString+";', function (error, results, fields) {\n"+
                      "if (error) res.status(500).send(error);\n";
                      appString+=data.valName +"= results;\n";
                    
                    appString+="\n";
                appString+="exec"+targetAttr+"();\n";
                appString+="\n";
                    
                    appString+="});\n";
                }
                else if(data.qType=="UPDATE")
                {
                    query+="UPDATE ";

                    var colString = "";

                    for(var i=0;i<data.sqlVals.length;i++)
                    {
                        if(i==data.sqlVals.length-1)
                        {
                            colString+=data.sqlVals[i].colName+"='"+data.sqlVals[i].valName+"'";
                        }
                        else
                        {
                            colString+=data.sqlVals[i].colName+"='"+data.sqlVals[i].valName+"',";
                        }
                    }

                    var whereString = "";

                    for(var i=0;i<data.sqlWhs.length;i++)
                    {
                        if(i==data.sqlWhs.length-1)
                        {
                            whereString+=data.sqlWhs[i].colName+"=\\\'\'+"+data.sqlWhs[i].valName+"+\'\\\'";
                        }
                        else
                        {
                            whereString+=data.sqlWhs[i].colName+"=\\\'\'+"+data.sqlWhs[i].valName+"+\'\\\',";
                        }
                    }

                    appString+="connection.query('"+query+" "+data.tbName+" SET "+colString+" WHERE "+whereString+";', function (error, results, fields) {\n";
                      appString+="if (error) res.status(500).send(error);\n";
                      appString+=data.valName +"= results;\n";
                    
                    appString+="\n";
                appString+="exec"+targetAttr+"();\n";
                appString+="\n";
                    
                    appString+="});\n";
                }
                else if(data.qType=="QUERY")
                {

                    var colString = "";

                    for(var i=0;i<data.sqlVals.length;i++)
                    {
                        if(i==data.sqlVals.length-1)
                        {
                            colString+=data.sqlVals[i].colName;
                        }
                        else
                        {
                            colString+=data.sqlVals[i].colName+",";
                        }
                    }

                    var whereString = "";

                    for(var i=0;i<data.sqlWhs.length;i++)
                    {
                        if(i==data.sqlWhs.length-1)
                        {
                            whereString+=data.sqlWhs[i].colName+"=\\\'\'+"+data.sqlWhs[i].valName+"+\'\\\'";
                        }
                        else
                        {
                            whereString+=data.sqlWhs[i].colName+"=\\\'\'+"+data.sqlWhs[i].valName+"+\'\\\',";
                        }
                    }



                    query+="SELECT ";
                    appString+="connection.query('"+query+" "+colString+" FROM "+data.tbName+" WHERE "+whereString+";', function (error, results, fields) {\n";
                      appString+="if (error) res.status(500).send(error);\n";
                      appString+=data.valName +"= results;\n";
                    
                    appString+="\n";
                appString+="exec"+targetAttr+"();\n";
                appString+="\n";
                    
                    appString+="});\n";
                }
                else if(data.qType=="DELETE")
                {
                    query+="DELETE FROM ";

                    var whereString = "";

                    for(var i=0;i<data.sqlWhs.length;i++)
                    {
                        if(i==data.sqlWhs.length-1)
                        {
                            whereString+=data.sqlWhs[i].colName+"=\\\'\'+"+data.sqlWhs[i].valName+"+\'\\\'";
                        }
                        else
                        {
                            whereString+=data.sqlWhs[i].colName+"=\\\'\'+"+data.sqlWhs[i].valName+"+\'\\\',";
                        }
                    }

                    appString+="connection.query('"+query+" "+data.tbName+" WHERE "+whereString+";', function (error, results, fields) {\n";
                      appString+="if (error) res.status(500).send(error);\n";
                      appString+=data.valName +"= results;\n";
                    
                    appString+="\n";
                appString+="exec"+targetAttr+"();\n";
                appString+="\n";
                    
                    appString+="});\n";
                }

                console.log("query: " +query);



                appString+="connection.end();\n";

                appString+="\n";
                
                
                
                appString+="}\n"
                appString+="\n";
                
                console.log("db appString: " +appString);
                
                resolve(appString);

            });
        }
        else
        {
            
//            appString+="\n";
//                appString+="function exec"+id+"(){\n";
//                appString+="\n";
//            appString+="\n";
//                appString+="exec"+targetAttr+"();\n";
//                appString+="\n";
//                    
//                    appString+="};\n";
//            
//            console.log(compNode[x].name+" appString: " +appString);
            
//            resolve(appString);
            
            console.log("!!!!!!!!!!!!!found component:" +compNode[x].name);
            //res.status(500).send("incorrect cmponent:"+compNode[x].name);
            
            
            var collection = db.get('mscomp_handling');
            var obj = collection.findOne({"username":username,"proj":proj,"id":id},function(err,data){
                if(err)
                {
                    res.status(500).send(err);
                    return;
                }
                
                //console.log("mscomp data:");
                //console.log(data);
                
                //console.log("data.proj: " +data.proj);
                
                var sercollection = db.get('service_registry');
                var serobj = sercollection.findOne({"project":data.msname},function(err,serdata){
                    if(err)
                    {
                        res.status(500).send(err);
                        return;
                    }
                    
                    //console.log("serdata: " +serdata);
                    
                    var envdb = db.get('env');
                    var envobj = envdb.findOne({"name":serdata.env},function(err,envdata){
                        if(err)
                        {
                            console.log("err:"+err);
                            res.status(500).send(err);
                            return;
                        }

                        //console.log("envdata data:");
                        //console.log(envdata);


                        appString+="\n";
                        appString+="function exec"+id+"(){\n";
                        appString+="\n";

                        appString+="requestify.post('http://"+ip.address()+":"+envdata.port+"/execute', "+data.mscomp.inputVar+")\n";
                        appString+=".then(function(response) {\n";
                        appString+=data.mscomp.outputVar +"= response.getBody();\n";
                        appString+="\n";
                        appString+="exec"+targetAttr+"();\n";
                        appString+="\n";

                        appString+="});\n";

                        appString+="\n";


                        appString+="}\n"
                        appString+="\n";

                        console.log("mscomp appString: "+appString);

                        resolve(appString);

                    });
                    
                    
                });
                
                
                
                
                
                
                
            });

        }
    });
    
    
//    else
//    {
//        console.log("could not match component id:" + compNode[x].attr.id +" to target: " +compNode[x].attr.id);
//    }
    
}


module.exports = router;
