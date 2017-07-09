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
        getprojectsbyuser:function(username)
        {
            return request.make("GET","projects/"+username,'');
        },
        addProj:function(data){
            return request.make("POST","projects/",data);
        },
        getEnvs:function(){
            return request.make("GET","envs/",'');
        },
        addEnv:function(data){
            return request.make("POST","envs/",data);
        },
        getProjByUserAndProjName:function(user,proj){
            return request.make("GET","projects/"+user+"/"+proj,'');
        },
        saveProj:function(data)
        {
            return request.make("POST","projects/save",data);
        }
        
    }
}]);