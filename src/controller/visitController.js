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
                visitor: true,
            },
        })

        const result = visits.map(v => ({
            visitor_name: v.visitor?.visitor_name ?? null,
            visitor_phone: v.visitor?.visitor_phone ?? null,
            visitory_category: v.visitor?.visitor_category ?? null,
            visitor_company: v.visitor?.visitor_company ?? null,
            visit_type: v.visit_type,
            created_at: v.created_at,
            interest: v.visitor_interest,
            visit_status: v.visit_status,
            visit_desc: v.visit_desc,
            visit_sales: v.visit_sales,
            user_id: v.user_id
        }));

        return response(200, { visits: result }, 'Get All Visit Success', res)
    } catch (error) {
        return next(error)
    }
}

const getVisitList = async (req, res, next) => {
    try {
        const visits = await prisma.visit.findMany({
            orderBy: { created_at: 'desc' },
            include: {
                visitor: true
            }
        });

        const result = visits.map(v => ({
            visit_id: v.visit_id,
            visitor_name: v.visitor?.visitor_name ?? null,
            visitor_interest: v.visitor_interest,
            visit_type: v.visit_type,
            visitor_category: v.visitor?.visitor_category ?? null,
            visit_status: v.visit_status,
            created_at: v.created_at
        }));

        return response(200, { visitList: result }, 'Get Visit List Success', res);
    } catch (error) {
        return next(error);
    }
}

const getVisitStats = async (req, res, next) => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const visits = await prisma.visit.findMany({
            where: {
                created_at: {
                    gte: sevenDaysAgo
                }
            },
            select: {
                visit_id: true,
                visit_type: true,
                created_at: true
            }
        });

        const todayStr = new Date().toLocaleDateString('en-CA');
        const visitsToday = visits.filter(v => new Date(v.created_at).toLocaleDateString('en-CA') === todayStr);
        const getNormalizedType = (type) => (type || '').toLowerCase().replace(/_/g, ' ').trim();

        const totalUnitService = await prisma.unit_serviced.count({
            where: {
                created_at: {
                    gte: sevenDaysAgo
                }
            }
        });

        const productSoldAggregate = await prisma.product_sold.aggregate({
            where: {
                created_at: {
                    gte: sevenDaysAgo
                }
            },
            _sum: {
                product_sold_quantity: true
            }
        });
        const totalProductSold = productSoldAggregate._sum.product_sold_quantity || 0;

        const dailyCount = {
            total_visit: visitsToday.length,
            call_in: visitsToday.filter(v => getNormalizedType(v.visit_type) === 'call in').length,
            chat_in: visitsToday.filter(v => getNormalizedType(v.visit_type) === 'chat in').length,
            walk_in: visitsToday.filter(v => getNormalizedType(v.visit_type) === 'walk in').length,
            total_unit_service: totalUnitService,
            total_product_sold: totalProductSold
        };

        const weeklyCount = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toLocaleDateString('en-CA');
            const count = visits.filter(v => new Date(v.created_at).toLocaleDateString('en-CA') === dateStr).length;

            weeklyCount.push({
                date: dateStr,
                total_visit: count
            });
        }

        const hourlyCounts = {};
        for (let h = 9; h <= 17; h++) {
            hourlyCounts[h] = 0;
        }

        visits.forEach(v => {
            const hour = new Date(v.created_at).getHours();
            if (hour >= 9 && hour <= 17) {
                if (hourlyCounts[hour] !== undefined) {
                    hourlyCounts[hour]++;
                }
            }
        });

        const rushHour = Object.keys(hourlyCounts).map(h => {
            const hNum = Number(h);
            const hourStr = hNum < 10 ? '0' + hNum : '' + hNum;
            return {
                hour: `${hourStr}:00`,
                total_visit: hourlyCounts[hNum]
            };
        });

        return response(200, {
            dailyCount,
            weeklyCount,
            rushHour
        }, 'Get Visit Stats Success', res);
    } catch (error) {
        return next(error);
    }
}

const getVisitDetail = async (req, res, next) => {
    const visitId = Number(req.params.visitId)

    try {
        const visit = await prisma.visit.findUnique({
            where: { visit_id: visitId },
            include: {
                visitor: true,
                user: {
                    select: {
                        user_name: true
                    }
                },
                follow_up: true,
                product_sold: true,
                unit_serviced: true,
            },
        })

        if (!visit) {
            return response(404, null, 'Visit Not Found', res)
        }

        const formattedVisit = {
            visit_id: visit.visit_id,
            visitor_id: visit.visitor_id,
            visitor_name: visit.visitor?.visitor_name || null,
            visitor_phone: visit.visitor?.visitor_phone || null,
            visitor_category: visit.visitor?.visitor_category || null,
            visitor_company: visit.visitor?.visitor_company || null,
            visit_type: visit.visit_type,
            created_at: visit.created_at,
            visit_interest: visit.visitor_interest,
            visit_status: visit.visit_status,
            visit_desc: visit.visit_desc,
            user_name: visit.user?.user_name || null,
            "Follow UP": (visit.follow_up || []).map(f => ({
                follow_up_id: f.follow_up_id,
                follow_up_status: f.follow_up_status,
                follow_up_action: f.follow_up_action,
                created_at: f.created_at
            })),
            "Product Sold": (visit.product_sold || []).map(p => ({
                product_sold_id: p.product_sold_id,
                product_sold_name: p.product_sold_name,
                product_sold_quantity: p.product_sold_quantity,
                product_sold_total: p.product_sold_total,
                product_sold_desc: p.product_sold_desc,
                created_at: p.created_at
            })),
            "Unit Serviced": (visit.unit_serviced || []).map(u => ({
                unit_serviced_id: u.unit_serviced_id,
                unit_serviced_name: u.unit_serviced_name,
                unit_serviced_issue: u.unit_serviced_issue,
                unit_serviced_action: u.unit_serviced_action,
                unit_serviced_status: u.unit_serviced_status,
                unit_serviced_id_desc: u.unit_serviced_desc,
                unit_serviced_desc: u.unit_serviced_desc,
                created_at: u.created_at
            }))
        };

        return response(200, { visit: formattedVisit }, 'Get Visit Detail Success', res)
    } catch (error) {
        return next(error)
    }
}

const createNewVisit = async (req, res, next) => {
    const {
        visitor_id,
        visitor_name,
        visitor_phone,
        visitor_category,
        visitory_category,
        visitor_company,
        visit_type,
        created_at,
        interest,
        visitor_interest,
        visit_status,
        visit_desc,
        visit_sales,
        user_id
    } = req.body;

    try {
        const userId = user_id ? Number(user_id) : Number(req.userData?.user_id);
        if (!userId) {
            return response(401, null, "Unauthorized", res);
        }

        const final_interest = visitor_interest || interest;
        const final_status = visit_status || "PENDING";
        const final_type = visit_type;

        if (!final_interest || !final_type) {
            return response(400, null, "Missing Required Field (interest/visitor_interest, visit_type)", res);
        }

        let dbVisitor = null;

        if (visitor_id) {
            dbVisitor = await prisma.visitor.findUnique({
                where: { visitor_id: Number(visitor_id) }
            });
        }

        if (!dbVisitor && visitor_name) {
            dbVisitor = await prisma.visitor.findFirst({
                where: {
                    visitor_name: visitor_name,
                    visitor_phone: visitor_phone || null
                }
            });

            if (!dbVisitor) {
                dbVisitor = await prisma.visitor.create({
                    data: {
                        visitor_name,
                        visitor_phone: visitor_phone || null,
                        visitor_company: visitor_company || null,
                        visitor_category: visitor_category || visitory_category || null
                    }
                });
            }
        }

        if (!dbVisitor) {
            dbVisitor = await prisma.visitor.create({
                data: {
                    visitor_name: 'Anonymous',
                    visitor_phone: null,
                    visitor_company: null,
                    visitor_category: null
                }
            });
        }

        const created = await prisma.visit.create({
            data: {
                user_id: userId,
                visitor_id: dbVisitor.visitor_id,
                visitor_interest: final_interest,
                visit_status: final_status,
                visit_type: final_type,
                visit_desc: visit_desc || null,
                visit_sales: visit_sales || null,
                created_at: created_at ? new Date(created_at) : new Date()
            },
        });

        return response(201, { visitCreated: created }, "Create Visit Success", res);
    } catch (error) {
        return next(error);
    }
}

const updateVisitPut = async (req, res, next) => {
    const visitId = Number(req.params.visitId);
    const {
        visitor_name,
        visitor_phone,
        visitor_category,
        visitory_category,
        visitor_company,
        visit_type,
        created_at,
        interest,
        visitor_interest,
        visit_status,
        visit_desc,
        visit_sales,
        user_id
    } = req.body;

    try {
        const existing = await prisma.visit.findUnique({
            where: { visit_id: visitId },
            include: { visitor: true }
        });

        if (!existing) {
            return response(404, null, "Visit Not Found", res);
        }

        if (existing.visitor_id) {
            const visitorData = {};
            if (visitor_name !== undefined) visitorData.visitor_name = visitor_name;
            if (visitor_phone !== undefined) visitorData.visitor_phone = visitor_phone;
            if (visitor_company !== undefined) visitorData.visitor_company = visitor_company;
            const cat = visitor_category !== undefined ? visitor_category : visitory_category;
            if (cat !== undefined) visitorData.visitor_category = cat;

            if (Object.keys(visitorData).length > 0) {
                await prisma.visitor.update({
                    where: { visitor_id: existing.visitor_id },
                    data: visitorData
                });
            }
        }

        const visitData = {};
        if (user_id !== undefined) visitData.user_id = Number(user_id);
        if (visit_type !== undefined) visitData.visit_type = visit_type;
        if (created_at !== undefined) visitData.created_at = created_at ? new Date(created_at) : null;
        const interestVal = visitor_interest !== undefined ? visitor_interest : interest;
        if (interestVal !== undefined) visitData.visitor_interest = interestVal;
        if (visit_status !== undefined) visitData.visit_status = visit_status;
        if (visit_desc !== undefined) visitData.visit_desc = visit_desc;
        if (visit_sales !== undefined) visitData.visit_sales = visit_sales;

        const updated = await prisma.visit.update({
            where: { visit_id: visitId },
            data: visitData
        });

        return response(200, { visitUpdated: updated }, "Update Visit Success", res);
    } catch (error) {
        return next(error);
    }
}

const deleteVisit = async (req, res, next) => {
    const id = Number(req.params.visitId)

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

        await prisma.visit.update({
            where: { visit_id: visitId },
            data: { visitor_status: follow_up_status },
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

        if (follow_up_status) {
            const lastFollowUp = await prisma.follow_up.findFirst({
                where: { visit_id: visitId },
                orderBy: { follow_up_id: 'desc' },
            })
            if (lastFollowUp && lastFollowUp.follow_up_id === followUpId) {
                await prisma.visit.update({
                    where: { visit_id: visitId },
                    data: { visitor_status: follow_up_status },
                })
            }
        }

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
        const deleted = await prisma.follow_up.delete({
            where: { follow_up_id: Number(followUpId) },
        });

        const lastFollowUp = await prisma.follow_up.findFirst({
            where: { visit_id: deleted.visit_id },
            orderBy: { follow_up_id: 'desc' },
        });

        if (lastFollowUp) {
            await prisma.visit.update({
                where: { visit_id: deleted.visit_id },
                data: { visitor_status: lastFollowUp.follow_up_status },
            });
        }

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
    const visitId = Number(req.params.id)
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
    const {
        unit_serviced_name, unit_name, unit_serviced_type,
        unit_serviced_issue, issue, problem,
        unit_serviced_action, action, solution,
        unit_serviced_status, status,
        unit_serviced_desc, notes, unit_serviced_category
    } = req.body

    try {
        const final_name = unit_serviced_name || unit_name || unit_serviced_type
        const final_issue = unit_serviced_issue || issue || problem
        const final_action = unit_serviced_action || action || solution
        const final_status = unit_serviced_status || status
        const final_desc = unit_serviced_desc || notes || unit_serviced_category

        if (!final_name) {
            return response(400, null, 'Missing Required Field (unit_serviced_name)', res)
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
                unit_serviced_name: final_name,
                unit_serviced_issue: final_issue ?? null,
                unit_serviced_action: final_action ?? null,
                unit_serviced_status: final_status ?? null,
                unit_serviced_desc: final_desc ?? null,
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
    const {
        unit_serviced_name, unit_name, unit_serviced_type,
        unit_serviced_issue, issue, problem,
        unit_serviced_action, action, solution,
        unit_serviced_status, status,
        unit_serviced_desc, notes, unit_serviced_category
    } = req.body

    try {
        const existing = await prisma.unit_serviced.findFirst({
            where: { unit_serviced_id: unitServicedId, visit_id: visitId },
        })

        if (!existing) {
            return response(404, null, 'Unit Serviced Not Found', res)
        }

        const data = {}
        const final_name = unit_serviced_name || unit_name || unit_serviced_type
        const final_issue = unit_serviced_issue || issue || problem
        const final_action = unit_serviced_action || action || solution
        const final_status = unit_serviced_status || status
        const final_desc = unit_serviced_desc || notes || unit_serviced_category

        if (final_name !== undefined) data.unit_serviced_name = final_name
        if (final_issue !== undefined) data.unit_serviced_issue = final_issue
        if (final_action !== undefined) data.unit_serviced_action = final_action
        if (final_status !== undefined) data.unit_serviced_status = final_status
        if (final_desc !== undefined) data.unit_serviced_desc = final_desc

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
    getVisitList,
    getVisitStats,
    getVisitDetail,
    createNewVisit,
    updateVisitPut,
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
