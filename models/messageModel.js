const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema(
  {
    message: { //cobjeto que representa el objeto del mensaje y dentro el texto del mensaje
      text: { type: String, required: true },
    },
    users: Array, // usuarios relacionados con el mensaje
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // establece una relación entre el campo de envio y los documentos en la colección users.
      required: true,
    },
  },
  {
    timestamps: true, //anexa los campos de hora y fecha automaticamente
  }
);

module.exports = mongoose.model("Messages", MessageSchema);
