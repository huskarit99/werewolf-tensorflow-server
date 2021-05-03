import express from 'express';

import auth from "../../api/middlewares/auth.js";
import operatorType from "../../utils/enums/operatorType.js";
import httpStatusCode from '../../utils/enums/httpStatusCode.js';
import userService from "../../bussiness/services/user.service.js";

const router = express.Router();

// @route   GET api/user
// @desc    Get info user by token
// @access  Private
router.get(
  '/user',
  auth,
  async (req, res) => {
    const resultGetUser = await userService.getUserById(req.user.id);
    if (resultGetUser.code === operatorType.FAIL.READ) {
      res.status(httpStatusCode.SERVER_ERRORS.INTERNAL_SERVER_ERROR)
        .send(resultGetUser)
        .end();
      return;
    }
    res.status(httpStatusCode.SUCCESS.OK).send(resultGetUser);
  });

// @route   PUT api/user
// @desc    update info user
// @access  Private
router.put(
  '/user',
  auth,
  async (req, res) => {
    const { fullname, password } = req.body;
    const resultUpdateUser = await userService.updateUser(fullname, password, req.user.id);
    if (!resultUpdateUser.isSuccess) {
      res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST)
        .send(resultUpdateUser)
        .end();
      return;
    }
    res.status(httpStatusCode.SUCCESS.OK).send(resultUpdateUser);
  });

// @route   GET api/auth
// @desc    Validate token
// @access  Private
router.post(
  '/auth-token',
  auth,
  async (req, res) => {
    res.status(httpStatusCode.SUCCESS.OK).json({
      isSuccess: true
    })
  });

// @route   GET api/users
// @desc    Get all users
// @access  Private
router.get(
  '/users',
  auth,
  async (req, res) => {
    const resultGetAllUsers = await userService.getAllUsers();
    if (resultGetAllUsers.code === operatorType.FAIL.READ) {
      res.status(httpStatusCode.SERVER_ERRORS.INTERNAL_SERVER_ERROR)
        .send(resultGetAllUsers)
        .end();
      return;
    }
    res.status(httpStatusCode.SUCCESS.OK).send(resultGetAllUsers);
  });

export default router;