import Input from '../../components/Input.tsx';
import { ChangeEvent, MouseEvent, useReducer, useRef, useState } from 'react';
import Button from '../../components/Button.tsx';
import FontButton from '../../components/FontButton.tsx';
import { userRegister, userResetPassword, userVerifyCode } from '../../api/user.ts';
import useNotification from '../../hooks/useNotification.ts';
import useAuth from '../../hooks/useAuth.ts';

type PageType = 'Login' | 'Register' | 'Reset Password';

type State = { username: string; email: string; code: string; password: string; };
type Action = { type: 'FIELD_CHANGE', field: keyof State, value: string } | { type: 'CLEAR_VALUES' };
const initialState: State = { username: '', email: '', code: '', password: '' };
const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'FIELD_CHANGE': return { ...state, [action.field]: action.value };
    case 'CLEAR_VALUES': return initialState;
  }
};

const Page = () => {
  const [pageType, setPageType] = useState<PageType>('Login');
  const formRef = useRef<HTMLFormElement | null>(null);
  const [state, dispatch] = useReducer(reducer, initialState);

  const { notify } = useNotification();
  const { login } = useAuth();

  const changePageType = (value: PageType) => {
    dispatch({ type: 'CLEAR_VALUES' });
    setPageType(value);
  };

  const submit = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!formRef.current) return;
    const isValid = formRef.current.checkValidity();
    if (!isValid) {
      formRef.current.reportValidity();
      return;
    }
    switch (pageType) {
      case 'Login': {
        login(state.email, state.password);
        break;
      }
      case 'Register': {
        userRegister(state.username, state.email, state.code, state.password)
          .then((res) => {
            notify(res.data.message);
            dispatch({ type: 'CLEAR_VALUES' });
          })
          .catch((err) => { notify(err.response.data.message); });
        break;
      }
      case 'Reset Password': {
        userResetPassword(state.email, state.code, state.password)
          .then((res) => {
            notify(res.data.message);
            dispatch({ type: 'CLEAR_VALUES' });
          })
          .catch((err) => { notify(err.response.data.message); });
        break;
      }
    }
  };

  const handleInputChangeEvent = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    dispatch({ type: 'FIELD_CHANGE', field: name as keyof State, value });
  };

  return (
    <main className="bg-mint-50 dark:bg-mint-950 h-screen w-screen flex flex-col items-center justify-center relative">
      <form
        className={'flex flex-col items-start justify-center border p-16 border-mint-950 dark:border-mint-50'}
        ref={formRef}
      >
        {/* 用户名 */}
        {pageType === 'Register' ? (
          <Input
            autoComplete={'name'} className={'w-64 mb-8'} label={'用户名'} name={'username'}
            onChange={handleInputChangeEvent}
            type={'text'} value={state.username}
          />
        ) : null}

        {/* 邮箱 */}
        <Input
          autoComplete={'email'} className={'w-64 mb-8'} label={'邮箱'} name={'email'}
          onChange={handleInputChangeEvent}
          type={'email'} value={state.email}
        />

        {/* 验证码 */}
        {pageType !== 'Login' ? (
          <div className={'w-full flex flex-row items-center justify-between'}>
            <Input
              autoComplete={'one-time-code'} className={'w-32 mb-8'} label={'验证码'} name={'code'}
              onChange={handleInputChangeEvent}
              type={'text'} value={state.code}
            />
            <Button
              onClick={() => {
                userVerifyCode(state.email)
                  .then((res) => { notify(res.data.message); })
                  .catch((err) => { notify(err.response.data.message); });
              }}
              type="button"
            />
          </div>
        ) : null}

        {/* 密码 */}
        {pageType === 'Login' ? (
          <Input
            autoComplete={'current-password'} className={'w-64 mb-8'} label={'密码'} name={'password'}
            onChange={handleInputChangeEvent}
            type={'password'} value={state.password}
          />
        ) : (
          <Input
            autoComplete={'new-password'} className={'w-64 mb-8'} label={'密码'} name={'password'}
            onChange={handleInputChangeEvent}
            type={'password'} value={state.password}
          />
        )}

        <div className={'w-full mb-8 flex flex-row items-center justify-between'}>
          {pageType !== 'Login' ? (
            <>
              <FontButton className={'ml-6'} label={'返回'} onClick={() => changePageType('Login')} />
            </>
          ) : (
            <>
              <FontButton className={'ml-6'} label={'忘记密码'} onClick={() => changePageType('Reset Password')} />
              <FontButton className={'mr-6'} label={'注册账号'} onClick={() => changePageType('Register')} />
            </>
          )}
        </div>
        <Button
          label={pageType}
          onClick={submit}
          type="submit"
        />
      </form>
    </main>
  );
};

export default Page;
