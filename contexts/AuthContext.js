import React, { createContext, useContext, useState } from "react";
import { AsyncStorage } from "react-native";

export const AuthContext = createContext();

export const AuthProvider = ({ isLoggedIn: isLoggedInProp, children }) => {
  // 로그인 상태 제어 null: 체크안한 상태 / true: 체크 후 로그인 확인 / false: 체크 후 비로그인 확인
  const [isLoggedIn, setIsLoggedIn] = useState(isLoggedInProp);
  // 로그인 이벤트
  const onLogin = async () => {
    try {
      await AsyncStorage.setItem("isLoggedIn", "true");
      setIsLoggedIn(true);
    } catch (e) {
      console.log(e);
    }
  };
  // 로그아웃 이벤트
  const onLogout = async () => {
    try {
      await AsyncStorage.setItem("isLoggedIn", "false");
      setIsLoggedIn(false);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <AuthContext.Provider value={{ isLoggedIn, onLogin, onLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
// 커스텀 훅: 로그인 여부 반환
export const useIsLoggedIn = () => {
  const { isLoggedIn } = useContext(AuthContext);
  return isLoggedIn;
};
// 커스텀 훅: 로그인 함수
export const useLogin = () => {
  const { onLogin } = useContext(AuthContext);
  return onLogin;
};
// 커스텀 훅: 로그아웃 함수
export const useLogout = () => {
  const { onLogout } = useContext(AuthContext);
  return onLogout;
};
