export declare global {
  // namespace Express {
  //   export interface Request {
  //     user?: any
  //   }
  // }
  namespace NodeJS {
    interface ProcessEnv {
      GENERAL_SERVICE_URL: string
      WATCH_SERVICE_URL: string
      PORT: string
    }
  }
}
