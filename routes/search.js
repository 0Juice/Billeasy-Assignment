const { Router } = require("express");
const { Book } = require("../database");
const { bookSearchSchema } = require("../schemas");

const searchRouter = Router();

// GET /search – Search books by title or author (partial and case-insensitive)
searchRouter.get("/", async(req, res) => {
    const { title, author } = req.query;

    const validatedSearchQuery = bookSearchSchema.safeParse({ title, author });

    if(validatedSearchQuery.success){
        const filters = [];
        if (title) filters.push({ title: { $regex: title, $options: "i" }});
		if (author) filters.push({ author: { $regex: author, $options: "i" } });
		
        const books = (await Book
            .find(filters.length ? { $or: filters } : {})
            .lean()
            ).map(book => {
                const { _id, __v, ...rest } = book;
                return {
                    bookId: _id,
                    ...rest
                };
            });
        
        if(books.length > 0){
            res.json({
                books
            });
        }else{
            res.status(404).json({
                message: "No Books Found"
            });
        }

    }else{
		// 400 Bad Request
		res.status(400).json({
			error: "Either Title or Author must be present",
		});
	}
});

module.exports = searchRouter;