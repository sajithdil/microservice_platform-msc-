var home = angular.module("menv",['ui.router','apiService','ui.bootstrap','toastr','ng-mfb','akoenig.deckgrid'])
	.config(['$stateProvider',function($stateProvider){
		$stateProvider.state('mEnvtate', {
			url: '/env',
			templateUrl: '/javascripts/environments/template/template.tpl.html',
			controller: 'mEnvCtrl'
			
		});
	}])
	.controller('mEnvCtrl',["$scope", "$rootScope",'restApiService','$modal','$state','toastr','$timeout','$modal',function($scope,$rootScope,api,$modal,$state,toastr,$timeout,$modal){
	    
	    $scope.goToProj = function()
	    {
	        $state.transitionTo('mProjectsState');
	    }
	    
		
		api.getEnvs().then(function success(res){
			
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
                    templateUrl: '/javascripts/environments/template/env.tpl.html',
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
                        
                      
                        
                        $scope.saveEnv = function()
                        {
                            var data = {
                                name: $scope.name,
                                loc: $scope.loc
                            };
                            
                           
                            
                            api.addEnv(data).then(function success(res){
                                
                                toastr.success("Env saved");
                                
                                // api.getBusinessObjectsByUser('sajith').then(function success(res){
                                //     $scope.bObjs = res.data.b_objs;
                                //     $scope.bObjData = res.data;
                                    
                                // },function fail(err){
                                //     console.log(err);
                                // });
                                
                                api.getEnvs().then(function success(res){
			
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
		}
	    
	}]);