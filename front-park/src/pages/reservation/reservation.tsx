import Sidebar from "@/components/Sidebar";
import { CommonContext } from "@/context";
import { getReservations, updateReservation, deleteReservation, approveReservation, rejectReservation } from "@/services/reservation";
import { getVehicles } from "@/services/vehicle";
import { DataTable, DataTableColumn } from "mantine-datatable";
import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { BiEdit, BiSearch, BiTrash, } from "react-icons/bi";
import { Modal, Select, Button } from "@mantine/core";
import { IReservation, IVehicle,  } from "@/types";
import Header from "@/components/Header";
import { MdCancel } from "react-icons/md";
import { FcOk } from "react-icons/fc";

const Reservations: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [searchKey, setSearchKey] = useState<string>("");
  const [vehicles, setVehicles] = useState<IVehicle[]>([]);
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [selectedReservation, setSelectedReservation] = useState<IReservation | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");

  const { user, reservations , setReservations, setMeta , meta} = useContext(CommonContext);
  const isAdmin = user?.role === "ADMIN";

  const columns: DataTableColumn<IReservation>[] = [
    {
      accessor: "id",
      title: "#",
      render: (_, index) => index + 1 + (page - 1) * limit,
    },
    {
      accessor: "vehicle.plate",
      title: "Vehicle Plate",
      sortable: true,
    },
    {
      accessor: "vehicle.model",
      title: "Vehicle Model",
      sortable: true,
    },
    {
      accessor: "parkingSlot.slotCode",
      title: "Parking Slot",
      render: (record) => record.parkingSlot?.slotCode || "Not Assigned",
    },
    {
      accessor: "status",
      title: "Status",
      sortable: true,
    },
    {
      accessor: "createdAt",
      title: "Created At",
      render: (record) => new Date(record.createdAt).toLocaleDateString(),
    },
    {
      accessor: "actions",
      title: "Actions",
      render: (record) =>
        record.status === "PENDING" ? (
          <div className="flex gap-2">
            {isAdmin ? (
              <>
                <button
                  onClick={() => handleApprove(record.id)}
                  className="text-green-500"
                  disabled={actionLoading}
                >
                  <FcOk  size={25}/>
                </button>
                <button
                  onClick={() => handleReject(record.id)}
                  className="text-red-500"
                  disabled={actionLoading}
                >
                  <MdCancel size={25} />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setSelectedReservation(record);
                    setSelectedVehicleId(record.vehicleId.toString());
                    setShowUpdateModal(true);
                  }}
                  className="text-blue-500"
                  disabled={actionLoading}
                >
                  <BiEdit size={20} />
                </button>
                <button
                  onClick={() => handleDelete(record.id)}
                  className="text-red-500"
                  disabled={actionLoading}
                >
                  <BiTrash size={20} />
                </button>
              </>
            )}
          </div>
        ) : null,
    },
  ];

  const fetchReservations = async () => {
    await getReservations({
      page,
      limit,
      setLoading,
      setMeta,
      setReservations,
      searchKey,
    });
  };

  const fetchVehicles = async () => {
    await getVehicles({
      page: 1,
      limit: 100,
      setLoading,
      setMeta: () => {},
      setVehicles,
    });
  };

  const handleSearch = () => {
    setPage(1);
    fetchReservations();
  };

  const handleUpdate = async () => {
    if (!selectedReservation || !selectedVehicleId) return;
    const updated = await updateReservation({
      reservationId: selectedReservation.id,
      vehicleId: parseInt(selectedVehicleId),
      setLoading: setActionLoading,
    });
    if (updated) {
      setShowUpdateModal(false);
      setSelectedReservation(null);
      setSelectedVehicleId("");
      fetchReservations();
    }
  };

  const handleDelete = async (reservationId: number) => {
    if (window.confirm("Are you sure you want to cancel this reservation?")) {
      const success = await deleteReservation({
        reservationId,
        setLoading: setActionLoading,
      });
      if (success) {
        fetchReservations();
      }
    }
  };

  const handleApprove = async (reservationId: number) => {
    const updated = await approveReservation({
      reservationId,
      setLoading: setActionLoading,
    });
    if (updated) {
      fetchReservations();
    }
  };

  const handleReject = async (reservationId: number) => {
    if (window.confirm("Are you sure you want to reject this reservation?")) {
      const success = await rejectReservation({
        reservationId,
        setLoading: setActionLoading,
      });
      if (success) {
        fetchReservations();
      }
    }
  };

  useEffect(() => {
    fetchReservations();
    if (!isAdmin) {
      fetchVehicles();
    }
  }, [page, limit, isAdmin]);

  return (
    <div className="w-full flex min-h-screen">
      <Sidebar />
      <Helmet>
        <title>Reservations</title>
      </Helmet>
   <div className="w-10/12  flex flex-col ">
           <Header />
        <div className="my-14 mx-1 md:mx-4">
          <div className="w-full justify-between flex items-center mb-6">
            <span className="text-xl">Your Reservations</span>
          </div>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Search by plate or slot code..."
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="px-4 py-3 rounded-lg border flex-grow"
            />
            <button
              onClick={handleSearch}
              className="bg-primary-blue flex items-center justify-center px-4 rounded-lg text-white"
              disabled={loading}
            >
              <BiSearch size={20} />
            </button>
          </div>

          <DataTable
            records={reservations}
            columns={columns}
            page={page}
            recordsPerPage={limit}
            loadingText={loading ? "Loading..." : "Rendering..."}
            onPageChange={setPage}
            onRecordsPerPageChange={setLimit}
            recordsPerPageOptions={[5, 10, 20, 50]}
            withTableBorder
            borderRadius="sm"
            withColumnBorders
            striped
              styles={{
    table: { fontSize: '18px' }, // sets font size for the whole table
  }}
            totalRecords={meta?.total}
            highlightOnHover
            noRecordsText="No reservations found"
          />

          {!isAdmin && (
            <Modal
              opened={showUpdateModal}
              onClose={() => {
                setShowUpdateModal(false);
                setSelectedReservation(null);
                setSelectedVehicleId("");
              }}
              title="Update Reservation"
            >
              <Select
                label="Select Vehicle"
                placeholder="Choose a vehicle"
                data={vehicles.map((vehicle) => ({
                  value: vehicle.id.toString(),
                  label: `${vehicle.plate} - ${vehicle.model || "Unknown"}`,
                }))}
                value={selectedVehicleId}
                onChange={(value) => setSelectedVehicleId(value || "")}
              />
              <Button
                onClick={handleUpdate}
                className="mt-4 bg-primary-blue text-white"
                disabled={!selectedVehicleId || actionLoading}
                loading={actionLoading}
              >
                Update
              </Button>
            </Modal>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reservations;