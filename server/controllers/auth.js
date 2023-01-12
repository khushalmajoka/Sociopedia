import bcrypt from "bcrypt";
// bcrypt is a popular npm package that provides a simple and secure way to hash and verify passwords. It uses the bcrypt hashing 
// algorithm, which is a cryptographic hash function designed specifically for hashing passwords. The bcrypt package is designed to be 
// easy to use and to provide strong security. It is a widely used and well-respected password hashing library, and it is a good 
// choice for storing hashed passwords in a database.
import jwt from "jsonwebtoken";
// jsonwebtoken is a popular npm package that provides a simple and secure way to sign and verify JSON Web Tokens (JWTs). JWTs are a 
// standard for representing claims securely between two parties, and they are commonly used to authenticate and authorize users in 
// web applications.The jsonwebtoken package is designed to be easy to use and to provide strong security. It is a widely used and 
// well-respected JWT library, and it is a good choice for implementing JWT-based authentication and authorization in a web application.
import User from "../models/User.js";

/* REGISTER USER */
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* LOGGING IN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ msg: "User does not exist. " });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
