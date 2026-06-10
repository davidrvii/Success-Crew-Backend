const prisma = require('../utils/prisma')
const response = require('../../response')

const getAllVisitor = async (req, res, next) => {
    try {
        const visitors = await prisma.visitor.findMany({
            orderBy: { created_at: 'desc' },
        })

        return response(200, { visitors }, 'Get All Visitor Success', res)
    } catch (error) {
        return next(error)
    }
}

const getVisitorDetail = async (req, res, next) => {
    const id = Number(req.params.id)

    try {
        const visitor = await prisma.visitor.findUnique({
            where: { visitor_id: id },
            include: {
                visit: true
            }
        })

        if (!visitor) {
            return response(404, null, 'Visitor Not Found', res)
        }

        return response(200, { visitor }, 'Get Visitor Detail Success', res)
    } catch (error) {
        return next(error)
    }
}

const createNewVisitor = async (req, res, next) => {
    const { visitor_name, visitor_phone, visitor_address, visitor_information } = req.body;

    try {
        if (!visitor_name) {
            return response(400, null, 'visitor_name is required', res)
        }

        const created = await prisma.visitor.create({
            data: {
                visitor_name,
                visitor_phone: visitor_phone ?? null,
                visitor_address: visitor_address ?? null,
                visitor_information: visitor_information ?? null,
            }
        })

        return response(201, { visitor: created }, 'Create Visitor Success', res)
    } catch (error) {
        return next(error)
    }
}

module.exports = {
    getAllVisitor,
    getVisitorDetail,
    createNewVisitor,
}
