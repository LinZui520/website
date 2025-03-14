import Input from '../../components/Input.tsx';
import { useRef, useState } from 'react';
import Button from '../../components/Button.tsx';
import FontButton from '../../components/FontButton.tsx';

type TPage = 'Login' | 'Register' | 'Reset Password';

const Page = () => {
  const [pageType, setPageType] = useState<TPage>('Login');
  const formRef = useRef<HTMLFormElement | null>(null);
  const usernameInput = useRef<HTMLDivElement | null>(null);
  const verifyCodeInput = useRef<HTMLDivElement | null>(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [password, setPassword] = useState('');
  return (
    <main className="bg-mint-50 dark:bg-mint-950 h-screen w-screen flex flex-col items-center justify-center relative">
      <form
        className={'flex flex-col items-start justify-center border p-16 border-mint-950 dark:border-mint-50'}
        onSubmit={() => { console.log(email, password); }}
        ref={formRef}
      >
        {/* 用户名 */}
        {pageType === 'Register' ? (
          <Input
            autoComplete={'name'} className={'w-64 mb-8'} label={'Username'}
            onChange={(e) => setUsername(e.target.value)}
            ref={usernameInput}
            type={'text'} value={username}
          />
        ) : null}

        {/* 邮箱 */}
        <Input
          autoComplete={'email'} className={'w-64 mb-8'} label={'Email'}
          onChange={(e) => setEmail(e.target.value)}
          type={'email'} value={email}
        />

        {/* 验证码 */}
        {pageType !== 'Login' ? (
          <div className={'w-full flex flex-row items-center justify-between'}>
            <Input
              autoComplete={'one-time-code'} className={'w-32 mb-8'} label={'VerifyCode'}
              onChange={(e) => setVerifyCode(e.target.value)}
              ref={verifyCodeInput}
              type={'text'} value={verifyCode}
            />
            <Button
              onClick={() => {
              }}
              type="button"
            />
          </div>
        ) : null}

        {/* 密码 */}
        {pageType === 'Login' ? (
          <Input
            autoComplete={'current-password'} className={'w-64 mb-8'} label={'Password'}
            onChange={(e) => setPassword(e.target.value)}
            type={'password'} value={password}
          />
        ) : (
          <Input
            autoComplete={'new-password'} className={'w-64 mb-8'} label={'Password'}
            onChange={(e) => setPassword(e.target.value)}
            type={'password'} value={password}
          />
        )}

        <div className={'w-full mb-8 flex flex-row items-center justify-between'}>
          {pageType !== 'Login' ? (
            <FontButton className={'ml-6'} label={'Login'} onClick={() => setPageType('Login')} />
          ) : (
            <>
              <FontButton className={'ml-6'} label={'Forget Password'} onClick={() => setPageType('Reset Password')} />
              <FontButton className={'mr-6'} label={'Register'} onClick={() => setPageType('Register')} />
            </>
          )}
        </div>
        <Button
          label={pageType}
          onClick={(event) => {
            event.preventDefault();
            if (!formRef.current) return;
            const isValid = formRef.current.checkValidity();
            if (!isValid) {
              formRef.current.reportValidity();
              return;
            }
            console.log(pageType);
          }}
          type="submit"
        />
      </form>
    </main>
  );
};

export default Page;
