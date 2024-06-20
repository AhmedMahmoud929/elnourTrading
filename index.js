const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const port = process.env.PORT || 2502;
const bodyParser = require("body-parser");
const session = require("express-session");
const flash = require("express-flash");
const Admin = require("./models/admin.model");
const bcrypt = require("bcrypt");
const requireAuth = require("./middlewares/requireAuth");
const countVisits = require("./middlewares/countVisits");
const i18n = require("i18n");
const cookieParser = require("cookie-parser");
const SessionStore = require("connect-mongodb-session")(session);

const DB_URL =
  "mongodb+srv://ahmedMahmoud:ahmedMahmoud@cluster0.u22xrj7.mongodb.net/elnourTrading?retryWrites=true&w=majority";

// Routers
const AuthRouter = require("./routers/auth.router");
const publicRouter = require("./routers/public.router");
const NewsRouter = require("./routers/news.router");
const GalleryRouter = require("./routers/gallery.router");
const BrochuresRouter = require("./routers/brochures.router");
const contentRouter = require("./routers/content.router");
const mediaRouter = require("./routers/media.router");
const messagesRouter = require("./routers/messages.router");

// Connect to MongoDB
mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

// Store sessions
const STORE = new SessionStore({
  uri: DB_URL,
  collection: "loginSessions",
});

app.use(
  session({
    secret: "3MyS#ecr$2xtDLa01DwqT",
    saveUninitialized: false,
    store: STORE,
    cookie: {
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
    },
  })
);

// Configure i18n
i18n.configure({
  locales: ["en", "ar"],
  directory: path.join(__dirname, "locales"),
  defaultLocale: "en",
  cookie: "locale",
  autoReload: true, // This enables auto-reloading
  updateFiles: true,
  syncFiles: true,
  objectNotation: true,
  register: global,
});

// i18n middlewares
app.use(i18n.init);
app.use(cookieParser());

// Middleware to set locale based on query parameter or cookie
app.use((req, res, next) => {
  let locale = req.query.lang || req.cookies.locale;
  if (locale) {
    res.setLocale(locale);
  }
  next();
});

// Flash Sessions
app.use(flash());

// create application/json parser
app.use(bodyParser.json());

// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }));

// Set up EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Set static path
app.use(express.static(path.join(__dirname, "assets")));

// Routes
app.use("/", countVisits, publicRouter);
app.use("/", AuthRouter);
app.use("/dashboard", requireAuth, NewsRouter);
app.use("/dashboard", requireAuth, GalleryRouter);
app.use("/dashboard", requireAuth, BrochuresRouter);
app.use("/dashboard", requireAuth, contentRouter);
app.use("/dashboard", requireAuth, mediaRouter);
app.use("/dashboard", requireAuth, messagesRouter);

// Server Listening
app.listen(port, () => {
  console.log(`http://127.0.0.1:${port}`);
});

// Code to create admin
// async function CREATE_ADMIN(fullName, username, password) {
//   try {
//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds

//     // Create new user with hashed password
//     const newAdmin = new Admin({
//       fullName,
//       username,
//       password: hashedPassword,
//     });

//     // Save the new user
//     await newAdmin.save();
//     res.send("Admin Created Successfully");
//   } catch (err) {
//     res.status(500).send(err);
//   }
// }

// CREATE_ADMIN("Ahmed Mahmoud", "admin", "admin");
