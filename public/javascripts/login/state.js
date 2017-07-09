var home = angular.module("mlogin",['ui.router','apiService','ui.bootstrap','toastr'])
	.config(['$stateProvider',function($stateProvider){
		$stateProvider.state('mLoginState', {
			url: '/login',
			templateUrl: '/javascripts/login/template/template.tpl.html',
			controller: 'mLoginCtrl'
			
		});
	}])
	.controller('mLoginCtrl',["$scope", "$rootScope",'restApiService','$modal','$state','toastr',function($scope,$rootScope,api,$modal,$state,toastr){
	    
	    $scope.login = function()
	    {
	    	if($scope.username=="sajith")
	    {
	        $rootScope.username = "sajith";
	        $state.transitionTo('mProjectsState');
	    }
	    else if($scope.username=="jamal")
	    {
	        $rootScope.username = "jamal";
	        $state.transitionTo('mProjectsState');
	    }
	    else
	    {
	        toastr.error("failed to login");
	    }
	    }
	    
	}]);