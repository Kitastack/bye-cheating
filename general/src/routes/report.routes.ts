import { info as loggerInfo, error as loggerError } from "@utils/logger";
import { validateTokenHTTP } from "@middlewares/authentication.middleware";
import { Role } from "@prisma/client";
import RouteExpress from ".";
import ReportController from "@src/controllers/report.controller";

class ReportRoute extends RouteExpress {
  useRoutes() {
    try {
      this.router.get("/", validateTokenHTTP(), ReportController.getReport);
      this.router.get(
        "/",
        validateTokenHTTP([Role.admin]),
        ReportController.getReport
      );
      this.router.get(
        "/:id",
        validateTokenHTTP(),
        ReportController.getReportById
      );
    } catch (error: any) {
      loggerError("report-routes", error?.message ?? error);
    }
  }
}

export default new ReportRoute();
