import { updateUser } from '@/services/user'
import { UpdateInputs } from '@/types'
import { yupResolver } from "@hookform/resolvers/yup"
import React, { useState, useContext, useEffect } from 'react'
import { CommonContext } from '@/context'
import { Helmet } from 'react-helmet'
import { Resolver, SubmitHandler, useForm } from "react-hook-form"
import * as yup from "yup"
import { BiLoaderAlt, BiSolidHide, BiSolidShow } from 'react-icons/bi'
import Sidebar from '@/components/Sidebar'

const Profile = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [showPasswords, setShowPasswords] = useState({ old: false, new: false })
    const { user } = useContext(CommonContext)

    const ProfileSchema = yup.object({
        firstName: yup.string().label("First name"),
        lastName: yup.string().label("Last name"),
        phoneNumber: yup.string().label("Phone number"),
        oldPassword: yup.string().label("Old Password"),
        newPassword: yup.string()
            .label("New Password")
    })

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<UpdateInputs>({
        resolver: yupResolver(ProfileSchema) as Resolver<UpdateInputs, any>,
        mode: "onTouched"
    })

    // Populate the form with user data when available
    useEffect(() => {
        if (user) {
            reset({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                phoneNumber: user.phoneNumber || '',
                oldPassword: '',
                newPassword: ''
            })
        }
    }, [user, reset])

    const onSubmit: SubmitHandler<UpdateInputs> = async (data) => {
        await updateUser({ setLoading, data })
    }

    return (
        <div className="w-full flex min-h-screen">
              <Sidebar />
            <Helmet>
                <title>Update Profile</title>
            </Helmet>
            <div className="justify-center  items-center m-10 mlg:mx-48 flex-1 flex-col">
                <div className="text-center">
                    <span className="text-2xl font-bold text-gray-800">Update Profile</span>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700">First Name</label>
                        <input
                            {...register("firstName")}
                              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName.message}</p>}
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">Last Name</label>
                        <input
                            {...register("lastName")}
                              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName.message}</p>}
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">Phone Number</label>
                        <input
                            {...register("phoneNumber")}
                              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        {errors.phoneNumber && <p className="text-sm text-red-500 mt-1">{errors.phoneNumber.message}</p>}
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">Old Password</label>
                        <div className="relative">
                            <input
                                type={showPasswords.old ? "text" : "password"}
                                {...register("oldPassword")}
                                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                            <button  className="absolute right-3 top-3 text-gray-500" type="button" onClick={() => setShowPasswords(p => ({ ...p, old: !p.old }))} >
                                {showPasswords.old ? <BiSolidShow /> : <BiSolidHide />}
                            </button>
                        </div>
                        {errors.oldPassword && <p className="text-sm text-red-500 mt-1">{errors.oldPassword.message}</p>}
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">New Password</label>
                        <div className="relative">
                            <input
                                type={showPasswords.new ? "text" : "password"}
                                {...register("newPassword")}
                                 className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                            <button  className="absolute right-3 top-3 text-gray-500" type="button" onClick={() => setShowPasswords(p => ({ ...p, new: !p.new }))}>
                                {showPasswords.new ? <BiSolidShow /> : <BiSolidHide />}
                            </button>
                        </div>
                        {errors.newPassword && <p className="text-sm text-red-500 mt-1">{errors.newPassword.message}</p>}
                    </div>

                    <button
                        disabled={loading}
                        type="submit"
                        className={`w-full py-3 rounded-lg text-white font-semibold transition duration-300 ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-sky-600 hover:bg-blue-700"}`}
                    >
                        {loading ? <BiLoaderAlt className="animate-spin mx-auto" size={20} /> : "Update"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Profile
