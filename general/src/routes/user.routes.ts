import { info as loggerInfo, error as loggerError } from "@utils/logger";
import { validateTokenHTTP } from "@middlewares/authentication.middleware";
import { Role } from "@prisma/client";
import UserController from "@controllers/user.controller";
import RouteExpress from ".";

class UserRoute extends RouteExpress {
  useRoutes() {
    try {
      this.router.get("/my", validateTokenHTTP(), UserController.getMyUser);
      this.router.get(
        "/:id",
        validateTokenHTTP([Role.admin]),
        UserController.getById
      );
      this.router.get(
        "/",
        validateTokenHTTP([Role.admin]),
        UserController.getById
      );
      this.router.post(
        "/",
        // validateTokenHTTP([Role.admin]),
        UserController.create
      );
    } catch (error: any) {
      loggerError("user-routes", error?.message ?? error);
    }
  }
}

export default new UserRoute();
