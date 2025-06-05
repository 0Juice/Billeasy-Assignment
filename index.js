const authRoutes = require("./routes/auth");
const bookRoutes = require("./routes/books");
const reviewRoutes = require("./routes/reviews");
const searchRoutes = require("./routes/search");

const app = express();

app.use(express.json());

app.use("/", authRoutes);
app.use("/books", bookRoutes);
app.use("/reviews", reviewRoutes);
app.use("/search", searchRoutes);