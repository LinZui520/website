import { AxiosError, AxiosResponse } from 'axios';
import useNotification from './useNotification';
import { ApiResponse } from '../utils/axios';
import { useCallback } from 'react';

export const useRequest = () => {
  const { notify } = useNotification();

  const handleRequest = useCallback(<T> (
    request: () => Promise<AxiosResponse>,
    successCallback?: (res: AxiosResponse<ApiResponse<T>>) => void,
    errorCallback?: (err: AxiosError) => void,
    finallyCallback?: () => void
  ) => {
    request().then((res) => {
      notify(res.data.message, 'success');
      successCallback?.(res);
    }).catch((err) => {
      notify(err.response.data.message || '504 Gateway Timeout');
      errorCallback?.(err);
    }).finally(() => {
      finallyCallback?.();
    });
  }, [notify]);

  return {
    handleRequest,
    notify
  };
};
