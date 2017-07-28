var onInit = function(editor) {}

var home = angular.module("mdesign", ['ui.router', 'listview', 'apiService', 'ngPopup', 'ngAnimate', 'toastr', 'ui.bootstrap', 'ui.bootstrap.modal', 'apiService'])
    .config(['$stateProvider', function($stateProvider) {
        // 		$stateProvider.state('mdesignState', {
        // 			url: '/mdesign',
        // 			templateUrl: '/javascripts/mdesign/template/template.tpl.html',
        // 			controller: 'mdesignCtrl'

        // 		});

        $stateProvider.state('mdesignState', {
            url: '/mdesign/:user/:project',
            templateUrl: '/javascripts/mdesign/template/template.tpl.html',
            controller: 'mdesignCtrl'

        });
    }])
    .controller('mdesignCtrl', ["$scope", "$rootScope", 'restApiService', 'toastr', '$modal', '$stateParams', 'restApiService','$state', '$timeout',function($scope, $rootScope, api, toastr, $modal, $stateParams, api,$state,$timeout) {

        $scope.deployProj = function()
        {
            $scope.modalInstance = $modal.open({
                    templateUrl: '/javascripts/mdesign/template/env.tpl.html',
                    scope:$scope,
                    resolve: {
                        // bObjData: function () {
                        //   return $scope.bObjData;
                        // }
                        username:function()
                        {
                        	return $rootScope.username;
                        },
                        proj:function()
                        {
                            return $stateParams.project;
                        }
                      },
                    controller:function($modalInstance, $scope,username,proj){
                        //$modalInstance.dismiss('cancel');
                        
                        $scope.env = "";
                        
                        api.getEnvs().then(function success(res){
			
                            // $scope.photos = res.data
                            // $scope.$apply();

                             $timeout(function() {
                                $scope.envs = res.data;
                            }, 0);

                        },function fail(err){
                            console.log(err);
                        });
                        
                        $scope.dropboxitemselected = function (item) {
 
                            $scope.selectedItem = item;
                            $scope.env = item;
                        }
                        
                        $scope.deployToserv = function()
                        {
                            api.deployToServ(username,proj,$scope.env).then(function succ(res){
                                toastr.success("successfully deployed project");
                                
                                $modalInstance.dismiss('cancel');
                            },function fail(err){
                                toastr.error("failed to deploy project");
                                console.log(err);
                            })
                        }
                      
                    }
                });
            
            
            $scope.modalInstance.result.then(function (selectedItem) {

            }, function () {

            });
        }

        $scope.goToProj = function()
	    {
	        $state.transitionTo('mProjectsState');
	    }
        
        $scope.goToEnv = function()
	    {
	    	$state.transitionTo('mEnvtate');
	    }

        var editor = null;

        onInit = function(editor) {
            // Enables rotation handle
            mxVertexHandler.prototype.rotationEnabled = true;

            // Enables guides
            mxGraphHandler.prototype.guidesEnabled = true;

            // Alt disables guides
            mxGuide.prototype.isEnabledForEvent = function(evt) {
                return !mxEvent.isAltDown(evt);
            };

            // Enables snapping waypoints to terminals
            mxEdgeHandler.prototype.snapToTerminals = true;

            // Defines an icon for creating new connections in the connection handler.
            // This will automatically disable the highlighting of the source vertex.
            mxConnectionHandler.prototype.connectImage = new mxImage('/node_modules/mxgraph/javascript/examples/editors/images/connector.gif', 16, 16);

            // Enables connections in the graph and disables
            // reset of zoom and translate on root change
            // (ie. switch between XML and graphical mode).
            editor.graph.setConnectable(true);

            // Clones the source if new connection has no target
            editor.graph.connectionHandler.setCreateTarget(true);

            // Updates the title if the root changes
            var title = document.getElementById('title');

            if (title != null) {
                var f = function(sender) {
                    title.innerHTML = 'mxDraw - ' + sender.getTitle();
                };

                editor.addListener(mxEvent.ROOT, f);
                f(editor);
            }

            // Changes the zoom on mouseWheel events
            mxEvent.addMouseWheelListener(function(evt, up) {
                if (!mxEvent.isConsumed(evt)) {
                    if (up) {
                        editor.execute('zoomIn');
                    }
                    else {
                        editor.execute('zoomOut');
                    }

                    mxEvent.consume(evt);
                }
            });

            // Defines a new action to switch between
            // XML and graphical display
            //this is where the xml source comes out
            //parse this to get the output and build the microservice correctly
            var textNode = document.getElementById('xml');
            var graphNode = editor.graph.container;
            var sourceInput = document.getElementById('source');
            sourceInput.checked = false;

            var funct = function(editor) {
                if (sourceInput.checked) {
                    graphNode.style.display = 'none';
                    textNode.style.display = 'inline';

                    var enc = new mxCodec();
                    var node = enc.encode(editor.graph.getModel());

                    textNode.value = mxUtils.getPrettyXml(node);
                    textNode.originalValue = textNode.value;
                    textNode.focus();
                }
                else {
                    graphNode.style.display = '';

                    if (textNode.value != textNode.originalValue) {
                        var doc = mxUtils.parseXml(textNode.value);
                        var dec = new mxCodec(doc);
                        dec.decode(doc.documentElement, editor.graph.getModel());
                    }

                    textNode.originalValue = null;

                    // Makes sure nothing is selected in IE
                    if (mxClient.IS_IE) {
                        mxUtils.clearSelection();
                    }

                    textNode.style.display = 'none';

                    // Moves the focus back to the graph
                    editor.graph.container.focus();
                }
            };

            editor.addAction('switchView', funct);

            // Defines a new action to switch between
            // XML and graphical display
            mxEvent.addListener(sourceInput, 'click', function() {
                editor.execute('switchView');
            });

            // Create select actions in page
            var node = document.getElementById('mainActions');
            var buttons = ['group', 'ungroup', 'cut', 'copy', 'paste', 'delete', 'undo', 'redo', 'print', 'show'];

            // Only adds image and SVG export if backend is available
            // NOTE: The old image export in mxEditor is not used, the urlImage is used for the new export.
            if (editor.urlImage != null) {
                // Client-side code for image export
                var exportImage = function(editor) {
                    var graph = editor.graph;
                    var scale = graph.view.scale;
                    var bounds = graph.getGraphBounds();

                    // New image export
                    var xmlDoc = mxUtils.createXmlDocument();
                    var root = xmlDoc.createElement('output');
                    xmlDoc.appendChild(root);

                    // Renders graph. Offset will be multiplied with state's scale when painting state.
                    var xmlCanvas = new mxXmlCanvas2D(root);
                    xmlCanvas.translate(Math.floor(1 / scale - bounds.x), Math.floor(1 / scale - bounds.y));
                    xmlCanvas.scale(scale);

                    var imgExport = new mxImageExport();
                    imgExport.drawState(graph.getView().getState(graph.model.root), xmlCanvas);

                    // Puts request data together
                    var w = Math.ceil(bounds.width * scale + 2);
                    var h = Math.ceil(bounds.height * scale + 2);
                    var xml = mxUtils.getXml(root);

                    // Requests image if request is valid
                    if (w > 0 && h > 0) {
                        var name = 'export.png';
                        var format = 'png';
                        var bg = '&bg=#FFFFFF';

                        new mxXmlRequest(editor.urlImage, 'filename=' + name + '&format=' + format +
                            bg + '&w=' + w + '&h=' + h + '&xml=' + encodeURIComponent(xml)).
                        simulate(document, '_blank');
                    }
                };

                editor.addAction('exportImage', exportImage);

                // Client-side code for SVG export
                var exportSvg = function(editor) {
                    var graph = editor.graph;
                    var scale = graph.view.scale;
                    var bounds = graph.getGraphBounds();

                    // Prepares SVG document that holds the output
                    var svgDoc = mxUtils.createXmlDocument();
                    var root = (svgDoc.createElementNS != null) ?
                        svgDoc.createElementNS(mxConstants.NS_SVG, 'svg') : svgDoc.createElement('svg');

                    if (root.style != null) {
                        root.style.backgroundColor = '#FFFFFF';
                    }
                    else {
                        root.setAttribute('style', 'background-color:#FFFFFF');
                    }

                    if (svgDoc.createElementNS == null) {
                        root.setAttribute('xmlns', mxConstants.NS_SVG);
                    }

                    root.setAttribute('width', Math.ceil(bounds.width * scale + 2) + 'px');
                    root.setAttribute('height', Math.ceil(bounds.height * scale + 2) + 'px');
                    root.setAttribute('xmlns:xlink', mxConstants.NS_XLINK);
                    root.setAttribute('version', '1.1');

                    // Adds group for anti-aliasing via transform
                    var group = (svgDoc.createElementNS != null) ?
                        svgDoc.createElementNS(mxConstants.NS_SVG, 'g') : svgDoc.createElement('g');
                    group.setAttribute('transform', 'translate(0.5,0.5)');
                    root.appendChild(group);
                    svgDoc.appendChild(root);

                    // Renders graph. Offset will be multiplied with state's scale when painting state.
                    var svgCanvas = new mxSvgCanvas2D(group);
                    svgCanvas.translate(Math.floor(1 / scale - bounds.x), Math.floor(1 / scale - bounds.y));
                    svgCanvas.scale(scale);

                    var imgExport = new mxImageExport();
                    imgExport.drawState(graph.getView().getState(graph.model.root), svgCanvas);

                    var name = 'export.svg';
                    var xml = encodeURIComponent(mxUtils.getXml(root));

                    new mxXmlRequest(editor.urlEcho, 'filename=' + name + '&format=svg' + '&xml=' + xml).simulate(document, "_blank");
                };

                editor.addAction('exportSvg', exportSvg);

                buttons.push('exportImage');
                buttons.push('exportSvg');
            };

            for (var i = 0; i < buttons.length; i++) {
                var button = document.createElement('button');

                mxUtils.write(button, mxResources.get(buttons[i]));

                var factory = function(name) {
                    return function() {
                        editor.execute(name);
                    };
                };

                mxEvent.addListener(button, 'click', factory(buttons[i]));
                button.innerHTML = buttons[i];
                node.appendChild(button);
            }

            // Create select actions in page
            var node = document.getElementById('selectActions');
            mxUtils.write(node, 'Select: ');
            mxUtils.linkAction(node, 'All', editor, 'selectAll');
            mxUtils.write(node, ', ');
            mxUtils.linkAction(node, 'None', editor, 'selectNone');
            mxUtils.write(node, ', ');
            mxUtils.linkAction(node, 'Vertices', editor, 'selectVertices');
            mxUtils.write(node, ', ');
            mxUtils.linkAction(node, 'Edges', editor, 'selectEdges');

            // Create select actions in page
            var node = document.getElementById('zoomActions');
            mxUtils.write(node, 'Zoom: ');
            mxUtils.linkAction(node, 'In', editor, 'zoomIn');
            mxUtils.write(node, ', ');
            mxUtils.linkAction(node, 'Out', editor, 'zoomOut');
            mxUtils.write(node, ', ');
            mxUtils.linkAction(node, 'Actual', editor, 'actualSize');
            mxUtils.write(node, ', ');
            mxUtils.linkAction(node, 'Fit', editor, 'fit');


            api.getProjByUserAndProjName($stateParams.user, $stateParams.project).then(function success(res) {
                if (res.data[0].dataflow != undefined) {
                    var xmlString = res.data[0].dataflow;
                    var doc = mxUtils.parseXml(xmlString);
                    var codec = new mxCodec(doc);
                    codec.decode(doc.documentElement, editor.graph.getModel());
                }
                else {
                    console.log("dataflow does not exist");
                }
            }, function fail(err) {
                console.log("could not get project");
                console.log(err);
            })

            //------------------load model dynamically
            // var xmlString = '<mxGraphModel><root><Diagram label="My Diagram" href="http://www.jgraph.com/" id="0"><mxCell/></Diagram><Layer label="Default Layer" id="1"><mxCell parent="0"/></Layer><Begin label="Begin" href="" id="2"><mxCell vertex="1" parent="1"><mxGeometry x="130" y="20" width="80" height="40" as="geometry"/></mxCell></Begin></root></mxGraphModel>';


            // var doc = mxUtils.parseXml(xmlString);
            // var codec = new mxCodec(doc);
            // codec.decode(doc.documentElement, editor.graph.getModel());


        }


        var createEditor = function(config) {


            var hideSplash = function() {
                // Fades-out the splash screen
                var splash = document.getElementById('splash');

                if (splash != null) {
                    try {
                        mxEvent.release(splash);
                        mxEffects.fadeOut(splash, 100, true);
                    }
                    catch (e) {
                        splash.parentNode.removeChild(splash);
                    }
                }
            };

            try {
                if (!mxClient.isBrowserSupported()) {
                    mxUtils.error('Browser is not supported!', 200, false);
                }
                else {
                    mxObjectCodec.allowEval = true;
                    var node = mxUtils.load(config).getDocumentElement();
                    editor = new mxEditor(node);
                    mxObjectCodec.allowEval = false;

                    // Adds active border for panning inside the container
                    editor.graph.createPanningManager = function() {
                        var pm = new mxPanningManager(this);
                        pm.border = 30;

                        return pm;
                    };

                    editor.graph.allowAutoPanning = true;
                    editor.graph.timerAutoScroll = true;

                    // Updates the window title after opening new files
                    var title = document.title;
                    var funct = function(sender) {
                        document.title = title + ' - ' + sender.getTitle();
                    };

                    editor.addListener(mxEvent.OPEN, funct);

                    // Prints the current root in the window title if the
                    // current root of the graph changes (drilling).
                    editor.addListener(mxEvent.ROOT, funct);
                    funct(editor);

                    // Displays version in statusbar
                    editor.setStatus('mxGraph ' + mxClient.VERSION);

                    // Shows the application
                    hideSplash();
                }
            }
            catch (e) {
                hideSplash();

                // Shows an error message if the editor cannot start
                mxUtils.alert('Cannot start application: ' + e.message);
                throw e; // for debugging
            }

            return editor;
        }




        createEditor('/config/diagrameditor.xml');

        function addToolbarItem(graph, toolbar, prototype, image,name) {
            // Function that is executed when the image is dropped on
            // the graph. The cell argument points to the cell under
            // the mousepointer if there is one.
            var funct = function(graph, evt, cell, x, y,name) {
                graph.stopEditing(false);
//
                var vertex = graph.getModel().cloneCell(prototype);
                var template = editor.templates[prototype.title];
                
//                var clone = editor.graph.model.cloneCell(template);
//                editor.createProperties(clone);
//                clone.geometry.x = x;
//                clone.geometry.y = y;
                
                var doc = mxUtils.createXmlDocument();
                var node = doc.createElement(prototype.title)
                node.setAttribute('label', prototype.title);
                graph.insertVertex(graph.getDefaultParent(), null, node, x, y, 100, 40);
                

                //graph.addCell(clone);
                //graph.setSelectionCell(clone);
                
//                var parent = graph.getDefaultParent();
//                
//                graph.getModel().beginUpdate();
//				try
//				{
//                    graph.insertVertex(parent, null, 'vertexLabelsMovable', x, y, vertex.geometry.width, vertex.geometry.height);
//                }
//				finally
//				{
//					// Updates the display
//					graph.getModel().endUpdate();
//				}
            }

            // Creates the image which is used as the drag icon (preview)
            var img = toolbar.addMode(null, image, function(evt, cell) {
                var pt = this.graph.getPointForEvent(evt);
                funct(graph, evt, cell, pt.x, pt.y,name);
            });

            // Disables dragging if element is disabled. This is a workaround
            // for wrong event order in IE. Following is a dummy listener that
            // is invoked as the last listener in IE.
            mxEvent.addListener(img, 'mousedown', function(evt) {
                // do nothing
            });

            // This listener is always called first before any other listener
            // in all browsers.
            mxEvent.addListener(img, 'mousedown', function(evt) {
                if (img.enabled == false) {
                    mxEvent.consume(evt);
                }
            });

            mxUtils.makeDraggable(img, graph, funct);

            return img;
        }
//
//        var addVertex = function(icon, w, h, style,title) {
//            var vertex = new mxCell(null, new mxGeometry(0, 0, w, h), style);
//            vertex.setVertex(true);
//            
//            //vertex.value.tagName=title;
//            
//
//            var img = addToolbarItem(editor.graph, editor.toolbar, vertex, icon);
//            img.enabled = true;
//            img.setAttribute('title',title);
//
//            editor.graph.getSelectionModel().addListener(mxEvent.CHANGE, function() {
//                var tmp = editor.graph.isSelectionEmpty();
//                mxUtils.setOpacity(img, (tmp) ? 100 : 20);
//                img.enabled = tmp;
//            });
//        };
//
//
//        addVertex('/node_modules/mxgraph/javascript/examples/editors/images/rectangle.gif', 100, 40, '','testt');
        
        api.getServiceRegistry().then(function succ(res){
            
            for(var i = 0;i<res.data.length;i++)
            {
//                var template = "<"+res.data[i].project+" label=\""+res.data[i].project+"\" href=\"\">\n"+
//				"<mxCell vertex=\"1\">\n"+	
//				"	<mxGeometry as=\"geometry\" width=\"80\" height=\"40\"/>\n"+
//				"</mxCell>\n"+
//			"</"+res.data[i].project+">"
                
                //editor.addTemplate(res.data[i].project,template);
                
                var c  = new mxCell(null, new mxGeometry(0, 0, 100, 40), '');
                c.setVertex(true);
                c.setAttribute('title',res.data[i].project);
                c.setAttribute('label',res.data[i].project);
                c.label = res.data[i].project;
                c.title = res.data[i].project;
                
                editor.addTemplate(res.data[i].project,c);
                
                var img = addToolbarItem(editor.graph, editor.toolbar, c, '/node_modules/mxgraph/javascript/examples/editors/images/rectangle.gif',res.data[i].project);
                img.setAttribute('title',res.data[i].project);
                img.enabled = true;
                
                editor.graph.getSelectionModel().addListener(mxEvent.CHANGE, function() {
                    var tmp = editor.graph.isSelectionEmpty();
                    mxUtils.setOpacity(img, (tmp) ? 100 : 20);
                    img.enabled = tmp;
                });
            }
            
        },function fail(err){
            console.log("failed to get service registry");
            console.log(err);
        })


        $rootScope.showPropertiesPanel = function(editor, cell) {
            if (cell.value.tagName == "Begin") {
                console.log("showing prop panel");
                $scope.showPropPanel = true;
                $scope.template = "beginTemplate";

                api.getBusinessObjectsByUserAndProject($stateParams.user,$stateParams.project).then(function success(res) {
                    $scope.bObjs = res.data.b_objs;
                    $scope.bObjData = res.data;
                    if($scope.bObjData == "" || $scope.bObjData == undefined)
                    {
                        $scope.bObjData = {};
                        $scope.bObjData.b_objs = [];
                        $scope.bObjData.project = $stateParams.project;
                        $scope.bObjData.username = $stateParams.user;
                    }
                }, function fail(err) {
                    console.log(err);
                });
                
                $scope.beginObjs = [];
                $scope.beginObjData = {};
                $scope.beginObjData.begin_objs = [];
                api.getBeginObjectsByUserAndProject($stateParams.user,$stateParams.project).then(function success(res) {
                    $scope.beginObjs = res.data.begin_objs;
                    $scope.beginObjData = res.data;
                    if($scope.beginObjData == "" || $scope.beginObjData == undefined)
                    {
                        $scope.beginObjData = {};
                        $scope.beginObjData.begin_objs = [];
                        $scope.beginObjData.project = $stateParams.project;
                        $scope.beginObjData.username = $stateParams.user;
                    }
                }, function fail(err) {
                    console.log(err);
                });
            }
            else if(cell.value.tagName == "Script")
            {
                $timeout(function(){
                     $scope.$apply(function () {
                        console.log("showing script panel");
                        $scope.showPropPanel = true;
                        $scope.template = "scriptTemplate";
                         $scope.scriptId = cell.getId();
                    });
                },0);
                
                api.getScriptHandling($stateParams.user,$stateParams.project,cell.getId()).then(function succ(res){
                    $scope.scriptText = res.data.script;
                },function fail(err){
                    console.log("err");
                    console.log(err);
                })
            }
            else if(cell.value.tagName == "Database")
            {
                $timeout(function(){
                     $scope.$apply(function () {
                        console.log("showing script panel");
                        $scope.showPropPanel = true;
                        $scope.template = "databseTemplate";
                         $scope.scriptId = cell.getId();
                         
                         $scope.db = {};
                        $scope.db.sqlVals = [];
                        $scope.db.sqlWhs = [];
                        $scope.bNameList = [];
                    });
                },0);
                
                $scope.db = {};
                $scope.db.sqlVals = [];
                $scope.db.sqlWhs = [];
                $scope.bNameList = [];
                api.getBusinessObjectsByUserAndProject($stateParams.user,$stateParams.project).then(function success(res) {
                    $scope.bObjs = res.data.b_objs;
                    $scope.bObjData = res.data;
                    if($scope.bObjData == "" || $scope.bObjData == undefined)
                    {
                        $scope.bObjData = {};
                        $scope.bObjData.b_objs = [];
                        $scope.bObjData.project = $stateParams.project;
                        $scope.bObjData.username = $stateParams.user;
                    }
                    else
                    {
                        for(var i=0;i<$scope.bObjData.b_objs.length;i++)
                        {
                            $scope.bNameList.push($scope.bObjData.b_objs[i].name);
                        }
                    }
                }, function fail(err) {
                    console.log(err);
                });
                
                api.getDbHandling($stateParams.user,$stateParams.project,cell.getId()).then(function succ(res){
                    $scope.db = res.data.db;
                    if($scope.db == "" || $scope.db == undefined)
                    {
                        $scope.db = {};
                        $scope.db.sqlVals = [];
                        $scope.db.sqlWhs = [];
                    }
                    else
                    {
                        
                        
                        $scope.db = res.data.db;
                    }
                },function fail(err){
                    console.log("err");
                    console.log(err);
                })
            }
            else if(cell.value.tagName == "REST")
            {
                $timeout(function(){
                     $scope.$apply(function () {
                        console.log("showing rest panel");
                        $scope.showPropPanel = true;
                        $scope.template = "restTemplate";
                         $scope.scriptId = cell.getId();
                    });
                },0);
                $scope.rest = {};
                api.getRestHandling($stateParams.user,$stateParams.project,cell.getId()).then(function succ(res){
                    $scope.rest = res.data.rest;
                    
                    if($scope.rest == "" || $scope.rest == undefined)
                    {
                        $scope.rest = {};
                    }
                    else
                    {
                        $scope.rest = res.data.rest;
                    }
                },function fail(err){
                    console.log("err");
                    console.log(err);
                })
                
                
                $scope.bNameList = [];
                api.getBusinessObjectsByUserAndProject($stateParams.user,$stateParams.project).then(function success(res) {
                    $scope.bObjs = res.data.b_objs;
                    $scope.bObjData = res.data;
                    if($scope.bObjData == "" || $scope.bObjData == undefined)
                    {
                        $scope.bObjData = {};
                        $scope.bObjData.b_objs = [];
                        $scope.bObjData.project = $stateParams.project;
                        $scope.bObjData.username = $stateParams.user;
                    }
                    else
                    {
                        for(var i=0;i<$scope.bObjData.b_objs.length;i++)
                        {
                            $scope.bNameList.push($scope.bObjData.b_objs[i].name);
                        }
                    }
                }, function fail(err) {
                    console.log(err);
                });
            }
            else if(cell.value.tagName == "Decision")
            {
                $timeout(function(){
                     $scope.$apply(function () {
                        console.log("showing Decision panel");
                        $scope.showPropPanel = true;
                        $scope.template = "decisionTemplate";
                         $scope.scriptId = cell.getId();
                    });
                },0);
                $scope.decision = [];
                api.getDecisionHandling($stateParams.user,$stateParams.project,cell.getId()).then(function succ(res){
                    $scope.decision = res.data.decision;
                    
                    if($scope.decision == "" || $scope.decision == undefined)
                    {
                        $scope.decision = [];
                    }
                    else
                    {
                        $scope.decision = res.data.decision;
                    }
                },function fail(err){
                    console.log("err");
                    console.log(err);
                });
                
                $scope.bNameList = [];
                api.getBusinessObjectsByUserAndProject($stateParams.user,$stateParams.project).then(function success(res) {
                    $scope.bObjs = res.data.b_objs;
                    $scope.bObjData = res.data;
                    if($scope.bObjData == "" || $scope.bObjData == undefined)
                    {
                        $scope.bObjData = {};
                        $scope.bObjData.b_objs = [];
                        $scope.bObjData.project = $stateParams.project;
                        $scope.bObjData.username = $stateParams.user;
                    }
                    else
                    {
                        for(var i=0;i<$scope.bObjData.b_objs.length;i++)
                        {
                            $scope.bNameList.push($scope.bObjData.b_objs[i].name);
                        }
                    }
                }, function fail(err) {
                    console.log(err);
                });
            }
            else if (cell.value.tagName == "End") {
                console.log("showing prop panel");
                $scope.showPropPanel = true;
                $scope.template = "endTemplate";

            
                
                $scope.endObjs = [];
                $scope.endObjData = {};
                $scope.endObjData.begin_objs = [];
                api.getEndObjectsByUserAndProject($stateParams.user,$stateParams.project).then(function success(res) {
                    $scope.endObjs = res.data.end_objs;
                    $scope.endObjData = res.data;
                    if($scope.endObjData == "" || $scope.endObjData == undefined)
                    {
                        $scope.endObjData = {};
                        $scope.endObjData.end_objs = [];
                        $scope.endObjData.project = $stateParams.project;
                        $scope.endObjData.username = $stateParams.user;
                    }
                }, function fail(err) {
                    console.log(err);
                });
            }
        }
        
        $scope.saveScript = function()
        {
            var data = {};
            data.username = $stateParams.user;
            data.proj = $stateParams.project;
            data.id = $scope.scriptId;
            data.script = $scope.scriptText;
            
            api.addScriptHandling(data).then(function succ(res){
                toastr.success("Script Saved");
            },function err(err){
                console.log(err);
                toastr.error("could not save script");
            })
        }
        
        $scope.saveDb = function()
        {
            var data = {};
            data.username = $stateParams.user;
            data.proj = $stateParams.project;
            data.id = $scope.scriptId;
            data.db = $scope.db;
            
            api.addDbHandling(data).then(function succ(res){
                toastr.success("rest Saved");
            },function err(err){
                console.log(err);
                toastr.error("could not save rest");
            })
        }
        
        $scope.saveRest = function()
        {
            var data = {};
            data.username = $stateParams.user;
            data.proj = $stateParams.project;
            data.id = $scope.scriptId;
            data.rest = $scope.rest;
            
            api.addRestHandling(data).then(function succ(res){
                toastr.success("rest Saved");
            },function err(err){
                console.log(err);
                toastr.error("could not save rest");
            })
        }
        
        $scope.saveDecision = function()
        {
            var data = {};
            data.username = $stateParams.user;
            data.proj = $stateParams.project;
            data.id = $scope.scriptId;
            data.decision = $scope.decision;
            
            api.addDecisionHandling(data).then(function succ(res){
                toastr.success("decision Saved");
            },function err(err){
                console.log(err);
                toastr.error("could not save decision");
            })
        }
        
        $scope.openSqlColForm = function()
        {
            var buTypes = [];

            buTypes.push("string");
            buTypes.push("integer");
            buTypes.push("boolean");
            buTypes.push("float");
            buTypes.push("double");


            $scope.buTypes = buTypes;
            
            $scope.modalInstance = $modal.open({
                templateUrl: '/javascripts/mdesign/template/db_vals.tpl.html',
                scope: $scope,
                resolve: {
                    buTypes: function() {
                        return $scope.buTypes;
                    },
                    bNameList: function() {
                        return $scope.bNameList;
                    }
                },
                controller: function($modalInstance, $scope, buTypes,bNameList) {
                    //$modalInstance.dismiss('cancel');

                    $scope.buTypes = buTypes;
                    $scope.bNameList = bNameList;
                    $scope.sqlval = {};
                    
                    //$uibModalInstance.close($ctrl.selected.item);
                    $scope.saveCol = function()
                    {
                        $modalInstance.close($scope.sqlval);
                    }
                }
            });
            
            $scope.modalInstance.result.then(function (selectedItem) {
              $scope.db.sqlVals.push(selectedItem);
            }, function () {
              $log.info('modal-component dismissed at: ' + new Date());
            });

        }
        
        $scope.openSqlWhForm = function()
        {
            var buTypes = [];

            buTypes.push("string");
            buTypes.push("integer");
            buTypes.push("boolean");
            buTypes.push("float");
            buTypes.push("double");


            $scope.buTypes = buTypes;
            
            $scope.modalInstance = $modal.open({
                templateUrl: '/javascripts/mdesign/template/db_wheres.tpl.html',
                scope: $scope,
                resolve: {
                    buTypes: function() {
                        return $scope.buTypes;
                    },
                    bNameList: function() {
                        return $scope.bNameList;
                    }
                },
                controller: function($modalInstance, $scope, buTypes,bNameList) {
                    //$modalInstance.dismiss('cancel');

                    $scope.buTypes = buTypes;
                    $scope.bNameList = bNameList;
                    $scope.sqlwh = {};
                    
                    //$uibModalInstance.close($ctrl.selected.item);
                    $scope.saveWh = function()
                    {
                        $modalInstance.close($scope.sqlwh);
                    }
                }
            });
            
            $scope.modalInstance.result.then(function (selectedItem) {
              $scope.db.sqlWhs.push(selectedItem);
            }, function () {
              $log.info('modal-component dismissed at: ' + new Date());
            });

        }
        
        
        $scope.addDecisionPath = function()
        {
           
            
            $scope.modalInstance = $modal.open({
                templateUrl: '/javascripts/mdesign/template/dPath.tpl.html',
                scope: $scope,
                resolve: {
                    bNameList:function(){
                        return $scope.bNameList;
                    }
                },
                controller: function($modalInstance, $scope,bNameList) {
                    //$modalInstance.dismiss('cancel');

                    $scope.dec = {};
                    
                    $scope.bNameList = bNameList;
                    
                    //$uibModalInstance.close($ctrl.selected.item);
                    $scope.saveDec = function()
                    {
                        $modalInstance.close($scope.dec);
                    }
                }
            });
            
            $scope.modalInstance.result.then(function (selectedItem) {
              $scope.decision.push(selectedItem);
            }, function () {
              $log.info('modal-component dismissed at: ' + new Date());
            });

        }


        $scope.openBuObjForm = function() {
            var buTypes = [];

            buTypes.push("string");
            buTypes.push("integer");
            buTypes.push("boolean");
            buTypes.push("float");
            buTypes.push("double");
            buTypes.push("complex");
            buTypes.push("array");

            for (var i = 0; i < $scope.bObjData.length; i++) {
                if ($scope.bObjData[i].type == "complex") {
                    buTypes.push($scope.bObjData[i].name);
                }
            }

            $scope.buTypes = buTypes;

            $scope.params = [];



            $scope.modalInstance = $modal.open({
                templateUrl: '/javascripts/template/addBuObj.tpl.html',
                scope: $scope,
                resolve: {
                    bObjData: function() {
                        return $scope.bObjData;
                    },
                    projectname:function()
                    {
                        return $stateParams.project;
                    }
                },
                controller: function($modalInstance, $scope, bObjData,projectname) {
                    //$modalInstance.dismiss('cancel');

                    $scope.addParam = function() {
                        var p = {};
                        p.name = $scope.buParamName;
                        p.type = $scope.buParamType;
                        $scope.params.push(p);
                    }

                    $scope.saveBuObj = function() {
                        var data = {
                            name: $scope.buName,
                            type: $scope.buType
                        };

                        if ($scope.buType == 'complex') {
                            data.params = $scope.params;
                        }

                        if ($scope.buType == 'array') {
                            data.array_type = $scope.buArrayType;
                        }

                        bObjData.b_objs.push(data);
                        bObjData.project = projectname;
                        bObjData.username = $stateParams.user;

                        api.updateBusinessObj(bObjData).then(function success(res) {

                            toastr.success("business object saved");

                            api.getBusinessObjectsByUserAndProject($stateParams.user,$stateParams.project).then(function success(res) {
                                $scope.bObjs = res.data.b_objs;
                                $scope.bObjData = res.data;
                                $modalInstance.dismiss('cancel');
                            }, function fail(err) {
                                console.log(err);
                            });
                        }, function fail(err) {
                            console.log(err);
                        })

                    }
                }
            });
        }

        $scope.openBeginObjForm = function() {
            var beginTypes = [];

            beginTypes.push("string");
            beginTypes.push("integer");
            beginTypes.push("boolean");
            beginTypes.push("float");
            beginTypes.push("double");
            beginTypes.push("complex");
            beginTypes.push("array");

            for (var i = 0; i < $scope.beginObjData.length; i++) {
                if ($scope.beginObjData[i].type == "complex") {
                    beginTypes.push($scope.beginObjData[i].name);
                }
            }

            $scope.beginTypes = beginTypes;

            $scope.beginparams = [];



            $scope.modalInstance = $modal.open({
                templateUrl: '/javascripts/template/addBeginObj.tpl.html',
                scope: $scope,
                resolve: {
                    beginObjData: function() {
                        return $scope.beginObjData;
                    },
                    projectname:function()
                    {
                        return $stateParams.project;
                    }
                },
                controller: function($modalInstance, $scope, beginObjData,projectname) {
                    //$modalInstance.dismiss('cancel');

                    $scope.addParam = function() {
                        var p = {};
                        p.name = $scope.beginParamName;
                        p.type = $scope.beginParamType;
                        $scope.params.push(p);
                    }

                    $scope.saveBeginObj = function() {
                        var data = {
                            name: $scope.beginName,
                            type: $scope.beginType
                        };

                        if ($scope.beginType == 'complex') {
                            data.params = $scope.params;
                        }

                        if ($scope.beginType == 'array') {
                            data.array_type = $scope.beginArrayType;
                        }

                        beginObjData.begin_objs.push(data);
                        beginObjData.project = projectname;
                        beginObjData.username = $stateParams.user;

                        api.updateBeginObj(beginObjData).then(function success(res) {

                            toastr.success("begin object saved");

                            api.getBeginObjectsByUserAndProject($stateParams.user,$stateParams.project).then(function success(res) {
                                $scope.beginObjs = res.data.begin_objs;
                                $scope.beginObjData = res.data;
                                $modalInstance.close();
                            }, function fail(err) {
                                console.log(err);
                            });
                        }, function fail(err) {
                            console.log(err);
                        })

                    }
                }
            });
            
            
            $scope.modalInstance.result.then(function (selectedItem) {
              //$scope.decision.push(selectedItem);
                
                api.getBeginObjectsByUserAndProject($stateParams.user,$stateParams.project).then(function success(res) {
                                $scope.beginObjs = res.data.begin_objs;
                                $scope.beginObjData = res.data;
                                $modalInstance.close();
                            }, function fail(err) {
                                console.log(err);
                            });
            }, function () {
              //$log.info('modal-component dismissed at: ' + new Date());
                
                api.getBeginObjectsByUserAndProject($stateParams.user,$stateParams.project).then(function success(res) {
                                $scope.beginObjs = res.data.begin_objs;
                                $scope.beginObjData = res.data;
                                $modalInstance.close();
                            }, function fail(err) {
                                console.log(err);
                            });
            });
        }

        $scope.openEndObjForm = function() {
            var endTypes = [];

            endTypes.push("string");
            endTypes.push("integer");
            endTypes.push("boolean");
            endTypes.push("float");
            endTypes.push("double");
            endTypes.push("complex");
            endTypes.push("array");

            for (var i = 0; i < $scope.endObjData.length; i++) {
                if ($scope.endObjData[i].type == "complex") {
                    beginTypes.push($scope.endObjData[i].name);
                }
            }

            $scope.endTypes = endTypes;

            $scope.endparams = [];



            $scope.modalInstance = $modal.open({
                templateUrl: '/javascripts/template/addEndObj.tpl.html',
                scope: $scope,
                resolve: {
                    endObjData: function() {
                        return $scope.endObjData;
                    },
                    projectname:function()
                    {
                        return $stateParams.project;
                    }
                },
                controller: function($modalInstance, $scope, endObjData,projectname) {
                    //$modalInstance.dismiss('cancel');

                    $scope.addParam = function() {
                        var p = {};
                        p.name = $scope.endParamName;
                        p.type = $scope.endParamType;
                        $scope.params.push(p);
                    }

                    $scope.saveEndObj = function() {
                        var data = {
                            name: $scope.endName,
                            type: $scope.endType
                        };

                        if ($scope.endType == 'complex') {
                            data.params = $scope.params;
                        }

                        if ($scope.endType == 'array') {
                            data.array_type = $scope.endArrayType;
                        }

                        endObjData.end_objs.push(data);
                        endObjData.project = projectname;
                        endObjData.username = $stateParams.user;

                        api.updateEndObj(endObjData).then(function success(res) {

                            toastr.success("end object saved");

                            api.getEndObjectsByUserAndProject($stateParams.user,$stateParams.project).then(function success(res) {
                                $scope.endObjs = res.data.end_objs;
                                $scope.endObjData = res.data;
                                $modalInstance.close();
                            }, function fail(err) {
                                console.log(err);
                            });
                        }, function fail(err) {
                            console.log(err);
                        })

                    }
                }
            });
            
            
            $scope.modalInstance.result.then(function (selectedItem) {
              //$scope.decision.push(selectedItem);
                
                api.getEndObjectsByUserAndProject($stateParams.user,$stateParams.project).then(function success(res) {
                                $scope.endObjs = res.data.end_objs;
                                $scope.endObjData = res.data;
                            }, function fail(err) {
                                console.log(err);
                            });
            }, function () {
              //$log.info('modal-component dismissed at: ' + new Date());
                
                api.getEndObjectsByUserAndProject($stateParams.user,$stateParams.project).then(function success(res) {
                                $scope.endObjs = res.data.end_objs;
                                $scope.endObjData = res.data;
                            }, function fail(err) {
                                console.log(err);
                            });
            });
        }
        
        $scope.saveDesign = function() {
            var enc = new mxCodec();
            var node = enc.encode(editor.graph.getModel());

            var val = mxUtils.getPrettyXml(node);

            var data = {};
            data.username = $stateParams.user;
            data.projectname = $stateParams.project;
            data.dataflow = val;

            api.saveProj(data).then(function success(res) {
                toastr.success("Successfully saved project");
            }, function fail(err) {
                console.log("failed to save project");
                console.log(err);
            })
        }

    }]);
