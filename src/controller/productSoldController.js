const prisma = require('../utils/prisma')
const response = require('../../response')

const getAllProductSold = async (req, res, next) => {
    try {
        const products = await prisma.product_sold.findMany({
            orderBy: { created_at: 'desc' },
            select: {
                product_sold_name: true,
                product_sold_quantity: true,
                product_sold_total: true,
                product_sold_desc: true
            }
        });
        return response(200, { products }, 'Get All Product Sold Success', res);
    } catch (error) {
        return next(error);
    }
};

const createProductSold = async (req, res, next) => {
    const { visit_id, product_sold_name, product_sold_quantity, product_sold_total, product_sold_desc } = req.body;
    try {
        if (!visit_id || !product_sold_name) {
            return response(400, null, 'Missing Required Fields', res);
        }

        const visit = await prisma.visit.findUnique({
            where: { visit_id: Number(visit_id) }
        });

        if (!visit) {
            return response(404, null, 'Visit Not Found', res);
        }

        const created = await prisma.product_sold.create({
            data: {
                visit_id: Number(visit_id),
                product_sold_name,
                product_sold_quantity: product_sold_quantity ? Number(product_sold_quantity) : null,
                product_sold_total: product_sold_total ? Number(product_sold_total) : null,
                product_sold_desc: product_sold_desc || null
            }
        });

        const result = {
            visit_id: created.visit_id,
            product_sold_name: created.product_sold_name,
            product_sold_quantity: created.product_sold_quantity,
            product_sold_total: created.product_sold_total,
            product_sold_desc: created.product_sold_desc
        };

        return response(201, { productSoldCreated: result }, 'Create Product Sold Success', res);
    } catch (error) {
        return next(error);
    }
};

const updateProductSoldPut = async (req, res, next) => {
    const productSoldId = Number(req.params.productSoldId);
    const { product_sold_name, product_sold_quantity, product_sold_total, product_sold_desc } = req.body;

    try {
        const existing = await prisma.product_sold.findUnique({
            where: { product_sold_id: productSoldId }
        });

        if (!existing) {
            return response(404, null, 'Product Sold Not Found', res);
        }

        const data = {};
        if (product_sold_name !== undefined) data.product_sold_name = product_sold_name;
        if (product_sold_quantity !== undefined) data.product_sold_quantity = product_sold_quantity ? Number(product_sold_quantity) : null;
        if (product_sold_total !== undefined) data.product_sold_total = product_sold_total ? Number(product_sold_total) : null;
        if (product_sold_desc !== undefined) data.product_sold_desc = product_sold_desc;

        const updated = await prisma.product_sold.update({
            where: { product_sold_id: productSoldId },
            data
        });

        const result = {
            product_sold_name: updated.product_sold_name,
            product_sold_quantity: updated.product_sold_quantity,
            product_sold_total: updated.product_sold_total,
            product_sold_desc: updated.product_sold_desc
        };

        return response(200, { productSoldUpdated: result }, 'Update Product Sold Success', res);
    } catch (error) {
        return next(error);
    }
};

const deleteProductSold = async (req, res, next) => {
    const productSoldId = Number(req.params.productSoldId);

    try {
        const existing = await prisma.product_sold.findUnique({
            where: { product_sold_id: productSoldId }
        });

        if (!existing) {
            return response(404, null, 'Product Sold Not Found', res);
        }

        await prisma.product_sold.delete({
            where: { product_sold_id: productSoldId }
        });

        return response(200, { productSoldId }, 'Delete Product Sold Success', res);
    } catch (error) {
        return next(error);
    }
};

const getVisitProductsSold = async (req, res, next) => {
    const visitId = Number(req.params.visitId)

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
    const visitId = Number(req.params.visitId)
    const {
        product_sold_name, product_name, product_sold_type,
        product_sold_quantity, quantity, qty,
        product_sold_total, product_sold_price, price,
        product_sold_desc, notes, product_sold_category
    } = req.body

    try {
        const final_name = product_sold_name || product_name || product_sold_type
        const final_quantity = product_sold_quantity || quantity || qty
        const final_total = product_sold_total || product_sold_price || price
        const final_desc = product_sold_desc || notes || product_sold_category

        if (!final_name) {
            return response(400, null, 'Missing Required Field (product_sold_name)', res)
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
                product_sold_name: final_name,
                product_sold_quantity: final_quantity ? Number(final_quantity) : null,
                product_sold_total: final_total ? Number(final_total) : null,
                product_sold_desc: final_desc ?? null,
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
    const visitId = Number(req.params.visitId)
    const productSoldId = Number(req.params.productSoldId)
    const {
        product_sold_name, product_name, product_sold_type,
        product_sold_quantity, quantity, qty,
        product_sold_total, product_sold_price, price,
        product_sold_desc, notes, product_sold_category
    } = req.body

    try {
        const existing = await prisma.product_sold.findFirst({
            where: { product_sold_id: productSoldId, visit_id: visitId },
        })

        if (!existing) {
            return response(404, null, 'Product Sold Not Found', res)
        }

        const data = {}
        const final_name = product_sold_name || product_name || product_sold_type
        const final_quantity = product_sold_quantity || quantity || qty
        const final_total = product_sold_total || product_sold_price || price
        const final_desc = product_sold_desc || notes || product_sold_category

        if (final_name !== undefined) data.product_sold_name = final_name
        if (final_quantity !== undefined) data.product_sold_quantity = final_quantity !== null ? Number(final_quantity) : null
        if (final_total !== undefined) data.product_sold_total = final_total !== null ? Number(final_total) : null
        if (final_desc !== undefined) data.product_sold_desc = final_desc

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
    const visitId = Number(req.params.visitId)
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

module.exports = {
    getAllProductSold,
    createProductSold,
    updateProductSoldPut,
    deleteProductSold,
    getVisitProductsSold,
    createVisitProductSold,
    updateVisitProductSold,
    deleteVisitProductSold
};
