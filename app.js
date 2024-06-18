/*
This is a file to build APIs for application usability. 
APIs will be build using Node.js and Express framework.
The list of REST APIs to be implemented in this project are as follows:
1. POST postImage
2. GET getWeeklyRecommendation
3. GET getOutfitRecommendation
4. GET getHistory

Other functionalities that will be implemented in this project:
1. Access model from Cloud Storage.
2. Call API-Python to predict result after scanning.
3. Store data into Firestore
4. Fetch data from Firestore
*/

const express = require('express'); 

const myRoute = require('./routes.js'); 
  
const app = express(); 
const PORT = 3000; 

// Middlewares 
app.use(express.json()); 
  
// Routes will be written here 
app.use('/', myRoute);  

app.listen(PORT, (error) =>{ 
    if(!error) 
        console.log("Server is Successfully Running, and App is listening on port "+ PORT) 
    else 
        console.log("Error occurred, server can't start", error); 
    } 
); 