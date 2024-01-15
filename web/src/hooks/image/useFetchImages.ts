import {useCallback, useEffect, useState} from "react"
import {GetAddImage} from "../../api/image";


export interface Image {
  id: number
  author: number
  filename: string
  create: string
}

const useFetchImage = () => {
  const [images, setImages] = useState<Image[]>([])

  const fetchData = useCallback(async () => {
    try {
      const res = await GetAddImage();
      if (res.data.code === 200) {
        setImages(res.data.data !== null ? res.data.data : []);
      } else {
        setImages([])
      }
    } catch (_) {
      setImages([])
    }
  }, [])

  useEffect(() => {
    fetchData().then(() => {});
  }, [fetchData]);

  return {
    images,
    fetchData: fetchData
  }
}

export default useFetchImage