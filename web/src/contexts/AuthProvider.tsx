import { createContext, Dispatch, ReactNode, useCallback, useEffect, useReducer } from 'react';
import useNotification from '../hooks/useNotification.ts';
import { userJWTLogin, userLogin } from '../api/user.ts';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

type User = {
  id: string;
  avatar: string;
  username: string;
  email: string;
  power: number;
};

type State = { user: User | null };
type Action = { type: 'LOGIN'; payload: User } | { type: 'LOGOUT' };
const initialState: State = { user: null };
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
  }
};

export const AuthContext = createContext<{
  state: State;
  dispatch: Dispatch<Action>;
  login: (email: string, password: string) => void;
  logout: () => void;
} | null>(null);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { notify } = useNotification();
  const navigate = useNavigate();
  const [cookies, setCookies] = useCookies(['token']);

  const login = useCallback((email: string, password: string) => {
    userLogin(email, password)
      .then((res) => {
        dispatch({ type: 'LOGIN', payload: res.data.data.user });
        setCookies('token', res.data.data.token, { path: '/', expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
        notify(res.data.message);
        navigate('/');
      })
      .catch((err) => { notify(err.response.data.message); });
  }, [navigate, notify, setCookies]);

  const logout = useCallback(() => {
    notify('登出成功');
    dispatch({ type: 'LOGOUT' });
  }, [notify]);

  useEffect(() => {
    if (!cookies.token) { return; }
    userJWTLogin()
      .then((res) => {
        dispatch({ type: 'LOGIN', payload: res.data.data.user });
      })
      .catch((err) => {
        notify(err.response.data.message);
        navigate('/auth');
      });
  }, [cookies, navigate, notify]);

  return (
    <AuthContext.Provider value={{ state, dispatch, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
