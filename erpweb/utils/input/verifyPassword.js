const password = /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z]).*$/;

const verifyPassword = (value) => password.test(value);

export default verifyPassword;
