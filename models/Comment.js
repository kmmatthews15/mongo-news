// Require mongoose
const mongoose = require("mongoose");
// Create a schema class
const Schema = mongoose.Schema;

// Create the comment schema
const CommentSchema = new Schema({
  // The comment text
  body: {
    type: String
  }
});

// Create the Comment model
const Comment = mongoose.model("Comment", CommentSchema);

// Export the Comment model
module.exports = Comment;