// Require mongoose
const mongoose = require("mongoose");
// Create Schema class
const Schema = mongoose.Schema;

// Create article schema
const ArticleSchema = new Schema({
  // title is a required string
  title: {
    type: String,
    required: true,
    unique: true
  },
  // description is a required string
  description: {
    type: String,
    required: true,
    unique: true
  },
  // boolean to flag articles as saved
  saved: {
    type: Boolean,
    required: true,
    default: false
  },
  // This will save an array of comments' ObjectIds
  comments:[{
        type: Schema.ObjectId,
        ref:'Comment'
    }]
});

// Create the Article model with the ArticleSchema
const Article = mongoose.model("Article", ArticleSchema);

// Export the model
module.exports = Article;