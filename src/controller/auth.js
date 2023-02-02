
const db = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();


module.exports = {
  registraion: (req, res, next) => {
    res.render('registration/registration');
  },
  homepage: (req, res, next) => {
    res.render('homepage');
  },
  login: (req, res, next) => {
    res.render('login/login');
  },

  handlelogin: async (req, res, next) => {
    const { email, password } = req.body;

    if (!(email && password)) {
      return res.render('login/login', { message: 'All input is required' });

    }
    // Validate if user exist in our database
    const post = await db.User.findOne({ where: { email } });

    if (post && (await bcrypt.compare(password, post.password))) {
      // Create token
      const token = jwt.sign(
        { id: post._id, email: post._email },
        process.env.SECRET_KEY);

      // save user token
      post.token = token;
      return res.render('dashboard');
    }
    return res.render('login/login', { message: 'invalid credential' });

    // Our register logic ends here
  },

  addNewUser: async (req, res) => {
    try {
      const { name, adress, email, age, password } = req.body;
      const existingUser = await db.User.findOne({ where: { email } });
      if (existingUser) {
        return res.render('registration/registration', { message: 'user already exist' });
      }
      else {
        hashassword = await bcrypt.hash(password, 10);

        const post = await db.User.create({
          name: name,
          adress: adress,
          email: email,
          age: age,
          password: hashassword
        });

        const token = jwt.sign({ email: post.email, id: post._id }, process.env.SECRET_KEY)
        res.render('registration/registrationhandle');
        post.token = token;
      }
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }

}















