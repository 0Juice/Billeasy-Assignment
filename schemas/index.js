const { z } = require("zod/v4");
const mongoose = require("mongoose");

const ObjectId = mongoose.Types.ObjectId;

const userLoginSchema = z.object({
		username: z.string().max(15).optional(),
		// Can set more Limitations as required
		password: z.string().min(8),
		email: z.email().optional()
	})
	.refine(
		(data) => {
			return data.username || data.email;
		},
		{
			error: "Username or Email Required",
		}
	);

const userSignupSchema = z.object({
	username: z.string(),
	password: z.string().min(8),
	email: z.email()
});

const bookSchema = z.object({
	// Set Max Size for a Title & Description to prevent spamming
	title: z.string().max(256),
	description: z.string().max(500),
	author: z.string().max(50).optional(),
	genre: z.string().max(15).optional(),
});

const bookSearchSchema = z
	.object({
		title: z.string().max(256).optional(),
		author: z.string().max(50).optional(),
	})
	.refine(
		(data) => {
			return data.title || data.author;
		},
		{
			error: "Title or Author required",
		}
	);

const reviewSchema = z.object({
	userId: z.instanceof(ObjectId),
	bookId: z.instanceof(ObjectId),
	rating: z.int().min(1).max(5),
	content: z.string().max(500),
});

module.exports = { userLoginSchema, userSignupSchema, bookSchema, bookSearchSchema, reviewSchema }