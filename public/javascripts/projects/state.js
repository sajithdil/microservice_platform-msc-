var home = angular.module("mprojects",['ui.router','apiService','ui.bootstrap','toastr','ng-mfb','akoenig.deckgrid'])
	.config(['$stateProvider',function($stateProvider){
		$stateProvider.state('mProjectsState', {
			url: '/projects',
			templateUrl: '/javascripts/projects/template/template.tpl.html',
			controller: 'mProjectsCtrl'
			
		});
	}])
	.controller('mProjectsCtrl',["$scope", "$rootScope",'restApiService','$modal','$state','toastr','$timeout','$modal',function($scope,$rootScope,api,$modal,$state,toastr,$timeout,$modal){
	    
	    
	    $scope.goToEnv = function()
	    {
	    	$state.transitionTo('mEnvtate');
	    }
	    
	    $scope.goToProj = function(projectName)
	    {
	    	$state.transitionTo('mdesignState',{"user":$rootScope.username,"project":projectName});
	    }
		
		api.getprojectsbyuser($rootScope.username).then(function success(res){
			
			// $scope.photos = res.data
			// $scope.$apply();
			
			 $timeout(function() {
    			$scope.photos = res.data;
    		}, 0);
			
		},function fail(err){
			console.log(err);
		});
		
		$scope.addProject = function()
		{
			$scope.modalInstance = $modal.open({
                    templateUrl: '/javascripts/projects/template/proj.tpl.html',
                    scope:$scope,
                    resolve: {
                        // bObjData: function () {
                        //   return $scope.bObjData;
                        // }
                        username:function()
                        {
                        	return $rootScope.username;
                        }
                      },
                    controller:function($modalInstance, $scope,username){
                        //$modalInstance.dismiss('cancel');
                        
                      
                        
                        $scope.saveProj = function()
                        {
                            var data = {
                                projectname: $scope.buName,
                                username: username
                            };
                            
                           
                            
                            api.addProj(data).then(function success(res){
                                
                                toastr.success("proj saved");
                                
                                // api.getBusinessObjectsByUser('sajith').then(function success(res){
                                //     $scope.bObjs = res.data.b_objs;
                                //     $scope.bObjData = res.data;
                                    
                                // },function fail(err){
                                //     console.log(err);
                                // });
                                
                                api.getprojectsbyuser($rootScope.username).then(function success(res){
			
									// $scope.photos = res.data
									// $scope.$apply();
									
									 $timeout(function() {
						    			$scope.photos = res.data;
						    			$modalInstance.dismiss('cancel');
						    		}, 0);
									
								},function fail(err){
									console.log(err);
								});
								
                                
                            },function fail(err){
                                console.log(err);
                            })
                            
                        }
                    }
                });
            
            $scope.modalInstance.result.then(function (selectedItem) {
              api.getprojectsbyuser($rootScope.username).then(function success(res){
			
									// $scope.photos = res.data
									// $scope.$apply();
									
									 $timeout(function() {
						    			$scope.photos = res.data;
						    		}, 0);
									
								},function fail(err){
									console.log(err);
								});
            }, function () {
              api.getprojectsbyuser($rootScope.username).then(function success(res){
			
									// $scope.photos = res.data
									// $scope.$apply();
									
									 $timeout(function() {
						    			$scope.photos = res.data;
						    		}, 0);
									
								},function fail(err){
									console.log(err);
								});
            });
          };
		
	    
	}]);