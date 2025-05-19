import api from '@/api';
import toast from 'react-hot-toast';
import React from 'react';
import { IReservation, IMeta } from "@/types"

export const createRequestSlot = async ({
  requestData,
  setLoading,
  setShowRequestParkingSlot,
}: {
  requestData: { vehicleId: number };
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setShowRequestParkingSlot?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  try {
    const url = '/reservation/create';
    await api.post(url, requestData);
    toast.success('Slot request created successfully');
    if (setShowRequestParkingSlot) setShowRequestParkingSlot(false);
  } catch (error: any) {
    toast.error(error?.response?.data?.message ?? 'Error creating slot request');
  } finally {
    setLoading(false);
  }
};



export const getReservations = async ({
  page,
  limit,
  setLoading,
  setMeta,
  setReservations,
  searchKey,
}: {
  page: number;
  limit: number;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setMeta: React.Dispatch<React.SetStateAction<IMeta>>;
  setReservations: React.Dispatch<React.SetStateAction<IReservation[]>>;
  searchKey?: string;
}) => {
  try {
    let url = `/reservation/all?page=${page}&limit=${limit}`;
    if (searchKey) url += `&searchKey=${searchKey}`;
    const response = await api.get(url);
    console.log("data: ", response.data.data);
    setReservations(response.data.data.reservations);
    setMeta(response.data.data.meta);
  } catch (error: any) {
    if (error.response?.data?.status === 401) {
      return window.location.replace("/auth/login");
    }
    error?.response?.data?.message
      ? toast.error(error.response.data.message)
      : toast.error("Error fetching reservations");
  } finally {
    setLoading(false);
  }
};



export const updateReservation = async ({
  reservationId,
  vehicleId,
  setLoading,
}: {
  reservationId: number;
  vehicleId: number;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  try {
    setLoading(true);
    const url = `/reservation/${reservationId}`;
    const response = await api.put(url, { vehicleId });
    toast.success("Reservation updated successfully");
    return response.data.data.reservation as IReservation;
  } catch (error: any) {
    toast.error(error?.response?.data?.message ?? "Error updating reservation");
    return null;
  } finally {
    setLoading(false);
  }
};



export const deleteReservation = async ({
  reservationId,
  setLoading,
}: {
  reservationId: number;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  try {
    setLoading(true);
    const url = `/reservation/${reservationId}`;
    await api.delete(url);
    toast.success("Reservation cancelled successfully");
    return true;
  } catch (error: any) {
    toast.error(error?.response?.data?.message ?? "Error deleting reservation");
    return false;
  } finally {
    setLoading(false);
  }
};


export const approveReservation = async ({
  reservationId,
  setLoading,
}: {
  reservationId: number;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  try {
    setLoading(true);
    const url = `/reservation/${reservationId}/approve`;
    const response = await api.put(url);
    toast.success("Reservation approved successfully");
    return response.data.data.reservation as IReservation;
  } catch (error: any) {
    toast.error(error?.response?.data?.message ?? "Error approving reservation");
    return null;
  } finally {
    setLoading(false);
  }
};

export const rejectReservation = async ({
  reservationId,
  setLoading,
}: {
  reservationId: number;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  try {
    setLoading(true);
    const url = `/reservation/${reservationId}/reject`;
    await api.put(url);
    toast.success("Reservation rejected successfully");
    return true;
  } catch (error: any) {
    toast.error(error?.response?.data?.message ?? "Error rejecting reservation");
    return false;
  } finally {
    setLoading(false);
  }
};