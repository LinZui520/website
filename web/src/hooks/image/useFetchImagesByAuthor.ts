import {useCallback, useEffect, useState} from "react"
import {GetImageByAuthor} from "../../api/image";
import {Image} from "./useFetchImages";

const useFetchImagesByAuthor = () => {
  const [images, setImages] = useState<Image[]>([])

  const fetchData = useCallback(async () => {
    try {
      const res = await GetImageByAuthor();
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

export default useFetchImagesByAuthor;