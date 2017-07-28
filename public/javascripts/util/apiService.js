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
        },
        addScriptHandling:function(data)
        {
            return request.make("POST","sch",data);
        },
        getScriptHandling:function(username,proj,id)
        {
            return request.make("GET","sch/"+username+"/"+proj+"/"+id,'');
        },
        addDbHandling:function(data)
        {
            return request.make("POST","dbh",data);
        },
        getDbHandling:function(username,proj,id)
        {
            return request.make("GET","dbh/"+username+"/"+proj+"/"+id,'');
        },
        addRestHandling:function(data)
        {
            return request.make("POST","resth",data);
        },
        getRestHandling:function(username,proj,id)
        {
            return request.make("GET","resth/"+username+"/"+proj+"/"+id,'');
        },
        addDecisionHandling:function(data)
        {
            return request.make("POST","dech",data);
        },
        getDecisionHandling:function(username,proj,id)
        {
            return request.make("GET","dech/"+username+"/"+proj+"/"+id,'');
        },
        getBeginObjectsByUserAndProject:function(user,project)
        {
            return request.make("GET","begin_objects/"+user+"/"+project,'');
        },
        updateBeginObj:function(data)
        {
            return request.make("POST","begin_objects",data);
        },
        getEndObjectsByUserAndProject:function(user,project)
        {
            return request.make("GET","end_objects/"+user+"/"+project,'');
        },
        updateEndObj:function(data)
        {
            return request.make("POST","end_objects",data);
        }
        
        
    }
}]);