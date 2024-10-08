import { paymentIntentResponse, UserType } from '../../../../backend/src/shared/types';
import { useForm } from 'react-hook-form';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { StripeCardElement } from '@stripe/stripe-js';
import { useSearchContext } from '../../contexts/SearchContext';
import { useMutation } from 'react-query';
import * as apiClient from "../../api-client";
import { useAppContext } from '../../contexts/AppContext';

type Props = {
    currentUser: UserType;
    paymentIntent: paymentIntentResponse;
};

export type BookingFormData = {
    hotelId: string;
    firstName: string;
    lastName: string;
    email: string;
    checkIn: string; 
    checkOut: string; 
    adultCount: number; 
    childCount: number;
    paymentIntentId: string;
    totalCost: number;
};

const BookingForm = ({ currentUser, paymentIntent }: Props) => {
    const stripe = useStripe();
    const elements = useElements();
    const search = useSearchContext();
    const { showToast } = useAppContext();

    const { mutate: bookRoom, isLoading } = useMutation(apiClient.createRoomBooking, {
        onSuccess: () => {
            showToast({ message: "Booking Saved!", type: "SUCCESS" });
        },
        onError: () => {
            showToast({ message: "Something went wrong", type: "ERROR" });
        }
    });

    const { handleSubmit, register } = useForm<BookingFormData>({
        defaultValues: {
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            email: currentUser.email,
            checkIn: search.checkIn.toISOString(), 
            checkOut: search.checkOut.toISOString(), 
            adultCount: search.adultCount, 
            childCount: search.childCount,
            paymentIntentId: paymentIntent.paymentIntentId,
            totalCost: paymentIntent.totalCost,
        }
    });

    const onSubmit = async (formData: BookingFormData) => {
        if (!stripe || !elements) {
            return;
        }

        const result = await stripe.confirmCardPayment(paymentIntent.clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement) as StripeCardElement,
            },
        });

        if (result.paymentIntent?.status === "succeeded") {
            bookRoom({ ...formData, paymentIntentId: result.paymentIntent.id });
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-5 rounded-lg border border-slate-300 p-5">
                <span className="text-3xl font-bold">Confirm Your Details</span>
                <div className="grid grid-cols-2 gap-6">
                    <div className="text-gray-700 text-sm font-bold flex-1">
                        First Name
                        <input type="text" readOnly disabled className="mt-1 border rounded w-full py-3 px-3 text-gray-200 bg-gray"
                        {...register("firstName")} />
                    </div>
                    <div className="text-gray-700 text-sm font-bold flex-1">
                        Last Name
                        <input type="text" readOnly disabled className="mt-1 border rounded w-full py-3 px-3 text-gray-200 bg-gray"
                        {...register("lastName")} />
                    </div>
                    <div className="text-gray-700 text-sm font-bold flex-1">
                        Email
                        <input type="email" className="mt-1 border rounded w-full py-3 px-3 text-gray-200 bg-gray"
                        {...register("email")} />
                    </div>
                </div>

                <div className="space-y-2">
                    <h2 className="font-semibold text-xl">Your Price Summary</h2>
                    <div className="bg-blue-200 p-4 rounded-md">
                        <div className="font-semi-bold text-lg">
                            Total Cost: ${paymentIntent.totalCost.toFixed(2)}
                        </div>
                        <div className="text-xs">Includes taxes and charges</div>
                    </div>
                </div>
                <div className="space-y-2">
                    <h2 className="font-semibold text-xl">Payment Details</h2>
                    <CardElement id="payment-element" className="border rounded-md p-2 text-sm"/>
                </div>
                <div className="flex justify-end">
                    <button disabled={isLoading} type="submit" className="bg-blue-600 text-white rounded-sm p-2 font-md text-xl hover:bg-blue-500 disabled:bg-gray-500">
                        {isLoading ? "Saving..." : "Confirm booking"}  
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BookingForm;
