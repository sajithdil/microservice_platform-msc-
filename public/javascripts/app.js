// self executing function here
(function() {
    // your page initialization code here
    // the DOM will be available here

    var app = angular.module("app", ['ui.router','mdesign'])
            .config(['$urlRouterProvider',function($urlRouterProvider) {
                console.log("app config");
               
    
    
                $urlRouterProvider.otherwise('/mdesign');
                
                
    
            }])
        .controller("appController", [function() {
            console.log("app controller");
           
            
            

        }]);



})();


