import mongoose from "mongoose";

// This is a sample data model to demonstrate the usage of models in MongoDB/Mongoose.
// This is not used in the actual application but serves as a reference for creating data models.

const dataSchema = mongoose.Schema({
  title: String,
  content: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  image: String,
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }]
}, {
});

const DataModel = mongoose.model("Data", dataSchema);

export default DataModel;