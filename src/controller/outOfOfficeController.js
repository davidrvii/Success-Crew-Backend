const prisma = require('../utils/prisma')
const response = require('../../response')

const getAllOutOfOffice = async (req, res, next) => {
    try {
        const outOfOffices = await prisma.out_of_office.findMany({
            orderBy: { out_of_office_date: 'desc' },
        })

        return response(200, { outOfOffices }, 'Get All Out Of Office Success', res)
    } catch (error) {
        return next(error)
    }
}

const getCrewOutOfOffice = async (req, res, next) => {
    const userId = Number(req.params.id)

    try {
        const outOfOffices = await prisma.out_of_office.findMany({
            where: { user_id: userId },
            orderBy: { out_of_office_date: 'desc' },
        })

        return response(200, { crewOutOfOffices: outOfOffices }, 'Get Crew Out Of Office Success', res)
    } catch (error) {
        return next(error)
    }
}

const getOutOfOfficeDetail = async (req, res, next) => {
    const id = Number(req.params.id)

    try {
        const outOfOffice = await prisma.out_of_office.findUnique({
            where: { out_of_office_id: id },
        })

        if (!outOfOffice) {
            return response(404, null, 'Out Of Office Record Not Found', res)
        }

        return response(200, { outOfOfficeDetail: outOfOffice }, 'Get Out Of Office Detail Success', res)
    } catch (error) {
        return next(error)
    }
}

const createNewOutOfOffice = async (req, res, next) => {
    const {
        out_of_office_desc,
        out_of_office_date,
        out_of_office_status,
    } = req.body

    try {
        const userId = Number(req.userData?.user_id);
        if (!userId) {
            return response(401, null, "Unauthorized", res);
        }

        if (!out_of_office_desc || !out_of_office_date) {
            return response(400, null, 'Missing Required Field: out_of_office_desc and out_of_office_date are required', res)
        }

        const data = {
            user_id: userId,
            out_of_office_desc,
            out_of_office_date: new Date(out_of_office_date),
            out_of_office_status: out_of_office_status || 'PENDING',
        }

        const created = await prisma.out_of_office.create({ data })

        return response(201, { newOutOfOffice: created }, 'Create Out Of Office Success', res)
    } catch (error) {
        return next(error)
    }
}

const updateOutOfOffice = async (req, res, next) => {
    const id = Number(req.params.id)
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
            const existingAttendance = await prisma.attendance.findFirst({
                where: {
                    user_id: existing.user_id,
                    attendance_date: existing.out_of_office_date,
                }
            });

            if (!existingAttendance) {
                await prisma.attendance.create({
                    data: {
                        user_id: existing.user_id,
                        attendance_status: 'Dinas Luar',
                        attendance_date: existing.out_of_office_date,
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

        const updated = await prisma.out_of_office.update({
            where: { out_of_office_id: id },
            data: {
                out_of_office_status,
            },
        })

        return response(200, { updatedOutOfOffice: updated }, 'Update Out Of Office Success', res)
    } catch (error) {
        return next(error)
    }
}

const deleteOutOfOffice = async (req, res, next) => {
    const id = Number(req.params.id)

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
    getCrewOutOfOffice,
    getOutOfOfficeDetail,
    createNewOutOfOffice,
    updateOutOfOffice,
    deleteOutOfOffice,
}
