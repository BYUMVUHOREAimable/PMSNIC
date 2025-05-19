import { useContext, useState, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { BiLoaderAlt } from 'react-icons/bi';
import { CommonContext } from '@/context';
import { createRequestSlot } from '@/services/reservation';
import { getVehicles } from '@/services/vehicle';
import { IVehicle } from '@/types'; // Adjust path to your types

type RequestSlotData = {
  vehicleId: string;
};

const RequestSlotSchema = yup.object({
  vehicleId: yup.string().required().label('Vehicle'),
});

const CreateRequestSlot = () => {
  const { setShowRequestParkingSlot, showCreateRequestSlot,vehicles, setVehicles, setMeta } = useContext(CommonContext);
  const [loading, setLoading] = useState(false);
  const [fetchingVehicles, setFetchingVehicles] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RequestSlotData>({
    resolver: yupResolver(RequestSlotSchema),
    mode: 'onTouched',
  });

  // Fetch user's vehicles on mount
  useEffect(() => {
    const fetchVehicles = async () => {
      setFetchingVehicles(true);
      await getVehicles({
        page: 1,
        limit: 100, // Fetch all vehicles (adjust as needed)
        setLoading: setFetchingVehicles,
        setMeta,
        setVehicles,
      });
      setFetchingVehicles(false);
    };
    fetchVehicles();
  }, [setMeta, setVehicles]);

  const onSubmit: SubmitHandler<RequestSlotData> = async (data) => {
    setLoading(true);
    await createRequestSlot({
      requestData: { vehicleId: parseInt(data.vehicleId) },
      setLoading,
      setShowRequestParkingSlot,
    });
    setLoading(false);
  };

  return (
    <div className="fixed w-screen h-screen bg-black/60 backdrop-blur-md flex justify-center z-30">
      <div className="z-30 w-full h-full absolute" onClick={() => { setShowRequestParkingSlot(false)
        console.log(showCreateRequestSlot)
      }}></div>
      <div className="bg-white w-11/12 md:w-6/12 lg:w-5/12 xl:w-4/12 flex flex-col p-6 rounded-lg z-50 mt-14 mb-14 justify-center items-center">
        <span className="font-semibold text-xl text-primary-blue">Request Parking Slot</span>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 w-9/12 flex flex-col items-center">
          {/* Vehicle Selection */}
          <div className="w-full my-2">
            <span className="font-semibold text-lg">Select Vehicle</span>
            <select
              {...register('vehicleId')}
              className="bg-transparent border border-gray-200 rounded focus:outline-none text-sm font-medium leading-none text-gray-800 py-3 w-full pl-3"
              disabled={fetchingVehicles}
            >
              <option value="">Select a vehicle</option>
              {vehicles.map((vehicle: IVehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.plate} ({vehicle.model || 'Unknown Model'})
                </option>
              ))}
            </select>
            {errors.vehicleId && <span className="text-red-400 text-[16px]">{errors.vehicleId.message}</span>}
          </div>

          <button
            disabled={loading || fetchingVehicles}
            type="submit"
            className={`${
              loading || fetchingVehicles ? 'bg-primary-blue/70' : 'bg-sky-600'
            } my-4 text-white w-44 flex justify-center px-6 py-3 rounded-lg`}
          >
            {loading ? <BiLoaderAlt className="animate-spin" size={25} /> : 'Request Slot'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRequestSlot;