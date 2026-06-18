const prisma = require('../utils/prisma')
const response = require('../../response')

const getAllFollowUp = async (req, res, next) => {
    try {
        const followUps = await prisma.follow_up.findMany({
            orderBy: { created_at: 'desc' },
            select: {
                follow_up_status: true,
                follow_up_action: true
            }
        });
        return response(200, { followUps }, 'Get All Follow Up Success', res);
    } catch (error) {
        return next(error);
    }
};

const createFollowUp = async (req, res, next) => {
    const { visit_id, follow_up_status, follow_up_action } = req.body;
    try {
        if (!visit_id || !follow_up_status || !follow_up_action) {
            return response(400, null, 'Missing Required Fields', res);
        }

        const visit = await prisma.visit.findUnique({
            where: { visit_id: Number(visit_id) }
        });

        if (!visit) {
            return response(404, null, 'Visit Not Found', res);
        }

        const created = await prisma.follow_up.create({
            data: {
                visit_id: Number(visit_id),
                follow_up_status,
                follow_up_action
            }
        });

        await prisma.visit.update({
            where: { visit_id: Number(visit_id) },
            data: { visitor_status: follow_up_status }
        });

        const result = {
            visit_id: created.visit_id,
            follow_up_status: created.follow_up_status,
            follow_up_action: created.follow_up_action
        };

        return response(201, { followUpCreated: result }, 'Create Follow Up Success', res);
    } catch (error) {
        return next(error);
    }
};

const updateFollowUpPut = async (req, res, next) => {
    const followUpId = Number(req.params.followUpId);
    const { follow_up_status, follow_up_action } = req.body;

    try {
        const existing = await prisma.follow_up.findUnique({
            where: { follow_up_id: followUpId }
        });

        if (!existing) {
            return response(404, null, 'Follow Up Not Found', res);
        }

        const data = {};
        if (follow_up_status !== undefined) data.follow_up_status = follow_up_status;
        if (follow_up_action !== undefined) data.follow_up_action = follow_up_action;

        const updated = await prisma.follow_up.update({
            where: { follow_up_id: followUpId },
            data
        });

        if (follow_up_status) {
            const lastFollowUp = await prisma.follow_up.findFirst({
                where: { visit_id: existing.visit_id },
                orderBy: { follow_up_id: 'desc' }
            });
            if (lastFollowUp && lastFollowUp.follow_up_id === followUpId) {
                await prisma.visit.update({
                    where: { visit_id: existing.visit_id },
                    data: { visitor_status: follow_up_status }
                });
            }
        }

        const result = {
            follow_up_status: updated.follow_up_status,
            follow_up_action: updated.follow_up_action
        };

        return response(200, { followUpUpdated: result }, 'Update Follow Up Success', res);
    } catch (error) {
        return next(error);
    }
};

const deleteFollowUp = async (req, res, next) => {
    const followUpId = Number(req.params.followUpId);

    try {
        const existing = await prisma.follow_up.findUnique({
            where: { follow_up_id: followUpId }
        });

        if (!existing) {
            return response(404, null, 'Follow Up Not Found', res);
        }

        const deleted = await prisma.follow_up.delete({
            where: { follow_up_id: followUpId }
        });

        const lastFollowUp = await prisma.follow_up.findFirst({
            where: { visit_id: deleted.visit_id },
            orderBy: { follow_up_id: 'desc' }
        });

        if (lastFollowUp) {
            await prisma.visit.update({
                where: { visit_id: deleted.visit_id },
                data: { visitor_status: lastFollowUp.follow_up_status }
            });
        }

        return response(200, { followUpId }, 'Delete Follow Up Success', res);
    } catch (error) {
        return next(error);
    }
};

const getVisitFollowUp = async (req, res, next) => {
    const visitId = Number(req.params.visitId)

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
    const visitId = Number(req.params.visitId)
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
    const visitId = Number(req.params.visitId)
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

module.exports = {
    getAllFollowUp,
    createFollowUp,
    updateFollowUpPut,
    deleteFollowUp,
    getVisitFollowUp,
    createVisitFollowUp,
    updateVisitFollowUp,
    deleteVisitFollowUp
};
