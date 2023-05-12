import jwt from 'jsonwebtoken'
import User from '../model/userModal.js';

export async function authMiddleware(req,res,next){
    let token;

    if(req.headers.authorization){

        try{
            token = req.headers.authorization.split(" ")[1]

            const isCustomAuth = token.length > 30
            let decodedData;

            if(token && isCustomAuth){
                decodedData = jwt.verify(token,process.env.SECRET)
                console.log(decodedData)
                req.userId = decodedData?.id
            }else{
                // the googleId is the token/sub
                const user = await User.findOne({googleId:token})
                req.userId = user._id
            }
            next()

        }catch(e){
            console.log(e)
            res.status(401).json({msg:"Not authorized, token failed"})
        }
    }
    if(!token){
        res.status(401).json({msg:"Not authorized, no token"})
    }
}