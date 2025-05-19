import api from '@/api'
import toast from 'react-hot-toast'
import { IMeta, IParkingSlot } from '@/types'
import React from 'react'

export const createParkingSlot = async ({
  slotData,
  setLoading,
  setShowCreateParkingSlot,
}: {
  slotData: IParkingSlot,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setShowCreateParkingSlot?: React.Dispatch<React.SetStateAction<boolean>>,
}) => {
  try {
    const url = '/parking/create'
    await api.post(url, { ...slotData })
    toast.success('Parking slot created successfully')

    if (setShowCreateParkingSlot) setShowCreateParkingSlot(false)
  } catch (error: any) {
    toast.error(error?.response?.data?.message ?? 'Error creating parking slot')
  } finally {
    setLoading(false)
  }
}

export const getParkingSlots = async ({
  page,
  limit,
  setLoading,
  setMeta,
  setParkingSlots,
  searchKey,
}: {
  page: number
  limit: number
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  setMeta: React.Dispatch<React.SetStateAction<IMeta>>
  setParkingSlots: React.Dispatch<React.SetStateAction<IParkingSlot[]>>
  searchKey?: string
}) => {
  try {
    let url = `/parking/all?page=${page}&limit=${limit}`
    if (searchKey) url += `&searchKey=${searchKey}`

    const response = await api.get(url)
    console.log("tata: ", response)
    setParkingSlots(response.data.data.parkingSlots)
    setMeta(response.data.data.meta)
  } catch (error: any) {
    if (error.response?.data?.status === 401) return window.location.replace('/auth/login')

    toast.error(error?.response?.data?.message ?? 'Error fetching parking slots')
  } finally {
    setLoading(false)
  }
}

export const updateParkingSlot = async ({
  slotId,
  slotData,
  setLoading,
  setShowUpdateParkingSlot,
}: {
  slotId: number;
  slotData: Partial<IParkingSlot>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setShowUpdateParkingSlot?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  try {
    setLoading(true);
    const url = `/parking/${slotId}`;
    const response = await api.put(url, { ...slotData });
    toast.success("Parking slot updated successfully");
    if (setShowUpdateParkingSlot) setShowUpdateParkingSlot(false);
    return response.data.data.parkingSlot as IParkingSlot;
  } catch (error: any) {
    toast.error(error?.response?.data?.message ?? "Error updating parking slot");
    return null;
  } finally {
    setLoading(false);
  }
};

export const deleteParkingSlot = async ({
  slotId,
  setLoading,
}: {
  slotId: number;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  try {
    setLoading(true);
    const url = `/parking/${slotId}`;
    await api.delete(url);
    toast.success("Parking slot deleted successfully");
    return true;
  } catch (error: any) {
    toast.error(error?.response?.data?.message ?? "Error deleting parking slot");
    return false;
  } finally {
    setLoading(false);
  }
};