// self executing function here
(function() {
   // your page initialization code here
   // the DOM will be available here
   
   var app = angular.module("app",[])
   .controller("appController",[function(){
       console.log("app controller");
   }]);

})();