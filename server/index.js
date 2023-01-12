import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
// import.meta.url hume dega url of the current file i.e.
// --> file:///C:/Users/HP/Desktop/WebDevProjects/Sociopedia%20(MERN)/server/index.js

// fir fileURLToPath() kya krta hai ye kisi bhi file ke url ko path me convert kr deta hai matlab ab __filename me aayega
// --> C:\Users\HP\Desktop\WebDevProjects\Sociopedia (MERN)\server\index.js

// ab file path or url me frk kya hota hai:
// file path: A file path is a string that specifies the location of a file on a computer or network. A file path can be either
// absolute or relative. An absolute file path specifies the full location of a file and includes the root directory, while a relative
// file path specifies the location of a file relative to the current directory.

// url: A URL (Uniform Resource Locator) is a string that specifies the location of a resource on the internet. URLs are used to
// access resources on the internet, such as web pages, images, and other types of files. URLs contain information about the location
// of the resource, as well as the protocol used to access it (e.g. HTTP, HTTPS).

const __dirname = path.dirname(__filename);
// ab dirname() kya krta hai?
// ye ek file path leta hai as arguments and return the path to the directory of the file that is being passed.

dotenv.config();
// To dotenv is a package that allows you to define environment variables in a file called .env in the root of your project.
// Environment variables key-value pairs hote hai that are used to configure the behavior of the application. They are often
// used to store sensitive information like API keys or database passwords that you don't want to hardcode into your application code.

// The dotenv.config() function reads the .env file in the root of your project and loads the environment variables from the file into
// the process.env object. This object is a global object in Node.js that is used to store environment variables. The environment
// variables are available to your application as properties of the process.env object.

const app = express();
// to humne jo express module import kiya hai upr vo ek function return krta hai or 51 line me hum us function ko call kr rhe hai as
// express() or vo return krega ek new instance of express fir hum us instance ka use krke jaise app in the above case required functions
// ka use kr skte hain.

app.use(express.json());
// to ise samajhne ke liye sbse pehle:

// Middleware Functions: middleware functions are functions that have access to the request and response objects of an HTTP request
// and can perform tasks before the final route handler is called. Middleware functions can be used to modify the request and response
// objects, run tasks asynchronously, or terminate the request-response cycle.

// The express.json() function is a built-in middleware function in the Express framework that parses the body of an incoming HTTP
// request with a JSON payload and makes the parsed data available in the request.body property. It is designed to be used with the
// app.use() method, which mounts the middleware function at a path or at the application-level.

// payload is the data that is transmitted in an HTTP request or response. The payload can be in various formats, such as plain text,
// HTML, JSON, XML, or binary data (e.g. images, audio files).

app.use(helmet());
// statement is a middleware function that sets various HTTP headers to help protect a web application from common web vulnerabilities.

// helmet is a popular npm package that provides a collection of middleware functions for setting HTTP headers that can help protect a
// web application from various security threats. The helmet package includes middleware functions for setting headers such as
// Content-Security-Policy, Strict-Transport-Security, X-XSS-Protection, and more.

// This code mounts the helmet() middleware function at the application-level, which means that it will set the default set of HTTP
// headers for all incoming requests.

// it is important to note that setting HTTP headers is just one aspect of securing a web application.

app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
// sbse pehle cors ya cross origin resource sharing hota kya h

// It is a security feature implemented by web browsers that blocks web pages from making requests to a different domain than the one
// that served the web page. This is done to prevent malicious websites from making requests to your site and potentially accessing
// sensitive information. However, in some cases, you may want to allow your web page to make requests to a different domain.
// This is where CORS comes in. CORS allows you to specify which domains are allowed to make requests to your server. It is designed
// to allow web applications to access resources from other domains in a safe and controlled manner.

// middleware function that sets the Cross-Origin-Resource-Policy HTTP header to protect a web application from cross-origin resource
// sharing (CORS) attacks.

// The Cross-Origin-Resource-Policy HTTP header is a security header that controls whether a web application is allowed to make
// requests to a different domain. It can be used to protect a web application from CORS attacks by limiting the domains that the
// application is allowed to make requests to.

// This code mounts the helmet.crossOriginResourcePolicy middleware function at the application-level, which means that it will
// set the Cross-Origin-Resource-Policy header for all incoming requests. The policy option specifies the value for the header.
// In this case, the value is set to "cross-origin", which allows the web application to make requests to any domain.

app.use(morgan("common"));
// morgan is a popular npm package that provides a simple, customizable logger middleware function for Express applications.
// It allows you to log HTTP request information such as the request method, URL, response status, and more.

// morgan is a popular npm package that provides a simple, customizable logger middleware function for Express applications.
// It allows you to log HTTP request information such as the request method, URL, response status, and more.

app.use(bodyParser.json({ limit: "30mb", extended: true }));
// body-parser package is a popular npm package that provides middleware functions for parsing the body of HTTP requests.
// It supports parsing of various types of data, including JSON, URL-encoded data, and raw data.

// statement is a middleware function that parses the body of incoming HTTP requests with JSON payloads and makes
// the parsed data available in the request.body property. The limit option is set to "30mb", which specifies that the
// maximum size of the request body is 30 megabytes. The extended option is set to true, which specifies that the qs library should be
// used to parse the data.

// The qs library is a popular npm package for parsing and stringifying query strings. It is a lightweight, efficient library that is
// designed to parse and stringify query strings with minimal overhead. Query strings are a common way to send data in an HTTP request
// or response, especially in GET requests and in the fragment part of the URL. A query string is a string of key-value pairs that is
// appended to the end of the URL, separated by an & character. For example: https://example.com/search?q=test&sort=date
// In this URL, the query string is q=test&sort=date, which contains two key-value pairs: q=test and sort=date.

app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
// it is same as the above it just that is parses the urlencoded payload.

app.use(cors());
// This will enable CORS for all routes on the server, allowing any domain to make requests to your server. You can also specify 
// specific domains that are allowed to make requests to your server, or configure more advanced options like which HTTP methods are 
// allowed.

app.use("/assets", express.static(path.join(__dirname, "public/assets")));
// middleware function that serves static files from the public/assets directory in the root of the project.

// The express.static middleware function is provided by the express package and allows you to serve static files from a directory on 
// the file system. It takes a path to the directory as an argument and returns a middleware function that serves the files in that 
// directory.

// This code mounts the express.static middleware function at the "/assets" path, which means that it will serve static files from 
// the public/assets directory in the root of the project for requests to the "/assets" path. For example, a request to
// "/assets/image.png" will serve the image.png file from the public/assets directory.

// The express.static middleware function can be a useful tool for serving static files, such as images, stylesheets, and JavaScript 
// files, in an Express application. It allows you to easily serve static files from a directory on the file system, without having to 
// write route handlers for each file. However, it is important to note that serving static files can have an impact on the performance 
// of your application, and it is important to use it wisely.

/* FILE STORAGE */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });
// Multer is a middleware for handling HTTP requests that contain multipart/form-data, which is used for file uploads. It is designed 
// to be used with the Express web framework, but it can also be used with other web frameworks or on its own. Multer provides a simple 
// API for handling file uploads and making it easy to process and store the uploaded files. It can be used to handle single file uploads 
// or multiple file uploads, and it provides options for handling the uploaded files in different ways (e.g. storing the files in memory, 
// on disk, or in a cloud storage service).

// Above code snippet defines a multer storage object and a multer middleware function that handle file uploads in an Express application.

// The multer.diskStorage function takes an object with two properties: destination and filename. The destination property is a function 
// that specifies the directory where the uploaded files should be stored, and the filename property is a function that specifies how 
// to name the uploaded files.

// The destination function takes three arguments: req, file, and cb. The req argument is the request object, the file argument is the 
// file being uploaded, and the cb argument is a callback function. The destination function should call the callback function with 
// the directory where the uploaded files should be stored.

// The filename function takes three arguments: req, file, and cb. The req argument is the request object, the file argument is the 
// file being uploaded, and the cb argument is a callback function. The filename function should call the callback function with the 
// name to use for the uploaded file.

// This code defines a multer storage object that specifies that uploaded files should be stored in the public/assets directory and 
// should retain their original name. You can then use the upload middleware function in your route handlers to handle file uploads.

// The cb function is a callback function that is called to return the result of an operation. The first argument to the cb function 
// is typically an error object, which is passed as null if there is no error. If there is an error, the cb function is called with 
// an error object as the first argument. If there is no error, the cb function is called with null as the first argument.

/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
// to ye vhi dotenv package ka kamaal hai ki jo humne secrets .env file me likhe hue hai vo hum process.env se get kr skte hai jase PORT
// in the above case to agar ise process.env.PORT me se PORT mil jaayega to thik hai vrna 6001 le lega as PORT

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    /* ADD DATA ONE TIME */
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error} did not connect`));
// The mongoose package is a popular npm package that provides a simple and elegant way to interact with MongoDB databases from Node.js. 
// It provides a set of functions and methods for defining and querying data models, and for performing common database operations such 
// as inserting, updating, and deleting documents.

// The mongoose.connect function is a function that establishes a connection to a MongoDB database. It takes a MongoDB connection string 
// as the first argument and an options object as the second argument, and returns a promise that resolves when the connection is 
// established.

// It is generally recommended to use the new URL parser and the new unified topology engine when connecting to a MongoDB database with 
// mongoose, as they offer improved performance and reliability.
