import { info as loggerInfo, error as loggerError } from "@utils/logger";
import { validateTokenHTTP } from "@middlewares/authentication.middleware";
import RouteExpress from ".";
import StreamController from "@src/controllers/stream.controller";

class StreamRoute extends RouteExpress {
  useRoutes() {
    try {
      this.router.post("/", validateTokenHTTP([]), StreamController.create);
      this.router.get(
        "/",
        validateTokenHTTP([]),
        StreamController.getAllByUser
      );
      this.router.get(
        "/all",
        validateTokenHTTP(["admin"]),
        StreamController.getAll
      );
      this.router.get("/:id", validateTokenHTTP([]), StreamController.getById);
    } catch (error: any) {
      loggerError("report-routes", error?.message ?? error);
    }
  }
}

export default new StreamRoute();
