import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import * as apiClient from '../api-client';

export type SignInFormData = {
  email: string;
  password: string;
};

const SignIn = () => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors } } = useForm<SignInFormData>();
  const navigate = useNavigate();
  const { showToast } = useAppContext();

  const mutation = useMutation(apiClient.signIn, {
    onSuccess: async () => {
      showToast({ message: "Sign in Successful!", type: "SUCCESS" });
      await queryClient.invalidateQueries("validateToken");
      navigate("/");
    },
    onError: (error: Error) => {
      console.error('Error during sign in:', error);
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const onSubmit = handleSubmit((data) => {
    console.log('Form data:', data);
    mutation.mutate(data);
  });

  return (
    <form className='flex flex-col gap-5' onSubmit={onSubmit}>
      <h2 className='text-3xl font-bold'>
        Sign In
      </h2>
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
      <span className='flex items-center justify-between'>
        <span className='text-md font-medium'>
          Don't have an account? <Link className="underline text-blue-600" to="/register">Register here</Link>
        </span>
        <button type='submit' className='bg-blue-600 text-white rounded-sm p-2 font-md text-xl hover:bg-blue-500'>Login</button>
      </span>
    </form>
  );
};

export default SignIn;
