
type data = any

interface ApiResponse {
  code: number;
  message: string;
  data: data;
}

export const ResponseOK = (data: data): ApiResponse => ({
  code: 200,
  message: 'success',
  data
})


export const ResponseError = (message: string): ApiResponse => ({
  code: 400,
  message,
  data: null
})