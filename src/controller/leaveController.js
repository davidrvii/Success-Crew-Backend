const prisma = require('../utils/prisma')
const response = require('../../response')

const getAllLeave = async (req, res, next) => {
    try {
        const leaves = await prisma.leave.findMany({
            orderBy: { leave_date: 'desc' },
            select: {
                leave_id: true,
                leave_desc: true,
                leave_date: true,
                leave_status: true
            }
        })

        return response(200, { leaves: leaves }, 'Get All Leave Success', res)
    } catch (error) {
        return next(error)
    }
}

const getLeaveBasicAll = async (req, res, next) => {
    try {
        const leaves = await prisma.leave.findMany({
            select: {
                leave_id: true,
                leave_status: true
            }
        })

        const unapprovedCount = leaves.filter(l => {
            const status = (l.leave_status || '').toLowerCase();
            return status !== 'approved' && status !== 'diterima';
        }).length;

        return response(200, {
            leaves,
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
                leave_status: true
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
            total_unapproved: unapprovedCount
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
            orderBy: { leave_date: 'desc' },
        })

        return response(200, {crewLeaves: leaves}, 'Get Crew Leave Success', res)
    } catch (error) {
        return next(error)
    }
}

const getLeaveDetail = async (req, res, next) => {
    const id = Number(req.params.id)

    try {
        const leave = await prisma.leave.findUnique({
            where: { leave_id: id },
        })

        if (!leave) {
            return response(404, null, 'Leave Not Found', res)
        }

        return response(200, {leaveDetail: leave}, 'Get Leave Detail Success', res)
    } catch (error) {
        return next(error)
    }
}

const createNewLeave = async (req, res, next) => {
    const {
        user_id,
        leave_desc,
        leave_date,
        leave_status,
    } = req.body

    try {
        const targetUserId = Number(user_id) || Number(req.userData?.user_id);
        if (!targetUserId) {
            return response(401, null, "Unauthorized or Missing User ID", res);
        }

        if (!leave_desc || !leave_date) {
            return response(400, null, 'Missing Required Field: leave_desc and leave_date are required', res)
        }

        const data = {
            user_id: targetUserId,
            leave_desc,
            leave_date: new Date(leave_date),
            leave_status: leave_status || 'PENDING',
        }

        const created = await prisma.leave.create({ data })

        const result = {
            user_id: created.user_id,
            leave_desc: created.leave_desc,
            leave_date: created.leave_date,
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
            const existingAttendance = await prisma.attendance.findFirst({
                where: {
                    user_id: existing.user_id,
                    attendance_date: existing.leave_date,
                }
            });

            if (!existingAttendance) {
                await prisma.attendance.create({
                    data: {
                        user_id: existing.user_id,
                        attendance_status: 'Cuti',
                        attendance_date: existing.leave_date,
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
    const { leave_desc, leave_date, leave_status } = req.body;

    try {
        const existing = await prisma.leave.findUnique({
            where: { leave_id: leaveId }
        });

        if (!existing) {
            return response(404, null, 'Leave Not Found', res);
        }

        const data = {};
        if (leave_desc !== undefined) data.leave_desc = leave_desc;
        if (leave_date !== undefined) data.leave_date = leave_date ? new Date(leave_date) : null;
        if (leave_status !== undefined) data.leave_status = leave_status;

        if (leave_status && (leave_status.toUpperCase() === 'APPROVED' || leave_status.toUpperCase() === 'DITERIMA')) {
            const checkDate = leave_date ? new Date(leave_date) : existing.leave_date;
            const existingAttendance = await prisma.attendance.findFirst({
                where: {
                    user_id: existing.user_id,
                    attendance_date: checkDate
                }
            });

            if (!existingAttendance) {
                await prisma.attendance.create({
                    data: {
                        user_id: existing.user_id,
                        attendance_status: 'Cuti',
                        attendance_date: checkDate,
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

        const updated = await prisma.leave.update({
            where: { leave_id: leaveId },
            data
        });

        const result = {
            leave_desc: updated.leave_desc,
            leave_date: updated.leave_date,
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