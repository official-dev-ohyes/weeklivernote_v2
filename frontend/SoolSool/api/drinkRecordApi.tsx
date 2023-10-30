import axiosInstance from "./axiosConfig";
//
export const fetchDrink = async (drinkDate) => {
  try {
    const res = await axiosInstance.get(`/api/v1/drink/${drinkDate}`);
    console.log("조회 성공했다면", res);
    return res.data;
  } catch (err) {
    console.log("axios 호출 실패하는 이유", err);
    throw new Error("drink record 조회 get 요청 실패");
  }
};

export const createDrink = async (drinkData) => {
  try {
    const res = await axiosInstance.post(`/api/v1/drink`, drinkData);
    console.log("성공했다면", res);
    return res.data;
  } catch (err) {
    console.log("axios 호출 실패");
    throw new Error("drink record 기록 post 요청 실패");
  }
};
