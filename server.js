const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/bloodbank', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.error('Failed to connect to MongoDB', err);
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bloodgroup: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

app.post('/register', async (req, res) => {
  try {
    const { username, password, bloodgroup } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists.' });
    }

    const newUser = new User({
      username,
      password,
      bloodgroup
    });

    await newUser.save();
    res.status(200).json({ message: 'User registered successfully!' });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ message: 'Error registering new user.' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Authentication failed. User not found.' });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: 'Authentication failed. Incorrect password.' });
    }

    res.status(200).json({ message: 'Login successful!' });
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).json({ message: 'Error logging in.' });
  }
});

const bloodDetailsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  bloodgroup: { type: String, required: true },
  address: { type: String, required: true },
  placeOfDonation: { type: String, required: true },
  hospitalName: { type: String, required: true },
  donationDate: { type: Date, required: true }
});

const BloodDetails = mongoose.model('BloodDetails', bloodDetailsSchema);

app.get('/blood-details', async (req, res) => {
  try {
    const details = await BloodDetails.find();
    res.status(200).json(details);
  } catch (error) {
    console.error('Error fetching blood details:', error);
    res.status(500).json({ message: 'Failed to fetch blood details.' });
  }
});

app.post('/blood-details', async (req, res) => {
  try {
    const { name, mobileNumber, bloodgroup, address, placeOfDonation, hospitalName, donationDate } = req.body;

    const newBloodDetails = new BloodDetails({
      name,
      mobileNumber,
      bloodgroup,
      address,
      placeOfDonation,
      hospitalName,
      donationDate
    });

    await newBloodDetails.save();

    res.status(201).json({ message: 'Blood details registered successfully.' });
  } catch (error) {
    console.error('Error saving blood details:', error);
    res.status(500).json({ message: 'Failed to register blood details.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
