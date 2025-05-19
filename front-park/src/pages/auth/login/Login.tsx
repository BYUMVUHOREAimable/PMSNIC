
import { signIn } from '@/services/auth'
import { yupResolver } from "@hookform/resolvers/yup"
import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import { Resolver, SubmitHandler, useForm } from "react-hook-form"
import { BiLoaderAlt, BiSolidHide, BiSolidShow } from 'react-icons/bi'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import * as yup from "yup"

const Login: React.FC = () => {
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    type LoginInputs = {
        email: string
        password: string
    }

    const LoginSchema = yup.object({
        email: yup.string().email("This email is not valid").required("Email is required"),
        password: yup.string().matches(
            /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{6,}$/,
            "Password must have at least 6 characters, one symbol, one number, and one uppercase letter."
        )
    })

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginInputs>({
        resolver: yupResolver(LoginSchema) as Resolver<LoginInputs, any>,
        mode: "onTouched"
    })

    const dispatch = useDispatch()

    const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
        await signIn({ dispatch, setLoading, email: data.email, password: data.password })
    }

    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-[#E2E9ED] py-10">
            <Helmet>
                <title>Login</title>
            </Helmet>

            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8 w-11/12 sm:w-4/5 md:w-2/3 lg:w-1/3">
                <div className="flex flex-col items-center">
                   
                    <h1 className="text-2xl font-bold text-gray-800">PMS</h1>
                  
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-9">
                    <div>
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <input
                            {...register("email")}
                            type="email"
                            placeholder="johndoe@gmail.com"
                            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">Password</label>
                        <div className="relative mt-1">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter password"
                                {...register("password")}
                                className="block w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-gray-600"
                            >
                                {showPassword ? <BiSolidShow size={20} /> : <BiSolidHide size={20} />}
                            </button>
                        </div>
                        {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 text-white rounded-lg font-semibold transition duration-200 ${
                            loading
                                ? "bg-blue-500/70 cursor-not-allowed"
                                : "bg-sky-600 hover:bg-blue-700"
                        } flex justify-center items-center`}
                    >
                        {loading ? <BiLoaderAlt className="animate-spin" size={24} /> : "Login"}
                    </button>
                </form>
                  <p className="text-sm text-center mt-6 text-gray-600">
                        Don't have an account?{" "}
                        <Link to="/auth/signup" className="text-blue-600 font-medium hover:underline">
                            Create one
                        </Link>
                    </p>
            </div>
        </div>
    )
}

export default Login
