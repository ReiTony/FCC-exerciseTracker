const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./db/connect");
const Exercise = require("./models/exerciseSchema");
const User = require("./models/userSchema");
require("dotenv").config();

app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find({});
    return res.json(users);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
});

app.post("/api/users", async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    // Check if the username already exists
    const user = await User.findOne({ username });
    if (user) {
      return res.json({ error: "Username already taken" });
    }

    const newUser = new User({
      username,
    });

    await newUser.save();
    return res.json({ username: newUser.username, _id: newUser._id });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
});

app.post("/api/users/:_id/exercises", async (req, res) => {
  try {
    const { _id } = req.params;
    const { description, duration, date } = req.body;

    if (!_id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const user = await User.findById(_id);
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    if (!description || !duration) {
      return res
        .status(400)
        .json({ error: "Description and duration are required" });
    }

    const newExercise = new Exercise({
      username: user.username,
      description,
      duration,
      date: date ? new Date(date) : Date.now(),
      user: user._id,
    });

    await newExercise.save();
    return res.json({
      username: user.username,
      description: newExercise.description,
      duration: newExercise.duration,
      _id: user._id,
      date: newExercise.date.toDateString(),
    });

  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
});

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Server is listening to ${port}....`));
  } catch (error) {
    console.log(error);
  }
};

start();
