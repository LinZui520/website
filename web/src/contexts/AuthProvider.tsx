import { createContext, Dispatch, ReactNode, useCallback, useEffect, useReducer } from 'react';
import { userJWTLogin, userLogin } from '../pages/auth/api.ts';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useRequest } from '../hooks/useRequest.ts';
import { User, UserDTO } from '../pages/auth/type';

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
  const { handleRequest } = useRequest();
  const navigate = useNavigate();
  const [cookies, setCookies] = useCookies(['token']);

  const login = useCallback((email: string, password: string) => handleRequest<UserDTO>(
    () => userLogin<UserDTO>(email, password),
    (res) => {
      dispatch({ type: 'LOGIN', payload: res.data.data.user });
      setCookies('token', res.data.data.token, { path: '/', expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
      navigate('/');
    }
  ), [handleRequest, navigate, setCookies]);

  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT' });
  }, []);

  useEffect(() => {
    if (!cookies.token) { return; }
    userJWTLogin<UserDTO>()
      .then((res) => dispatch({ type: 'LOGIN', payload: res.data.data.user }))
      .catch(() => {});
  }, [cookies]);

  return (
    <AuthContext.Provider value={{ state, dispatch, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
