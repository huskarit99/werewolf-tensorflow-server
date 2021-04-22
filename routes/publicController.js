const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @route   POST api/users
// @desc    Register a user
// @access  Public
router.post(
  '/users', [
  check('fullname', 'Please add name').not().isEmpty(),
  check('username', 'Please include a valid username').not().isEmpty(),
  check(
    'password',
    'Please enter a password with 6 or more characters'
  ).isLength({ min: 6 }),
],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, username, password } = req.body;

    try {
      let user = await User.findOne({ username });

      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }

      user = new User({
        fullname,
        username,
        password,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET, {
        expiresIn: 3600000,
      },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            isSuccess: true,
            token: token
          });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error...');
    }
  }
);

// @route   POST api/auth
// @desc    Auth user & get token
// @access  Public
router.post(
  '/auth-user', [
  check('username', 'Please include a valid username').not().isEmpty(),
  check('password', 'Password is required').exists(),
],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        isSuccess: false,
        errors: errors.array()
      })
        .end();
    }
    const { username, password } = req.body;
    try {
      let user = await User.findOne({ username });
      if (!user) {
        res.status(400).json({ isSusscess: false }).end();
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(400).json({ isSusscess: false }).end();
      }
      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        process.env.JWT_SECRET, {
        expiresIn: 3600000,
      },
        (err, token) => {
          if (err) throw err;
          res.json({
            isSuccess: true,
            token: token
          });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(401).json({ isSusscess: false }).end();
    }
  }
);

module.exports = router;