const prisma = require('../utils/prisma')
const response = require('../../response')

const getAllOvertime = async (req, res, next) => {
    try {
        const overtimes = await prisma.overtime.findMany({
            orderBy: { overtime_date: 'desc' },
            select: {
                overtime_id: true,
                overtime_desc: true,
                overtime_start: true,
                overtime_end: true,
                overtime_status: true
            }
        })

        return response(200, { overtimes: overtimes }, 'Get All Overtime Success', res)
    } catch (error) {
        return next(error)
    }
}

const getOvertimeBasicAll = async (req, res, next) => {
    try {
        const overtimes = await prisma.overtime.findMany({
            select: {
                overtime_id: true,
                overtime_status: true
            }
        })

        const unapprovedCount = overtimes.filter(o => {
            const status = (o.overtime_status || '').toLowerCase();
            return status !== 'approved' && status !== 'diterima';
        }).length;

        return response(200, {
            overtimes,
            total_unapproved: unapprovedCount
        }, 'Get Overtime Basic All Success', res)
    } catch (error) {
        return next(error)
    }
}

const getOvertimeBasicById = async (req, res, next) => {
    const overtimeId = Number(req.params.overtimeId)

    try {
        const overtime = await prisma.overtime.findUnique({
            where: { overtime_id: overtimeId },
            select: {
                overtime_id: true,
                overtime_status: true
            }
        })

        if (!overtime) {
            return response(404, null, 'Overtime Not Found', res)
        }

        const unapprovedCount = await prisma.overtime.count({
            where: {
                NOT: [
                    { overtime_status: { equals: 'APPROVED', mode: 'insensitive' } },
                    { overtime_status: { equals: 'DITERIMA', mode: 'insensitive' } }
                ]
            }
        });

        const result = {
            overtime_id: overtime.overtime_id,
            overtime_status: overtime.overtime_status,
            total_unapproved: unapprovedCount
        }

        return response(200, { overtimeBasic: result }, 'Get Overtime Basic Success', res)
    } catch (error) {
        return next(error)
    }
}

const getCrewOvertime = async (req, res, next) => {
    const userId = Number(req.params.id)

    try {
        const overtimes = await prisma.overtime.findMany({
            where: { user_id: userId },
            orderBy: { overtime_date: 'desc' },
        })

        return response( 200, {crewOvertimes: overtimes}, 'Get Crew Overtime Success', res)
    } catch (error) {
        return next(error)
    }
}

const getOvertimeDetail = async (req, res, next) => {
    const id = Number(req.params.id)

    try {
        const overtime = await prisma.overtime.findUnique({
            where: { overtime_id: id },
        })

        if (!overtime) {
            return response(404, null, 'Overtime Not Found', res)
        }

        return response(200, {overtimeDetail: overtime}, 'Get Overtime Detail Success', res)
    } catch (error) {
        return next(error)
    }
}

const createNewOvertime = async (req, res, next) => {
    const {
        user_id,
        attendance_id,
        overtime_desc,
        overtime_start,
        overtime_end,
        overtime_status,
        overtime_date
    } = req.body

    try {
        const targetUserId = Number(user_id) || Number(req.userData?.user_id);
        if (!targetUserId) {
            return response(401, null, "Unauthorized or Missing User ID", res);
        }

        if (!overtime_start || !overtime_end) {
            return response(400, null, 'Missing Required Field: overtime_start and overtime_end', res)
        }
        
        if (!overtime_desc) {
            return response(400, {}, "Overtime description is required", res);
        }

        let resolvedAttendanceId = Number(attendance_id);
        if (!resolvedAttendanceId) {
            const dateStr = overtime_date || overtime_start.split('T')[0];
            const attDate = new Date(dateStr);

            let existingAtt = await prisma.attendance.findFirst({
                where: {
                    user_id: targetUserId,
                    attendance_date: attDate
                }
            });

            if (!existingAtt) {
                existingAtt = await prisma.attendance.create({
                    data: {
                        user_id: targetUserId,
                        attendance_date: attDate,
                        attendance_status: 'Hadir'
                    }
                });
            }
            resolvedAttendanceId = existingAtt.attendance_id;
        }

        const data = {
            user_id: targetUserId,
            attendance_id: resolvedAttendanceId,
            overtime_desc: overtime_desc || null,
            overtime_date: overtime_date ? new Date(overtime_date) : new Date(overtime_start.split('T')[0]),
            overtime_start: new Date(overtime_start),
            overtime_end: new Date(overtime_end),
            overtime_status: overtime_status || 'PENDING',
        }

        const created = await prisma.overtime.create({ data })

        if (overtime_status && (overtime_status.toUpperCase() === 'APPROVED' || overtime_status.toUpperCase() === 'DITERIMA')) {
            await prisma.attendance.update({
                where: { attendance_id: resolvedAttendanceId },
                data: {
                    attendance_status: 'Lembur'
                }
            });
        }

        const result = {
            user_id: created.user_id,
            attendance_id: created.attendance_id,
            overtime_desc: created.overtime_desc,
            overtime_start: created.overtime_start,
            overtime_end: created.overtime_end,
            overtime_status: created.overtime_status
        }

        return response(201, { overtimeCreated: result }, 'Create Overtime Success', res)
    } catch (error) {
        return next(error)
    }
}

const updateOvertime = async (req, res, next) => {
    const id = Number(req.params.overtimeId)
    const { overtime_status } = req.body

    try {
        if (!overtime_status) {
            return response(400, null, 'overtime_status is required', res)
        }

        const existing = await prisma.overtime.findUnique({
            where: { overtime_id: id },
        })

        if (!existing) {
            return response(404, null, 'Overtime Not Found', res)
        }

        const updated = await prisma.overtime.update({
            where: { overtime_id: id },
            data: {
                overtime_status,
            },
        })

        if (overtime_status && (overtime_status.toUpperCase() === 'APPROVED' || overtime_status.toUpperCase() === 'DITERIMA')) {
            if (existing.attendance_id) {
                await prisma.attendance.update({
                    where: { attendance_id: existing.attendance_id },
                    data: {
                        attendance_status: 'Lembur',
                    },
                })
            }
        }

        const result = {
            overtime_id: updated.overtime_id,
            overtime_status: updated.overtime_status
        };

        return response(200, { overtimeUpdated: result }, 'Update Overtime Status Success', res)
    } catch (error) {
        return next(error)
    }
}

const updateOvertimePut = async (req, res, next) => {
    const overtimeId = Number(req.params.overtimeId);
    const { overtime_desc, overtime_start, overtime_end, overtime_status } = req.body;

    try {
        const existing = await prisma.overtime.findUnique({
            where: { overtime_id: overtimeId }
        });

        if (!existing) {
            return response(404, null, 'Overtime Not Found', res);
        }

        const data = {};
        if (overtime_desc !== undefined) data.overtime_desc = overtime_desc;
        if (overtime_start !== undefined) data.overtime_start = overtime_start ? new Date(overtime_start) : null;
        if (overtime_end !== undefined) data.overtime_end = overtime_end ? new Date(overtime_end) : null;
        if (overtime_status !== undefined) data.overtime_status = overtime_status;

        const updated = await prisma.overtime.update({
            where: { overtime_id: overtimeId },
            data
        });

        if (overtime_status && (overtime_status.toUpperCase() === 'APPROVED' || overtime_status.toUpperCase() === 'DITERIMA')) {
            if (existing.attendance_id) {
                await prisma.attendance.update({
                    where: { attendance_id: existing.attendance_id },
                    data: {
                        attendance_status: 'Lembur'
                    }
                });
            }
        }

        const result = {
            overtime_desc: updated.overtime_desc,
            overtime_start: updated.overtime_start,
            overtime_end: updated.overtime_end,
            overtime_status: updated.overtime_status
        };

        return response(200, { overtimeUpdated: result }, 'Update Overtime Success', res);
    } catch (error) {
        return next(error);
    }
}

const deleteOvertime = async (req, res, next) => {
    const id = Number(req.params.overtimeId)

    try {
        const existing = await prisma.overtime.findUnique({
            where: { overtime_id: id },
            select: { overtime_id: true },
        })

        if (!existing) {
            return response(404, null, 'Overtime Not Found', res)
        }

        await prisma.overtime.delete({
            where: { overtime_id: id },
        })

        return response(200, {overtimeId: id}, 'Delete Overtime Success', res)
    } catch (error) {
        return next(error)
    }
}

module.exports = {
    getAllOvertime,
    getOvertimeBasicAll,
    getOvertimeBasicById,
    getCrewOvertime,
    getOvertimeDetail,
    createNewOvertime,
    updateOvertime,
    updateOvertimePut,
    deleteOvertime,
}