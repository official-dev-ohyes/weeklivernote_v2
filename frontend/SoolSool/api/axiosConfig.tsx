import axios from "axios";
import { useRecoilValue } from "recoil";
import { accessTokenAtom } from "../recoil/auth";

const axiosInstance = axios.create({
  // 추후 .env 파일에 환경변수 생성해서 사용할 것
  baseURL: "https://soolsool.site",
  headers: {
    "Content-Type": "application/json",
  },
});

// Axios 인스턴스에 요청 전에 인터셉터해서 accessToken 추가
axiosInstance.interceptors.request.use(
  (config) => {
    //recoil에 저장된 accessToken을 가져옴
    const accessToken = useRecoilValue(accessTokenAtom);
    console.log("AccessToken 있는지 확인", accessToken);

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    console.log("AccessToken이 없습니다");
    return Promise.reject(error);
  }
);

export default axiosInstance;
