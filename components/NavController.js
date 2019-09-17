import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useIsLoggedIn, useLogin, useLogout } from "../contexts/AuthContext";
import styled from "styled-components";

const StyledView = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export default () => {
  const isLoggedIn = useIsLoggedIn();
  const onLogin = useLogin();
  const onLogout = useLogout();
  return (
    <StyledView>
      {isLoggedIn ? (
        <TouchableOpacity onPress={onLogout}>
          <Text>로그아웃</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={onLogin}>
          <Text>로그인</Text>
        </TouchableOpacity>
      )}
    </StyledView>
  );
};
