const express = require('express'); 
  
const app = express(); 
const PORT = 3000; 
  
app.listen(PORT, (error) =>{ 
    if(!error) 
        console.log("Server is Successfully Running, and App is listening on port "+ PORT) 
    else 
        console.log("Error occurred, server can't start", error); 
    } 
); 

/*
This is a file to build APIs for application usability. 
APIs will be build using Node.js and Express framework.
The list of REST APIs to be implemented in this project are as follows:
1. POST postImage
2. GET getWeeklyRecommendation
3. GET getOutfitRecommendation
4. GET getHistory
5. GET getProfile
6. POST postProfile
7. PUT updateProfile

API connections to database:
1 - 4 : Firestore
5 - 7 : SQL

Other functionalities that will be implemented in this project:
1. Access model from Cloud Storage.
2. Predict result after scanning.
3. Provide sign in with Google Account.
*/