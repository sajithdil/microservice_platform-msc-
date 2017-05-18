var apiService = angular.module("apiService",["httpService"]);
apiService.factory("restApiService",['$http','$q','requestService',function($http,$q,request){

    return{
        getBusinessObjectsByUser:function(user)
        {
            return request.make("GET","business_objects/"+user,'');
        },
        updateBusinessObj:function(data)
        {
            return request.make("POST","business_objects",data);
        },
        
    }
}]);