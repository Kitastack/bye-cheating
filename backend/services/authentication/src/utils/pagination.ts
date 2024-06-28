import { Users } from "@models/users.model";

/**
 * @name pagination
 * @description turn mongodb result into pagination
 * @access private
 */
export const pagination = async (
  model: typeof Users,
  query: any,
  pageNumber: number = 1,
  limitPerPage: number = 25
): Promise<{ data: any; pages: number; count: number }> => {
  const skip = Number((pageNumber - 1) * limitPerPage);
  const limit = Number(limitPerPage);
  let aggregate: any = [];

  if (query) {
    const arrMatch = Object.entries(query).filter(
      (item) => item[0] !== "pipeline"
    );
    if (arrMatch.length >= 1) {
      aggregate = Object.values(
        arrMatch?.reduce(
          (total, item) => ({ ...total, [item[0]]: item[1] }),
          {}
        )
      );
    }
  }
  // handle pipeline
  let _query;
  let _queryPipeline;
  if (
    (_query = query) === null || _query === void 0
      ? void 0
      : (_queryPipeline = _query.pipeline) === null || _queryPipeline === void 0
      ? void 0
      : _queryPipeline.length >= 1
  ) {
    aggregate.push(...query.pipeline);
  }
  // get Count
  const count =
    (
      await model.aggregate([
        ...aggregate,
        { $group: { _id: null, n: { $sum: 1 } } },
      ])
    )?.[0]?.n || 0;
  // handle pagination
  if (skip) {
    aggregate.push({ $skip: skip });
  }
  if (limit) {
    aggregate.push({ $limit: limit });
  }
  // if aggregate empty
  if (aggregate.length <= 0) {
    aggregate.push({ $match: {} });
  }
  // options
  const options = {
    collation: {
      locale: "en",
    },
  };
  // send result
  const data = await model.aggregate(aggregate).option(options);
  const lengthOfPage = Math.ceil(count / limit);
  return { data, pages: lengthOfPage, count };
};
