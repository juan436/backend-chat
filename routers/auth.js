const authRoutes = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcrypt");

authRoutes.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user)
            return res.json({ msg: "Incorrect Username or Password", status: false });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid)
            return res.json({ msg: "Incorrect Username or Password", status: false });
        delete user.password;
        return res.json({ status: true, user });

    } catch (ex) {
        next(ex);
    }
});
// authRoutes.post("/register");
// authRoutes.get("/allusers/:id");
// authRoutes.post("/setavatar/:id");
// authRoutes.get("/logout/:id");

module.exports = authRoutes;
