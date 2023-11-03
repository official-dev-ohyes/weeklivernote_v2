import axiosInstance from "./axiosConfig";
//
export const fetchDrink = async (drinkDate) => {
  try {
    const res = await axiosInstance.get(`/v1/drink/${drinkDate}`);
    console.log("조회 성공했다면", res.data);
    return res.data;
  } catch (err) {
    console.log("axios 호출 실패하는 이유", err);
    throw new Error("drink record 조회 get 요청 실패");
  }
};

export const createDrink = async (drinkData) => {
  try {
    const res = await axiosInstance.post(`/v1/drink`, drinkData);
    console.log("성공했다면", res.data);
    return res.data;
  } catch (err) {
    console.log("axios 호출 실패");
    throw new Error("drink record 기록 post 요청 실패");
  }
};

export const deleteDrink = async (day) => {
  try {
    const res = await axiosInstance.delete(`/v1/drink/daily/${day}`);
    console.log("삭제 성공", res);
    return res;
  } catch (err) {
    console.log("삭제 실패");
    throw new Error("음주기록 삭제 실패");
  }
};

// 월간 음주 기록 조회
export const fetchMonthRecord = async (day) => {
  try {
    const res = await axiosInstance.get(`/v1/drink/monthly/${day}`);
    console.log("성공!", res.data);
    return res.data;
  } catch (err) {
    console.log(err);
    throw new Error("실패!");
  }
};

// 일간 음주기록 요약 조회
export const fetchDailyDrink = async (day) => {
  try {
    const res = await axiosInstance.get(`/v1/drink/daily/${day}`);
    // console.log("성공!", res);
    return res.data;
  } catch (err) {
    throw new Error("실패!");
  }
};

// 일간 음주기록 상세 조회
export const fetchDailyDetail = async (day) => {
  try {
    const res = await axiosInstance.get(`/v1/drink/daily-detail/${day}`);
    // console.log("성공!", res.data);
    return res.data;
  } catch (err) {
    throw new Error("실패!");
  }
};
