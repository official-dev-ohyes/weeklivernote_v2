import axiosInstance from "./axiosConfig";

// 일간 음주 총계 조회
export const fetchDrink = async (drinkDate: string) => {
  try {
    const res = await axiosInstance.get(`/v1/drink/${drinkDate}`);
    return res.data;
  } catch (err) {
    console.log("axios 호출 실패하는 이유", err);
    throw new Error("drink record 조회 get 요청 실패");
  }
};

// 음주 기록 추가
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

// 음주 기록 수정
export const updateDrink = async (drinkData) => {
  try {
    const res = await axiosInstance.patch(`/v1/drink`, drinkData);
    // console.log("성공했다면", res.data);
    return res.data;
  } catch (err) {
    console.log("axios 호출 실패");
    throw new Error("drink record 기록 patch 요청 실패");
  }
};

// 음주 기록 삭제 (개별 술 기록 삭제)
export const deleteDrink = async (drinkData) => {
  try {
    const res = await axiosInstance.delete(`/v1/drink-one`, {
      data: drinkData,
    });
    return res.data;
  } catch (err) {
    // console.log("axios 호출 실패");
    throw new Error("drink record 기록 delete 요청 실패");
  }
};

// 일간 음주 기록 완전 삭제
export const removeDrink = async (drinkDate) => {
  try {
    const res = await axiosInstance.delete(`/v1/drink/daily/${drinkDate}`);
    // console.log("성공했다면", res.data);
    return res.data;
  } catch (err) {
    // console.log("axios 호출 실패");
    throw new Error("drink record 기록 delete 요청 실패");
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
    throw new Error("월간 음주기록 조회 실패!");
  }
};

// 일간 음주기록 요약 조회
export const fetchDailyDrink = async (day) => {
  try {
    const res = await axiosInstance.get(`/v1/drink/daily/${day}`);
    console.log(`${day} 날짜의 요약 정보 조회 요청 성공!`, res.data);
    return res.data;
  } catch (err) {
    throw new Error(`음주기록 요약 조회 실패! 실패한 날짜는 ${day}`);
  }
};

// 일간 음주기록 상세 조회
export const fetchDailyDetail = async (day) => {
  try {
    const res = await axiosInstance.get(`/v1/drink/daily-detail/${day}`);
    // console.log("성공!", res.data);
    return res.data;
  } catch (err) {
    throw new Error(`음주기록 상세 조회 실패! 실패한 날짜는 ${day}`);
  }
};

export const postImage = async (day, imageUri) => {
  try {
    const res = await axiosInstance.post(`/v1/drink/photo/${day}`, {
      imageUri: imageUri,
    });
    console.log("사진 post 요청 성공", res.data);
    return res.data;
  } catch (err) {
    throw new Error("사진 post 요청 실패");
  }
};
