const prisma = require('../utils/prisma')
const response = require('../../response')

/* ============================
 * VISIT
 * ============================ */

const getAllVisit = async (req, res, next) => {
    try {
        const visits = await prisma.visit.findMany({
            orderBy: { created_at: 'desc' },
            include: {
                follow_up: true,
                product_sold: true,
                unit_serviced: true,
            },
        })

        return response(
            200,
            { visits },
            'Get All Visit Success',
            res
        )
    } catch (error) {
        return next(error)
    }
}

const getVisitDetail = async (req, res, next) => {
    const id = Number(req.params.id)

    try {
        const visit = await prisma.visit.findUnique({
            where: { visit_id: id },
            include: {
                follow_up: true,
                product_sold: true,
                unit_serviced: true,
            },
        })

        if (!visit) {
            return response(404, null, 'Visit Not Found', res)
        }

        return response(
            200,
            { visit },
            'Get Visit Detail Success',
            res
        )
    } catch (error) {
        return next(error)
    }
}

const createNewVisit = async (req, res, next) => {
    const { visitor_interest, visitor_status } = req.body

    try {
        const userId = Number(req.userData?.user_id);
        if (!userId) {
            return response(401, null, "Unauthorized", res);
        }

        if (!visitor_interest || !visitor_status) {
            return response(400, null, 'Missing Required Field', res)
        }

        const created = await prisma.visit.create({
            data: {
                user_id: userId,
                visitor_interest,
                visitor_status,
            },
        })

        return response(
            201,
            { visit: created },
            'Create Visit Success',
            res
        )
    } catch (error) {
        return next(error)
    }
}

const updateVisit = async (req, res, next) => {
    const id = Number(req.params.id)
    const { visitor_id, user_id, visitor_interest, visitor_status } = req.body

    try {
        const existing = await prisma.visit.findUnique({
            where: { visit_id: id },
        })

        if (!existing) {
            return response(404, null, 'Visit Not Found', res)
        }

        const data = {}
        if (visitor_id) data.visitor_id = Number(visitor_id)
        if (user_id) data.user_id = Number(user_id)
        if (visitor_interest) data.visitor_interest = visitor_interest
        if (visitor_status) data.visitor_status = visitor_status

        const updated = await prisma.visit.update({
            where: { visit_id: id },
            data,
        })

        return response(
            200,
            { visit: updated },
            'Update Visit Success',
            res
        )
    } catch (error) {
        return next(error)
    }
}

const deleteVisit = async (req, res, next) => {
    const id = Number(req.params.id)

    try {
        const existing = await prisma.visit.findUnique({
            where: { visit_id: id },
            select: { visit_id: true },
        })

        if (!existing) {
            return response(404, null, 'Visit Not Found', res)
        }

        await prisma.$transaction([
            prisma.follow_up.deleteMany({ where: { visit_id: id } }),
            prisma.product_sold.deleteMany({ where: { visit_id: id } }),
            prisma.unit_serviced.deleteMany({ where: { visit_id: id } }),
            prisma.visit.delete({ where: { visit_id: id } }),
        ])

        return response(
            200,
            { visitId: id },
            'Delete Visit Success',
            res
        )
    } catch (error) {
        return next(error)
    }
}

/* ============================
 * FOLLOW UP
 * ============================ */
const getVisitFollowUp = async (req, res, next) => {
    const visitId = Number(req.params.id)

    try {
        const followUps = await prisma.follow_up.findMany({
            where: { visit_id: visitId },
            orderBy: { created_at: 'asc' },
        })

        return response(
            200,
            { followUps },
            'Get Visit Follow Up Success',
            res
        )
    } catch (error) {
        return next(error)
    }
}

const createVisitFollowUp = async (req, res, next) => {
    const visitId = Number(req.params.id)
    const { follow_up_status, follow_up_action } = req.body

    try {
        if (!follow_up_status || !follow_up_action) {
            return response(400, null, 'Missing Required Field', res)
        }

        const existingVisit = await prisma.visit.findUnique({
            where: { visit_id: visitId },
            select: { visit_id: true },
        })

        if (!existingVisit) {
            return response(404, null, 'Visit Not Found', res)
        }

        const created = await prisma.follow_up.create({
            data: {
                visit_id: visitId,
                follow_up_status,
                follow_up_action,
            },
        })

        return response(
            201,
            { followUp: created },
            'Create Follow Up Success',
            res
        )
    } catch (error) {
        return next(error)
    }
}

const updateVisitFollowUp = async (req, res, next) => {
    const visitId = Number(req.params.id)
    const followUpId = Number(req.params.followUpId)
    const { follow_up_status, follow_up_action } = req.body

    try {
        const existing = await prisma.follow_up.findFirst({
            where: { follow_up_id: followUpId, visit_id: visitId },
        })

        if (!existing) {
            return response(404, null, 'Follow Up Not Found', res)
        }

        const data = {}
        if (follow_up_status) data.follow_up_status = follow_up_status
        if (follow_up_action) data.follow_up_action = follow_up_action

        const updated = await prisma.follow_up.update({
            where: { follow_up_id: followUpId },
            data,
        })

        return response(
            200,
            { followUp: updated },
            'Update Follow Up Success',
            res
        )
    } catch (error) {
        return next(error)
    }
}

const deleteVisitFollowUp = async (req, res, next) => {
    const { followUpId } = req.params;

    try {
        await prisma.follow_up.delete({
        where: { follow_up_id: Number(followUpId) },
    });

    return response(200, {}, "Follow up deleted", res);

    } catch (error) {
        return next(error)
    }
};


/* ============================
 * PRODUCT SOLD
 * ============================ */
const getVisitProductsSold = async (req, res, next) => {
    const visitId = Number(req.params.id)

    try {
        const products = await prisma.product_sold.findMany({
            where: { visit_id: visitId },
            orderBy: { created_at: 'asc' },
        })

        return response(
            200,
            { products },
            'Get Visit Products Sold Success',
            res
        )
    } catch (error) {
        return next(error)
    }
}

const createVisitProductSold = async (req, res, next) => {
    const visitId = Number(req.params.id)
    const { product_sold_type, product_sold_category } = req.body

    try {
        if (!product_sold_type || !product_sold_category) {
            return response(400, null, 'Missing Required Field', res)
        }

        const existingVisit = await prisma.visit.findUnique({
            where: { visit_id: visitId },
            select: { visit_id: true },
        })

        if (!existingVisit) {
            return response(404, null, 'Visit Not Found', res)
        }

        const created = await prisma.product_sold.create({
            data: {
                visit_id: visitId,
                product_sold_type,
                product_sold_category,
            },
        })

        return response(
            201,
            { productSold: created },
            'Create Product Sold Success',
            res
        )
    } catch (error) {
        return next(error)
    }
}

const updateVisitProductSold = async (req, res, next) => {
    const visitId = Number(req.params.id)
    const productSoldId = Number(req.params.productSoldId)
    const { product_sold_type, product_sold_category } = req.body

    try {
        const existing = await prisma.product_sold.findFirst({
            where: { product_sold_id: productSoldId, visit_id: visitId },
        })

        if (!existing) {
            return response(404, null, 'Product Sold Not Found', res)
        }

        const data = {}
        if (product_sold_type) data.product_sold_type = product_sold_type
        if (product_sold_category) data.product_sold_category = product_sold_category

        const updated = await prisma.product_sold.update({
            where: { product_sold_id: productSoldId },
            data,
        })

        return response(
            200,
            { productSold: updated },
            'Update Product Sold Success',
            res
        )
    } catch (error) {
        return next(error)
    }
}

const deleteVisitProductSold = async (req, res, next) => {
    const visitId = Number(req.params.id)
    const productSoldId = Number(req.params.productSoldId)

    try {
        const existing = await prisma.product_sold.findFirst({
            where: { product_sold_id: productSoldId, visit_id: visitId },
            select: { product_sold_id: true },
        })

        if (!existing) {
            return response(404, null, 'Product Sold Not Found', res)
        }

        await prisma.product_sold.delete({
            where: { product_sold_id: productSoldId },
        })

        return response(
            200,
            { productSoldId },
            'Delete Product Sold Success',
            res
        )
    } catch (error) {
        return next(error)
    }
}

/* ============================
 * UNIT SERVICED
 * ============================ */

const getVisitUnitsServiced = async (req, res, next) => {
    const visitId = Number(req.params.id)

    try {
        const units = await prisma.unit_serviced.findMany({
            where: { visit_id: visitId },
            orderBy: { created_at: 'asc' },
        })

        return response(
            200,
            { units },
            'Get Visit Units Serviced Success',
            res
        )
    } catch (error) {
        return next(error)
    }
}

const createVisitUnitServiced = async (req, res, next) => {
    const visitId = Number(req.params.id)
    const { unit_serviced_type, unit_serviced_category } = req.body

    try {
        if (!unit_serviced_type || !unit_serviced_category) {
            return response(400, null, 'Missing Required Field', res)
        }

        const existingVisit = await prisma.visit.findUnique({
            where: { visit_id: visitId },
            select: { visit_id: true },
        })

        if (!existingVisit) {
            return response(404, null, 'Visit Not Found', res)
        }

        const created = await prisma.unit_serviced.create({
            data: {
                visit_id: visitId,
                unit_serviced_type,
                unit_serviced_category,
            },
        })

        return response(
            201,
            { unitServiced: created },
            'Create Unit Serviced Success',
            res
        )
    } catch (error) {
        return next(error)
    }
}

const updateVisitUnitServiced = async (req, res, next) => {
    const visitId = Number(req.params.id)
    const unitServicedId = Number(req.params.unitServicedId)
    const { unit_serviced_type, unit_serviced_category } = req.body

    try {
        const existing = await prisma.unit_serviced.findFirst({
            where: { unit_serviced_id: unitServicedId, visit_id: visitId },
        })

        if (!existing) {
            return response(404, null, 'Unit Serviced Not Found', res)
        }

        const data = {}
        if (unit_serviced_type) data.unit_serviced_type = unit_serviced_type
        if (unit_serviced_category) data.unit_serviced_category = unit_serviced_category

        const updated = await prisma.unit_serviced.update({
            where: { unit_serviced_id: unitServicedId },
            data,
        })

        return response(
            200,
            { unitServiced: updated },
            'Update Unit Serviced Success',
            res
        )
    } catch (error) {
        return next(error)
    }
}

const deleteVisitUnitServiced = async (req, res, next) => {
    const visitId = Number(req.params.id)
    const unitServicedId = Number(req.params.unitServicedId)

    try {
        const existing = await prisma.unit_serviced.findFirst({
            where: { unit_serviced_id: unitServicedId, visit_id: visitId },
            select: { unit_serviced_id: true },
        })

        if (!existing) {
            return response(404, null, 'Unit Serviced Not Found', res)
        }

        await prisma.unit_serviced.delete({
            where: { unit_serviced_id: unitServicedId },
        })

        return response(
            200,
            { unitServicedId },
            'Delete Unit Serviced Success',
            res
        )
    } catch (error) {
        return next(error)
    }
}

module.exports = {

    getAllVisit,
    getVisitDetail,
    createNewVisit,
    updateVisit,
    deleteVisit,

    getVisitFollowUp,
    createVisitFollowUp,
    updateVisitFollowUp,
    deleteVisitFollowUp,

    getVisitProductsSold,
    createVisitProductSold,
    updateVisitProductSold,
    deleteVisitProductSold,

    getVisitUnitsServiced,
    createVisitUnitServiced,
    updateVisitUnitServiced,
    deleteVisitUnitServiced,
}
