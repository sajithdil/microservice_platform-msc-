var home = angular.module("mprojects",['ui.router','apiService','ui.bootstrap','toastr'])
	.config(['$stateProvider',function($stateProvider){
		$stateProvider.state('mLoginState', {
			url: '/projects',
			templateUrl: '/javascripts/projects/template/template.tpl.html',
			controller: 'mProjectsCtrl'
			
		});
	}])
	.controller('mLoginCtrl',["$scope", "$rootScope",'restApiService','$modal','$state','toastr',function($scope,$rootScope,api,$modal,$state,toastr){
	    
	    if($scope.username=="sajith")
	    {
	        $rootScope.username = "sajith";
	    }
	    else if($scope.username=="jamal")
	    {
	        $rootScope.username = "jamal";
	    }
	    else
	    {
	        toastr.error("failed to login");
	    }
	    
	}]);