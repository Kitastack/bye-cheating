import moment from "moment";
export default abstract class Logger {
  constructor() {}
  static error(title: string, msg: string) {
    console.log(
      `${moment(Date.now()).format(
        "dddd, MMMM D, YYYY h:mm:ss A"
      )} [ERROR] [${title}] ${msg}`
    );
  }
  static info(title: string, msg: string) {
    console.log(
      `${moment(Date.now()).format(
        "dddd, MMMM D, YYYY h:mm:ss A"
      )} [INFO] [${title}] ${msg}`
    );
  }
}
