import Input from '../../components/Input.tsx';
import { useState } from 'react';

const Page = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <main className="bg-mint-50 dark:bg-mint-950 h-screen w-screen flex flex-col items-center justify-center">
      <form className={'flex flex-col items-center justify-center'}>
        <Input
          autoComplete={'email'} className={'mb-8'} label={'Email'}
          onChange={(e) => setEmail(e.target.value)}
          type={'email'} value={email}
        />
        <Input
          autoComplete={'current-password'} className={'mb-8'} label={'Password'}
          onChange={(e) => setPassword(e.target.value)}
          type={'password'} value={password}
        />
        <button
          className={'text-mint-950 dark:text-mint-50'}
          onClick={(event) => {
            event.preventDefault();
            console.log(email, password);
          }}
        >
          submit
        </button>
      </form>
    </main>
  );
};

export default Page;
