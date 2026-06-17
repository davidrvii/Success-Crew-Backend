const prisma = require('../utils/prisma')
const response = require('../../response')

const getAllAttendance = async (req, res, next) => {
    try {
        const attendances = await prisma.attendance.findMany({
            orderBy: { attendance_date: 'desc' },
            select: {
                attendance_id: true,
                attendance_status: true,
                attendance_in: true,
                attendance_out: true,
                attendance_date: true
            }
        });
        return response(200, { attendance: attendances }, 'Get All Attendance Success', res);
    } catch (error) {
        return next(error);
    }
}

const getAttendanceBasic = async (req, res, next) => {
    try {
        const userId = Number(req.userData?.user_id);
        if (!userId) {
            return response(401, null, "Unauthorized", res);
        }

        const dateStr = req.query.date || new Date().toLocaleDateString('en-CA');
        const searchDate = new Date(dateStr);

        const a = await prisma.attendance.findFirst({
            where: {
                user_id: userId,
                attendance_date: searchDate
            },
            select: {
                attendance_in: true,
                attendance_out: true
            }
        });

        const result = {
            attendance_in: a?.attendance_in ?? null,
            attendance_out: a?.attendance_out ?? null
        };

        return response(200, { attendanceBasic: result }, 'Get Attendance Basic Success', res);
    } catch (error) {
        return next(error);
    }
}

const getCrewAttendance = async (req, res, next) => {
    const userId = Number(req.params.userId);

    try {
        const user = await prisma.user.findUnique({
            where: { user_id: userId },
            select: {
                user_id: true,
                attendance: {
                    select: {
                        attendance_id: true,
                        attendance_status: true,
                        attendance_in: true,
                        attendance_out: true,
                        attendance_date: true
                    },
                    orderBy: { attendance_date: 'desc' }
                },
                leave: {
                    select: {
                        leave_id: true,
                        leave_date: true
                    },
                    orderBy: { leave_date: 'desc' }
                },
                overtime: {
                    select: {
                        overtime_id: true,
                        overtime_start: true
                    },
                    orderBy: { overtime_start: 'desc' }
                }
            }
        });

        if (!user) {
            return response(404, null, 'User Not Found', res);
        }

        const currentYear = new Date().getFullYear();

        const attendancesThisYear = user.attendance.filter(a => {
            const date = new Date(a.attendance_date);
            return date.getFullYear() === currentYear;
        });

        const leavesThisYear = user.leave.filter(l => {
            const date = new Date(l.leave_date);
            return date.getFullYear() === currentYear;
        });

        const overtimesThisYear = user.overtime.filter(o => {
            const date = new Date(o.overtime_start);
            return date.getFullYear() === currentYear;
        });

        const total_attendance = attendancesThisYear.filter(a => {
            const status = (a.attendance_status || '').toLowerCase();
            return status === 'hadir' || status === 'telat';
        }).length;

        const total_late = attendancesThisYear.filter(a => {
            const status = (a.attendance_status || '').toLowerCase();
            return status === 'telat';
        }).length;

        const total_leave = leavesThisYear.length;
        const total_overtime = overtimesThisYear.length;

        const result = {
            total_attendance,
            total_late,
            total_leave,
            total_overtime,
            attendance: user.attendance,
            leave: user.leave.map(l => ({ leave_id: l.leave_id })),
            overtime: user.overtime.map(o => ({ overtime_id: o.overtime_id }))
        };

        return response(200, { crewAttendanceHistory: result }, 'Get Crew Attendance Success', res);
    } catch (error) {
        return next(error);
    }
}

const getAttendanceDetail = async (req, res, next) => {
    const id = Number(req.params.id)

    try {
        const a = await prisma.attendance.findUnique({
            where: { attendance_id: id },
            include: {
                overtime: true,
            },
        })

        if (!a) {
            return response(404, null, 'Attendance Not Found', res)
        }

        const result = {
            attendance_id: a.attendance_id,
            user_id: a.user_id,
            attendance_status: a.attendance_status,
            attendance_in: a.attendance_in,
            attendance_out: a.attendance_out,
            attendance_date: a.attendance_date,
            created_at: a.created_at,
            updated_at: a.updated_at,
            overtimes: (a.overtime || []).map((o) => ({
                overtime_id: o.overtime_id,
                overtime_desc: o.overtime_desc,
                overtime_date: o.overtime_date,
                overtime_start: o.overtime_start,
                overtime_end: o.overtime_end,
                overtime_status: o.overtime_status,
                created_at: o.created_at,
                updated_at: o.updated_at,
            })),
        }

        return response(200, {attendanceDetail: result}, 'Get Attendance Detail Success', res)
    } catch (error) {
        return next(error)
    }
}

const createNewAttendance = async (req, res, next) => {
    const { user_id, attendance_date } = req.body;

    try {
        const targetUserId = Number(user_id) || Number(req.userData?.user_id);
        if (!targetUserId) {
            return response(401, null, "Unauthorized or Missing User ID", res);
        }

        if (!attendance_date) {
            return response(400, null, 'Missing Required Field: attendance_date', res);
        }

        const created = await prisma.attendance.create({
            data: {
                user_id: targetUserId,
                attendance_status: "Tidak Hadir",
                attendance_date: new Date(attendance_date)
            }
        });

        const result = {
            user_id: created.user_id,
            attendance_date: created.attendance_date
        };

        return response(201, { attendanceAdded: result }, 'Create Attendance Success', res);
    } catch (error) {
        if (error.code === "P2002") {
            return response(409, {}, "Attendance record already exists for this date", res);
        }
        return next(error);
    }
}

const patchCheckin = async (req, res, next) => {
    const { attendance_status, date } = req.body;
    try {
        const userId = Number(req.userData?.user_id);
        if (!userId) {
            return response(401, null, "Unauthorized", res);
        }

        const dateStr = date || req.query.date || new Date().toLocaleDateString('en-CA');
        const attendance_date = new Date(dateStr);

        let existing = await prisma.attendance.findFirst({
            where: {
                user_id: userId,
                attendance_date
            }
        });

        const now = new Date();
        let status = attendance_status;
        if (!status) {
            if (now.getHours() >= 9) {
                status = 'Telat';
            } else {
                status = 'Hadir';
            }
        }

        let resultRecord;
        if (existing) {
            resultRecord = await prisma.attendance.update({
                where: { attendance_id: existing.attendance_id },
                data: {
                    attendance_in: now,
                    attendance_status: status
                }
            });
        } else {
            resultRecord = await prisma.attendance.create({
                data: {
                    user_id: userId,
                    attendance_date,
                    attendance_in: now,
                    attendance_status: status
                }
            });
        }

        const result = {
            attendance_in: resultRecord.attendance_in,
            attendance_status: resultRecord.attendance_status
        };

        return response(200, { checkin: result }, 'Check-in Success', res);
    } catch (error) {
        return next(error);
    }
}

const patchCheckout = async (req, res, next) => {
    const { date } = req.body;
    try {
        const userId = Number(req.userData?.user_id);
        if (!userId) {
            return response(401, null, "Unauthorized", res);
        }

        const dateStr = date || req.query.date || new Date().toLocaleDateString('en-CA');
        const attendance_date = new Date(dateStr);

        let existing = await prisma.attendance.findFirst({
            where: {
                user_id: userId,
                attendance_date
            }
        });

        const now = new Date();

        let resultRecord;
        if (existing) {
            resultRecord = await prisma.attendance.update({
                where: { attendance_id: existing.attendance_id },
                data: {
                    attendance_out: now
                }
            });
        } else {
            resultRecord = await prisma.attendance.create({
                data: {
                    user_id: userId,
                    attendance_date,
                    attendance_out: now,
                    attendance_status: 'Hadir'
                }
            });
        }

        const result = {
            attendance_date: resultRecord.attendance_date,
            attendance_out: resultRecord.attendance_out
        };

        return response(200, { checkout: result }, 'Check-out Success', res);
    } catch (error) {
        return next(error);
    }
}

const updateAttendancePut = async (req, res, next) => {
    const attendanceId = Number(req.params.attendanceId);
    const { attendance_status, attendance_in, attendance_out, attendance_date } = req.body;

    try {
        const existing = await prisma.attendance.findUnique({
            where: { attendance_id: attendanceId }
        });

        if (!existing) {
            return response(404, null, 'Attendance Not Found', res);
        }

        const data = {};
        if (attendance_status !== undefined) data.attendance_status = attendance_status;
        if (attendance_in !== undefined) data.attendance_in = attendance_in ? new Date(attendance_in) : null;
        if (attendance_out !== undefined) data.attendance_out = attendance_out ? new Date(attendance_out) : null;
        if (attendance_date !== undefined) data.attendance_date = attendance_date ? new Date(attendance_date) : null;

        const updated = await prisma.attendance.update({
            where: { attendance_id: attendanceId },
            data
        });

        const result = {
            attendance_status: updated.attendance_status,
            attendance_in: updated.attendance_in,
            attendance_out: updated.attendance_out,
            attendance_date: updated.attendance_date
        };

        return response(200, { attendanceUpdated: result }, 'Update Attendance Success', res);
    } catch (error) {
        return next(error);
    }
}

const deleteAttendance = async (req, res, next) => {
    const id = Number(req.params.attendanceId)

    try {
        const existing = await prisma.attendance.findUnique({
            where: { attendance_id: id },
            select: { attendance_id: true },
        })

        if (!existing) {
            return response(404, null, 'Attendance Not Found', res)
        }

        await prisma.attendance.delete({
            where: { attendance_id: id },
        })

        return response(200, {attendanceId: id}, 'Delete Attendance Success', res)
    } catch (error) {
        return next(error)
    }
}

module.exports = {
    getAllAttendance,
    getAttendanceBasic,
    getCrewAttendance,
    getAttendanceDetail,
    createNewAttendance,
    patchCheckin,
    patchCheckout,
    updateAttendancePut,
    deleteAttendance,
}