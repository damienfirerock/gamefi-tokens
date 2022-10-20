import { useDispatch } from "react-redux";

import { AppDispatch } from "../../store";
import { setError } from "../../features/TransactionsSlice";

const useDispatchErrors = () => {
  const dispatch = useDispatch<AppDispatch>();

  const sendTransactionError = (error: string) => {
    dispatch(setError(error));
  };

  return { sendTransactionError };
};

export default useDispatchErrors;
