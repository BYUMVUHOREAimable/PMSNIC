import React, { useContext, useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { CommonContext } from "@/context";
import { getParkingSlots, updateParkingSlot, deleteParkingSlot } from "@/services/parkingSlot";
import { DataTable, DataTableColumn } from "mantine-datatable";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet";
import { BiEdit, BiPlus, BiSearch, BiTrash } from "react-icons/bi";
import { Modal, TextInput, Select, Button } from "@mantine/core";
import { IParkingSlot } from "@/types";
import Header from "@/components/Header";

const ParkingSlotsList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchKey, setSearchKey] = useState("");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<IParkingSlot | null>(null);
  const [formData, setFormData] = useState<Partial<IParkingSlot>>({});

  const { user, setShowCreateParkingSlot, setShowRequestParkingSlot, parkingSlots, setParkingSlots, setMeta, meta } =
    useContext(CommonContext);

  const isAdmin = user?.role === "ADMIN";

  const columns: DataTableColumn<IParkingSlot>[] = [
    {
      accessor: "id",
      title: "#",
      render: (_, index) => index + 1 + (page - 1) * limit,
    },
    {
      accessor: "slotCode",
      title: "Slot Code",
      sortable: true,
    },
    {
      accessor: "size",
      title: "Size",
      sortable: true,
    },
    {
      accessor: "vehicleType",
      title: "Vehicle Type",
      sortable: true,
    },
    {
      accessor: "location",
      title: "Location",
      sortable: true,
    },
    {
      accessor: "status",
      title: "Status",
      sortable: true,
    },
    {
      accessor: "actions",
      title: "Actions",
      hidden: !isAdmin,
      render: (record) => (
        <div className="flex gap-3 ">
          <button
            onClick={() => {
              setSelectedSlot(record);
              setFormData({
                slotCode: record.slotCode,
                size: record.size,
                vehicleType: record.vehicleType,
                location: record.location,
                status: record.status,
              });
              setShowUpdateModal(true);
            }}
            className="text-blue-500 hover:text-blue-800"
            disabled={actionLoading}
          >
            <BiEdit size={30} />
          </button>
          <button
            onClick={() => handleDelete(record.id)}
            className="text-red-500 hover:text-red-800"
            disabled={actionLoading}
          >
            <BiTrash size={30} />
          </button>
        </div>
      ),
    },
  ];

  const handleSearch = () => {
    setPage(1);
    fetchParkingSlot();
  };

  const fetchParkingSlot = async () => {
    await getParkingSlots({
      page,
      limit,
      setLoading,
      setMeta,
      setParkingSlots,
      searchKey,
    });
  };

  const handleUpdate = async () => {
    if (!selectedSlot || !formData.slotCode) return;
    const updated = await updateParkingSlot({
      slotId: selectedSlot?.id,
      slotData: formData,
      setLoading: setActionLoading,
      setShowUpdateParkingSlot: setShowUpdateModal,
    });
    if (updated) {
      setSelectedSlot(null);
      setFormData({});
      fetchParkingSlot();
    }
  };

  const handleDelete = async (slotId: number) => {
    if (window.confirm("Are you sure you want to delete this parking slot?")) {
      const success = await deleteParkingSlot({
        slotId,
        setLoading: setActionLoading,
      });
      if (success) {
        fetchParkingSlot();
      }
    }
  };

  useEffect(() => {
    fetchParkingSlot();
  }, [page, limit]);

  return (
    <div className="w-full flex min-h-screen">
      <Sidebar />
      <Helmet>
        <title>Parking Slots</title>
      </Helmet>
   <div className="w-10/12  flex flex-col ">
           <Header />
        <div className="my-14 mx-1 md:mx-4">
          <div className="w-full justify-between flex items-center mb-6">
            <span className="text-xl">Parking Slots</span>
            {isAdmin ? (
              <button
                onClick={() => setShowCreateParkingSlot(true)}
                className="bg-sky-600 flex items-center px-6 h-14 rounded-lg text-white"
              >
                <BiPlus color="white" className="mr-3" size={25} />
                <span className="font-bold">Add Slot</span>
              </button>
            ) : (
              <button
                onClick={() => setShowRequestParkingSlot(true)}
                className="bg-sky-600 flex items-center px-6 h-14 rounded-lg text-white"
              >
                <BiPlus color="white" className="mr-3" size={25} />
                <span className="font-bold">Request Slot</span>
              </button>
            )}
          </div>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Search by slot code, vehicle type or size..."
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="px-4 py-3 rounded-lg border flex-grow"
            />
            <button
              onClick={handleSearch}
              className="bg-sky-600 flex items-center justify-center px-4 rounded-lg text-white"
              disabled={loading}
            >
              <BiSearch size={20} />
            </button>
          </div>

          <DataTable
            records={parkingSlots}
            columns={columns}
            page={page}
              styles={{
    table: { fontSize: '18px' }, // sets font size for the whole table
  }}
            recordsPerPage={limit}
            loadingText={loading ? "Loading..." : "Rendering..."}
            onPageChange={setPage}
            onRecordsPerPageChange={setLimit}
            recordsPerPageOptions={[5, 10, 20, 50]}
            withTableBorder
            borderRadius="sm"
            withColumnBorders
            striped
            totalRecords={meta?.total}
            highlightOnHover
            onRowClick={({ record }) => toast.success(`Slot: ${record.slotCode} clicked!`)}
            noRecordsText="No parking slots found"
          />

          {isAdmin && (
            <Modal
              opened={showUpdateModal}
              onClose={() => {
                setShowUpdateModal(false);
                setSelectedSlot(null);
                setFormData({});
              }}
              title="Update Parking Slot"
            >
              <TextInput
                label="Slot Code"
                placeholder="Enter slot code"
                value={formData.slotCode || ""}
                onChange={(e) => setFormData({ ...formData, slotCode: e.target.value })}
                required
              />
              <Select
                label="Size"
                placeholder="Select size"
                data={["Small", "Medium", "Large"]}
                value={formData.size || ""}
                onChange={(value) => setFormData({ ...formData, size: value || null })}
              />
              <Select
                label="Vehicle Type"
                placeholder="Select vehicle type"
                data={["Car", "Truck", "Motorcycle"]}
                value={formData.vehicleType || ""}
                onChange={(value) => setFormData({ ...formData, vehicleType: value || null })}
              />
              <TextInput
                label="Location"
                placeholder="Enter location"
                value={formData.location || ""}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
              <Select
                label="Status"
                placeholder="Select status"
                data={["available", "unavailable"]}
                value={formData.status || ""}
                onChange={(value) => setFormData({ ...formData, status: value as "available" | "unavailable" })}
              />
              <Button
                onClick={handleUpdate}
                className="mt-4 bg-primary-blue text-white"
                disabled={!formData.slotCode || actionLoading}
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

export default ParkingSlotsList;