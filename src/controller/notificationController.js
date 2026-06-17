const prisma = require('../utils/prisma')
const response = require('../../response')

const getAllNotification = async (req, res, next) => {
    try {
        const notifications = await prisma.notification.findMany({
            orderBy: { created_at: 'desc' },
            select: {
                notification_id: true,
                notification_title: true,
                notification_desc: true,
                is_read: true,
                created_at: true,
            }
        })

        return response(200, { notifications: notifications }, 'Get All Notification Success', res)
    } catch (error) {
        return next(error)
    }
}

const getNotificationBasic = async (req, res, next) => {
    const notificationId = Number(req.params.notificationId)

    try {
        const notif = await prisma.notification.findUnique({
            where: { notification_id: notificationId },
        })

        if (!notif) {
            return response(404, null, 'Notification Not Found', res)
        }

        const totalUnread = await prisma.notification.count({
            where: {
                user_id: notif.user_id,
                is_read: false
            }
        });

        const result = {
            notification_id: notif.notification_id,
            is_read: notif.is_read,
            total_unread: totalUnread
        };

        return response(200, { notificationBasic: result }, 'Get Notification Basic Success', res)
    } catch (error) {
        return next(error)
    }
}

const getHistoryNotification = async (req, res, next) => {
    const userId = Number(req.params.id)

    try {
        const notifications = await prisma.notification.findMany({
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
        const notification = await prisma.notification.findUnique({
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
    const { user_id, notification_title, notification_desc, is_read } = req.body

    try {
        const targetUserId = Number(user_id) || Number(req.userData?.user_id);
        if (!targetUserId) {
            return response(401, null, "Unauthorized or Missing User ID", res);
        }

        if (!notification_title || !notification_desc) {
            return response(400, null, 'Missing Required Field', res)
        }

        const data = {
            user_id: targetUserId,
            notification_title,
            notification_desc,
            is_read: typeof is_read === 'boolean' ? is_read : (is_read === 'true' || is_read === true),
        }

        const created = await prisma.notification.create({ data })

        const result = {
            user_id: created.user_id,
            notification_title: created.notification_title,
            notification_desc: created.notification_desc,
            is_read: created.is_read
        }

        return response(201, { notificationCreated: result }, 'Create Notification Success', res)
    } catch (error) {
        return next(error)
    }
}

const readNotification = async (req, res, next) => {
    const id = Number(req.params.id)
    const { is_read } = req.body

    try {
        const existing = await prisma.notification.findUnique({
            where: { notification_id: id },
        })

        if (!existing) {
            return response(404, null, 'Notification Not Found', res)
        }

        const updated = await prisma.notification.update({
            where: { notification_id: id },
            data: {
                is_read: typeof is_read === 'boolean' ? is_read : true
            }
        })

        const result = {
            notification_id: updated.notification_id,
            is_read: updated.is_read
        }

        return response(200, { notificationRead: result }, 'Read Notification Success', res)
    } catch (error) {
        return next(error)
    }
}

const updateNotification = async (req, res, next) => {
    const id = Number(req.params.id)
    const { user_id, notification_title, notification_desc, is_read } = req.body

    try {
        const existing = await prisma.notification.findUnique({
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

        const updated = await prisma.notification.update({
            where: { notification_id: id },
            data,
        })

        return response( 200, {notificationUpdated: updated}, 'Update Notification Success', res)
    } catch (error) {
        return next(error)
    }
}

const updateNotificationPut = async (req, res, next) => {
    const notificationId = Number(req.params.notificationId)
    const { notification_title, notification_desc, is_read } = req.body

    try {
        const existing = await prisma.notification.findUnique({
            where: { notification_id: notificationId },
        })

        if (!existing) {
            return response(404, null, 'Notification Not Found', res)
        }

        const data = {}
        if (notification_title !== undefined) data.notification_title = notification_title
        if (notification_desc !== undefined) data.notification_desc = notification_desc
        if (is_read !== undefined) data.is_read = typeof is_read === 'boolean' ? is_read : (is_read === 'true' || is_read === true)

        const updated = await prisma.notification.update({
            where: { notification_id: notificationId },
            data,
        })

        const result = {
            notification_title: updated.notification_title,
            notification_desc: updated.notification_desc,
            is_read: updated.is_read
        }

        return response(200, { notificationUpdated: result }, 'Update Notification Success', res)
    } catch (error) {
        return next(error)
    }
}

const deleteNotification = async (req, res, next) => {
    const id = Number(req.params.notificationId)

    try {
        const existing = await prisma.notification.findUnique({
            where: { notification_id: id },
            select: { notification_id: true },
        })

        if (!existing) {
            return response(404, null, 'Notification Not Found', res)
        }

        await prisma.notification.delete({
            where: { notification_id: id },
        })

        return response(200, {notificationId: id}, 'Delete Notification Success', res)
    } catch (error) {
        return next(error)
    }
}

module.exports = {
    getAllNotification,
    getNotificationBasic,
    getHistoryNotification,
    getNotificationDetail,
    createNewNotification,
    readNotification,
    updateNotification,
    updateNotificationPut,
    deleteNotification,
}