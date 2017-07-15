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
    .controller('mdesignCtrl', ["$scope", "$rootScope", 'restApiService', 'toastr', '$modal', '$stateParams', 'restApiService', function($scope, $rootScope, api, toastr, $modal, $stateParams, api) {




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

        function addToolbarItem(graph, toolbar, prototype, image) {
            // Function that is executed when the image is dropped on
            // the graph. The cell argument points to the cell under
            // the mousepointer if there is one.
            var funct = function(graph, evt, cell, x, y) {
                graph.stopEditing(false);

                var vertex = graph.getModel().cloneCell(prototype);
                vertex.geometry.x = x;
                vertex.geometry.y = y;

                graph.addCell(vertex);
                graph.setSelectionCell(vertex);
            }

            // Creates the image which is used as the drag icon (preview)
            var img = toolbar.addMode(null, image, function(evt, cell) {
                var pt = this.graph.getPointForEvent(evt);
                funct(graph, evt, cell, pt.x, pt.y);
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

        var addVertex = function(icon, w, h, style) {
            var vertex = new mxCell(null, new mxGeometry(0, 0, w, h), style);
            vertex.setVertex(true);

            var img = addToolbarItem(editor.graph, editor.toolbar, vertex, icon);
            img.enabled = true;

            editor.graph.getSelectionModel().addListener(mxEvent.CHANGE, function() {
                var tmp = editor.graph.isSelectionEmpty();
                mxUtils.setOpacity(img, (tmp) ? 100 : 20);
                img.enabled = tmp;
            });
        };


        addVertex('/node_modules/mxgraph/javascript/examples/editors/images/rectangle.gif', 100, 40, '');


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
            }
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
