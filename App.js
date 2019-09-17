import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, AsyncStorage } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppLoading } from "expo"; // splash.png를 렌더링
import * as Font from "expo-font";
import { Asset } from "expo-asset";
import ApolloClient from "apollo-boost";
import { InMemoryCache } from "apollo-cache-inmemory";
import { persistCache } from "apollo-cache-persist";
import { ApolloProvider } from "react-apollo-hooks";
import { ThemeProvider } from "styled-components";
import apolloClientOptions from "./apollo";
import theme from "./theme";
import NavController from "./components/NavController";
import { AuthProvider } from "./contexts/AuthContext";

export default function App() {
  // 프리로드 상태 제어
  const [loaded, setLoaded] = useState(false);
  // 아폴로 프로바이더에 제공될 아폴로 클라이언트 객체 상태 제어
  const [client, setClient] = useState(null);
  // 로그인 상태 제어 null: 체크안한 상태 / true: 체크 후 로그인 확인 / false: 체크 후 비로그인 확인
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  // 특정 이미지 및 소스 파일 로드 에러를 해결하기 위해 로드과정이 필요
  const preLoad = async () => {
    try {
      // 폰트 로드
      await Font.loadAsync({
        ...Ionicons.font
      });
      // 에셋 로드
      await Asset.loadAsync([require("./assets/instacon.png")]);
      // 아폴로 클라이언트에 주입할 빈 메모리 캐시 객체 생성
      const cache = new InMemoryCache();
      // 캐시 객체에 해당 데이터를 주입
      await persistCache({
        cache,
        // 디바이스에 내장된 백업 데이터에 접근
        storage: AsyncStorage
      });
      // 아폴로 클라이언트에 불러온 데이터 주입
      const client = new ApolloClient({
        cache,
        ...apolloClientOptions
      });
      // 로그인 여부 확인
      const isLogIn = await AsyncStorage.getItem("isLoggedIn");
      if (!isLogIn || isLogIn === "false") {
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);
      }
      setLoaded(true);
      setClient(client);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    preLoad.call(this);
  }, []);
  return loaded && client && isLoggedIn !== null ? (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <AuthProvider isLoggedIn={isLoggedIn}>
          <NavController />
        </AuthProvider>
      </ThemeProvider>
    </ApolloProvider>
  ) : (
    <AppLoading />
  );
}
