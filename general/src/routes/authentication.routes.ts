import { info as loggerInfo, error as loggerError } from "@utils/logger";
import { validateTokenHTTP } from "@middlewares/authentication.middleware";
import { Role } from "@prisma/client";
import AuthenticationController from "@controllers/authentication.controller";
import RouteExpress from ".";

class AuthenticationRoute extends RouteExpress {
  async useRoutes() {
    try {
      this.router.post("/signin", AuthenticationController.signin);
      this.router.delete(
        "/signout",
        validateTokenHTTP([]),
        AuthenticationController.signout
      );
    } catch (error: any) {
      loggerError("authentication-routes", error?.message ?? error);
    }
  }
}

export default new AuthenticationRoute();
