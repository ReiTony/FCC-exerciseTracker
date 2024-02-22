const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser');
const  connectDB  = require('./db/connect')
const User = require('./models/userSchema')
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.get('/api/users', async (req, res) => {
  try{
    const users = await User.find({});
    return res.json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { username }  = req.body;
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    // Check if the username already exists
    const user = await User.findOne({ username });
    if (user) {
      return res.json({ error: "Username already taken" });
    }

    const newUser = new User({
      username,
    })

    await newUser.save();
    return res.json({ username: newUser.username, _id: newUser._id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
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