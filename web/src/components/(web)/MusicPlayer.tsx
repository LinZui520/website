'use client'

import dynamic from 'next/dynamic';
import type { Music } from 'react-tyranitar';

const Tyranitar = dynamic(
  () => import('react-tyranitar').then((mod) => mod.Tyranitar),
  { ssr: false }
);

const MusicPlayer = () => {
  const music: Music = {
    title: '晴天-周杰伦',
    cover: '/musics/images/晴天-周杰伦.jpg',
    audio: '/musics/audios/晴天-周杰伦.mp3',
    lyrics: '/musics/lyrics/晴天-周杰伦.lrc'
  };

  return (
    <Tyranitar
      music={music} size={38}
      style={{position: 'fixed', left: '25px', bottom: '25px', zIndex: '10'}}
    />
  );
};

export default MusicPlayer;
