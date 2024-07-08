const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const i18n = require("i18n");
const dotenv = require("dotenv");
const SessionStore = require("connect-mongodb-session")(session);

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 2502;

// MongoDB URI and options
const DB_URL = process.env.MONGO_URI || "mongodb://mongo:27017/elnourTrading";

// Connect to MongoDB
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  auth: {
    username: process.env.MONGO_USER || "",
    password: process.env.MONGO_PASS || "",
  },
})
.then(() => console.log("Connected to MongoDB"))
.catch((error) => console.error("Error connecting to MongoDB:", error));

// Store sessions in MongoDB
const STORE = new SessionStore({
  uri: DB_URL,
  collection: "loginSessions",
});

// Middleware setup
app.use(session({
  secret: process.env.SESSION_SECRET || "3MyS#ecr$2xtDLa01DwqT",
  saveUninitialized: false,
  resave: false, // Ensure to set resave to false or true as per your requirement
  store: STORE,
  cookie: {
    maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
  },
}));
app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Configure i18n
i18n.configure({
  locales: ["en", "ar"],
  directory: path.join(__dirname, "locales"),
  defaultLocale: "en",
  cookie: "locale",
  autoReload: true,
  updateFiles: true,
  syncFiles: true,
  objectNotation: true,
  register: global,
});
app.use(i18n.init);

// Middleware to set locale based on query parameter or cookie
app.use((req, res, next) => {
  let locale = req.query.lang || req.cookies.locale;
  if (locale) {
    res.setLocale(locale);
  }
  next();
});

// Set up EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static assets
app.use(express.static(path.join(__dirname, "assets")));

// Routes
const AuthRouter = require("./routers/auth.router");
const publicRouter = require("./routers/public.router");
const NewsRouter = require("./routers/news.router");
const GalleryRouter = require("./routers/gallery.router");
const BrochuresRouter = require("./routers/brochures.router");
const contentRouter = require("./routers/content.router");
const mediaRouter = require("./routers/media.router");
const messagesRouter = require("./routers/messages.router");
const adminsRouter = require("./routers/admins.router");
const careersRouter = require("./routers/careers.router");

app.use("/", publicRouter);
app.use("/", AuthRouter);
app.use("/dashboard", require("./middlewares/requireAuth"), NewsRouter);
app.use("/dashboard", require("./middlewares/requireAuth"), GalleryRouter);
app.use("/dashboard", require("./middlewares/requireAuth"), BrochuresRouter);
app.use("/dashboard", require("./middlewares/requireAuth"), contentRouter);
app.use("/dashboard", require("./middlewares/requireAuth"), mediaRouter);
app.use("/dashboard", require("./middlewares/requireAuth"), messagesRouter);
app.use("/dashboard", require("./middlewares/requireAuth"), adminsRouter);
app.use("/dashboard", require("./middlewares/requireAuth"), careersRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Server listening
app.listen(port, () => {
  console.log(`Server running at http://127.0.0.1:${port}`);
});
