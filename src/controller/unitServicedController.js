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

module.exports = {
    getAllUnitServiced,
    createUnitServiced,
    updateUnitServicedPut,
    deleteUnitServiced
};
