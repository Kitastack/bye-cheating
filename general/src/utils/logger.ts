import moment from "moment";

export const error = (title: string, msg: string) => {
  console.error(
    `${moment(Date.now()).format(
      "dddd, MMMM D, YYYY h:mm:ss A"
    )} [ERROR] [${title}] ${msg}`
  );
};

export const nativeError = (...data: any[]) => {
  console.error(
    `${moment(Date.now()).format(
      "dddd, MMMM D, YYYY h:mm:ss A"
    )} [ERROR] ${data?.join("..")}`
  );
};

export const info = (title: string, msg: string) => {
  console.info(
    `${moment(Date.now()).format(
      "dddd, MMMM D, YYYY h:mm:ss A"
    )} [INFO] [${title}] ${msg}`
  );
};
