const prisma = require('../utils/prisma')
const response = require('../../response')

const getAllOutOfOffice = async (req, res, next) => {
    try {
        const outOfOffices = await prisma.out_of_office.findMany({
            orderBy: { out_of_office_date: 'desc' },
        })

        const result = outOfOffices.map(o => ({
            outofoffice_id: o.out_of_office_id,
            outofoffice_desc: o.out_of_office_desc,
            outofoffice_date: o.out_of_office_date,
            outofoffice_status: o.out_of_office_status,
            out_of_office_id: o.out_of_office_id,
            out_of_office_desc: o.out_of_office_desc,
            out_of_office_date: o.out_of_office_date,
            out_of_office_status: o.out_of_office_status
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
                out_of_office_status: true
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
            out_of_office_status: o.out_of_office_status
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
                out_of_office_status: true
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
            total_unapproved: unapprovedCount
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
        user_id, 
        outofoffice_desc, 
        out_of_office_desc, 
        outofoffice_date, 
        out_of_office_date, 
        outofoffice_status, 
        out_of_office_status 
    } = req.body;

    try {
        const targetUserId = Number(user_id) || Number(req.userData?.user_id);
        if (!targetUserId) {
            return response(401, null, "Unauthorized or Missing User ID", res);
        }

        const desc = outofoffice_desc || out_of_office_desc;
        const dateVal = outofoffice_date || out_of_office_date;
        const statusVal = outofoffice_status || out_of_office_status || 'PENDING';

        if (!desc || !dateVal) {
            return response(400, null, 'Missing Required Field: desc and date are required', res);
        }

        const searchDate = new Date(dateVal);

        const existing = await prisma.out_of_office.findFirst({
            where: {
                user_id: targetUserId,
                out_of_office_date: searchDate
            }
        });

        if (existing) {
            return response(409, null, 'Out of office request already exists for this date', res);
        }

        const data = {
            user_id: targetUserId,
            out_of_office_desc: desc,
            out_of_office_date: searchDate,
            out_of_office_status: statusVal
        }

        const created = await prisma.out_of_office.create({ data })

        const result = {
            user_id: created.user_id,
            outofoffice_desc: created.out_of_office_desc,
            outofoffice_date: created.out_of_office_date,
            outofoffice_status: created.out_of_office_status,
            out_of_office_desc: created.out_of_office_desc,
            out_of_office_date: created.out_of_office_date,
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
    const { outofoffice_desc, out_of_office_desc, outofoffice_date, out_of_office_date, outofoffice_status, out_of_office_status } = req.body;

    try {
        const existing = await prisma.out_of_office.findUnique({
            where: { out_of_office_id: outOfOfficeId }
        });

        if (!existing) {
            return response(404, null, 'Out Of Office Record Not Found', res);
        }

        const desc = outofoffice_desc !== undefined ? outofoffice_desc : out_of_office_desc;
        const dateVal = outofoffice_date !== undefined ? outofoffice_date : out_of_office_date;
        const statusVal = outofoffice_status !== undefined ? outofoffice_status : out_of_office_status;

        const data = {};
        if (desc !== undefined) data.out_of_office_desc = desc;
        if (dateVal !== undefined) data.out_of_office_date = dateVal ? new Date(dateVal) : null;
        if (statusVal !== undefined) data.out_of_office_status = statusVal;

        if (statusVal && (statusVal.toUpperCase() === 'APPROVED' || statusVal.toUpperCase() === 'DITERIMA')) {
            const checkDate = dateVal ? new Date(dateVal) : existing.out_of_office_date;
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
                        attendance_status: 'Dinas Luar',
                        attendance_date: checkDate,
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

        const updated = await prisma.out_of_office.update({
            where: { out_of_office_id: outOfOfficeId },
            data
        });

        const result = {
            outofoffice_desc: updated.out_of_office_desc,
            outofoffice_date: updated.out_of_office_date,
            outofoffice_status: updated.out_of_office_status,
            out_of_office_desc: updated.out_of_office_desc,
            out_of_office_date: updated.out_of_office_date,
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
