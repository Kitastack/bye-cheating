import { Context } from "hono";

type respType = Context & {
  data: any;
};

// export const respHandler = (c: respType) => {
//   return c.json({
//     success: true,
//     ...(c.get("data") || {}),
//   });
// };

export const errorHandler = (c: Context) => {
  return c.json(
    {
      success: false,
      message: c.get("message") || "Internal Server Error",
    },
    c.get("status") || 500
  );
};

export const notFoundHandler = (c: Context) => {
  return c.json(
    {
      success: false,
      message: "Page not found",
    },
    404
  );
};
