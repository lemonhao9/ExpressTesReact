import ratelimit from "../config/upstash.js";

const rateLimiter = async (req,res,next) => {
    try {
        const {success} = await ratelimit.limit("my-limit-key"); // ou l'userId par user avec l'auth !
        if(!success){
            return res.status(429).json({message:"Trop de requêtes, réessayez plus tard !"});
        }
        next();

    } catch (error) {
        console.log("Rate Limit error", error);
        next (error);
    }
}

export default rateLimiter