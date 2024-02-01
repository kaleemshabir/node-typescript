/* eslint-disable no-param-reassign */

import { Document, Model, Query, Schema } from "mongoose";

/**
 * @typedef {Object} QueryResult
 * @property {Document[]} results - Results found
 * @property {number} page - Current page
 * @property {number} limit - Maximum number of results per page
 * @property {number} totalPages - Total number of pages
 * @property {number} totalResults - Total number of documents
 */
interface QueryResult {
  results: Document[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

/**
 * Query for documents with pagination
 * @param {Object} [filter] - Mongo filter
 * @param {Object} [options] - Query options
 * @param {string} [options.sortBy] - Sorting criteria using the format: sortField:(desc|asc). Multiple sorting criteria should be separated by commas (,)
 * @param {string} [options.populate] - Populate data fields. Hierarchy of fields should be separated by (.). Multiple populating criteria should be separated by commas (,)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const paginate = (schema: Schema):void => {
  schema.statics.paginate = async function (
    filter: object,
    options: {
      sortBy?: string;
      populate?: string;
      limit?: number;
      page?: number;
    },
    projection: object = {}
  ): Promise<QueryResult> {
    let sort = "";
    if (options.sortBy) {
      const sortingCriteria: string[] = [];
      options.sortBy.split(",").forEach((sortOption) => {
        const [key, order] = sortOption.split(":");
        sortingCriteria.push((order === "desc" ? "-" : "") + key);
      });
      sort = sortingCriteria.join(" ");
    } else {
      sort = "-updatedAt";
    }

    const limit =
      options.limit && parseInt(options.limit.toString(), 10) > 0
        ? parseInt(options.limit.toString(), 10)
        : 10;
    const page =
      options.page && parseInt(options.page.toString(), 10) > 0
        ? parseInt(options.page.toString(), 10)
        : 1;
    const skip = (page - 1) * limit;
    const countPromise = this.countDocuments(
      filter
    ).exec() as unknown as Promise<number>;
    let docsPromise = this.find(filter, projection)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec() as unknown as Promise<Document[]>;

    if (options.populate) {
      const populateOptions = options.populate
        .split(",")
        .map((populateOption) => {
          const pathAndSelect = populateOption.split(" ");
          return {
            path: pathAndSelect[0],
            select: pathAndSelect.slice(1).join(" "),
          };
        });



      docsPromise = docsPromise.then((docs) => {
        return this.populate(docs, populateOptions);
      });
    }

    // docsPromise = docsPromise.exec();

    return Promise.all([countPromise, docsPromise]).then((values) => {
      const [totalResults, results] = values;
      const totalPages = Math.ceil(totalResults / limit);
      const result: QueryResult = {
        results,
        page,
        limit,
        totalPages,
        totalResults,
      };
      return Promise.resolve(result);
    });
  };
};

export default paginate;
