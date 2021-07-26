import signInResponseEnum from "../../utils/enums/signInResponseEnum.js";

const signInValidator = (username, password) => {
  if (!username) {
    return { isSuccess: false, code: signInResponseEnum.USERNAME_IS_EMPTY }
  }
  if (!password) {
    return { isSuccess: false, code: signInResponseEnum.PASSWORD_IS_EMPTY }
  }
  return { isSuccess: true, code: signInResponseEnum.SUCCESS };
}

export default signInValidator;