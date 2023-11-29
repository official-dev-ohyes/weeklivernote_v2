import * as AppleAuthentication from "expo-apple-authentication";
import { appleLogin } from "./AppleLogin";

const AppleLoginButton = () => {
  return (
    <AppleAuthentication.AppleAuthenticationButton
      buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
      buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
      cornerRadius={15}
      style={{ width: 280, height: 60, marginTop: 12 }}
      onPress={appleLogin}
    />
  );
};

export default AppleLoginButton;
