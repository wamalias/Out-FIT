const { res } = require("express");
const {  
    store_data, 
    fetch_history,
    store_mix,
    fetch_recom } = require('./firestore');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const crypto = require('crypto');


//Local Database
const profileAccount = [];

// Methods to be executed on routes 
const welcomePage = (req, res)=>{ 
    res.send("Hello, Welcome to our Page"); 
} 

const postImageMethod = async (req, res)=>{ 
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    try {
        userId = req.params.id;

        // Read the uploaded file
        const filePath = path.join(__dirname, req.file.path);
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
        
        let id, createdAt;  
        id = crypto.randomUUID();
        createdAt = new Date().toISOString();

        const dataOutfit = {
            id: id,
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
            message: "Model is predicted successfully",
            data: dataOutfit,
        })

        return res;
    } catch (error) {
        console.error('Error calling external API:', error.message);
        res.status(500).send('Error processing image.');
    }
};

const getWeeklyRecommendationMethod = (req, res)=>{ 
    res.send("Hello, Get Weekly Recommendation Request"); 
} 

const getOutfitRecommendationMethod = async (req, res)=>{ 
    type = req.params.type;
    const data = await fetch_recom(type);
    return res.status(201).json({
        status: "success",
        data: data
    });
} 

const getHistoryMethod = async (req, res)=>{ 
    userId = req.params.id;
    const data = await fetch_history(userId);
    return res.status(201).json({
        status: "success",
        data: data
    });
} 

const getProfileMethod = (req, res)=>{ 
    const { id } = req.params;
    const profile = profileAccount.filter((Account) => Account.id == id)[0];
    
    if (profile) {
        return res.status(200).json({
            status: 'success',
            data: profile,
        });
    } else {
        return res.status(404).json({
            status: 'fail',
            message: 'Profile not found',
        });
    }
} 

const postProfileMethod = async (req, res)=>{ 
    const { email, name } = req.body;
    
    if (!email) {
        return res.status(400).json({ error: 'Email is missing' });
    }

    const index = profileAccount.findIndex((Account) => Account.email === email);

    if (index !== -1) {
        return res.status(201).json({
            status: 'success',
            message: 'Profil telah terdaftar',
            data: {
                profileId: profileAccount[index].id,
            },
        });
    }

    const { nanoid } = await import('nanoid');
    const id = nanoid(16);
    const newAccount = {
        id,
        email
    };

    profileAccount.push(newAccount);

    const isSuccess = profileAccount.filter((profile) => profile.email === email).length > 0;

    if (isSuccess) {
        return res.status(201).json({
            status: 'success',
            message: 'Profil berhasil ditambahkan',
            data: {
                profileId: id,
            },
        });
    }
} 

const updateProfileMethod = (req, res)=>{ 
    res.send("Hello, Update Profile Request"); 
} 

const postMixandMatch = (req, res)=>{
    const { imageURL, types } = req.body;
    id = crypto.randomUUID();

    const data = {
        id : id,
        imageURL: imageURL,
    };
    
    store_mix(types, data);
    return res.status(200).json({
        status: 'success',
        data: data,
    });
}
// Export of all methods as object 
module.exports = { 
    welcomePage, 
    getWeeklyRecommendationMethod,
    getOutfitRecommendationMethod,
    getHistoryMethod,
    getProfileMethod,
    postImageMethod,
    postProfileMethod,
    updateProfileMethod,
    postMixandMatch
}