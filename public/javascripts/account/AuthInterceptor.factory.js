/**
 * Created by rafaelpossas on 4/16/15.
 */
/**
 * Created by rafaelpossas on 4/12/15.
 */
'user strict'

app.factory('authInterceptor',['authToken',function(authToken){
  return{
    request: function(config){
      var token = authToken.getToken(config);

      if(token){
        config.headers.Authorization = 'Bearer ' + token;
      }
      return config;
    },
    response: function(response){
      return response;
    }
  }
}])