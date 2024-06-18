/*
This file is used to make function or handler for each API
1. Post Image Method
2. Get Outfit Recommendation
3. Get Weekly Outfit Recommendation
4. Get History
*/

const {  
    store_data, 
    fetch_history,
    fetch_recom 
} = require('./firestore');

const {postImagetoStorage} = require('./storage.js');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const crypto = require('crypto');

// Function to post image into Cloud Storage, predict outfit type and color, and post data description into Firestore
const postImageMethod = async (req, res)=>{ 
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    try {
        userId = req.params.id; //get userID

        // Read the uploaded file
        const filePath = path.join(__dirname, req.file.path);

        const id = crypto.randomUUID();
        const URL = await postImagetoStorage(req.file.path, id);

        let fileStream = fs.createReadStream(filePath);

        // Call the external API to predict outfit type
        const outfit_type  = await axios({
            method: 'post',
            url: 'https://api-python-service-y6drvm4jba-et.a.run.app/detectOutfit',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            data: {
                file: fileStream
            }
        });

        // Destructuring return
        const [predicted_label, confidence_score] = outfit_type.data;

        // Call the external API to predict outfit color
        fileStream = fs.createReadStream(filePath);
        const outfit_color = await axios({
            method: 'post',
            url: 'https://api-python-service-y6drvm4jba-et.a.run.app/detectColor',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            data: {
                file: fileStream
            }
        });
        
        const createdAt = new Date().toISOString();

        const dataOutfit = {
            id: id,
            URL: URL,
            type: predicted_label,
            confidence_score: confidence_score,
            color: outfit_color.data,
            createdAt: createdAt,
        }
        
        // Clean up the uploaded file
        fs.unlinkSync(filePath);

        await store_data(userId, dataOutfit);

        res.status(201).json({
            status: "success",
            message: "Model is predicted and post successfully",
            data: dataOutfit,
        })

        return res;
    } catch (error) {
        console.error('Error calling external API:', error.message);
        res.status(500).send('Error in processing or store image.');
    }
};

// Function to get weekly recommendation
const getWeeklyRecommendationMethod = async (req, res)=>{ 
    types_dict = ['Blazer', 'Dress', 'Jacket', 'Pants', 'Shirt', 'Short', 'Skirt', 'Top', 'Tshirt']

    randomType = types_dict[Math.floor(Math.random() * types_dict.length)];
    //Call fetch_recom function to get data from Firestore
    const data = await fetch_recom(randomType);
    return res.status(201).json({
        status: "success",
        data: data
    });
} 

// Function to get outfit recommendation based on outfit type that have been predicted before
const getOutfitRecommendationMethod = async (req, res)=>{
    if (!req.params.type) {
        return res.status(400).send('No outfit type uploaded.');
    } 
    type = req.params.type; //get type from params

    //Call fetch_recom function to get data from Firestore
    const data = await fetch_recom(type);
    return res.status(201).json({
        status: "success",
        data: data
    });
} 

//Function to get history for each user
const getHistoryMethod = async (req, res)=>{ 
    if (!req.params.id) {
        return res.status(400).send('No user id uploaded.');
    }
    userId = req.params.id; //get id from params

    //Call fetch_history function to get data from Firestore
    const data = await fetch_history(userId);
    return res.status(201).json({
        status: "success",
        data: data
    });
} 

// Export of all methods as object 
module.exports = { 
    getWeeklyRecommendationMethod,
    getOutfitRecommendationMethod,
    getHistoryMethod,
    postImageMethod,
}