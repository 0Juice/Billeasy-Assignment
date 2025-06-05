const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URL);

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const userDBSchema = new Schema({
	username: { type: String, unique: true, required: true },
	hashedPassword: { type: String, required: true },
	email: { type: String, unique: true, required: true },
});

// Can also store ISBNs
const bookDBSchema = new Schema({
	title: { type: String, unique: true, required: true },
	description: String,
	author: String,
	genre: String,
	publicationDate: Date,
	imageLink: String,
});

const reviewDBSchema = new Schema({
	userId: { type: ObjectId, ref: "User", required: true },
	bookId: { type: ObjectId, ref: "Book", required: true },
	rating: { type: Number, required: true },
	content: { type: String, required: true },
})
.index({ userId: 1, bookId: 1 }, { unique: true });

const User = mongoose.model("User", userDBSchema);
const Book = mongoose.model("Book", bookDBSchema);
const Review = mongoose.model("Review", reviewDBSchema);

module.exports = { User, Book, Review };