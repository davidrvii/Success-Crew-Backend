const prisma = require('../utils/prisma')
const response = require('../../response')

const getAllUnitServiced = async (req, res, next) => {
    try {
        const units = await prisma.unit_serviced.findMany({
            orderBy: { created_at: 'desc' },
            select: {
                unit_serviced_name: true,
                unit_serviced_issue: true,
                unit_serviced_action: true,
                unit_serviced_status: true,
                unit_serviced_desc: true
            }
        });
        return response(200, { units }, 'Get All Unit Serviced Success', res);
    } catch (error) {
        return next(error);
    }
};

const createUnitServiced = async (req, res, next) => {
    const { visit_id, unit_serviced_name, unit_serviced_issue, unit_serviced_action, unit_serviced_status, unit_serviced_desc, unit_serviced_id_desc } = req.body;
    try {
        if (!visit_id || !unit_serviced_name) {
            return response(400, null, 'Missing Required Fields', res);
        }

        const visit = await prisma.visit.findUnique({
            where: { visit_id: Number(visit_id) }
        });

        if (!visit) {
            return response(404, null, 'Visit Not Found', res);
        }

        const desc = unit_serviced_desc || unit_serviced_id_desc;

        const created = await prisma.unit_serviced.create({
            data: {
                visit_id: Number(visit_id),
                unit_serviced_name,
                unit_serviced_issue: unit_serviced_issue || null,
                unit_serviced_action: unit_serviced_action || null,
                unit_serviced_status: unit_serviced_status || null,
                unit_serviced_desc: desc || null
            }
        });

        const result = {
            visit_id: created.visit_id,
            unit_serviced_name: created.unit_serviced_name,
            unit_serviced_issue: created.unit_serviced_issue,
            unit_serviced_action: created.unit_serviced_action,
            unit_serviced_status: created.unit_serviced_status,
            unit_serviced_id_desc: created.unit_serviced_desc,
            unit_serviced_desc: created.unit_serviced_desc
        };

        return response(201, { unitServicedCreated: result }, 'Create Unit Serviced Success', res);
    } catch (error) {
        return next(error);
    }
};

const updateUnitServicedPut = async (req, res, next) => {
    const unitServicedId = Number(req.params.unitServicedId);
    const { unit_serviced_name, unit_serviced_issue, unit_serviced_action, unit_serviced_status, unit_serviced_desc, unit_serviced_id_desc } = req.body;

    try {
        const existing = await prisma.unit_serviced.findUnique({
            where: { unit_serviced_id: unitServicedId }
        });

        if (!existing) {
            return response(404, null, 'Unit Serviced Not Found', res);
        }

        const desc = unit_serviced_desc !== undefined ? unit_serviced_desc : unit_serviced_id_desc;

        const data = {};
        if (unit_serviced_name !== undefined) data.unit_serviced_name = unit_serviced_name;
        if (unit_serviced_issue !== undefined) data.unit_serviced_issue = unit_serviced_issue;
        if (unit_serviced_action !== undefined) data.unit_serviced_action = unit_serviced_action;
        if (unit_serviced_status !== undefined) data.unit_serviced_status = unit_serviced_status;
        if (desc !== undefined) data.unit_serviced_desc = desc;

        const updated = await prisma.unit_serviced.update({
            where: { unit_serviced_id: unitServicedId },
            data
        });

        const result = {
            unit_serviced_name: updated.unit_serviced_name,
            unit_serviced_issue: updated.unit_serviced_issue,
            unit_serviced_action: updated.unit_serviced_action,
            unit_serviced_status: updated.unit_serviced_status,
            unit_serviced_id_desc: updated.unit_serviced_desc,
            unit_serviced_desc: updated.unit_serviced_desc
        };

        return response(200, { unitServicedUpdated: result }, 'Update Unit Serviced Success', res);
    } catch (error) {
        return next(error);
    }
};

const deleteUnitServiced = async (req, res, next) => {
    const unitServicedId = Number(req.params.unitServicedId);

    try {
        const existing = await prisma.unit_serviced.findUnique({
            where: { unit_serviced_id: unitServicedId }
        });

        if (!existing) {
            return response(404, null, 'Unit Serviced Not Found', res);
        }

        await prisma.unit_serviced.delete({
            where: { unit_serviced_id: unitServicedId }
        });

        return response(200, { unitServicedId }, 'Delete Unit Serviced Success', res);
    } catch (error) {
        return next(error);
    }
};

const getVisitUnitsServiced = async (req, res, next) => {
    const visitId = Number(req.params.visitId)

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
    const visitId = Number(req.params.visitId)
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
    const visitId = Number(req.params.visitId)
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
    const visitId = Number(req.params.visitId)
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
    getAllUnitServiced,
    createUnitServiced,
    updateUnitServicedPut,
    deleteUnitServiced,
    getVisitUnitsServiced,
    createVisitUnitServiced,
    updateVisitUnitServiced,
    deleteVisitUnitServiced
};
