import axiosInstance from "./axiosConfig";

export const fetchHomeRoute = async (locationData) => {
  try {
    const res = await axiosInstance.post(`/v2/location`, locationData);
    // console.log("성공했다면", res.data);
    return res.data;
  } catch (err) {
    // console.log("경로 요청 axios 호출 실패", err);
    throw new Error("???");
  }
};
