const authRoutes = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcrypt");

authRoutes.post("/login", async (req, res, next) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ msg: "Incorrect Username or Password", status: false });
        }

        const { password: _, ...userWithoutPassword } = user.toObject();

        return res.json({ status: true, user: userWithoutPassword });
    } catch (err) {
        return next(err);
    }
});

authRoutes.post("/register", async (req, res, next) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            const duplicateField = existingUser.username === username ? 'username' : 'email';
            return res.status(400).json({ msg: `${duplicateField} already used`, status: false });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            email,
            username,
            password: hashedPassword,
        });

        await user.save();

        const { password: _, ...userWithoutPassword } = user.toObject();

        return res.status(201).json({ status: true, user: userWithoutPassword });
    } catch (ex) {
        return next(ex);
    }
});

authRoutes.get("/allusers/:id", async (req, res, next) => {
    const { id } = req.params;

    try {
        const users = await User.find({ _id: { $ne: id } }).select("email username avatarImage _id");

        if (!users.length) {
            return res.status(404).json({ msg: "No users found", status: false });
        }

        return res.json({ status: true, users });
    } catch (ex) {
        return next(ex);
    }
});

authRoutes.post("/setavatar/:id", async (req, res, next) => {
    try {
        const userId = req.params.id;
        const avatarImage = req.body.image;
      
        if (!userId || !avatarImage) {
          return res.status(400).json({ error: 'User ID and image are required.' });
        }
      
        const userData = await User.findByIdAndUpdate(
          userId,
          {
            isAvatarImageSet: true,
            avatarImage,
          },
          { new: true }
        );
      
        if (!userData) {
          return res.status(404).json({ error: 'User not found.' });
        }
      
        return res.json({
          isSet: userData.isAvatarImageSet,
          image: userData.avatarImage,
        });
      } catch (ex) {
        next(ex);
      }
      
});

authRoutes.get("/logout/:id", async (req, res, next) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({ msg: "User id is required." });
        }
        if (!onlineUsers.has(userId)) {
            return res.status(400).json({ msg: "User is not online." });
        }
        onlineUsers.delete(userId);
        return res.status(200).send();
    } catch (ex) {
        next(ex);
    }
});

module.exports = authRoutes;
