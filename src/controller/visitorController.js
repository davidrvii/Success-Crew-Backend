const prisma = require('../utils/prisma')
const response = require('../../response')

const getAllVisitor = async (req, res, next) => {
    try {
        const visitors = await prisma.visitor.findMany({
            orderBy: { created_at: 'desc' },
            select: {
                visitor_id: true,
                visitor_name: true,
                visitor_phone: true,
                visitor_category: true,
                visitor_company: true
            }
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
    const { visitor_name, visitor_phone, visitor_company, visitor_category, visitor_information } = req.body;

    try {
        if (!visitor_name) {
            return response(400, null, 'visitor_name is required', res)
        }

        const created = await prisma.visitor.create({
            data: {
                visitor_name,
                visitor_phone: visitor_phone ?? null,
                visitor_company: visitor_company ?? null,
                visitor_category: visitor_category || visitor_information || null,
            }
        })

        return response(201, { visitor: created }, 'Create Visitor Success', res)
    } catch (error) {
        return next(error)
    }
}

const updateVisitorPut = async (req, res, next) => {
    const visitorId = Number(req.params.visitorId);
    const { visitor_name, visitor_phone, visitor_category, visitor_company } = req.body;

    try {
        const existing = await prisma.visitor.findUnique({
            where: { visitor_id: visitorId }
        });

        if (!existing) {
            return response(404, null, 'Visitor Not Found', res);
        }

        const data = {};
        if (visitor_name !== undefined) data.visitor_name = visitor_name;
        if (visitor_phone !== undefined) data.visitor_phone = visitor_phone;
        if (visitor_category !== undefined) data.visitor_category = visitor_category;
        if (visitor_company !== undefined) data.visitor_company = visitor_company;

        const updated = await prisma.visitor.update({
            where: { visitor_id: visitorId },
            data
        });

        const result = {
            visitor_id: updated.visitor_id,
            visitor_name: updated.visitor_name,
            visitor_phone: updated.visitor_phone,
            visitor_category: updated.visitor_category,
            visitor_company: updated.visitor_company
        };

        return response(200, { visitorUpdated: result }, 'Update Visitor Success', res);
    } catch (error) {
        return next(error);
    }
};

const deleteVisitor = async (req, res, next) => {
    const visitorId = Number(req.params.visitorId);

    try {
        const existing = await prisma.visitor.findUnique({
            where: { visitor_id: visitorId },
            select: { visitor_id: true }
        });

        if (!existing) {
            return response(404, null, 'Visitor Not Found', res);
        }

        await prisma.visitor.delete({
            where: { visitor_id: visitorId }
        });

        return response(200, { visitorId }, 'Delete Visitor Success', res);
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getAllVisitor,
    getVisitorDetail,
    createNewVisitor,
    updateVisitorPut,
    deleteVisitor,
}
