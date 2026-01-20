const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const authentication = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Invalid token" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const user = await prisma.users.findUnique({
        where: { user_email: decoded.user_email },
    });

    if (!user) {
        return res.status(401).json({ message: "User not found" });
    }

    req.userData = {
        user_id: user.user_id,
        user_email: user.user_email,
        role_id: user.role_id,
        office_id: user.office_id,
    };

    next();
    } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
    }
};

const authorization = (req, res, next) => {
    next();
};

module.exports = {
    authentication,
    authorization,
};
