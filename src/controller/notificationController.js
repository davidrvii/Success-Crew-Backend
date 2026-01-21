const prisma = require('../utils/prisma')
const response = require('../../response')

const getAllNotification = async (req, res, next) => {
    try {
        const notifications = await prisma.notifications.findMany({
            orderBy: { created_at: 'desc' },
        })

        return response(200, {notifications: notifications}, 'Get All Notification Success', res)
    } catch (error) {
        return next(error)
    }
}

const getHistoryNotification = async (req, res, next) => {
    const userId = Number(req.params.id)

    try {
        const notifications = await prisma.notifications.findMany({
            where: { user_id: userId },
            orderBy: { created_at: 'desc' },
        })

        return response( 200, {notificationsHistory: notifications}, 'Get History Notification Success', res)
    } catch (error) {
        return next(error)
    }
}

const getNotificationDetail = async (req, res, next) => {
    const id = Number(req.params.id)

    try {
        const notification = await prisma.notifications.findUnique({
            where: { notification_id: id },
        })

        if (!notification) {
            return response(404, null, 'Notification Not Found', res)
        }

        return response(200, {notificationDetail: notification}, 'Get Notification Detail Success', res)
    } catch (error) {
        return next(error)
    }
}

const createNewNotification = async (req, res, next) => {
    const {notification_title, notification_desc, is_read } = req.body

    try {
        const userId = Number(req.userData?.user_id);
        if (!userId) {
            return response(401, null, "Unauthorized", res);
        }

        if (!notification_title || !notification_desc) {
            return response(400, null, 'Missing Required Field', res)
        }

        const data = {
            user_id: userId,
            notification_title,
            notification_desc,
            is_read: typeof is_read === 'boolean' ? is_read : false,
        }

        const created = await prisma.notifications.create({ data })

        return response(
            201, {notificationCreated: created}, 'Create Notification Success', res)
    } catch (error) {
        return next(error)
    }
}

const updateNotification = async (req, res, next) => {
    const id = Number(req.params.id)
    const { user_id, notification_title, notification_desc, is_read } = req.body

    try {
        const existing = await prisma.notifications.findUnique({
            where: { notification_id: id },
        })

        if (!existing) {
            return response(404, null, 'Notification Not Found', res)
        }

        const data = {}

        if (user_id) data.user_id = Number(user_id)
        if (notification_title) data.notification_title = notification_title
        if (notification_desc) data.notification_desc = notification_desc
        if (typeof is_read === 'boolean') data.is_read = is_read

        const updated = await prisma.notifications.update({
            where: { notification_id: id },
            data,
        })

        return response( 200, {notificationUpdated: updated}, 'Update Notification Success', res)
    } catch (error) {
        return next(error)
    }
}

const deleteNotification = async (req, res, next) => {
    const id = Number(req.params.id)

    try {
        const existing = await prisma.notifications.findUnique({
            where: { notification_id: id },
            select: { notification_id: true },
        })

        if (!existing) {
            return response(404, null, 'Notification Not Found', res)
        }

        await prisma.notifications.delete({
            where: { notification_id: id },
        })

        return response(200, {notificationId: id}, 'Delete Notification Success', res)
    } catch (error) {
        return next(error)
    }
}

module.exports = {
    getAllNotification,
    getHistoryNotification,
    getNotificationDetail,
    createNewNotification,
    updateNotification,
    deleteNotification,
}