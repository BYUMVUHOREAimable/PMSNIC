
import { createUser } from '@/services/user'
import { RegisterInputs } from '@/types'
import { yupResolver } from "@hookform/resolvers/yup"
import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import { Resolver, SubmitHandler, useForm } from "react-hook-form"
import { BiLoaderAlt } from 'react-icons/bi'
import { Link } from 'react-router-dom'
import * as yup from "yup"
import { BiSolidHide } from "react-icons/bi";
import { BiSolidShow } from "react-icons/bi";

const Register: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [showPassword, setShowPassword] = useState<boolean>(false)

    const RegisterSchema = yup.object({
        firstName: yup.string().required().label("First name"),
        lastName: yup.string().required().label("Last name"),
        phoneNumber: yup.string().required().label("phone number"),
        email: yup.string().email("This email is not valid").required("Email is required").label("Email"),
        role: yup.string().label("role"),
        password: yup.string().matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{3,}$/, { message: "Password must have at least 6 characters, one symbol, one number, and one uppercase letter." }).label("Password")
    })

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterInputs>({
        resolver: yupResolver(RegisterSchema) as Resolver<RegisterInputs, any>,
        mode: "onTouched"
    })

    const onSubmit: SubmitHandler<RegisterInputs> = async (data) => {
        await createUser({ setLoading, data })
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#E2E9ED] py-6 px-4">
            <Helmet>
                <title>Register</title>
            </Helmet>
            <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 space-y-6">
                <div className="text-center">
                    <span className="text-3xl font-bold text-gray-800">PMS</span>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700">First Name</label>
                        <input
                            {...register("firstName")}
                            type="text"
                            placeholder="John"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName.message}</p>}
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">Last Name</label>
                        <input
                            {...register("lastName")}
                            type="text"
                            placeholder="Doe"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName.message}</p>}
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <input
                            {...register("email")}
                            type="email"
                            placeholder="johndoe@gmail.com"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">Phone Number</label>
                        <input
                            {...register("phoneNumber")}
                            type="tel"
                            placeholder="+250..."
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        {errors.phoneNumber && <p className="text-sm text-red-500 mt-1">{errors.phoneNumber.message}</p>}
                    </div>

                    <div>
  <label className="text-sm font-medium text-gray-700">Role</label>
  <select
    {...register("role", { required: "Role is required" })}
    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
  >
    <option value="">Select Role</option>
    <option value="ADMIN">ADMIN</option>
    <option value="USER">USER</option>
  </select>
  {errors.role && <p className="text-sm text-red-500 mt-1">{errors.role.message}</p>}
</div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter password"
                                {...register("password")}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-gray-500"
                            >
                                {showPassword ?  <BiSolidShow /> : <BiSolidHide /> }
                            </button>
                        </div>
                        {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
                    </div>

                    <button
                        disabled={loading}
                        type="submit"
                        className={`w-full py-3 rounded-lg text-white font-semibold transition duration-300 ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-sky-600 hover:bg-blue-700"}`}
                    >
                        {loading ? <BiLoaderAlt className="animate-spin mx-auto" size={20} /> : "Register"}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600">
                    Already have an account? <Link to="/auth/login" className="text-sky-600 hover:underline">Login</Link>
                </p>
            </div>
        </div>
    )
}

export default Register
