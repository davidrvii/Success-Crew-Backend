const prisma = require('../utils/prisma')
const response = require('../../response')

const getDatesInRange = (startDate, endDate) => {
    const dates = [];
    let currentDate = new Date(startDate);
    const lastDate = new Date(endDate);
    
    currentDate.setHours(0,0,0,0);
    lastDate.setHours(0,0,0,0);

    while (currentDate <= lastDate) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
};

const getAllOutOfOffice = async (req, res, next) => {
    try {
        const outOfOffices = await prisma.out_of_office.findMany({
            orderBy: { out_of_office_start: 'desc' },
            include: {
                user: { select: { user_name: true } }
            }
        })

        const result = outOfOffices.map(o => ({
            outofoffice_id: o.out_of_office_id,
            outofoffice_desc: o.out_of_office_desc,
            outofoffice_start: o.out_of_office_start,
            outofoffice_end: o.out_of_office_end,
            outofoffice_status: o.out_of_office_status,
            out_of_office_id: o.out_of_office_id,
            out_of_office_desc: o.out_of_office_desc,
            out_of_office_start: o.out_of_office_start,
            out_of_office_end: o.out_of_office_end,
            out_of_office_status: o.out_of_office_status,
            Crew: o.user?.user_name || null
        }));

        return response(200, { outOfOffices: result }, 'Get All Out Of Office Success', res)
    } catch (error) {
        return next(error)
    }
}

const getOutOfOfficeBasicAll = async (req, res, next) => {
    try {
        const outOfOffices = await prisma.out_of_office.findMany({
            select: {
                out_of_office_id: true,
                out_of_office_status: true,
                user: { select: { user_name: true } }
            }
        });

        const unapprovedCount = outOfOffices.filter(o => {
            const status = (o.out_of_office_status || '').toLowerCase();
            return status !== 'approved' && status !== 'diterima';
        }).length;

        const result = outOfOffices.map(o => ({
            outofoffice_id: o.out_of_office_id,
            outofoffice_status: o.out_of_office_status,
            out_of_office_id: o.out_of_office_id,
            out_of_office_status: o.out_of_office_status,
            Crew: o.user?.user_name || null
        }));

        return response(200, {
            outOfOffices: result,
            total_unapproved: unapprovedCount
        }, 'Get Out Of Office Basic All Success', res);
    } catch (error) {
        return next(error);
    }
}

const getOutOfOfficeBasicById = async (req, res, next) => {
    const outOfOfficeId = Number(req.params.outOfOfficeId);

    try {
        const o = await prisma.out_of_office.findUnique({
            where: { out_of_office_id: outOfOfficeId },
            select: {
                out_of_office_id: true,
                out_of_office_status: true,
                user: { select: { user_name: true } }
            }
        });

        if (!o) {
            return response(404, null, 'Out of Office Record Not Found', res);
        }

        const unapprovedCount = await prisma.out_of_office.count({
            where: {
                NOT: [
                    { out_of_office_status: { equals: 'APPROVED', mode: 'insensitive' } },
                    { out_of_office_status: { equals: 'DITERIMA', mode: 'insensitive' } }
                ]
            }
        });

        const result = {
            outofoffice_id: o.out_of_office_id,
            outofoffice_status: o.out_of_office_status,
            out_of_office_id: o.out_of_office_id,
            out_of_office_status: o.out_of_office_status,
            total_unapproved: unapprovedCount,
            Crew: o.user?.user_name || null
        };

        return response(200, { outOfOfficeBasic: result }, 'Get Out Of Office Basic Success', res);
    } catch (error) {
        return next(error);
    }
}

const getCrewOutOfOffice = async (req, res, next) => {
    const userId = Number(req.params.id)

    try {
        const outOfOffices = await prisma.out_of_office.findMany({
            where: { user_id: userId },
            orderBy: { out_of_office_start: 'desc' },
            include: {
                user: { select: { user_name: true } }
            }
        })

        const result = outOfOffices.map(o => ({
            ...o,
            Crew: o.user?.user_name || null,
            user: undefined
        }))

        return response(200, { crewOutOfOffices: result }, 'Get Crew Out Of Office Success', res)
    } catch (error) {
        return next(error)
    }
}

const getOutOfOfficeDetail = async (req, res, next) => {
    const id = Number(req.params.id)

    try {
        const outOfOffice = await prisma.out_of_office.findUnique({
            where: { out_of_office_id: id },
            include: {
                user: { select: { user_name: true } }
            }
        })

        if (!outOfOffice) {
            return response(404, null, 'Out Of Office Record Not Found', res)
        }

        const result = {
            ...outOfOffice,
            Crew: outOfOffice.user?.user_name || null,
            user: undefined
        }

        return response(200, { outOfOfficeDetail: result }, 'Get Out Of Office Detail Success', res)
    } catch (error) {
        return next(error)
    }
}

const createNewOutOfOffice = async (req, res, next) => {
    const { 
        user_id, 
        outofoffice_desc, 
        out_of_office_desc, 
        outofoffice_start, 
        out_of_office_start, 
        outofoffice_end, 
        out_of_office_end, 
        outofoffice_status, 
        out_of_office_status 
    } = req.body;

    try {
        const targetUserId = Number(user_id) || Number(req.userData?.user_id);
        if (!targetUserId) {
            return response(401, null, "Unauthorized or Missing User ID", res);
        }

        const desc = outofoffice_desc || out_of_office_desc;
        const startVal = outofoffice_start || out_of_office_start;
        const endVal = outofoffice_end || out_of_office_end;
        const statusVal = outofoffice_status || out_of_office_status || 'PENDING';

        if (!desc || !startVal || !endVal) {
            return response(400, null, 'Missing Required Field: desc, start, and end dates are required', res);
        }

        const searchStart = new Date(startVal);
        const searchEnd = new Date(endVal);

        const existing = await prisma.out_of_office.findFirst({
            where: {
                user_id: targetUserId,
                out_of_office_start: { lte: searchEnd },
                out_of_office_end: { gte: searchStart }
            }
        });

        if (existing) {
            return response(409, null, 'Out of office request overlaps with an existing record for this user', res);
        }

        const data = {
            user_id: targetUserId,
            out_of_office_desc: desc,
            out_of_office_start: searchStart,
            out_of_office_end: searchEnd,
            out_of_office_status: statusVal
        }

        const created = await prisma.out_of_office.create({ data })

        const result = {
            user_id: created.user_id,
            outofoffice_desc: created.out_of_office_desc,
            outofoffice_start: created.out_of_office_start,
            outofoffice_end: created.out_of_office_end,
            outofoffice_status: created.out_of_office_status,
            out_of_office_desc: created.out_of_office_desc,
            out_of_office_start: created.out_of_office_start,
            out_of_office_end: created.out_of_office_end,
            out_of_office_status: created.out_of_office_status
        }

        return response(201, { outOfOfficeCreated: result }, 'Create Out Of Office Success', res)
    } catch (error) {
        return next(error)
    }
}

const updateOutOfOffice = async (req, res, next) => {
    const id = Number(req.params.outOfOfficeId)
    const { out_of_office_status } = req.body

    try {
        if (!out_of_office_status) {
            return response(400, null, 'out_of_office_status is required', res)
        }

        const existing = await prisma.out_of_office.findUnique({
            where: { out_of_office_id: id },
        })

        if (!existing) {
            return response(404, null, 'Out Of Office Record Not Found', res)
        }

        if (out_of_office_status && (out_of_office_status.toUpperCase() === 'APPROVED' || out_of_office_status.toUpperCase() === 'DITERIMA')) {
            const dates = getDatesInRange(existing.out_of_office_start, existing.out_of_office_end);
            for (const d of dates) {
                const existingAttendance = await prisma.attendance.findFirst({
                    where: {
                        user_id: existing.user_id,
                        attendance_date: d,
                    }
                });

                if (!existingAttendance) {
                    await prisma.attendance.create({
                        data: {
                            user_id: existing.user_id,
                            attendance_status: 'Dinas Luar',
                            attendance_date: d,
                            attendance_in: null,
                            attendance_out: null,
                        }
                    });
                } else {
                    await prisma.attendance.update({
                        where: { attendance_id: existingAttendance.attendance_id },
                        data: {
                            attendance_status: 'Dinas Luar',
                        }
                    });
                }
            }
        }

        const updated = await prisma.out_of_office.update({
            where: { out_of_office_id: id },
            data: {
                out_of_office_status,
            },
        })

        const result = {
            outofoffice_id: updated.out_of_office_id,
            outofoffice_status: updated.out_of_office_status,
            out_of_office_id: updated.out_of_office_id,
            out_of_office_status: updated.out_of_office_status
        }

        return response(200, { outOfOfficeUpdated: result }, 'Update Out Of Office Success', res)
    } catch (error) {
        return next(error)
    }
}

const updateOutOfOfficePut = async (req, res, next) => {
    const outOfOfficeId = Number(req.params.outOfOfficeId);
    const { 
        outofoffice_desc, 
        out_of_office_desc, 
        outofoffice_start, 
        out_of_office_start, 
        outofoffice_end, 
        out_of_office_end, 
        outofoffice_status, 
        out_of_office_status 
    } = req.body;

    try {
        const existing = await prisma.out_of_office.findUnique({
            where: { out_of_office_id: outOfOfficeId }
        });

        if (!existing) {
            return response(404, null, 'Out Of Office Record Not Found', res);
        }

        const desc = outofoffice_desc !== undefined ? outofoffice_desc : out_of_office_desc;
        const startVal = outofoffice_start !== undefined ? outofoffice_start : out_of_office_start;
        const endVal = outofoffice_end !== undefined ? outofoffice_end : out_of_office_end;
        const statusVal = outofoffice_status !== undefined ? outofoffice_status : out_of_office_status;

        const data = {};
        if (desc !== undefined) data.out_of_office_desc = desc;
        if (startVal !== undefined) data.out_of_office_start = startVal ? new Date(startVal) : null;
        if (endVal !== undefined) data.out_of_office_end = endVal ? new Date(endVal) : null;
        if (statusVal !== undefined) data.out_of_office_status = statusVal;

        if (statusVal && (statusVal.toUpperCase() === 'APPROVED' || statusVal.toUpperCase() === 'DITERIMA')) {
            const finalStart = startVal ? new Date(startVal) : existing.out_of_office_start;
            const finalEnd = endVal ? new Date(endVal) : existing.out_of_office_end;
            const dates = getDatesInRange(finalStart, finalEnd);
            for (const d of dates) {
                const existingAttendance = await prisma.attendance.findFirst({
                    where: {
                        user_id: existing.user_id,
                        attendance_date: d
                    }
                });

                if (!existingAttendance) {
                    await prisma.attendance.create({
                        data: {
                            user_id: existing.user_id,
                            attendance_status: 'Dinas Luar',
                            attendance_date: d,
                            attendance_in: null,
                            attendance_out: null
                        }
                    });
                } else {
                    await prisma.attendance.update({
                        where: { attendance_id: existingAttendance.attendance_id },
                        data: {
                            attendance_status: 'Dinas Luar'
                        }
                    });
                }
            }
        }

        const updated = await prisma.out_of_office.update({
            where: { out_of_office_id: outOfOfficeId },
            data
        });

        const result = {
            outofoffice_desc: updated.out_of_office_desc,
            outofoffice_start: updated.out_of_office_start,
            outofoffice_end: updated.out_of_office_end,
            outofoffice_status: updated.out_of_office_status,
            out_of_office_desc: updated.out_of_office_desc,
            out_of_office_start: updated.out_of_office_start,
            out_of_office_end: updated.out_of_office_end,
            out_of_office_status: updated.out_of_office_status
        };

        return response(200, { outOfOfficeUpdated: result }, 'Update Out Of Office Success', res);
    } catch (error) {
        return next(error);
    }
}

const deleteOutOfOffice = async (req, res, next) => {
    const id = Number(req.params.outOfOfficeId)

    try {
        const existing = await prisma.out_of_office.findUnique({
            where: { out_of_office_id: id },
            select: { out_of_office_id: true },
        })

        if (!existing) {
            return response(404, null, 'Out Of Office Record Not Found', res)
        }

        await prisma.out_of_office.delete({
            where: { out_of_office_id: id },
        })

        return response(200, { outOfOfficeId: id }, 'Delete Out Of Office Success', res)
    } catch (error) {
        return next(error)
    }
}

module.exports = {
    getAllOutOfOffice,
    getOutOfOfficeBasicAll,
    getOutOfOfficeBasicById,
    getCrewOutOfOffice,
    getOutOfOfficeDetail,
    createNewOutOfOffice,
    updateOutOfOffice,
    updateOutOfOfficePut,
    deleteOutOfOffice,
}
