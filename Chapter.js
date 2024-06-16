const mongoose = require("mongoose");

const ChapterSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    }
  });

const Chapter = mongoose.model("Chapter", ChapterSchema);

module.exports = Chapter;
