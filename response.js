const response = (statusCode, data = {}, message, res) => {
    if (!data || typeof data !== "object") {
    data = {};
    }

    return res.status(statusCode).json({
    statusCode,
    message,
    ...data,
    });
};

module.exports = response;
