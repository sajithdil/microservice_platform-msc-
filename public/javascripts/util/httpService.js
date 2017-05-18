var httpService = angular.module("httpService",[]);
httpService.factory("requestService",['$http','$q',function($http,$q){
    
    return{
        make:function(method,url,requestData){
                var def = $q.defer();
                
                $http({
                    method: method,
                    url: url,
                    data: requestData
                }).then(function successCallBack(response){
                    //console.log("success: " + response);
                    def.resolve(response);
                },function errorCallBack(response){
                    //console.log("err: " + response);
                    
                    def.reject(response);
                    
                    
                });
    
                return def.promise;
            }
        }
    
}]);