import { useDispatch } from "react-redux";

import { AppDispatch } from "../../store";
import { setError } from "../../features/TransactionsSlice";

const useDispatchErrors = () => {
  const dispatch = useDispatch<AppDispatch>();

  const sendTransactionError = (error: string) => {
    dispatch(setError(error));
  };

  const sendTransactionErrorOnMetaMaskRequest = (error: any) => {
    const { code, reason, message } = error;

    let errorMessage;

    if (code && reason) {
      errorMessage = `${code}: ${reason}`;
    } else if (message) {
      errorMessage = message;
    } else if (code) {
      errorMessage = code;
    } else {
      errorMessage = error;
    }

    sendTransactionError(errorMessage);
  };

  return {
    sendTransactionError,
    sendTransactionErrorOnMetaMaskRequest,
  };
};

export default useDispatchErrors;
