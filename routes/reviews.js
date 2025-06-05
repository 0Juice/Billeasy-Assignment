const { Router } = require("express");
const { Review } = require("../database");
const { reviewSchema } = require("../schemas");
const { userAuthentication } = require("../middlewares/authentication");
const { validateBookId } = require("../middlewares/validation");

const reviewsRouter = Router();

// PUT /reviews/:id – Update your own review
reviewsRouter.put("/:id", userAuthentication, validateBookId, async (req, res) => {
    const bookId = req.bookId;
	const userId = req.userId;
    const { rating, content } = req.body;

    const validatedReview = reviewSchema.safeParse({ bookId, userId, rating, content });

    if(validatedReview.success){
        
        const result = await Review.updateOne({ bookId, userId }, { rating, content });

        if(result.matchedCount === 0){
            // 404 Not Found
            res.status(404).json({
                error: "No Review Found to Update"
            });
        }else{
			// 204 No Content
			res.status(204).json({
				message: "Review Successfully Updated",
			});
		}
    }else{
		// 400 Bad Request
		res.status(400).json({
			// More detailed Errors can be returned for better Semantic Understanding
			error: "Validation Failed",
		});
	}

    
});

// DELETE /reviews/:id – Delete your own review
reviewsRouter.delete("/:id", userAuthentication, validateBookId, async(req, res) => {
    const bookId = req.bookId;
	const userId = req.userId;

    const result = await Review.deleteOne({ bookId, userId});
    
    if(result.deletedCount === 0){
		// 404 Not Found
		res.status(404).json({
			error: "No Review Found to Delete",
		});
	}else{
		// 204 No Content
		res.status(204).json({
			message: "Review Successfully Deleted",
		});
	}
});

module.exports = reviewsRouter;