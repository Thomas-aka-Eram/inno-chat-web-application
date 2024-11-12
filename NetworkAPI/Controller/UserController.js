const userModel = require('../Model/UserModel');
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const createToken = (_id) => {
    const jwtkey = process.env.JWT_SECRET_KEY;
    return jwt.sign({ _id }, jwtkey, { expiresIn: "3d" });
}

const verifyToken = (token) => {
    const jwtkey = process.env.JWT_SECRET_KEY;
    return jwt.verify(token, jwtkey);
}

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json("All fields are required!");
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json("Invalid email format!");
        }

        if (!validator.isStrongPassword(password)) {
            return res.status(400).json("Password must be stronger! Ensure it has at least 8 characters, including uppercase, lowercase, numbers, and symbols.");
        }

        let user = await userModel.findOne({ email });
        if (user) {
            return res.status(400).json(`User already exists with email: ${user.email}`);
        }

        user = new userModel({ name, email, password });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();
        const token = createToken(user._id);

        res.status(200).json({ _id: user._id, name, email, token });

    } catch (error) {
        console.error(error);
        res.status(500).json("Internal server error");
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json("Invalid email or password!");
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(400).json("Wrong password! Please try again!");
        }

        const token = createToken(user._id);
        res.status(200).json({ _id: user._id, name: user.name, email, token });

    } catch (error) {
        console.error(error);
        res.status(500).json("Internal server error");
    }
}

const findUser = async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json("User not found");
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json("Internal server error");
    }
}

const getUsers = async (req, res) => {
    try {
        const users = await userModel.find();
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json("Internal server error");
    }
}

const searchUsers = async (req, res) => {
    const searchTerm = req.query.searchTerm;

    if (!searchTerm) {
        return res.status(400).json({ error: true, message: "Search term is required" });
    }

    try {
        const users = await userModel.find({
            name: { $regex: searchTerm, $options: 'i' } // case-insensitive search
        });

        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: true, message: "Internal server error" });
    }
};

const updateUser = async (req, res) => {
    const userId = req.params.userId;
    const { name } = req.body; // Ensure you are destructuring the name properly

    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json("User not found");
        }

        user.name = name; // Update the user name correctly
        await user.save();

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { registerUser, loginUser, findUser, getUsers, searchUsers, updateUser };


