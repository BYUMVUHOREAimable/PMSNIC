import api from "@/api";
import { RegisterInputs , UpdateInputs } from "@/types";
import { toast } from "react-hot-toast";

export const createUser = async ({
    setLoading,
    data
}: {
    data: RegisterInputs,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
}) => {
    try {
        setLoading(true)
        const url = "/user/create";
        await api.post(url, { ...data })
        toast.success("User created successfully")
        setTimeout(() => {
            window.location.replace("/auth/login")
        }, 1000);
    } catch (error: any) {
        error?.response?.data?.message ? toast.error(error.response.data.message) : toast.error("Error creating your account")
    } finally {
        setLoading(false)
    }
}

export const  updateUser = async ({
    setLoading,
    data
}: {
    data: UpdateInputs,
     setLoading: React.Dispatch<React.SetStateAction<boolean>>,
}) =>  {
        try {
        setLoading(true)
        console.log(data)
        const url = "/user/update";
        await api.post(url, { ...data })
        toast.success("User updated successfully")
    
    } catch (error: any) {
        error?.response?.data?.message ? toast.error(error.response.data.message) : toast.error("Error creating your account")
    } finally {
        setLoading(false)
    }
}