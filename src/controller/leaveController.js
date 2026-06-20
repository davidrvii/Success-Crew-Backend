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

const getAllLeave = async (req, res, next) => {
    try {
        const leaves = await prisma.leave.findMany({
            orderBy: { leave_start: 'desc' },
            include: {
                user: { select: { user_name: true } }
            }
        })

        const result = leaves.map(l => ({
            leave_id: l.leave_id,
            leave_desc: l.leave_desc,
            leave_start: l.leave_start,
            leave_end: l.leave_end,
            leave_status: l.leave_status,
            Crew: l.user?.user_name || null
        }))

        return response(200, { leaves: result }, 'Get All Leave Success', res)
    } catch (error) {
        return next(error)
    }
}

const getLeaveBasicAll = async (req, res, next) => {
    try {
        const leaves = await prisma.leave.findMany({
            select: {
                leave_id: true,
                leave_status: true,
                user: { select: { user_name: true } }
            }
        })

        const unapprovedCount = leaves.filter(l => {
            const status = (l.leave_status || '').toLowerCase();
            return status !== 'approved' && status !== 'diterima';
        }).length;

        const result = leaves.map(l => ({
            leave_id: l.leave_id,
            leave_status: l.leave_status,
            Crew: l.user?.user_name || null
        }))

        return response(200, {
            leaves: result,
            total_unapproved: unapprovedCount
        }, 'Get Leave Basic All Success', res)
    } catch (error) {
        return next(error)
    }
}

const getLeaveBasicById = async (req, res, next) => {
    const leaveId = Number(req.params.leaveId)

    try {
        const leave = await prisma.leave.findUnique({
            where: { leave_id: leaveId },
            select: {
                leave_id: true,
                leave_status: true,
                user: { select: { user_name: true } }
            }
        })

        if (!leave) {
            return response(404, null, 'Leave Not Found', res)
        }

        const unapprovedCount = await prisma.leave.count({
            where: {
                NOT: [
                    { leave_status: { equals: 'APPROVED', mode: 'insensitive' } },
                    { leave_status: { equals: 'DITERIMA', mode: 'insensitive' } }
                ]
            }
        });

        const result = {
            leave_id: leave.leave_id,
            leave_status: leave.leave_status,
            total_unapproved: unapprovedCount,
            Crew: leave.user?.user_name || null
        }

        return response(200, { leaveBasic: result }, 'Get Leave Basic Success', res)
    } catch (error) {
        return next(error)
    }
}

const getCrewLeave = async (req, res, next) => {
    const userId = Number(req.params.id)

    try {
        const leaves = await prisma.leave.findMany({
            where: { user_id: userId },
            orderBy: { leave_start: 'desc' },
            include: {
                user: { select: { user_name: true } }
            }
        })

        const result = leaves.map(l => ({
            ...l,
            Crew: l.user?.user_name || null,
            user: undefined
        }))

        return response(200, { crewLeaves: result }, 'Get Crew Leave Success', res)
    } catch (error) {
        return next(error)
    }
}

const getLeaveDetail = async (req, res, next) => {
    const id = Number(req.params.id)

    try {
        const leave = await prisma.leave.findUnique({
            where: { leave_id: id },
            include: {
                user: { select: { user_name: true } }
            }
        })

        if (!leave) {
            return response(404, null, 'Leave Not Found', res)
        }

        const result = {
            ...leave,
            Crew: leave.user?.user_name || null,
            user: undefined
        }

        return response(200, { leaveDetail: result }, 'Get Leave Detail Success', res)
    } catch (error) {
        return next(error)
    }
}

const createNewLeave = async (req, res, next) => {
    const {
        user_id,
        leave_desc,
        leave_start,
        leave_end,
        leave_status,
    } = req.body

    try {
        const targetUserId = Number(user_id) || Number(req.userData?.user_id);
        if (!targetUserId) {
            return response(401, null, "Unauthorized or Missing User ID", res);
        }

        if (!leave_desc || !leave_start || !leave_end) {
            return response(400, null, 'Missing Required Field: leave_desc, leave_start, and leave_end are required', res)
        }

        const searchLeaveStart = new Date(leave_start);
        const searchLeaveEnd = new Date(leave_end);

        const existing = await prisma.leave.findFirst({
            where: {
                user_id: targetUserId,
                leave_start: { lte: searchLeaveEnd },
                leave_end: { gte: searchLeaveStart }
            }
        });

        if (existing) {
            return response(409, null, 'Leave request overlaps with an existing leave record for this user', res);
        }

        const data = {
            user_id: targetUserId,
            leave_desc,
            leave_start: searchLeaveStart,
            leave_end: searchLeaveEnd,
            leave_status: leave_status || 'PENDING',
        }

        const created = await prisma.leave.create({ data })

        const result = {
            user_id: created.user_id,
            leave_desc: created.leave_desc,
            leave_start: created.leave_start,
            leave_end: created.leave_end,
            leave_status: created.leave_status
        }

        return response(201, { leaveCreated: result }, 'Create Leave Success', res)
    } catch (error) {
        return next(error)
    }
}

const updateLeave = async (req, res, next) => {
    const id = Number(req.params.leaveId)
    const { leave_status } = req.body

    try {
        if (!leave_status) {
            return response(400, null, 'leave_status is required', res)
        }

        const existing = await prisma.leave.findUnique({
            where: { leave_id: id },
        })

        if (!existing) {
            return response(404, null, 'Leave Not Found', res)
        }

        if (leave_status && (leave_status.toUpperCase() === 'APPROVED' || leave_status.toUpperCase() === 'DITERIMA')) {
            const dates = getDatesInRange(existing.leave_start, existing.leave_end);
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
                            attendance_status: 'Cuti',
                            attendance_date: d,
                            attendance_in: null,
                            attendance_out: null,
                        }
                    });
                } else {
                    await prisma.attendance.update({
                        where: { attendance_id: existingAttendance.attendance_id },
                        data: {
                            attendance_status: 'Cuti',
                        }
                    });
                }
            }
        }

        const updated = await prisma.leave.update({
            where: { leave_id: id },
            data: {
                leave_status,
            },
        })

        const result = {
            leave_id: updated.leave_id,
            leave_status: updated.leave_status
        }

        return response(200, { leaveUpdated: result }, 'Update Leave Success', res)
    } catch (error) {
        return next(error)
    }
}

const updateLeavePut = async (req, res, next) => {
    const leaveId = Number(req.params.leaveId);
    const { leave_desc, leave_start, leave_end, leave_status } = req.body;

    try {
        const existing = await prisma.leave.findUnique({
            where: { leave_id: leaveId }
        });

        if (!existing) {
            return response(404, null, 'Leave Not Found', res);
        }

        const data = {};
        if (leave_desc !== undefined) data.leave_desc = leave_desc;
        if (leave_start !== undefined) data.leave_start = leave_start ? new Date(leave_start) : null;
        if (leave_end !== undefined) data.leave_end = leave_end ? new Date(leave_end) : null;
        if (leave_status !== undefined) data.leave_status = leave_status;

        if (leave_status && (leave_status.toUpperCase() === 'APPROVED' || leave_status.toUpperCase() === 'DITERIMA')) {
            const finalStart = leave_start ? new Date(leave_start) : existing.leave_start;
            const finalEnd = leave_end ? new Date(leave_end) : existing.leave_end;
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
                            attendance_status: 'Cuti',
                            attendance_date: d,
                            attendance_in: null,
                            attendance_out: null
                        }
                    });
                } else {
                    await prisma.attendance.update({
                        where: { attendance_id: existingAttendance.attendance_id },
                        data: {
                            attendance_status: 'Cuti'
                        }
                    });
                }
            }
        }

        const updated = await prisma.leave.update({
            where: { leave_id: leaveId },
            data
        });

        const result = {
            leave_desc: updated.leave_desc,
            leave_start: updated.leave_start,
            leave_end: updated.leave_end,
            leave_status: updated.leave_status
        };

        return response(200, { leaveUpdated: result }, 'Update Leave Success', res);
    } catch (error) {
        return next(error);
    }
}

const deleteLeave = async (req, res, next) => {
    const id = Number(req.params.leaveId)

    try {
        const existing = await prisma.leave.findUnique({
            where: { leave_id: id },
            select: { leave_id: true },
        })

        if (!existing) {
            return response(404, null, 'Leave Not Found', res)
        }

        await prisma.leave.delete({
            where: { leave_id: id },
        })

        return response(200, {leaveId: id}, 'Delete Leave Success', res)
    } catch (error) {
        return next(error)
    }
}

module.exports = {
    getAllLeave,
    getLeaveBasicAll,
    getLeaveBasicById,
    getCrewLeave,
    getLeaveDetail,
    createNewLeave,
    updateLeave,
    updateLeavePut,
    deleteLeave,
}