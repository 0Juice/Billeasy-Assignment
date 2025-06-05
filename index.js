require("dotenv").config();
const express = require("express");
const PORT = 3000;
const authRouter = require("./routes/auth");
const bookRouter = require("./routes/books");
const reviewRouter = require("./routes/reviews");
// const searchRouter = require("./routes/search");

const app = express();

app.use(express.json());

app.use("/", authRouter);
app.use("/books", bookRouter);
app.use("/reviews", reviewRouter);
// app.use("/search", searchRouter);

app.listen(PORT, () => {
	console.log(`Server started on Port: ${PORT}`);
});
