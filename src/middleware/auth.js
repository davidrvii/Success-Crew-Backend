const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const response = require("../../response");

const prisma = new PrismaClient();

const authentication = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
    if (!authHeader) {
        return response(401, null, "Unauthorized", res);
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return response(401, null, "Invalid token", res);
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const user = await prisma.users.findUnique({
        where: { user_email: decoded.email },
    });

    if (!user) {
        return response(401, null, "User not found", res);
    }

    req.userData = {
        user_id: user.user_id,
        user_email: user.user_email,
        role_id: user.role_id,
        office_id: user.office_id,
    };

    return next();
    } catch (error) {
        return response(401, null, "Unauthorized", res);
    }
};

const authorization = (req, res, next) => {
    return next();
};

module.exports = {
    authentication,
    authorization,
};
