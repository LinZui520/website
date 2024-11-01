### 修改网站图标和网站名称

网站图标 `web/public/favicon.ico`

网站名称 `web/src/app/layout.tsx`

```tsx
export const metadata: Metadata = {
  title: "我不吃牛肉",
  description: "一个简约风格的网站",
}
```

> 修改`title`字段即可

### 修改网站主页歌曲播放

根据`web/src/components/(web)/MusicPlayer.tsx`文件的 `music`变量

补全`web/public/musics`文件夹下的文件

比如`web/public/musics/images/XXX.jpg`

```tsx
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
```

### 环境变量

文件`web/.env`

需要修改字段

```
NEXT_PUBLIC_WEBSITE_URL="https://www.zhuguishihundan.com"
NEXT_PUBLIC_WEBSITE_IMAGE_URL="https://www.zhuguishihundan.com/image/"

AUTH_SECRET="XXX"
GITHUB_WEBHOOK_SECRET="XXX"

SMTP_HOST="smtp.qq.com"
SMTP_PORT=587
SMTP_USER="3035486238@qq.com"
SMTP_PASS="XXX"
SMTP_SUBJECT="朱贵是混蛋"
SMTP_TEXT="你的验证码是："
```

> `NEXT_PUBLIC_WEBSITE_URL` 为服务器域名
>
> `NEXT_PUBLIC_WEBSITE_IMAGE_URL` 为服务器域名加上 `/image/`
>
> `AUTH_SECRET` 为一个字符串
>
> `GITHUB_WEBHOOK_SECRET` 为一个字符串
>
> `SMTP` 服务如何获取自行解决

### start.sh脚本

如果不需要设置`npm`代理可以删除这行命令

```sh
npm config set registry https://registry.npmmirror.com
```



### 项目依赖

```sh
$ npm install prisma --save-dev
$ npm install @prisma/client
$ npm install next-auth
$ npm install framer-motion
$ npm install @types/bcryptjs --save-dev
$ npm install nodemailer --save
$ npm install @types/nodemailer --save
$ npm install ioredis --save
$ npm install axios
$ npm install @nextui-org/react
$ npm install md-editor-rt
$ npm install markdown-it-mark
$ npm install mac-scrollbar
$ npm install rc-bullets-ts
$ npm install react-toastify
```

> ```sh
> $ npx prisma init
> $ prisma generate
> ```
