export const getUserData = async () => {
    try {
        const role = req.User.role;
        const recentSearchCities = req.User.recentSearchCities;
        res.json({success:true, role, recentSearchCities})

    } catch (error) {

        res.json({success:false, message: error.message})
        
    }
    
}



// Store user recent search

export const storeRecentSearchCities = async (req, res)=>{
    try {

        const {recentSearchCity} = req.body;
        const user = await req.User;

        if(user.recentSearchCities.length< 3){
            user.recentSearchCities.push(recentSearchCity)
        }else{
            user.recentSearchCities.shift();
            user.recentSearchCities.push(recentSearchCity)
        }
        await user.save();
        res.json({success:true, message: "city added"})
        
    } catch (error) {
        res.json({success:false, message: error.message})
    }
};