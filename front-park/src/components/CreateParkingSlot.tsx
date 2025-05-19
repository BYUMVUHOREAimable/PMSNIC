import { useContext, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { BiLoaderAlt } from 'react-icons/bi';
import { CommonContext } from '@/context';
import { createParkingSlot, getParkingSlots } from '@/services/parkingSlot';

type ParkingSlotData = {
  slotCode: string;
  size: string;
  vehicleType: string;
  location: string;
  status?: string;
};

const ParkingSlotSchema = yup.object({
  slotCode: yup.string().required().label('Slot Code'),
  size: yup.string().oneOf(['small', 'medium', 'large']).required().label('Size'),
  vehicleType: yup.string().oneOf(['car', 'motorcycle', 'truck']).required().label('Vehicle Type'),
  location: yup.string().required().label('Location'),
  status: yup.string().oneOf(['available', 'unavailable']).optional(),
});

const CreateParkingSlot = () => {
  const { setShowCreateParkingSlot, setParkingSlots, setMeta } = useContext(CommonContext);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ParkingSlotData>({
    resolver: yupResolver(ParkingSlotSchema),
    mode: 'onTouched',
  });

  const onSubmit: SubmitHandler<ParkingSlotData> = async (data) => {
    setLoading(true);
    try {
      await createParkingSlot({ slotData: data, setLoading, setShowCreateParkingSlot });
      // Refresh list
      await getParkingSlots({ page: 1, limit: 10, setLoading, setMeta, setParkingSlots });
    } catch (error) {
      console.error('Error creating parking slot:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed w-screen h-screen bg-black/60 backdrop-blur-md flex justify-center z-30">
      <div className="z-30 w-full h-full absolute" onClick={() => setShowCreateParkingSlot(false)}></div>
      <div className="bg-white w-11/12 md:w-6/12 lg:w-5/12 xl:w-4/12 flex flex-col p-6 rounded-lg z-50 mt-14 mb-14 justify-center items-center">
        <span className="font-semibold text-xl text-primary-blue">Create New Parking Slot</span>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 w-9/12 flex flex-col items-center">
          {/* Slot Code */}
          <div className="w-full my-2">
            <span className="font-semibold text-lg">Slot Code</span>
            <input
              placeholder="Slot001"
              type="text"
              {...register('slotCode')}
              className="bg-transparent border border-gray-200 rounded focus:outline-none text-sm font-medium leading-none text-gray-800 py-3 placeholder:font-normal w-full pl-3"
            />
            {errors.slotCode && <span className="text-red-400 text-[16px]">{errors.slotCode.message}</span>}
          </div>

          {/* Size */}
          <div className="w-full my-2">
            <span className="font-semibold text-lg">Size</span>
            <select
              {...register('size')}
              className="bg-transparent border border-gray-200 rounded focus:outline-none text-sm font-medium leading-none text-gray-800 py-3 w-full pl-3"
            >
              <option value="" disabled selected>Select Size</option>
              <option value="small">small</option>
              <option value="medium">medium</option>
              <option value="large">large</option>
            </select>
            {errors.size && <span className="text-red-400 text-[16px]">{errors.size.message}</span>}
          </div>

          {/* Vehicle Type */}
          <div className="w-full my-2">
            <span className="font-semibold text-lg">Vehicle Type</span>
            <select
              {...register('vehicleType')}
              className="bg-transparent border border-gray-200 rounded focus:outline-none text-sm font-medium leading-none text-gray-800 py-3 w-full pl-3"
            >
              <option value="" disabled selected>Select Vehicle Type</option>
              <option value="car">car</option>
              <option value="motorcycle">motorcycle</option>
              <option value="truck">truck</option>
            </select>
            {errors.vehicleType && <span className="text-red-400 text-[16px]">{errors.vehicleType.message}</span>}
          </div>

          {/* Location */}
          <div className="w-full my-2">
            <span className="font-semibold text-lg">Location</span>
            <input
              placeholder="Section A"
              type="text"
              {...register('location')}
              className="bg-transparent border border-gray-200 rounded focus:outline-none text-sm font-medium leading-none text-gray-800 py-3 placeholder:font-normal w-full pl-3"
            />
            {errors.location && <span className="text-red-400 text-[16px]">{errors.location.message}</span>}
          </div>

          {/* Status (optional) */}
          <div className="w-full my-2">
            <span className="font-semibold text-lg">Status</span>
            <select
              {...register('status')}
              className="bg-transparent border border-gray-200 rounded focus:outline-none text-sm font-medium leading-none text-gray-800 py-3 w-full pl-3"
            >
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
            {errors.status && <span className="text-red-400 text-[16px]">{errors.status.message}</span>}
          </div>

          <button
            disabled={loading}
            type="submit"
            className={`${loading ? 'bg-primary-blue/70' : 'bg-sky-600'} my-4 text-white w-44 flex justify-center px-6 py-3 rounded-lg`}
          >
            {loading ? <BiLoaderAlt className="animate-spin" size={25} /> : 'Create'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateParkingSlot;