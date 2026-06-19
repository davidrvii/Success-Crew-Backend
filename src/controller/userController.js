const prisma = require('../utils/prisma')
const { hashPassword, comparedPassword } = require('../utils/bcrypt')
const { generateToken } = require('../utils/jwt')
const response = require('../../response')

const getAllUser = async (req, res, next) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                user_id: true,
                user_photo: true,
                user_name: true,
                crew_status: true,
                contract_status: true,
                user_email: true,
                user_phone: true,
                user_birth: true,
                start_work: true,
                end_work: true,
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
            },
            orderBy: { created_at: 'desc' },
        });

        const result = users.map((u) => ({
            user_id: u.user_id,
            user_photo: u.user_photo,
            user_name: u.user_name,
            crew_status: u.crew_status,
            contract_status: u.contract_status,
            user_email: u.user_email,
            user_phone: u.user_phone,
            user_birth: u.user_birth,
            start_work: u.start_work,
            end_work: u.end_work,
            role_name: u.role?.role_name ?? null,
            office_name: u.office?.office_name ?? null,
        }));

        return response(200, { users: result }, 'Get All Users Success', res)
    } catch (error) {
        return next(error)
    }
}

const getAllCrew = async (req, res, next) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                user_id: true,
                user_photo: true,
                user_name: true,
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
            },
            orderBy: { created_at: 'desc' },
        });

        const result = users.map((u) => ({
            user_id: u.user_id,
            user_photo: u.user_photo,
            user_name: u.user_name,
            role_name: u.role?.role_name ?? null,
            office_name: u.office?.office_name ?? null,
        }));

        return response(200, { crew: result }, 'Get All Crews Success', res)
    } catch (error) {
        return next(error)
    }
}

const getUserBasic = async (req, res, next) => {
    const id = Number(req.params.userId)

    try {
        const todayStr = new Date().toLocaleDateString('en-CA');
        const todayDate = new Date(todayStr);

        const user = await prisma.user.findUnique({
            where: { user_id: id },
            select: {
                user_id: true,
                user_name: true,
                role: {
                    select: {
                        role_name: true,
                    },
                },
                attendance: {
                    where: {
                        attendance_date: todayDate,
                    },
                    select: {
                        attendance_in: true,
                    },
                },
            },
        })

        if (!user) {
            return response(404, null, 'User Not Found', res)
        }

        const checkInTime = user.attendance[0]?.attendance_in ?? null;

        const result = {
            user_id: user.user_id,
            user_name: user.user_name,
            role_name: user.role?.role_name ?? null,
            attedance_in: checkInTime,
            attendance_in: checkInTime,
        }

        return response(200, { userBasic: result }, 'Get User Basic Success', res)
    } catch (error) {
        return next(error)
    }
}

const getCrewUserDetail = async (req, res, next) => {
    const userId = Number(req.params.userId)

    try {
        const user = await prisma.user.findUnique({
            where: { user_id: userId },
            select: {
                user_id: true,
                user_photo: true,
                user_name: true,
                crew_status: true,
                contract_status: true,
                user_email: true,
                user_phone: true,
                user_birth: true,
                start_work: true,
                end_work: true,
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
                attendance: {
                    select: {
                        attendance_id: true,
                        attendance_status: true,
                        attendance_in: true,
                        attendance_out: true,
                        attendance_date: true,
                    },
                    orderBy: { attendance_date: 'desc' },
                },
                leave: {
                    select: {
                        leave_id: true,
                        leave_desc: true,
                        leave_start: true,
                        leave_end: true,
                        leave_status: true,
                    },
                    orderBy: { leave_start: 'desc' },
                },
                overtime: {
                    select: {
                        overtime_id: true,
                        overtime_desc: true,
                        overtime_date: true,
                        overtime_start: true,
                        overtime_end: true,
                        overtime_status: true,
                    },
                    orderBy: { overtime_start: 'desc' },
                },
                out_of_office: {
                    select: {
                        out_of_office_id: true,
                        out_of_office_desc: true,
                        out_of_office_start: true,
                        out_of_office_end: true,
                        out_of_office_status: true,
                    },
                    orderBy: { out_of_office_start: 'desc' },
                },
            },
        })

        if (!user) {
            return response(404, null, 'User Not Found', res)
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
            user_id: user.user_id,
            user_photo: user.user_photo,
            user_name: user.user_name,
            role_name: user.role?.role_name ?? null,
            crew_status: user.crew_status,
            contract_status: user.contract_status,
            user_email: user.user_email,
            user_phone: user.user_phone,
            user_birth: user.user_birth,
            start_work: user.start_work,
            end_work: user.end_work,
            office_name: user.office?.office_name ?? null,
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

        return response(200, { userCrew: result }, 'Get Crew User Detail Success', res)
    } catch (error) {
        return next(error)
    }
}

const getUserDetail = async (req, res, next) => {
    const id = Number(req.params.userId)

    try {
        const user = await prisma.user.findUnique({
            where: { user_id: id },
            select: {
                user_id: true,
                user_photo: true,
                user_name: true,
                crew_status: true,
                contract_status: true,
                user_email: true,
                user_phone: true,
                user_birth: true,
                start_work: true,
                end_work: true,
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
            },
        })

        if (!user) {
            return response(404, null, 'User Not Found', res)
        }

        const result = {
            user_id: user.user_id,
            user_photo: user.user_photo,
            user_name: user.user_name,
            crew_status: user.crew_status,
            contract_status: user.contract_status,
            user_email: user.user_email,
            user_phone: user.user_phone,
            user_birth: user.user_birth,
            start_work: user.start_work,
            end_work: user.end_work,
            role_name: user.role?.role_name ?? null,
            office_name: user.office?.office_name ?? null,
        };

        return response(200, { userDetail: result }, 'Get User Detail Success', res)
    } catch (error) {
        return next(error)
    }
}

const createCrewUser = async (req, res, next) => {
    const {
        user_name,
        crew_status,
        contract_status,
        user_email,
        user_phone,
        user_birth,
        start_work,
        end_work,
        role_name,
        office_name,
        user_password,
    } = req.body;

    try {
        const pass = user_password || password;
        if (!pass) {
            return response(400, null, 'Missing Required Field: password is required', res);
        }

        const existing = await prisma.user.findUnique({
            where: { user_email }
        });

        if (existing) {
            return response(400, null, 'Email Already Registered', res);
        }

        let dbRole = await prisma.role.findFirst({
            where: {
                role_name: role_name || 'Crew',
            }
        });
        if (!dbRole) {
            dbRole = await prisma.role.create({
                data: {
                    role_name: role_name || 'Crew',
                }
            });
        }

        let dbOffice = await prisma.office.findFirst({
            where: {
                office_name: office_name || 'Main Office'
            }
        });
        if (!dbOffice) {
            dbOffice = await prisma.office.create({
                data: {
                    office_name: office_name || 'Main Office',
                    office_address: office_name || 'Main Office Address'
                }
            });
        }

        const hashed = await hashPassword(pass);

        const newUser = await prisma.user.create({
            data: {
                user_name,
                crew_status,
                contract_status,
                user_email,
                user_phone: user_phone || null,
                user_birth: user_birth ? new Date(user_birth) : null,
                start_work: start_work ? new Date(start_work) : null,
                end_work: end_work ? new Date(end_work) : null,
                user_password: hashed,
                role_id: dbRole.role_id,
                office_id: dbOffice.office_id
            },
            select: {
                user_id: true,
                user_name: true,
                crew_status: true,
                contract_status: true,
                user_email: true,
                user_phone: true,
                user_birth: true,
                start_work: true,
                end_work: true,
                role: {
                    select: {
                        role_name: true
                    }
                },
                office: {
                    select: {
                        office_name: true
                    }
                }
            }
        });

        const result = {
            user_id: newUser.user_id,
            user_name: newUser.user_name,
            crew_status: newUser.crew_status,
            contract_status: newUser.contract_status,
            user_email: newUser.user_email,
            user_phone: newUser.user_phone,
            user_birth: newUser.user_birth,
            start_work: newUser.start_work,
            end_work: newUser.end_work,
            role_name: newUser.role?.role_name ?? null,
            office_name: newUser.office?.office_name ?? null
        };

        return response(201, { crewAdded: result }, 'Add Crew Success', res);
    } catch (error) {
        return next(error);
    }
}

const updateCrewUser = async (req, res, next) => {
    const userId = Number(req.params.userId);
    const {
        user_name,
        crew_status,
        contract_status,
        user_email,
        user_phone,
        user_birth,
        start_work,
        end_work,
        role_name,
        office_name
    } = req.body;

    try {
        const existing = await prisma.user.findUnique({
            where: { user_id: userId }
        });

        if (!existing) {
            return response(404, null, 'User Not Found', res);
        }

        const data = {};
        if (user_name !== undefined) data.user_name = user_name;
        if (crew_status !== undefined) data.crew_status = crew_status;
        if (contract_status !== undefined) data.contract_status = contract_status;
        if (user_email !== undefined) data.user_email = user_email;
        if (user_phone !== undefined) data.user_phone = user_phone;
        if (user_birth !== undefined) data.user_birth = user_birth ? new Date(user_birth) : null;
        if (start_work !== undefined) data.start_work = start_work ? new Date(start_work) : null;
        if (end_work !== undefined) data.end_work = end_work ? new Date(end_work) : null;

        if (role_name !== undefined) {
            let dbRole = await prisma.role.findFirst({
                where: { role_name }
            });
            if (!dbRole) {
                dbRole = await prisma.role.create({
                    data: { role_name }
                });
            }
            data.role_id = dbRole.role_id;
        }

        if (office_name !== undefined) {
            let dbOffice = await prisma.office.findFirst({
                where: { office_name }
            });
            if (!dbOffice) {
                dbOffice = await prisma.office.create({
                    data: { office_name, office_address: office_name }
                });
            }
            data.office_id = dbOffice.office_id;
        }

        const updated = await prisma.user.update({
            where: { user_id: userId },
            data,
            select: {
                user_id: true,
                user_name: true,
                crew_status: true,
                contract_status: true,
                user_email: true,
                user_phone: true,
                user_birth: true,
                start_work: true,
                end_work: true,
                role: {
                    select: {
                        role_name: true
                    }
                },
                office: {
                    select: {
                        office_name: true
                    }
                }
            }
        });

        const result = {
            user_id: updated.user_id,
            user_name: updated.user_name,
            crew_status: updated.crew_status,
            contract_status: updated.contract_status,
            user_email: updated.user_email,
            user_phone: updated.user_phone,
            user_birth: updated.user_birth,
            start_work: updated.start_work,
            end_work: updated.end_work,
            role_name: updated.role?.role_name ?? null,
            office_name: updated.office?.office_name ?? null
        };

        return response(200, { crewUpdated: result }, 'Update Crew Success', res);
    } catch (error) {
        return next(error);
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
    const id = Number(req.params.userId)
    const {
        user_name,
        user_email,
        user_phone,
        user_birth
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
        if (user_name !== undefined) data.user_name = user_name
        if (user_email !== undefined) data.user_email = user_email
        if (user_phone !== undefined) data.user_phone = user_phone
        if (user_birth !== undefined) data.user_birth = user_birth ? new Date(user_birth) : null

        if (file) {
            data.user_photo = `/uploads/images/${file.filename}`
        }

        const updated = await prisma.user.update({
            where: { user_id: id },
            data,
            select: {
                user_id: true,
                user_photo: true,
                user_name: true,
                user_email: true,
                user_phone: true,
                user_birth: true,
            },
        })

        return response(200, { user: updated }, 'Update User Success', res)
    } catch (error) {
        return next(error)
    }
}

const updateUserPut = async (req, res, next) => {
    const id = Number(req.params.userId)
    const {
        user_name,
        crew_status,
        contract_status,
        user_email,
        user_phone,
        user_birth,
        start_work,
        end_work
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
        if (user_name !== undefined) data.user_name = user_name
        if (crew_status !== undefined) data.crew_status = crew_status
        if (contract_status !== undefined) data.contract_status = contract_status
        if (user_email !== undefined) data.user_email = user_email
        if (user_phone !== undefined) data.user_phone = user_phone
        if (user_birth !== undefined) data.user_birth = user_birth ? new Date(user_birth) : null
        if (start_work !== undefined) data.start_work = start_work ? new Date(start_work) : null
        if (end_work !== undefined) data.end_work = end_work ? new Date(end_work) : null

        if (file) {
            data.user_photo = `/uploads/images/${file.filename}`
        }

        const updated = await prisma.user.update({
            where: { user_id: id },
            data,
            select: {
                user_id: true,
                user_photo: true,
                user_name: true,
                crew_status: true,
                contract_status: true,
                user_email: true,
                user_phone: true,
                user_birth: true,
                start_work: true,
                end_work: true,
            },
        })

        return response(200, { user: updated }, 'Update User (PUT) Success', res)
    } catch (error) {
        return next(error)
    }
}

const deleteUser = async (req, res, next) => {
    const id = Number(req.params.userId)

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
    getAllCrew,
    getUserBasic,
    getCrewUserDetail,
    getUserDetail,
    createCrewUser,
    updateCrewUser,
    userRegister,
    userLogin,
    updateUser,
    updateUserPut,
    deleteUser,
}