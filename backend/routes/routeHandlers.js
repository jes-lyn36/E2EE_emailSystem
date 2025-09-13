import DataModel from "../models/dataModel.js";
import User from "../models/User.js";
import Email from "../models/Email.js";
import TempNewSession from "../models/TempNewSession.js";

export const getAuth = async (req, res) => {
  try {
    const data = await User.find();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(400).json({ message: "Internal Server Error" });
  }
}

export const getEmail = async (req, res) => {
    try {
    const data = await Email.find();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(400).json({ message: "Internal Server Error" });
  }
}

export const getSession = async (req, res) => {
  try {
    const data = await TempNewSession.find();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching session data:", error);
    res.status(400).json({ message: "Internal Server Error" });
  }
}

export const deleteAllEmail = async (req, res) => {
  try {
    await Email.deleteMany({});
    res.status(200).json({ message: "All emails deleted successfully" });
  } catch (error) {
    console.error("Error deleting data:", error);
    res.status(400).json({ message: "Internal Server Error" });
  }
} 

export const deleteAllUser = async (req, res) => {
  try {
    await User.deleteMany({});
    res.status(200).json({ message: "All users deleted successfully" });
  } catch (error) {
    console.error("Error deleting data:", error);
    res.status(400).json({ message: "Internal Server Error" });
  }
}

export const deleteAllSession = async (req, res) => {
  try {
    await TempNewSession.deleteMany({});
    res.status(200).json({ message: "All sessions deleted successfully" });
  } catch (error) {
    console.error("Error deleting session data:", error);
    res.status(400).json({ message: "Internal Server Error" });
  }
};


export const testCreate = async (req, res) => {
  // const post = req.body;
  
  const newData = new DataModel({
    title: "title",
    content: "content",
    image: "image",
  });

  try {
    await newData.save();
    res.status(201).json({ message: "Data created successfully", data: newData });
  } catch (error) {
    console.error("Error creating data:", error);
    res.status(400).json({ message: "Internal Server Error" });
  }
}

