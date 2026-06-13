const prisma = require('../utils/prisma')
const response = require('../../response')

const getAllAttendance = async (req, res, next) => {
    try {
        const usersWithHistory = await prisma.users.findMany({
            include: {
                attendance: {
                    orderBy: { attendance_date: 'desc' },
                    include: {
                        overtimes: true,
                    },
                },
                leaves: {
                    orderBy: { leave_date: 'desc' },
                },
            },
        })

        const result = usersWithHistory.map((u) => ({
            user_id: u.user_id,
            user_name: u.user_name,
            user_email: u.user_email,
            attendances: u.attendance.map((a) => ({
                attendance_id: a.attendance_id,
                attendance_status: a.attendance_status,
                attendance_in: a.attendance_in,
                attendance_out: a.attendance_out,
                attendance_desc: a.attendance_desc,
                attendance_date: a.attendance_date,
                created_at: a.created_at,
                updated_at: a.updated_at,
                overtimes: (a.overtimes || []).map((o) => ({
                    overtime_id: o.overtime_id,
                    overtime_desc: o.overtime_desc,
                    overtime_date: o.overtime_date,
                    overtime_start: o.overtime_start,
                    overtime_end: o.overtime_end,
                    overtime_status: o.overtime_status,
                    created_at: o.created_at,
                    updated_at: o.updated_at,
                })),
            })),
            leaves: u.leaves.map((l) => ({
                leave_id: l.leave_id,
                leave_title: l.leave_title,
                leave_desc: l.leave_desc,
                leave_date: l.leave_date,
                leave_status: l.leave_status,
                created_at: l.created_at,
                updated_at: l.updated_at,
            })),
        }))

        return response(200, { usersAttendanceHistory: result }, 'Get All Attendance Success', res)
    } catch (error) {
        return next(error)
    }
}

const getCrewAttendance = async (req, res, next) => {
    const userId = Number(req.params.id)

    try {
        const userWithHistory = await prisma.users.findUnique({
            where: { user_id: userId },
            include: {
                attendance: {
                    orderBy: { attendance_date: 'desc' },
                    include: {
                        overtimes: {
                            select: {
                                overtime_id: true,
                                overtime_start: true,
                                overtime_end: true,
                            },
                        },
                    },
                },
                leaves: {
                    orderBy: { leave_date: 'desc' },
                },
            },
        })

        if (!userWithHistory) {
            return response(404, null, 'User Not Found', res)
        }

        const result = {
            user_id: userWithHistory.user_id,
            user_name: userWithHistory.user_name,
            user_email: userWithHistory.user_email,
            attendances: userWithHistory.attendance.map((a) => ({
                attendance_id: a.attendance_id,
                attendance_status: a.attendance_status,
                attendance_in: a.attendance_in,
                attendance_out: a.attendance_out,
                attendance_desc: a.attendance_desc,
                attendance_date: a.attendance_date,
                created_at: a.created_at,
                updated_at: a.updated_at,
                overtimes: a.overtimes || [],
            })),
            leaves: userWithHistory.leaves.map((l) => ({
                leave_id: l.leave_id,
                leave_title: l.leave_title,
                leave_desc: l.leave_desc,
                leave_date: l.leave_date,
                leave_status: l.leave_status,
                created_at: l.created_at,
                updated_at: l.updated_at,
            })),
        }

        return response(200, { crewAttendanceHistory: result }, 'Get Crew Attendance Success', res)
    } catch (error) {
        return next(error)
    }
}

const getAttendanceDetail = async (req, res, next) => {
    const id = Number(req.params.id)

    try {
        const a = await prisma.attendance.findUnique({
            where: { attendance_id: id },
            include: {
                overtimes: true,
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
            attendance_desc: a.attendance_desc,
            attendance_date: a.attendance_date,
            created_at: a.created_at,
            updated_at: a.updated_at,
            overtimes: (a.overtimes || []).map((o) => ({
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
    const {
        attendance_status,
        attendance_in,
        attendance_date,
    } = req.body

    try {
        const userId = Number(req.userData?.user_id);
        if (!userId) {
            return response(401, null, "Unauthorized", res);
        }

        if (!attendance_date) {
            return response(400, null, 'Missing Required Field: attendance_date', res)
        }

        const created = await prisma.attendance.create({
            data: {
                user_id: userId,
                attendance_status: attendance_status || "Tidak Hadir",
                attendance_in: attendance_in || null,
                attendance_date,
            },
        })

        return response(201, {attendanceIn: created}, 'Create Attendance (Check-in) Success', res)
    } catch (error) {
        if (error.code === "P2002") {
            return response(409, {}, "You've Already Check In Today", res);
        }
        return next(error)
    }
}

const updateAttendance = async (req, res, next) => {
    const id = Number(req.params.id)
    const { attendance_out, attendance_in, attendance_status } = req.body

    try {
        const existing = await prisma.attendance.findUnique({
            where: { attendance_id: id },
        })

        if (!existing) {
            return response(404, null, 'Attendance Not Found', res)
        }

        const dataToUpdate = {};
        if (attendance_out !== undefined) {
            dataToUpdate.attendance_out = attendance_out;
        }
        if (attendance_in !== undefined) {
            dataToUpdate.attendance_in = attendance_in;
        }
        if (attendance_status !== undefined) {
            dataToUpdate.attendance_status = attendance_status;
        }

        if (Object.keys(dataToUpdate).length === 0) {
            return response(400, null, 'No fields to update provided', res)
        }

        const updated = await prisma.attendance.update({
            where: { attendance_id: id },
            data: dataToUpdate,
        })

        return response(200, {attendanceOut: updated}, 'Update Attendance (Check-out) Success', res)
    } catch (error) {
        return next(error)
    }
}

const deleteAttendance = async (req, res, next) => {
    const id = Number(req.params.id)

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
    getCrewAttendance,
    getAttendanceDetail,
    createNewAttendance,
    updateAttendance,
    deleteAttendance,
}