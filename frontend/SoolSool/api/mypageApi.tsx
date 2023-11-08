import axiosInstance from "./axiosConfig";

export const fetchUserProfile = async () => {
  try {
    const res = await axiosInstance.get(`/v1/user/info`);
    return res.data;
  } catch (err) {
    throw new Error("user profile data를 가져오는데 실패");
  }
};

export const fetchUserNonAlc = async () => {
  try {
    const res = await axiosInstance.get(`/v1/user/stat`);
    return res.data;
  } catch (err) {
    throw new Error("user profile stat 가져오는데 실패");
  }
};

export const updateUserProfile = async (
  nickname,
  weight,
  height,
  gender,
  address,
  drinkInfo
) => {
  try {
    const res = await axiosInstance.patch(`/v1/user/info`, {
      nickname: nickname,
      weight: weight,
      height: height,
      gender: gender,
      address: address,
      drinkInfo: drinkInfo,
    });
    return res.data;
  } catch (err) {
    throw new Error("사용자 정보 수정 patch 요청 실패");
  }
};
