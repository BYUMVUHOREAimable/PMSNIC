import api from "@/api"
import { IVehicle, IMeta } from "@/types"
import React from "react"
import toast from "react-hot-toast"

export const createVehicle = async ({
  vehicleData,
  setLoading,
  setShowCreateVehicle,  // add this here
}: {
  vehicleData: IVehicle,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setShowCreateVehicle?: React.Dispatch<React.SetStateAction<boolean>>, // optional
}) => {
  try {
    const url = "/vehicle/create"
    await api.post(url, { ...vehicleData })
    

    if (setShowCreateVehicle) setShowCreateVehicle(false)  // close modal on success
  } catch (error: any) {
    toast.error(error?.response?.data?.message ?? "Error registering vehicle")
  } finally {
    setLoading(false)
  }
}


export const getVehicles = async ({
    page,
    limit,
    setLoading,
    setMeta,
    setVehicles,
    searchKey
}: {
    page: number,
    limit: number,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setMeta: React.Dispatch<React.SetStateAction<IMeta>>,
    setVehicles: React.Dispatch<React.SetStateAction<IVehicle[]>>,
    searchKey?: string
}) => {
    try {
        let url = `/vehicle/all?page=${page}&limit=${limit}`
        if (searchKey) url += `&searchKey=${searchKey}`
        const response = await api.get(url)
        console.log("data: " , response.data.data )
        setVehicles(response.data.data.vehicles)
        
        setMeta(response.data.data.meta)
    }
    catch (error: any) {
        if (error.response?.data?.status === 401)
            return window.location.replace("/auth/login")
        error?.response?.data?.message
            ? toast.error(error.response.data.message)
            : toast.error("Error fetching vehicles")
    } finally {
        setLoading(false)
    }
}


export const updateVehicle = async ({
  vehicleId,
  vehicleData,
  setLoading,
  setShowUpdateVehicle,
}: {
  vehicleId: number;
  vehicleData: Partial<IVehicle>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setShowUpdateVehicle?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  try {
    setLoading(true);
    const url = `/vehicle/${vehicleId}`;
    const response = await api.put(url, { ...vehicleData });
    toast.success("Vehicle updated successfully");
    if (setShowUpdateVehicle) setShowUpdateVehicle(false);
    return response.data.data.vehicle as IVehicle;
  } catch (error: any) {
    toast.error(error?.response?.data?.message ?? "Error updating vehicle");
    return null;
  } finally {
    setLoading(false);
  }
};

export const deleteVehicle = async ({
  vehicleId,
  setLoading,
}: {
  vehicleId: number;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  try {
    setLoading(true);
    const url = `/vehicle/${vehicleId}`;
    await api.delete(url);
    toast.success("Vehicle deleted successfully");
    return true;
  } catch (error: any) {
    toast.error(error?.response?.data?.message ?? "Error deleting vehicle");
    return false;
  } finally {
    setLoading(false);
  }
};