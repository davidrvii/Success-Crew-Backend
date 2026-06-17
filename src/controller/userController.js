const prisma = require('../utils/prisma')
const { hashPassword, comparedPassword } = require('../utils/bcrypt')
const { generateToken } = require('../utils/jwt')
const response = require('../../response')

const getAllUser = async (req, res, next) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                user_id: true,
                user_name: true,
                user_email: true,
                user_photo: true,
                role: {
                    select: {
                        role_name: true,
                    },
                },
                office: {
                    select: {
                        office_name: true,
                    },
                },
                created_at: true,
                updated_at: true
            },
            orderBy: {created_at: 'desc'},
        });

        const result = users.map((u) => ({
            user_id: u.user_id,
            user_name: u.user_name,
            user_email: u.user_email,
            user_photo: u.user_photo,
            role_name: u.role?.role_name ?? null,
            office_name: u.office?.office_name ?? null,
            created_at: u.created_at,
            updated_at: u.updated_at,
        }));

        return response(200, {users: result}, 'Get All Users Success', res)
    } catch(error) {
        return next(error)
    }
}

const getUserDetail = async (req, res, next) => {
    const id = Number(req.params.id)

    try {
        const user = await prisma.user.findUnique({
            where: { user_id: id },
            select: {
                user_id: true,
                office_id: true,
                role_id: true,
                user_name: true,
                user_email: true,
                user_photo: true,
                user_phone: true,
                user_birth: true,
                start_work: true,
                end_work: true,
                crew_status: true,
                contract_status: true,
                role: {
                    select: {
                        role_name: true,
                    },
                },
                office: {
                    select: {
                        office_name: true,
                    },
                },
                created_at: true,
                updated_at: true,
            },
        })

        if (!user) {
            return response(404, null, 'User Not Found', res)
        }

        const result = {
            user_id: user.user_id,
            office_id: user.office_id,
            role_id: user.role_id,
            user_name: user.user_name,
            user_email: user.user_email,
            user_photo: user.user_photo,
            user_phone: user.user_phone,
            user_birth: user.user_birth,
            start_work: user.start_work,
            end_work: user.end_work,
            crew_status: user.crew_status,
            contract_status: user.contract_status,
            role_name: user.role?.role_name ?? null,
            office_name: user.office?.office_name ?? null,
            created_at: user.created_at,
            updated_at: user.updated_at,
        };

        return response(200, { userDetail: result }, 'Get User Detail Success', res)
    } catch (error) {
        return next(error)
    }
}

const getUserBasic = async (req, res, next) => {
    const id = Number(req.params.id)

    try {
        const user = await prisma.user.findUnique({
            where: { user_id: id },
            select: {
                user_id: true,
                user_name: true,
                user_photo: true,
                role: {
                    select: {
                        role_name: true,
                    },
                },
            },
        })

        if (!user) {
            return response(404, null, 'User Not Found', res)
        }

        const result = {
            user_id: user.user_id,
            user_name: user.user_name,
            user_photo: user.user_photo,
            role_name: user.role?.role_name ?? null,
        }

        return response(200, { userBasic: result }, 'Get User Basic Success', res)
    } catch (error) {
        return next(error)
    }
}

const userRegister = async (req, res, next) => {
    const { 
        office_id, 
        role_id, 
        user_name, 
        user_email, 
        user_password,
        user_phone,
        user_birth,
        start_work,
        end_work,
        crew_status,
        contract_status
    } = req.body;

    try {
        const existing = await prisma.user.findUnique({
            where: { user_email },
        });

        if (existing) {
            return response(400, null, 'Email Already Registered', res);
        }

        const hashed = await hashPassword(user_password);

        const newUser = await prisma.user.create({
            data: {
                office_id: Number(office_id),
                role_id: Number(role_id),
                user_name,
                user_email,
                user_password: hashed,
                user_phone: user_phone || null,
                user_birth: user_birth ? new Date(user_birth) : null,
                start_work: start_work ? new Date(start_work) : null,
                end_work: end_work ? new Date(end_work) : null,
                crew_status: crew_status || null,
                contract_status: contract_status || null,
            },
            select: {
                user_id: true,
                office_id: true,
                role_id: true,
                user_name: true,
                user_email: true,
                user_phone: true,
                user_birth: true,
                start_work: true,
                end_work: true,
                crew_status: true,
                contract_status: true,
                created_at: true,
            },
        });

        return response(201, { userRegistered: newUser }, 'Register User Success', res);
    } catch (error) {
        return next(error)
    }
}

const userLogin = async (req, res, next) => {
    const { email, password } = req.body

    try {
        const user = await prisma.user.findUnique({
            where: { user_email: email },
            select: {
                user_id: true,
                user_name: true,
                user_email: true,
                user_password: true,
                role: {
                    select: {
                        role_id: true,
                        role_name: true,
                    },
                },
                office: {
                    select: {
                        office_id: true,
                        office_name: true,
                    },
                },
            },
        })

        if (!user) {
            return response(401, { loginResult: null }, 'Invalid Email or Password', res)
        }

        const isPasswordMatch = await comparedPassword(password, user.user_password)
        if (!isPasswordMatch) {
            return response(401, { loginResult: null }, 'Invalid Email or Password', res)
        }

        const tokenPayload = {
            id: user.user_id,
            email: user.user_email,
            role_id: user.role?.role_id,
        }

        const token = generateToken(tokenPayload)

        const loginResult = {
            user_id: user.user_id,
            user_name: user.user_name,
            user_email: user.user_email,
            role_id: user.role?.role_id ?? null,
            role_name: user.role?.role_name ?? null,
            office_id: user.office?.office_id ?? null,
            office_name: user.office?.office_name ?? null,
            token,
        }

        return response(200, { loginResult: loginResult }, 'Login Success', res)
    } catch (error) {
        return next(error)
    }
}

const updateUser = async (req, res, next) => {
    const id = Number(req.params.id)
    const { 
        office_id, 
        role_id, 
        user_name, 
        user_email, 
        user_password,
        user_phone,
        user_birth,
        start_work,
        end_work,
        crew_status,
        contract_status
    } = req.body
    const file = req.file

    try {
        const existing = await prisma.user.findUnique({
            where: { user_id: id },
        })

        if (!existing) {
            return response(404, null, 'User Not Found', res)
        }

        const data = {}

        if (office_id) data.office_id = Number(office_id)
        if (role_id) data.role_id = Number(role_id)
        if (user_name) data.user_name = user_name
        if (user_email) data.user_email = user_email
        if (user_phone !== undefined) data.user_phone = user_phone
        if (user_birth !== undefined) data.user_birth = user_birth ? new Date(user_birth) : null
        if (start_work !== undefined) data.start_work = start_work ? new Date(start_work) : null
        if (end_work !== undefined) data.end_work = end_work ? new Date(end_work) : null
        if (crew_status !== undefined) data.crew_status = crew_status
        if (contract_status !== undefined) data.contract_status = contract_status

        if (user_password) {
            const hashed = await hashPassword(user_password)
            data.user_password = hashed
        }

        if (file) {
            data.user_photo = `/uploads/images/${file.filename}`
        }

        const updated = await prisma.user.update({
            where: { user_id: id },
            data,
            select: {
                user_id: true,
                office_id: true,
                role_id: true,
                user_name: true,
                user_email: true,
                user_photo: true,
                user_phone: true,
                user_birth: true,
                start_work: true,
                end_work: true,
                crew_status: true,
                contract_status: true,
                role: {
                    select: {
                        role_name: true,
                    },
                },
                office: {
                    select: {
                        office_name: true,
                    },
                },
                updated_at: true,
            },
        })

        const result = {
            user_id: updated.user_id,
            office_id: updated.office_id,
            role_id: updated.role_id,
            user_name: updated.user_name,
            user_email: updated.user_email,
            user_photo: updated.user_photo,
            user_phone: updated.user_phone,
            user_birth: updated.user_birth,
            start_work: updated.start_work,
            end_work: updated.end_work,
            crew_status: updated.crew_status,
            contract_status: updated.contract_status,
            role_name: updated.role?.role_name ?? null,
            office_name: updated.office?.office_name ?? null,
            updated_at: updated.updated_at,
        }

        return response(200, { user: result }, 'Update User Success', res)
    } catch (error) {
        return next(error)
    }
}

const deleteUser = async (req, res, next) => {
    const id = Number(req.params.id)

    try {
        const existing = await prisma.user.findUnique({
            where: { user_id: id },
            select: { user_id: true },
        })

        if (!existing) {
            return response(404, null, 'User Not Found', res)
        }

        await prisma.user.delete({
            where: { user_id: id },
        })

        return response(200, { userId: id }, 'DELETE User Success', res)
    } catch (error) {
        return next(error)
    }
}

module.exports = {
    getAllUser,
    getUserDetail,
    getUserBasic,
    userRegister,
    userLogin,
    updateUser,
    deleteUser,
}