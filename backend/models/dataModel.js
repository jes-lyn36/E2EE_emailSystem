import mongoose from "mongoose";

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