import bcrypt from 'bcryptjs';

import User from "../../models/User.js";
import operatorType from "../../utils/enums/operatorType.js";
import jwtGenerator from "../../api/security/jwtGenerator.js";
import signInValidator from "../../api/validators/signInValidator.js";
import signUpValidator from "../../api/validators/signUpValidator.js";
import updateValidator from "../../api/validators/updateValidator.js";
import userRepository from "../../data/repositories/user.repository.js";
import signInResponseEnum from "../../utils/enums/signInResponseEnum.js";
import signUpResponseEnum from "../../utils/enums/signUpResponseEnum.js";
import updateResponseEnum from '../../utils/enums/updateResponseEnum.js';

const userService = {
  async signin(username, password) {
    // validate request
    const resultSigninValidator = signInValidator(username, password);
    if (!resultSigninValidator.isSuccess)
      return resultSigninValidator;
    // Find username in DB
    const user = await userRepository.getUserByUsername(username);
    if (user === operatorType.FAIL.READ)
      return {
        isSuccess: false,
        code: signInResponseEnum.SERVER_ERROR
      }
    if (!user) {
      return {
        isSuccess: false,
        code: signInResponseEnum.WRONG_USERNAME
      }
    }
    // Comparate password from DB and password from request
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return {
        isSuccess: false,
        code: signInResponseEnum.WRONG_PASSWORD
      }
    // Generate Token
    const resultTokenGenerator = await jwtGenerator.createToken(user);
    if (!resultTokenGenerator.isSuccess)
      return {
        isSuccess: false,
        code: resultTokenGenerator.code
      };
    return {
      isSuccess: true,
      username: user.username,
      code: resultTokenGenerator.code,
      token: resultTokenGenerator.token
    };
  },
  async signup(fullname, username, password) {
    // Validate request
    const resultSignUpValidator = signUpValidator(fullname, username, password);
    if (!resultSignUpValidator.isSuccess)
      return resultSignUpValidator;
    // Check whether username is available or not 
    let user = await userRepository.getUserByUsername(username);
    if (user === operatorType.FAIL.READ)
      return {
        isSuccess: false,
        code: signUpResponseEnum.SERVER_ERROR
      }
    if (user)
      return {
        isSuccess: false,
        code: signUpResponseEnum.USERNAME_IS_UNAVAILABLE
      }
    // Save user to DB
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    user = new User({ fullname, username, password });
    const createUser = await userRepository.addUser(user);
    if (createUser === operatorType.FAIL.CREATE)
      return {
        isSuccess: false,
        code: signUpResponseEnum.SERVER_ERROR
      }
    // Generate Token
    user = await userRepository.getUserByUsername(username);
    const resultTokenGenerator = await jwtGenerator.createToken(user);
    if (!resultTokenGenerator.isSuccess)
      return {
        isSuccess: false,
        code: resultTokenGenerator.code
      };
    return {
      isSuccess: true,
      username: user.username,
      code: resultTokenGenerator.code,
      token: resultTokenGenerator.token
    };
  },
  async getUserByUsername(username) {
    const user = await userRepository.getUserByUsername(username);
    if (user === operatorType.FAIL.READ || !user)
      return {
        isSuccess: false,
        code: operatorType.FAIL.READ
      }
    return {
      isSuccess: true,
      user: user,
      code: operatorType.SUCCESS.READ
    }
  },
  async getUserById(id) {
    const user = await userRepository.getUserById(id);
    if (user === operatorType.FAIL.READ || !user)
      return {
        isSuccess: false,
        code: operatorType.FAIL.READ
      }
    return {
      isSuccess: true,
      user: user,
      code: operatorType.SUCCESS.READ
    }
  },
  async updateUser(fullname, password, id) {
    // validate request
    const resultUpdateValidator = updateValidator(fullname, password);
    if (!resultUpdateValidator.isSuccess)
      return resultUpdateValidator;
    // get user by token
    const user = await userRepository.getUserById(id);
    if (user === operatorType.FAIL.READ) {
      return {
        isSuccess: false,
        code: updateResponseEnum.SERVER_ERROR
      }
    }
    if (password) {
      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);
      user.password = password;
    }
    user.fullname = fullname;
    const resultUpdateUser = await userRepository.updateUser(user);
    if (resultUpdateUser === operatorType.FAIL.UPDATE)
      return {
        isSuccess: false,
        code: updateResponseEnum.SERVER_ERROR
      }
    return {
      isSuccess: true,
      user: user,
      code: updateResponseEnum.SUCCESS
    }
  },
  async getAllUsers() {
    const users = await userRepository.getUsers();
    if (users === operatorType.FAIL.READ)
      return {
        isSuccess: false,
        code: operatorType.FAIL.READ
      }
    return {
      isSuccess: true,
      code: operatorType.SUCCESS.READ,
      users: users
    }
  }
}

export default userService;