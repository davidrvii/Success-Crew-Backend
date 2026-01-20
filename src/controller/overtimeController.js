const prisma = require('../utils/prisma')
const response = require('../../response')

const getAllOvertime = async (req, res) => {
    try {
        const overtimes = await prisma.overtimes.findMany({
            orderBy: { overtime_date: 'desc' },
        })

        return response(200, {overtimes: overtimes}, 'Get All Overtime Success', res)
    } catch (error) {
        response(500, {error: error}, 'Server Error', res)
        throw error
    }
}

const getCrewOvertime = async (req, res) => {
    const userId = Number(req.params.id)

    try {
        const overtimes = await prisma.overtimes.findMany({
            where: { user_id: userId },
            orderBy: { overtime_date: 'desc' },
        })

        return response( 200, {crewOvertimes: overtimes}, 'Get Crew Overtime Success', res)
    } catch (error) {
        response(500, {error: error}, 'Server Error', res)
        throw error
    }
}

const getOvertimeDetail = async (req, res) => {
    const id = Number(req.params.id)

    try {
        const overtime = await prisma.overtimes.findUnique({
            where: { overtime_id: id },
        })

        if (!overtime) {
            return response(404, null, 'Overtime Not Found', res)
        }

        return response(200, {overtimeDetail: overtime}, 'Get Overtime Detail Success', res)
    } catch (error) {
        response(500, {error: error}, 'Server Error', res)
        throw error
    }
}

const createNewOvertime = async (req, res) => {
    const {
        user_id,
        attendance_id,
        overtime_desc,
        overtime_date,
        overtime_start,
        overtime_end,
        overtime_status,
    } = req.body

    try {
        if (
            !user_id ||
            !attendance_id ||
            !overtime_date ||
            !overtime_start ||
            !overtime_end
        ) {
            return response(400, null, 'Missing Required Field', res)
        }
        
        if (!overtime_desc) {
            return response(400, {}, "Overtime description is required", res);
        }

        const data = {
            user_id: Number(user_id),
            attendance_id: Number(attendance_id),
            overtime_desc: overtime_desc || null,
            overtime_date,
            overtime_start,
            overtime_end,
            overtime_status: overtime_status || 'PENDING',
        }

        const created = await prisma.overtimes.create({ data })

        return response(201, {newOvertime: created}, 'Create Overtime Success', res)
    } catch (error) {
        response(500, {error: error}, 'Server Error', res)
        throw error
    }
}

const updateOvertime = async (req, res) => {
    const id = Number(req.params.id)
    const { overtime_status } = req.body

    try {
        if (!overtime_status) {
            return response(400, null, 'overtime_status is required', res)
        }

        const existing = await prisma.overtimes.findUnique({
            where: { overtime_id: id },
        })

        if (!existing) {
            return response(404, null, 'Overtime Not Found', res)
        }

        const updated = await prisma.overtimes.update({
            where: { overtime_id: id },
            data: {
                overtime_status,
            },
        })

        return response(200, {updatedOvertime: updated}, 'Update Overtime Status Success', res)
    } catch (error) {
        response(500, {error: error}, 'Server Error', res)
        throw error
    }
}

const deleteOvertime = async (req, res) => {
    const id = Number(req.params.id)

    try {
        const existing = await prisma.overtimes.findUnique({
            where: { overtime_id: id },
            select: { overtime_id: true },
        })

        if (!existing) {
            return response(404, null, 'Overtime Not Found', res)
        }

        await prisma.overtimes.delete({
            where: { overtime_id: id },
        })

        return response(200, {overtimeId: id}, 'Delete Overtime Success', res)
    } catch (error) {
        response(500, {error: error}, 'Server Error', res)
        throw error
    }
}

module.exports = {
    getAllOvertime,
    getCrewOvertime,
    getOvertimeDetail,
    createNewOvertime,
    updateOvertime,
    deleteOvertime,
}