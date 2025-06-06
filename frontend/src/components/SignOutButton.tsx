
import { useMutation, useQueryClient } from 'react-query';
import * as apiClient from '../api-client';
import { useAppContext } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';

const SignOutButton = () => {

  const QueryClient = useQueryClient();

    const navigate = useNavigate();

    const { showToast } = useAppContext();

    const mutation = useMutation(apiClient.signOut, {
        onSuccess: async () => {
          await QueryClient.invalidateQueries("validateToken")
          showToast({ message: "Signed Out!", type: "SUCCESS" });
          navigate("/");
        },
        onError: (error: Error) => {
          showToast({ message: error.message, type: "ERROR" }); 
        },
      });
    
      const handleClick = () => {
        mutation.mutate();
      };
  return (
    <button onClick={handleClick} className='text-blue-600 px-3 font-bold hover:bg-gray-100 bg-white'>Sign Out</button>
  )
}

export default SignOutButton