import signUpResponseEnum from "../../utils/enums/signUpResponseEnum.js";

const signUpValidator = (fullname, username, password) => {
  if (!fullname) {
    return { isSuccess: false, code: signUpResponseEnum.FULLNAME_IS_EMPTY }
  }
  if (!username) {
    return { isSuccess: false, code: signUpResponseEnum.USERNAME_IS_EMPTY }
  }
  if (!password) {
    return { isSuccess: false, code: signUpResponseEnum.PASSWORD_IS_EMPTY }
  }
  if (password.length < 6)
    return { isSuccess: false, code: signUpResponseEnum.PASSWORD_IS_LESS_THAN_6_LETTERS }
  return { isSuccess: true, code: signUpResponseEnum.SUCCESS };
}

export default signUpValidator;