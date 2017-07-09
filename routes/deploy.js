var express = require('express');
var router = express.Router();

var exec = require('child_process').exec;
var cLocCmd = 'pwd';
var cdCmd = 'cd ';
var cpCmd = '/bin/cp -rf template_app/msapp ';
var dockerCmd = 'docker build -t sajithdil/testapp template_app/testapp';
var dockerExecCmd = 'docker run -p 49160:3000 -d sajithdil/testapp';


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


module.exports = router;
