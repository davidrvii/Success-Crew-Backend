const { mapPrismaError } = require("../utils/prismaError");
const response = require("../../response");

function errorHandler(err, req, res, next) {
    const prismaMapped = mapPrismaError(err);
    if (prismaMapped) {
        return response(
            prismaMapped.status,
            { details: prismaMapped.details },
            prismaMapped.message,
            res
        );
    }

    console.error("[Unhandled Error]", err);

    return response(500, null, "Server Error", res);
}

module.exports = errorHandler;
