const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const ObjectId = mongoose.Types.ObjectId;

async function userAuthentication(req, res, next){
    const authHeader = req.headers.authorization;

    if(authHeader && authHeader.startsWith("Bearer")){
        const token = authHeader.split(" ")[1];

        const decodedUser = jwt.verify(token, process.env.JWT_SECRET);

        if(decodedUser.username){
            req.username = decodedUser.username;
            req.userId = new ObjectId(String(decodedUser.userId));
            next();
        }else{
            res.status(401).json({
                error: "You are Unauthorized"
            });
        }
    }else{
        res.status(401).json({
            error: "Authorization Missing or Incorrect"
        });
    }
}

module.exports = { userAuthentication }