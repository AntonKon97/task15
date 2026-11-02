# Server for theme JWT

The application provides the functionality of authentication and authorization with JWT.  
The endpoints of the application with headers and examples of bodies are defined in *requests.rest* file. 

Provided functionality: 
1. **sign up into the server (auth/signup)** if there is no user with the same username already signed up.  
  - in case of success  
      user login and password will be saved,  
      the response status will be 200,    
      the response body will be
      ```
      {
        "result": "Signup is successful"
      }
      ```
  - in case of failure (if there is a user with such username signed up already) the response status will be 422 and the body:  
      ```
      {
        "errors": [
          {
            "msg": "This user already exists"
          }
        ]
      }
      ```
2. **log in to the server (auth/login)**  
  - in case of success - if login and password are correct  
  the response status will be 200,    
  the body will have the next structure
    ```
    {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiU21pdGgiLCJpYXQiOjE2OTc3OTE0NDAsImV4cCI6MTY5Nzc5MTQ4NX0.NWGg2BXP4dDNqVL_kbD7z5MKcr8dT_w9GeAB5udLW3I",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiU21pdGgiLCJpYXQiOjE2OTc3OTE0NDB9.s6hMWA5zgyFhJ-2DX14Q9EeKecQvBx9C_fVcMCCDjM0"
    }  
    ```  
    and refresh token will be stored by the server.  
    
  - if login or/and password are incorrect, the response status will be 404, and the body
    ```
    {
      "errors": [
        {
          "msg": "Invalid Credentials"
        }
      ]
    }  
    ```
3. **generating new token by refresh token: /auth/token**
  - in case of success the response status code will be 200 and the body  
    ```
    {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiU21pdGgiLCJpYXQiOjE2OTc3OTU1NjQsImV4cCI6MTY5Nzc5NTYwOX0.4eeenKoi8-pY39ru_Zy6DEgiH3_O_gA9xTWwcat_sa8"
    }
    ```
  - if no refresh token was provided, the response status code will be 401
  - if the refresh token was not found among stored to the server, the response status code will be 403
  - if the refresh token is invalid, the response status code will be 403
4. **logging out from the system: /auth/logout** - refresh token is sent in the body. 
  - 204 status code will be returned and the received refresh token will be removed from refreshTokens that are stored on the server
  
5. **/posts** - this resource is available only to authenticated users. Authentication token is received in the 'Authorization' header, the next word after 'Bearer' and space (see example in request.rest file).
  - if the token is not received, the response status will be 401
  - if the token is not valid, the response status will be 403
  - in case of success the 200 status code will be used for response, and an array of all posts will be sent in the response body
6. **/posts/my** - this resource is available only to authenticated users. Authentication token is received in 'Authorization' header, the next word after 'Bearer' and space.
  - if the token is not received, the response status will be 401
  - if the token is not valid, the response status will be 403
  - in case of success  
   the 200 status code will be used for response,   
   and an array of posts with author field equal to the name of this authenticated user, that is making the request, will be sent in the response body
7. **/posts/:id** - this resource is be available only to authenticated users. Authentication token is received in 'Authirization' header, the next word after 'Bearer' and space.
  - if author field of the requested post is not equal to the name of this authenticated user, that is making the request,  
  the response status code will be 403
  - if the token is not received, the response status will be 401
  - if the token is not valid, the response status will be 403
  - if there is no post with the specified id, the response status will be 404
  - in case of success  
   the 200 status code will be used for response,    
   and updated post will be sent in response body

   *Tip: you can use extention **REST Client** to be able to send requests from requests.rest file within VS Code :)*