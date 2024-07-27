import React from 'react'
import DatePicker from 'react-datepicker';
import { useSearchContext } from '../../contexts/SearchContext';
import { useAppContext } from '../../contexts/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';


type Props = {
    hotelId: string;
    pricePerNight: number;
};
type GuestInfoFormData = {
    checkIn: Date;
    checkOut: Date;
    adultCount: number;
    chidCount: number;
}
const GuestInfoForm = ({ hotelId, pricePerNight }: Props) => {

    const search = useSearchContext();
    const { isLoggedIn } = useAppContext();
    const { 
        watch,
        register,
        handleSubmit,
        setValue,
        formState: { errors},
    } = useForm<GuestInfoFormData>({
        defaultValues: {
            checkIn: search.checkIn,
            checkOut: search.checkOut,
            adultCount: search.adultCount,
            chidCount: search.childCount, 
        },
    });

    const checkIn = watch("checkIn");
    const checkOut = watch("checkOut");
    const navigate = useNavigate();
    const location = useLocation();

    const minDate = new Date();
     maxDate.setFullYear(maxDate.getFullYear() + 1);

    const onSignInClick = (data: GuestInfoFormData) => {
        search.saveSearchValues(
            data.checkIn,
            data.checkOut,
            data.adultCount,
            data.chidCount
        );
        Navigate("/sign-in", { state: { from: location }})
    } 
    const onSubmit = (data: GuestInfoFormData) => {
        search.saveSearchValues(
            data.checkIn,
            data.checkOut,
            data.adultCount,
            data.chidCount
        );
        Navigate(`/hotel/${hotelId}/booking`);
    }; 
  return (
    <div className='flex flex-col p-4 bg-blue-200 gap-4'>
      <h3 className='text-md font-bold'> ${pricePerNight}</h3>
      <form onSubmit={
        isLoggedIn ? handleSubmit(onSubmit) : 
        handleSubmit(onSignInClick)
      }>
        <div className="grid grid-cols-1 gap-4 items-center"> 
            
                <div>
                    <DatePicker selected={checkIn}
                    required
                    onChange={(date) => setValue("checkIn",date as Date)}
                    selectsStart
                    startDate={checkIn}
                    endDate={checkOut}
                    minDate={minDate}
                    maxDate={maxDate}
                    placeholderText="Check-in Date"
                    className="min-w-full bg-white p-2 focus:outline-none"
                    wrapperClassName="min-w-full"/>
                </div> 
                <div>
                    <DatePicker selected={checkOut}
                    required
                    onChange={(date) => setValue("checkOut",date as Date)}
                    selectsStart
                    startDate={checkIn}
                    endDate={checkOut}
                    minDate={minDate}
                    maxDate={maxDate}
                    placeholderText="Check-in Date"
                    className="min-w-full bg-white p-2 focus:outline-none"
                    wrapperClassName="min-w-full"/>
                </div>

                <div className="flex bg-white px-2 py-1 gap-4">
            <label className="items-center flex">
                Adults:
                <input className="w-full p-1 focus:outline-none font-bold" 
                type="number" 
                min={1} 
                max={30}
                {...register("adultCount", {
                   required: "This field is required",
                   min: {
                    value: 1,
                    message: "There must be at least one adult",
                   },
                   valueAsNumber: true,
                })} />
            </label>
            <label className="items-center flex">
                Children:
                <input className="w-full p-1 focus:outline-none font-bold" 
                type="number" 
                min={0} max={30}
                {...register("childCount", {
                    valueAsNumber: true,
                 })} />
            </label>
            {errors.adultCount && (
                <span className="text-red-500 font-semibold text-sm">
                    {errors.adultCount.message}
                </span>
            )}
        </div>
        {isLoggedIn? (
            <button className="w-2/3 bg-blue-600 text-white h-full p-2 font-bold text-xl hover:bg-blue-500">Book Now</button>
        ):(
            <button className="w-2/3 bg-blue-600 text-white h-full p-2 font-bold text-xl hover:bg-blue-500">Sign in to Book</button>
        )}
        </div>
        </form>
    </div>
  )
};

export default GuestInfoForm