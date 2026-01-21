const { Prisma } = require("@prisma/client");

function mapPrismaError(err) {
  // Prisma known request errors
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
            case "P2002": {
                const target = err.meta?.target;

                if (Array.isArray(target) && target.includes("user_email")) {
                    return {
                        status: 400,
                        message: "Email Already Registered",
                        details: { code: err.code, target },
                    };
                }

                // Unique constraint failed
                return {
                    status: 409,
                    message: "Duplicate data (unique constraint).",
                    details: {
                        code: err.code,
                        target: err.meta?.target,
                    },
                };
            }

            case "P2025":
                // An operation failed because it depends on one or more records that were required but not found.
                return {
                    status: 404,
                    message: "Data not found.",
                    details: { code: err.code },
                };

            case "P2003":
                // Foreign key constraint failed
                return {
                    status: 409,
                    message: "Related data not found / foreign key constraint failed.",
                    details: {
                        code: err.code,
                        field: err.meta?.field_name,
                    },
                };

            case "P2014":
                // Required relation violation
                return {
                    status: 409,
                    message: "Relation constraint violation.",
                    details: { code: err.code },
                };

            default:
                return {
                    status: 400,
                    message: "Database request error.",
                    details: { code: err.code, meta: err.meta },
                };
        }
    }

    // Prisma validation error 
    if (err instanceof Prisma.PrismaClientValidationError) {
        return {
            status: 400,
            message: "Invalid data format.",
            details: { type: "PrismaClientValidationError" },
        };
    }

    // Prisma initialization error / engine error
    if (err instanceof Prisma.PrismaClientInitializationError) {
        return {
            status: 500,
            message: "Database initialization error.",
            details: { type: "PrismaClientInitializationError" },
        };
    }

    if (err instanceof Prisma.PrismaClientRustPanicError) {
        return {
            status: 500,
            message: "Database engine error.",
            details: { type: "PrismaClientRustPanicError" },
        };
    }

    return null;
}

module.exports = { mapPrismaError };
