import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import * as apiClient from '../api-client';
import { useAppContext } from '../contexts/AppContext';
import { Link, useNavigate } from 'react-router-dom';

export type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Register = () => {
  const QueryClient = useQueryClient();
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const { register, watch, handleSubmit, formState: { errors } } = useForm<RegisterFormData>();

  const mutation = useMutation(apiClient.register, {
    onSuccess: async () => {
      showToast({ message: "Registration Success!", type: "SUCCESS" });
      await QueryClient.invalidateQueries("valiadateToken")
      navigate("/");
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" }); 
    },
  });

  const onSubmit = handleSubmit((data) => {
    console.log('Form data:', data); // Log form data
    mutation.mutate(data);
  });

  return (
    <form className='flex-col gap-5' onSubmit={onSubmit}>
      <h2 className='text-3xl font-bold'>Create Account</h2>
      <div className="flex flex-col md:flex-row gap-5">
        <label className="text-gray-700 flex-1 text-sm font-bold">
          First Name
          <input type="text" className='border rounded w-full py-1 px-2 font-normal' {...register("firstName", { required: "This field is required" })} />
          {errors.firstName && <span className='text-red-500'>{errors.firstName.message}</span>}
        </label>
        <label className="text-gray-700 flex-1 text-sm font-bold">
          Last Name
          <input type="text" className='border rounded w-full py-1 px-2 font-normal' {...register("lastName", { required: "This field is required" })} />
          {errors.lastName && <span className='text-red-500'>{errors.lastName.message}</span>}
        </label>
      </div>
      <label className="text-gray-700 flex-1 text-sm font-bold">
        Email
        <input type="email" className='border rounded w-full py-1 px-2 font-normal' {...register("email", { required: "This field is required" })} />
        {errors.email && <span className='text-red-500'>{errors.email.message}</span>}
      </label>
      <label className="text-gray-700 flex-1 text-sm font-bold">
        Password
        <input type="password" className='border rounded w-full py-1 px-2 font-normal' {...register("password", {
          required: "This field is required",
          minLength: {
            value: 6, message: "Password must be at least 6 characters"
          }
        })} />
        {errors.password && <span className='text-red-500'>{errors.password.message}</span>}
      </label>
      <label className="text-gray-700 flex-1 text-sm font-bold">
        Confirm Password
        <input type="password" className='border rounded w-full py-1 px-2 font-normal'
          {...register("confirmPassword", {
            validate: (val) => {
              if (!val) {
                return "This field is required";
              } else if (watch("password") !== val) {
                return "Your passwords do not match";
              }
            }
          })} />
        {errors.confirmPassword && <span className='text-red-500'>{errors.confirmPassword.message}</span>}
      </label>
      <span className=' flex items-center justify-between'>
      <span className='text-md font-medium'>
        Already have an account? <Link className="underline text-blue-600" to= "/sign-in">Sign in here</Link>
      </span>
        <button type='submit' className='bg-blue-600 text-white rounded-sm p-2 font-md text-xl hover:bg-blue-500'>Create Account</button>
      </span>
    </form>
  );
};

export default Register;
