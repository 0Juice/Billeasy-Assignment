const { Router } = require("express");
const { Book, Review } = require("../database");
const { bookSchema, reviewSchema } = require("../schemas");
const { userAuthentication } = require("../middlewares/authentication");
const mongoose = require("mongoose");

const ObjectId = mongoose.Types.ObjectId;

const booksRouter = Router();

// POST /books – Add a new book (Authenticated users only)
booksRouter.post("/", userAuthentication, async (req, res) => {
    const { title, description, author, genre, publicationDate, imageLink } = req.body;

    const validatedBook = bookSchema.safeParse({ title, description, author, genre, publicationDate, imageLink });

    console.log(validatedBook);

    if (validatedBook.success) {
		try {
			const book = new Book(validatedBook.data);

            console.log(book);

            await book.save();

            res.status(201).json({
                message: "Book Successfully Created"
            });

		} catch (err) {
            // Duplicate Book Entry Handle
			if(err.code === 11000){
                res.status(409).json({
					error: "A book with this title already exists.",
				});
            }else{
                // DEBUG Log
                console.log(err)
                res.status(500).json({
                    error: "Error Thrown"
                });
            }
		}
	} else {
		// 400 Bad Request
		res.status(400).json({
			// More detailed Errors can be returned for better Semantic Understanding
			error: "Validation Failed",
		});
	}
});

// GET /books – Get all books (with pagination and optional filters by author and genre)
booksRouter.get("/", async (req, res) => {
    const page = req.query.page || 1;
    const offset = req.query.offset || 10;
    const author = req.query.author;
    const genre = req.query.genre;

    const skip = (page - 1) * offset;
    const filter = {};
	if (author) filter.author = author;
	if (genre) filter.genre = genre;

    const books = (await Book
      .find(filter)
      .skip(skip)
      .limit(offset)
      .lean()
      ).map(book => {
        const { _id, __v, ...rest} = book;

        return {
            bookId: _id,
            ...rest
        }
      });

    if(books.length > 0){
        res.json({
            message: "Books Found",
            books
        });
    }else{
        res.status(404).json({
            error: "No Books Found"
        });
    }
});

// GET /books/:id – Get book details by ID, including:
// ○ Average rating
// ○ Reviews (with pagination)
booksRouter.get("/:id", async (req, res) => {
    const bookId = new ObjectId(req.params.id);
    const page = req.query.page || 1;
	const offset = req.query.offset || 10;

    const skip = (page - 1) * offset;

    const { _id, __v, ...bookData } = await Book.findById( bookId ).lean();
    const book = {
        bookId: _id,
        ...bookData
    }

    if(book){
        const ratingData = await Review.aggregate([
            {$match: { bookId }},
            {
                $group: {
                    _id: '$bookId',
                    averageRating: { $avg: '$rating' }
                }
            }
        ]);

        const averageRating = ratingData[0]?.averageRating || null;

        if(averageRating){
            const reviews = (await Review
                .find({ bookId })
                .skip(skip)
                .limit(offset)
                .lean()
                ).map(review => {
                    const { _id, __v, ...rest } = review;

                    return rest;
                });
            
            res.json({
                book,
                averageRating,
                reviews
            })
        }else{
            // Only Book Data found no reviews
            res.json({
                book
            });
        }

        
    }else{
        res.status(404).json({
			error: "No Book Found",
		});
    }
});

// POST /books/:id/reviews – Submit a review (Authenticated users only, one review per user per book)
booksRouter.post("/:id/reviews", userAuthentication, async (req, res) => {
    const bookId = new ObjectId(req.params.id);
    const userId = new ObjectId(String(req.userId));
    const { rating, content } = req.body;

    const validatedReview = reviewSchema.safeParse({ bookId, userId, rating, content});

    if(validatedReview.success){
        try{
            const review = new Review({ bookId, userId, rating, content });

            await review.save();

            res.status(201).json({
				message: "Review Successfully Created",
			});
        }catch(err){
            if (err.code === 11000) {
				res.status(409).json({
					error: "Multiple Reviews for same book",
				});
			}
        }
    }else{
		// 400 Bad Request
		res.status(400).json({
			// More detailed Errors can be returned for better Semantic Understanding
			error: "Validation Failed",
		});
	}
});

module.exports = booksRouter;