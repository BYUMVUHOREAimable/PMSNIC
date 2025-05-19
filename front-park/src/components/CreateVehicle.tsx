import { CommonContext } from '@/context';
import { createVehicle, getVehicles } from '@/services/vehicle';
import { yupResolver } from '@hookform/resolvers/yup';
import { useContext, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { BiLoaderAlt } from 'react-icons/bi';
import * as yup from 'yup';
import toast from 'react-hot-toast';

type VehicleData = {
  plate: string;
  type: string;
  size: string;
  model: string;
  color: string;
};

const VehicleSchema = yup.object({
  plate: yup.string().required().label('Plate Number'),
  type: yup.string().oneOf(['car', 'motorcycle', 'truck']).required().label('Vehicle Type'),
  size: yup.string().oneOf(['small', 'medium', 'large']).required().label('Vehicle Size'),
  model: yup.string().required().label('Model'),
  color: yup.string().required().label('Color'),
});

const CreateVehicle = () => {
  const { setShowCreateVehicle, setVehicles, setMeta } = useContext(CommonContext);
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<VehicleData>({
    resolver: yupResolver(VehicleSchema),
    mode: 'onTouched',
  });

  const onSubmit: SubmitHandler<VehicleData> = async (data) => {
    try {
      console.log('Form submitted with data:', data); // Debug log
      setLoading(true);
      await createVehicle({ setShowCreateVehicle, setLoading, vehicleData: data });
      await getVehicles({ page: 1, limit: 10, setLoading, setMeta, setVehicles });
      toast.success('Vehicle created successfully');
      reset(); // Clear form after submission
    } catch (error) {
      console.error('Error creating vehicle:', error);
      toast.error('Failed to create vehicle');
      setLoading(false);
    }
  };

  // Prevent backdrop click from propagating to form
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setShowCreateVehicle(false);
  };

  return (
    <div className="fixed w-screen h-screen bg-black/60 backdrop-blur-md flex justify-center z-30">
      <div className="z-30 w-full h-full absolute" onClick={handleBackdropClick}></div>
      <div className="bg-white w-11/12 md:w-6/12 lg:w-6/12 xl:w-4/12 flex flex-col p-6 rounded-lg z-50 mt-10 mb-10 justify-center items-center">
        <span className="font-semibold text-xl text-sky-600">Create New Vehicle</span>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-3 w-9/12 flex flex-col items-center">
          <div className="w-full flex flex-col items-center gap-x-6">
            {/* Plate Number */}
            <div className="w-full sm:w-[70%] mx-2 lg:mx-0 lg:w-full lg:my-4">
              <span className="font-semibold text-lg">Plate Number</span>
              <input
                placeholder="ABC123"
                type="text"
                {...register('plate')}
                className="bg-transparent border border-gray-200 rounded focus:outline-none text-sm font-medium leading-none text-gray-800 py-3 placeholder:font-normal w-full pl-3"
              />
              {errors.plate && <span className="text-red-400 text-[16px]">{errors.plate.message}</span>}
            </div>

            {/* Model */}
            <div className="w-full sm:w-[70%] mx-2 lg:mx-0 lg:w-full lg:my-4">
              <span className="font-semibold text-lg">Model</span>
              <input
                placeholder="Toyota Corolla"
                type="text"
                {...register('model')}
                className="bg-transparent border border-gray-200 rounded focus:outline-none text-sm font-medium leading-none text-gray-800 py-3 placeholder:font-normal w-full pl-3"
              />
              {errors.model && <span className="text-red-400 text-[16px]">{errors.model.message}</span>}
            </div>

            {/* Vehicle Type */}
            <div className="w-full sm:w-[70%] mx-2 lg:mx-0 lg:w-full lg:my-4">
              <span className="font-semibold text-lg">Type</span>
              <select
                {...register('type')}
                className="bg-transparent border border-gray-200 rounded focus:outline-none text-sm font-medium leading-none text-gray-800 py-3 placeholder:font-normal w-full pl-3"
              >
                <option value="" disabled selected>Select Vehicle Type</option>
                <option value="car">Car</option>
                <option value="motorcycle">Motorcycle</option>
                <option value="truck">Truck</option>
              </select>
              {errors.type && <span className="text-red-400 text-[16px]">{errors.type.message}</span>}
            </div>

            {/* Vehicle Size */}
            <div className="w-full sm:w-[70%] mx-2 lg:mx-0 lg:w-full lg:my-4">
              <span className="font-semibold text-lg">Size</span>
              <select
                {...register('size')}
                className="bg-transparent border border-gray-200 rounded focus:outline-none text-sm font-medium leading-none text-gray-800 py-3 placeholder:font-normal w-full pl-3"
              >
                <option value="" disabled selected>Select Vehicle Size</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
              {errors.size && <span className="text-red-400 text-[16px]">{errors.size.message}</span>}
            </div>

            {/* Vehicle Color */}
            <div className="w-full sm:w-[70%] mx-2 lg:mx-0 lg:w-full lg:my-4">
              <span className="font-semibold text-lg">Color</span>
              <input
                placeholder="e.g. red, black"
                type="text"
                {...register('color')}
                className="bg-transparent border border-gray-200 rounded focus:outline-none text-sm font-medium leading-none text-gray-800 py-3 placeholder:font-normal w-full pl-3"
              />
              {errors.color && <span className="text-red-400 text-[16px]">{errors.color.message}</span>}
            </div>
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

export default CreateVehicle;