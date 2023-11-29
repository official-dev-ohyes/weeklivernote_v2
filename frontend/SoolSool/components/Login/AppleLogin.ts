import * as AppleAuthentication from "expo-apple-authentication";

export const appleLogin = async () => {
  console.log("sign in with apple.");
  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });
    console.log("@components/login/applelogin.ts: ", credential);
  } catch (e) {
    console.log(e);
  }
};
