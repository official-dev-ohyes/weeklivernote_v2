import axios from "axios";
import { useRecoilValue } from "recoil";
import { accessTokenAtom } from "../recoil/Auth";

const axiosInstance = axios.create({
  // 추후 .env 파일에 환경변수 생성해서 사용할 것
  baseURL: "https://soolsool.site",
  headers: {
    "Content-Type": "application/json",
  },
});

// Axios 인스턴스에 요청 전에 인터셉터해서 토큰 추가
axiosInstance.interceptors.request.use(
  (config) => {
    //recoil에 저장된 accessToken을 가져옴
    const accessToken = useRecoilValue(accessTokenAtom);
    console.log("AccessToken?", accessToken);

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    console.log("엑세스 토큰이 없습니다");
    return Promise.reject(error);
  }
);

export default axiosInstance;
