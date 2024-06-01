const { res } = require("express");
const { 
    loadModel, 
    predict, 
    store_data, 
    fetch_data } = require('./predict');
//Local Database
const profileAccount = [];

// Methods to be executed on routes 
const welcomePage = (req, res)=>{ 
    res.send("Hello, Welcome to our Page"); 
} 

//INI BELUM DITES SAMA SEKALI
//AKU CUMA NGUMPULIN FUNGSI DARI REFERENSI
const postImageMethod = async (req, res)=>{ 
    const { image } = req.payload;
    const outfit_type = await predictOutfit(image);
    const outfit_color = await detectColors(image)
    
    let id, createdAt, code;  
    id = crypto.randomUUID();
    createdAt = new Date().toISOString();

    const data = {
        id: id,
        type: outfit_type,
        color: outfit_color,
        createdAt: createdAt,
    }
    
    await store_data(data);

    const response = h.response ({
        status: "success",
        message: "Model is predicted successfully",
        data: data,
    })

    response.code(201);
    return response;
}; 

const getWeeklyRecommendationMethod = (req, res)=>{ 
    res.send("Hello, Get Weekly Recommendation Request"); 
} 

const getOutfitRecommendationMethod = (req, res)=>{ 
    res.send("Hello, Get Outfit Recommendation Request"); 
} 

const getHistoryMethod = (req, res)=>{ 
    res.send("Hello, Get History Request"); 
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
    
    if (!name || !email) {
        return res.status(400).json({ error: 'Name is missing' });
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
        email,
        name
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
// Export of all methods as object 
module.exports = { 
    welcomePage, 
    getWeeklyRecommendationMethod,
    getOutfitRecommendationMethod,
    getHistoryMethod,
    getProfileMethod,
    postImageMethod,
    postProfileMethod,
    updateProfileMethod
}