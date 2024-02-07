const MessagesRoutes = require("express").Router();
const Messages = require("../models/messageModel");


MessagesRoutes.post("/addmsg/", async (req, res, next) => {
    try {
        const { from, to, message } = req.body;

        if (!from || !to || !message) {
            return res.status(400).json({ msg: "Missing required fields: 'from', 'to', or 'message'." });
        }

        const data = await Messages.create({
            message: { text: message },
            users: [from, to],
            sender: from,
        });

        if (data) return res.json({ msg: "Message added successfully." });
        else return res.json({ msg: "Failed to add message to the database" });

    } catch (ex) {
        next(ex);
    }
});

MessagesRoutes.post("/getmsg/", async (req, res, next) => {
    try {
        const { from, to } = req.body;

        if (!from || !to) {
            return res.status(400).json({ msg: "Missing required fields: 'from' or 'to'." });
        }
        
        const messages = await Messages.find({
            users: {
                $all: [from, to],
            },
        }).sort({ updatedAt: 1 });

        const projectedMessages = messages.map((msg) => {
            return {
                fromSelf: msg.sender.toString() === from,
                message: msg.message.text,
            };
        });
        res.json(projectedMessages);
    } catch (ex) {
        next(ex);
    }
});

module.exports = MessagesRoutes;