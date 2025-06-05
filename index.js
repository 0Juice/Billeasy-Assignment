require("dotenv").config();
const express = require("express");
const PORT = 3000;
const authRouter = require("./routes/auth");
// const bookRoutes = require("./routes/books");
// const reviewRoutes = require("./routes/reviews");
// const searchRoutes = require("./routes/search");

const app = express();

app.use(express.json());

app.use("/", authRouter);
// app.use("/books", bookRoutes);
// app.use("/reviews", reviewRoutes);
// app.use("/search", searchRoutes);

app.listen(PORT, () => {
	console.log(`Server started on Port: ${PORT}`);
});
