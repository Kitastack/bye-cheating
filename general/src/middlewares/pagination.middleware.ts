import { Request, Response, NextFunction } from "express";
import qs from "qs";

export const pagination =
  (limit: number = 5) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (req.query) {
      const query = Object.assign({}, req.query);
      const page = +(query.page ?? 1);
      req.limit = +(query.limit ?? limit);
      req.page = +((page - 1) * +req.limit);
      delete query.page;
      delete query.limit;
      req.populatedQuery = qs.parse(qs.stringify(query));
    }
    next();
  };
