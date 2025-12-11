const prisma = require('../utils/prisma')
const response = require('../../response')

const getAllLeave = async (req, res) => {
    try {
        const leaves = await prisma.leaves.findMany({
            orderBy: { leave_date: 'desc' },
        })

        return response(200, {leaves: leaves}, 'Get All Leave Success', res)
    } catch (error) {
        response(500, {error: error}, 'Server Error', res)
        throw error
    }
}

const getCrewLeave = async (req, res) => {
    const userId = Number(req.params.id)

    try {
        const leaves = await prisma.leaves.findMany({
            where: { user_id: userId },
            orderBy: { leave_date: 'desc' },
        })

        return response(200, {crewLeaves: leaves}, 'Get Crew Leave Success', res)
    } catch (error) {
        response(500, {error: error}, 'Server Error', res)
        throw error
    }
}

const getLeaveDetail = async (req, res) => {
    const id = Number(req.params.id)

    try {
        const leave = await prisma.leaves.findUnique({
            where: { leave_id: id },
        })

        if (!leave) {
            return response(404, null, 'Leave Not Found', res)
        }

        return response(200, {leaveDetail: leave}, 'Get Leave Detail Success', res)
    } catch (error) {
        response(500, {error: error}, 'Server Error', res)
        throw error
    }
}

const createNewLeave = async (req, res) => {
    const {
        user_id,
        attendance_id,
        leave_title,
        leave_desc,
        leave_date,
        leave_status,
    } = req.body

    try {
        if (!user_id || !leave_title || !leave_date) {
            return response(400, null, 'Missing Required Field', res)
        }

        const data = {
            user_id: Number(user_id),
            leave_title,
            leave_desc: leave_desc || null,
            leave_date,
            leave_status: leave_status || 'PENDING',
        }

        if (attendance_id) {
            data.attendance_id = Number(attendance_id)
        }

        const created = await prisma.leaves.create({ data })

        return response(201, {newLeave: created}, 'Create Leave Success', res)
    } catch (error) {
        response(500, {error: error}, 'Server Error', res)
        throw error
    }
}

const updateLeave = async (req, res) => {
    const id = Number(req.params.id)
    const { leave_status } = req.body

    try {
        if (!leave_status) {
            return response(400, null, 'leave_status is required', res)
        }

        const existing = await prisma.leaves.findUnique({
            where: { leave_id: id },
        })

        if (!existing) {
            return response(404, null, 'Leave Not Found', res)
        }

        const updated = await prisma.leaves.update({
            where: { leave_id: id },
            data: {
                leave_status,
            },
        })

        return response(200, {updatedLeave: updated}, 'Update Leave Success', res)
    } catch (error) {
        response(500, {error: error}, 'Server Error', res)
        throw error
    }
}

const deleteLeave = async (req, res) => {
    const id = Number(req.params.id)

    try {
        const existing = await prisma.leaves.findUnique({
            where: { leave_id: id },
            select: { leave_id: true },
        })

        if (!existing) {
            return response(404, null, 'Leave Not Found', res)
        }

        await prisma.leaves.delete({
            where: { leave_id: id },
        })

        return response(200, {leaveId: id}, 'Delete Leave Success', res)
    } catch (error) {
        response(500, {error: error}, 'Server Error', res)
        throw error
    }
}

module.exports = {
    getAllLeave,
    getCrewLeave,
    getLeaveDetail,
    createNewLeave,
    updateLeave,
    deleteLeave,
}