import Sidebar from "@/components/Sidebar";
import { CommonContext } from "@/context";
import { getVehicles, updateVehicle, deleteVehicle } from "@/services/vehicle";
import { DataTable, DataTableColumn } from "mantine-datatable";
import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { BiEdit, BiPlus, BiSearch, BiTrash } from "react-icons/bi";
import { Modal, TextInput, Select, Button } from "@mantine/core";
import { IVehicle } from "@/types";

import Header from "@/components/Header";

const Home: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [searchKey, setSearchKey] = useState<string>("");
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [selectedVehicle, setSelectedVehicle] = useState<IVehicle | null>(null);
  const [formData, setFormData] = useState<Partial<IVehicle>>({});
  

  const { setShowCreateVehicle, vehicles, setVehicles, setMeta, meta } =
    useContext(CommonContext);

  const columns: DataTableColumn<IVehicle>[] = [
    {
      accessor: "id",
      title: "#",
      render: (_, index) => index + 1 + (page - 1) * limit,
    },
    {
      accessor: "plate",
      title: "Plate Number",
      sortable: true,
    },
    {
      accessor: "model",
      title: "Model",
      sortable: true,
    },
    {
      accessor: "color",
      title: "Color",
      sortable: true,
    },
    {
      accessor: "size",
      title: "Size",
      sortable: true,
    },
    {
      accessor: "type",
      title: "Type",
      sortable: true,
    },
    {
      accessor: "actions",
      title: "Actions",
      render: (record) => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setSelectedVehicle(record);
              setFormData({
                plate: record.plate,
                model: record.model,
                color: record.color,
                size: record.size,
                type: record.type,
              });
              setShowUpdateModal(true);
            }}
            className="text-sky-600"
            disabled={actionLoading}
          >
            <BiEdit size={20} />
          </button>
          <button
            onClick={() => handleDelete(record.id!)}
            className="text-red-500"
            disabled={actionLoading}
          >
            <BiTrash size={20} />
          </button>
        </div>
      ),
    },
  ];

  const handleSearch = () => {
    setPage(1);
    fetchVehicles();
  };

  const fetchVehicles = async () => {
    await getVehicles({
      page,
      limit,
      setLoading,
      setMeta,
      setVehicles,
      searchKey,
    });
  };

  const handleUpdate = async () => {
    if (!selectedVehicle || !formData.plate) return;
    const updated = await updateVehicle({
      vehicleId: selectedVehicle.id!,
      vehicleData: formData,
      setLoading: setActionLoading,
      setShowUpdateVehicle: setShowUpdateModal,
    });
    if (updated) {
      setSelectedVehicle(null);
      setFormData({});
      fetchVehicles();
    }
  };

  const handleDelete = async (vehicleId: number) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      const success = await deleteVehicle({
        vehicleId,
        setLoading: setActionLoading,
      });
      if (success) {
        fetchVehicles();
      }
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [page, limit]);

  return (
    <div className="w-full flex min-h-screen">
    
      <Sidebar />
      <Helmet>
        <title>Home</title>
      </Helmet>
      <div className="w-10/12  flex flex-col ">
           <Header />
        <div className="my-14 mx-1 md:mx-4">
          <div className="w-full justify-between flex items-center mb-6">
            <span className="text-xl">Your Registered Vehicles</span>
            <button
              onClick={() => setShowCreateVehicle(true)}
              className="bg-sky-600 flex items-center px-6 h-14 rounded-lg text-white"
            >
              <BiPlus color="white" className="mr-3" size={25} />
              <span className="font-bold">Add Vehicle</span>
            </button>
          </div>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Search by plate or model..."
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
            records={vehicles}
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
            onRowClick={({ record }) => console.log(record)}
            noRecordsText="No vehicles found"
          />

          <Modal
            opened={showUpdateModal}
            onClose={() => {
              setShowUpdateModal(false);
              setSelectedVehicle(null);
              setFormData({});
            }}
            title="Update Vehicle"
          >
            <TextInput
              label="Plate Number"
              placeholder="Enter plate number"
              value={formData.plate || ""}
              onChange={(e) => setFormData({ ...formData, plate: e.target.value })}
              required
            />
            <TextInput
              label="Model"
              placeholder="Enter model"
              value={formData.model || ""}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            />
            <TextInput
              label="Color"
              placeholder="Enter color"
              value={formData.color || ""}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            />
            <Select
              label="Size"
              placeholder="Select size"
              data={["Small", "Medium", "Large"]}
              value={formData.size || ""}
              onChange={(value) => setFormData({ ...formData, size: value || undefined })}
            />
            <Select
              label="Type"
              placeholder="Select type"
              data={["Car", "Truck", "Motorcycle"]}
              value={formData.type || ""}
              onChange={(value) => setFormData({ ...formData, type: value || undefined })}
            />
            <Button
              onClick={handleUpdate}
              className="mt-4 bg-primary-blue text-white"
              disabled={!formData.plate || actionLoading}
              loading={actionLoading}
            >
              Update
            </Button>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Home;