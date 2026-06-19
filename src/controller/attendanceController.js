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
                        leave_desc: true,
                        leave_start: true,
                        leave_end: true,
                        leave_status: true
                    },
                    orderBy: { leave_start: 'desc' }
                },
                overtime: {
                    select: {
                        overtime_id: true,
                        overtime_desc: true,
                        overtime_date: true,
                        overtime_start: true,
                        overtime_end: true,
                        overtime_status: true
                    },
                    orderBy: { overtime_start: 'desc' }
                },
                out_of_office: {
                    select: {
                        out_of_office_id: true,
                        out_of_office_desc: true,
                        out_of_office_start: true,
                        out_of_office_end: true,
                        out_of_office_status: true
                    },
                    orderBy: { out_of_office_start: 'desc' }
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
            const startYear = new Date(l.leave_start).getFullYear();
            const endYear = new Date(l.leave_end).getFullYear();
            return startYear === currentYear || endYear === currentYear;
        });

        const overtimesThisYear = user.overtime.filter(o => {
            const date = new Date(o.overtime_start);
            return date.getFullYear() === currentYear;
        });

        const outOfOfficesThisYear = user.out_of_office.filter(o => {
            const startYear = new Date(o.out_of_office_start).getFullYear();
            const endYear = new Date(o.out_of_office_end).getFullYear();
            return startYear === currentYear || endYear === currentYear;
        });

        const attendanceCount = attendancesThisYear.filter(a => {
            const status = (a.attendance_status || '').toLowerCase();
            return status === 'hadir' || status === 'telat';
        }).length;

        const total_late = attendancesThisYear.filter(a => {
            const status = (a.attendance_status || '').toLowerCase();
            return status === 'telat';
        }).length;

        const total_leave = leavesThisYear.filter(l => {
            const status = (l.leave_status || '').toLowerCase();
            return status === 'approved' || status === 'diterima';
        }).length;
        const total_overtime = overtimesThisYear.length;
        const total_out_of_office = outOfOfficesThisYear.filter(o => {
            const status = (o.out_of_office_status || '').toLowerCase();
            return status === 'approved' || status === 'diterima';
        }).length;
        const total_attendance = attendanceCount + total_out_of_office;

        const attendanceHistoryList = user.attendance.map(a => ({
            id: a.attendance_id,
            type: 'attendance',
            date: a.attendance_date,
            status: a.attendance_status,
            description: null,
            details: {
                attendance_in: a.attendance_in,
                attendance_out: a.attendance_out
            }
        }));

        const leaveHistoryList = user.leave.map(l => ({
            id: l.leave_id,
            type: 'leave',
            date: l.leave_start,
            status: l.leave_status,
            description: l.leave_desc,
            details: {
                leave_start: l.leave_start,
                leave_end: l.leave_end
            }
        }));

        const overtimeHistoryList = user.overtime.map(o => ({
            id: o.overtime_id,
            type: 'overtime',
            date: o.overtime_date || o.overtime_start,
            status: o.overtime_status,
            description: o.overtime_desc,
            details: {
                overtime_start: o.overtime_start,
                overtime_end: o.overtime_end
            }
        }));

        const outOfOfficeHistoryList = user.out_of_office.map(o => ({
            id: o.out_of_office_id,
            type: 'out_of_office',
            date: o.out_of_office_start,
            status: o.out_of_office_status,
            description: o.out_of_office_desc,
            details: {
                out_of_office_start: o.out_of_office_start,
                out_of_office_end: o.out_of_office_end
            }
        }));

        const combinedHistory = [
            ...attendanceHistoryList,
            ...leaveHistoryList,
            ...overtimeHistoryList,
            ...outOfOfficeHistoryList
        ].sort((a, b) => new Date(b.date) - new Date(a.date));

        const result = {
            total_attendance,
            total_late,
            total_leave,
            total_overtime,
            total_out_of_office,
            history: combinedHistory,
            attendance: user.attendance,
            leave: user.leave.map(l => ({ leave_id: l.leave_id })),
            overtime: user.overtime.map(o => ({ overtime_id: o.overtime_id })),
            out_of_office: user.out_of_office.map(o => ({ out_of_office_id: o.out_of_office_id }))
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

        const searchDate = new Date(attendance_date);

        // 1. Check if there is an existing attendance record on this date with "Cuti" or "Dinas Luar"
        const existing = await prisma.attendance.findFirst({
            where: {
                user_id: targetUserId,
                attendance_date: searchDate
            }
        });

        if (existing) {
            const status = (existing.attendance_status || '').toLowerCase();
            if (status === 'cuti') {
                return response(400, null, "hari ini adalah jadwal cuti", res);
            }
            if (status === 'dinas luar' || status === 'dinas') {
                return response(400, null, "hari ini adalah jadwal dinas", res);
            }
            return response(409, {}, "Attendance record already exists for this date", res);
        }

        // 2. Check in leave table for approved leaves on this date
        const existingLeave = await prisma.leave.findFirst({
            where: {
                user_id: targetUserId,
                leave_start: { lte: searchDate },
                leave_end: { gte: searchDate },
                leave_status: { in: ['APPROVED', 'DITERIMA', 'approved', 'diterima'] }
            }
        });

        if (existingLeave) {
            return response(400, null, "hari ini adalah jadwal cuti", res);
        }

        // 3. Check in out_of_office table for approved out-of-office on this date
        const existingOutOfOffice = await prisma.out_of_office.findFirst({
            where: {
                user_id: targetUserId,
                out_of_office_start: { lte: searchDate },
                out_of_office_end: { gte: searchDate },
                out_of_office_status: { in: ['APPROVED', 'DITERIMA', 'approved', 'diterima'] }
            }
        });

        if (existingOutOfOffice) {
            return response(400, null, "hari ini adalah jadwal dinas", res);
        }

        const created = await prisma.attendance.create({
            data: {
                user_id: targetUserId,
                attendance_status: "Tidak Hadir",
                attendance_date: searchDate
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

        // 1. Check if there is an existing attendance record on this date with "Cuti" or "Dinas Luar"
        let existing = await prisma.attendance.findFirst({
            where: {
                user_id: userId,
                attendance_date
            }
        });

        if (existing) {
            const status = (existing.attendance_status || '').toLowerCase();
            if (status === 'cuti') {
                return response(400, null, "hari ini adalah jadwal cuti", res);
            }
            if (status === 'dinas luar' || status === 'dinas') {
                return response(400, null, "hari ini adalah jadwal dinas", res);
            }
        }

        // 2. Check in leave table for approved leaves on this date
        const existingLeave = await prisma.leave.findFirst({
            where: {
                user_id: userId,
                leave_start: { lte: attendance_date },
                leave_end: { gte: attendance_date },
                leave_status: { in: ['APPROVED', 'DITERIMA', 'approved', 'diterima'] }
            }
        });

        if (existingLeave) {
            return response(400, null, "hari ini adalah jadwal cuti", res);
        }

        // 3. Check in out_of_office table for approved out-of-office on this date
        const existingOutOfOffice = await prisma.out_of_office.findFirst({
            where: {
                user_id: userId,
                out_of_office_start: { lte: attendance_date },
                out_of_office_end: { gte: attendance_date },
                out_of_office_status: { in: ['APPROVED', 'DITERIMA', 'approved', 'diterima'] }
            }
        });

        if (existingOutOfOffice) {
            return response(400, null, "hari ini adalah jadwal dinas", res);
        }

        const now = new Date();
        const jakartaHour = Number(new Intl.DateTimeFormat('en-US', {
            timeZone: 'Asia/Jakarta',
            hour: 'numeric',
            hour12: false
        }).format(now));

        let status = attendance_status;
        if (!status) {
            if (jakartaHour >= 9) {
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
        const jakartaHour = Number(new Intl.DateTimeFormat('en-US', {
            timeZone: 'Asia/Jakarta',
            hour: 'numeric',
            hour12: false
        }).format(now));

        const todayStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(now);
        if (dateStr === todayStr && jakartaHour < 17) {
            return response(400, null, "Tidak dapat check out sebelum jam pulang", res);
        }

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