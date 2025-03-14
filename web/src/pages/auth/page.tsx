import Input from '../../components/Input.tsx';
import { useRef, useState } from 'react';
import Button from '../../components/Button.tsx';

const Page = () => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <main className="bg-mint-50 dark:bg-mint-950 h-screen w-screen flex flex-col items-center justify-center">
      <form
        className={'flex flex-col items-start justify-center'}
        onSubmit={() => { console.log(email, password); }}
        ref={formRef}
      >
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
        <div className={'w-full flex flex-row items-center justify-between'}>
          <Button
            label="Login"
            onClick={(event) => {
              event.preventDefault();
              if (!formRef.current) return;
              const isValid = formRef.current.checkValidity();
              if (isValid) {
                console.log(email, password);
              } else {
                formRef.current.reportValidity();
              }
            }}
            type="submit"
          />
          <span className={'ml-6'}>Register</span>
        </div>
      </form>
    </main>
  );
};

export default Page;
