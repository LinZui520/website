import { useOutletContext, useParams } from 'react-router-dom';
import { useEffect, useMemo, useRef, useState } from 'react';
import { OutletContext, PhotoVO } from '../type';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import { useRequest } from '../../../hooks/useRequest';
import { uploadPhoto } from '../api';
import BackArrow from '../../../components/BackArrow';
import UpArrow from '../../../components/UpArrow';
import useAuth from '../../../hooks/useAuth';

const Page = () => {
  const { location } = useParams();
  const { photos } = useOutletContext<OutletContext>();
  const [isOpen, setIsOpen] = useState(false);
  const container = useRef<HTMLDivElement | null>(null);
  const timeline = useRef<GSAPTimeline | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [photo, setPhoto] = useState('');
  const [description, setDescription] = useState('');
  const { handleRequest, notify } = useRequest();
  const auth = useAuth();

  useEffect(() => setPhoto(file?.name || ''), [file]);

  const localPhotos = useMemo(() => photos
    .filter(photo => photo.location === location)
    .sort(() => Math.random() - 0.5)
  , [photos, location]);

  useGSAP(() => {
    timeline.current = gsap.timeline();

    timeline.current
      .to('#dialog', { x: 0, duration: 0.7, ease: 'power2.inOut' }, 0)
      .to('#line1', { rotate: -135, transformOrigin: '50% 50%', duration: 0.7, ease: 'power2.inOut' }, 0)
      .to('#line2', { rotate: -135, transformOrigin: '50% 50%', duration: 0.7, ease: 'power2.inOut' }, 0);

    return () => timeline.current?.kill();
  }, { scope: container });

  useGSAP(() => isOpen ? timeline.current?.play() : timeline.current?.reverse(), { scope: container, dependencies: [isOpen] });

  const upload = async () => {
    if (!file || !location) {
      notify('参数为空');
      return;
    }

    if (file.size > 1024 * 1024) {
      notify('图片大小不能超过1MB');
      return;
    }

    const formData = new FormData();
    formData.append('photo', file);
    formData.append('description', description);
    formData.append('location', location);

    handleRequest(
      () => uploadPhoto(formData),
      () => {
        setFile(null);
        setPhoto('');
        setDescription('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      },
      undefined,
      undefined
    );
  };

  return (
    <div
      className={'container mx-auto min-h-screen p-4 md:p-12 xl:p-18'}
      ref={container}
    >
      <div className="columns-1 md:columns-2 xl:columns-3 gap-4 md:gap-12 xl:gap-18">
        {localPhotos.map((photo: PhotoVO) => (
          <div className="relative overflow-hidden shadow-md group break-inside-avoid mb-4 md:mb-12 xl:mb-18" key={photo.photo_id}>
            <img
              alt={photo.photo_id}
              className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
              src={photo.photo_url}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-mint-950/30 via-transparent to-mint-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
              <div className="relative text-mint-50 text-base">
                <span>
                  {photo.description}
                  {/* 添加与用户名长度相等的空格，防止挤压 */}
                  {Array(photo.created_by.username.length * 2 + 6).fill('\u00A0').join('')}
                </span>
                <span className="absolute bottom-0 right-0 text-mint-200 text-sm">
                  📸 {photo.created_by.username}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <UpArrow />

      <BackArrow />

      <svg
        className={`${auth.state.user?.permission ? 'fixed' : 'hidden'} right-12 top-28 h-16 w-16 stroke-3 stroke-mint-950 dark:stroke-mint-50 cursor-pointer z-[35]`}
        onClick={() => setIsOpen((value) => !value)}
        viewBox="0 0 32 32"
      >
        <path d="M 16 4 L 16 28" id="line1" />
        <path d="M 4 16 L 28 16" id="line2" />
      </svg>
      <div
        className={'fixed right-0 top-0 h-screen max-w-screen w-md z-30 bg-mint-100 dark:bg-mint-900 translate-x-[150%] flex flex-col justify-center items-center'}
        id="dialog"
      >
        <input
          accept="image/*" autoComplete="file" className="hidden" name="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          ref={fileInputRef} type="file"
        />
        <Input
          autoComplete="photo" className="mb-8 w-2/3" label="照片" name="photo"
          onChange={() => {}}
          onClick={() => fileInputRef.current?.click()}
          ref={photoInputRef} type="text" value={photo}
        />
        <Input
          autoComplete="description" className="mb-8 w-2/3" label="描述" name="description"
          onChange={(e) => setDescription(e.target.value)} type="text" value={description}
        />
        <div className="w-2/3 mb-8 flex flex-row items-center justify-start">
          <Button label="上传" onClick={upload} type="button" />
        </div>
      </div>
    </div>
  );
};

export default Page;
