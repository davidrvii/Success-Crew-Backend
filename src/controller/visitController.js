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
            visitor_category: v.visitor?.visitor_category ?? null,
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
            visit_sales: v.visit_sales,
            created_at: v.created_at
        }));

        return response(200, { visitList: result }, 'Get Visit List Success', res);
    } catch (error) {
        return next(error);
    }
}

const getVisitStats = async (req, res, next) => {
    try {
        const { range } = req.query;
        let startDate;
        let endDate;

        if (range === 'this_week') {
            const today = new Date();
            const currentDay = today.getDay();
            const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;

            startDate = new Date(today);
            startDate.setDate(today.getDate() + distanceToMonday);
            startDate.setHours(0, 0, 0, 0);

            endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 5); // Saturday
            endDate.setHours(23, 59, 59, 999);
        } else {
            startDate = new Date();
            startDate.setDate(startDate.getDate() - 6);
            startDate.setHours(0, 0, 0, 0);
        }

        const visits = await prisma.visit.findMany({
            where: {
                created_at: {
                    gte: startDate,
                    ...(endDate ? { lte: endDate } : {})
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

        const productSolds = await prisma.product_sold.findMany({
            where: {
                created_at: {
                    gte: startDate,
                    ...(endDate ? { lte: endDate } : {})
                }
            },
            select: {
                product_sold_quantity: true,
                created_at: true
            }
        });

        const unitServiceds = await prisma.unit_serviced.findMany({
            where: {
                created_at: {
                    gte: startDate,
                    ...(endDate ? { lte: endDate } : {})
                }
            },
            select: {
                created_at: true
            }
        });

        const totalUnitService = unitServiceds.length;
        const totalProductSold = productSolds.reduce((sum, p) => sum + (p.product_sold_quantity || 0), 0);

        const dailyCount = {
            total_visit: visitsToday.length,
            call_in: visitsToday.filter(v => getNormalizedType(v.visit_type) === 'call in').length,
            chat_in: visitsToday.filter(v => getNormalizedType(v.visit_type) === 'chat in').length,
            walk_in: visitsToday.filter(v => getNormalizedType(v.visit_type) === 'walk in').length,
            unit_serviced: totalUnitService,
            product_sold: totalProductSold
        };

        const weeklyCount = [];
        const productSoldWeekly = [];
        const unitServiceWeekly = [];

        if (range === 'this_week') {
            for (let i = 0; i <= 5; i++) {
                const d = new Date(startDate);
                d.setDate(startDate.getDate() + i);
                if (d.getDay() === 0) continue;
                const dateStr = d.toLocaleDateString('en-CA');
                const count = visits.filter(v => new Date(v.created_at).toLocaleDateString('en-CA') === dateStr).length;

                weeklyCount.push({
                    date: dateStr,
                    total_visit: count
                });

                const productSoldToday = productSolds.filter(p => new Date(p.created_at).toLocaleDateString('en-CA') === dateStr);
                const totalProductSoldToday = productSoldToday.reduce((sum, p) => sum + (p.product_sold_quantity || 0), 0);

                const unitServicedToday = unitServiceds.filter(u => new Date(u.created_at).toLocaleDateString('en-CA') === dateStr).length;

                productSoldWeekly.push({
                    date: dateStr,
                    totalProductSold: totalProductSoldToday
                });

                unitServiceWeekly.push({
                    date: dateStr,
                    totalUnitService: unitServicedToday
                });
            }
        } else {
            for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                if (d.getDay() === 0) continue;
                const dateStr = d.toLocaleDateString('en-CA');
                const count = visits.filter(v => new Date(v.created_at).toLocaleDateString('en-CA') === dateStr).length;

                weeklyCount.push({
                    date: dateStr,
                    total_visit: count
                });

                const productSoldToday = productSolds.filter(p => new Date(p.created_at).toLocaleDateString('en-CA') === dateStr);
                const totalProductSoldToday = productSoldToday.reduce((sum, p) => sum + (p.product_sold_quantity || 0), 0);

                const unitServicedToday = unitServiceds.filter(u => new Date(u.created_at).toLocaleDateString('en-CA') === dateStr).length;

                productSoldWeekly.push({
                    date: dateStr,
                    totalProductSold: totalProductSoldToday
                });

                unitServiceWeekly.push({
                    date: dateStr,
                    totalUnitService: unitServicedToday
                });
            }
        }

        const hourlyCounts = {};
        for (let h = 9; h <= 16; h++) {
            hourlyCounts[h] = 0;
        }

        visits.forEach(v => {
            const hour = new Date(v.created_at).getHours();
            if (hour >= 9 && hour <= 16) {
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
            productSoldWeekly,
            unitServiceWeekly,
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
            visit_sales: visit.visit_sales || null,
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
module.exports = {
    getAllVisit,
    getVisitList,
    getVisitStats,
    getVisitDetail,
    createNewVisit,
    updateVisitPut,
    deleteVisit,
}
