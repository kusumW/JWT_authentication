const db = require('../models');
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');



module.exports = {
  loginApi: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!(email && password)) {
        return res.status(500).json({ message: "all input required" });
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
        return res.status(201).json({ sucess: 1, message: 'login sucessfully', token: token });

      }
      return res.status(500).json({ message: "invalid credential" });
    }
    catch (error) {
      return res.status(500).json({ error: error.message })
      // Our register logic ends here
    }
  },

  createNewuser: async (req, res) => {
    try {
      const { name, adress, email, age, password } = req.body;
      const existingUser = await db.User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'user already exist' });
      }
      hashassword = await bcrypt.hash(password, 10);

      const post = await db.User.create({
        name: name,
        adress: adress,
        email: email,
        age: age,
        password: hashassword
      });
      res.status(201).json({ post });

    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  },

  getAll: async (req, res) => {
    try {
      const posts = await db.User.findAll();
      return res.status(200).json({ posts });
    } catch (error) {
      return res.status(500).send(error.message);
    }
  },

  getUserById: async (req, res) => {
    try {
      const { userId } = req.params;
      const post = await db.User.findOne({
        where: { id: userId }
      });
      if (post) {
        return res.status(200).json({ post });
      }
      return res.status(404).send('User with the specified ID does not exists');
    } catch (error) {
      return res.status(500).send(error.message);
    }
  },

  updateUser: async (req, res) => {
    try {

      const { name, adress, email, age, password } = req.body;
      hashassword = await bcrypt.hash(password, 10);
      const { userId } = req.params;
      const [updated] = await db.User.update({
        name: name,
        adress: adress,
        email: email,
        age: age,
        password: hashassword
      }, {
        where: { id: userId }
      });
      if (updated) {
        const updatedUser = await db.User.findOne({ where: { id: userId } });
        return res.status(200).json({ post: updatedUser });

      }
      throw new Error('User not found');
    } catch (error) {
      return res.status(500).send(error.message);
    }
  },

  deleteUser: async (req, res) => {
    try {
      const { userId } = req.params;
      const deleted = await db.User.destroy({
        where: { id: userId }
      });
      if (deleted) {
        return res.status(200).send('User deleted');
      }
      throw new Error("User not found");
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }
};
