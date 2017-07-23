var apiService = angular.module("apiService",["httpService"]);
apiService.factory("restApiService",['$http','$q','requestService',function($http,$q,request){

    return{
        getBusinessObjectsByUser:function(user)
        {
            return request.make("GET","business_objects/"+user,'');
        },
         getBusinessObjectsByUserAndProject:function(user,project)
        {
            return request.make("GET","business_objects/"+user+"/"+project,'');
        },
        updateBusinessObj:function(data)
        {
            return request.make("POST","business_objects",data);
        },
        getprojectsbyuser:function(username)
        {
            return request.make("GET","projects/"+username,'');
        },
        getprojectsbyuserandproject:function(username)
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
        },
        deployToServ:function(user,proj,serv)
        {
            return request.make("POST","deploy/"+user+"/"+proj+"/"+serv,'');
        },
        getServiceRegistry:function()
        {
            return request.make("GET","serreg",'');
        }
        
        
    }
}]);