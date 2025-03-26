import type { AxiosError, AxiosResponse } from 'axios';
import { useSnackbar } from './useSnackbar';
import type { ApiResponse } from '@/utils/axios';

export const useRequest = () => {
  const { show, close, SnackbarComponent } = useSnackbar({
    timeout: 2000,
    location: 'top'
  });

  const handleRequest = async<T> (
    request: () => Promise<AxiosResponse>,
    successCallback?: (res: AxiosResponse<ApiResponse<T>>) => void,
    errorCallback?: (err: AxiosError) => void,
    finallyCallback?: () => void
  ) => {
    close();
    request().then((res) => {
      show(res.data.message, 'success');
      successCallback?.(res);
    }).catch((err) => {
      show(
        err.response.data.message || '请求失败',
        err.response.data.code === 400 ? 'warning' : 'error'
      );
      errorCallback?.(err);
    }).finally(() => {
      finallyCallback?.();
    });
  };

  return { handleRequest, SnackbarComponent };
};
