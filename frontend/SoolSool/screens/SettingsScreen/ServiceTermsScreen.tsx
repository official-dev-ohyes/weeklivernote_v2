import { WebView } from "react-native-webview";

const ServiceTermsScreen = () => {
  return (
    <WebView
      source={{
        uri: "https://",
      }}
      style={{ flex: 1 }}
    />
  );
};

export default ServiceTermsScreen;
