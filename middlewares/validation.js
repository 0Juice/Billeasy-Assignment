const mongoose = require("mongoose");

const ObjectId = mongoose.Types.ObjectId;

function validateBookId(req, res, next){
    const id = String(req.params.id);

    if(ObjectId.isValid(id)){
        req.bookId = new ObjectId(id);
        next();
    }else{
        // 400 Bad Request
        res.status(400).json({
            error: "Book ID is Invalid"
        });
    }
}

module.exports = { validateBookId };