import axiosInstance from "./axiosConfig";

export const saveUserInfo = async (
  socialId,
  weight,
  height,
  gender,
  address,
  drinkInfo
) => {
  console.log("data확인", weight, height, gender, address, drinkInfo);
  try {
    const res = await axiosInstance.patch(`/v1/user`, {
      socialId: socialId,
      weight: weight,
      height: height,
      gender: gender,
      address: address,
      drinkInfo: drinkInfo,
    });
    return res.data;
  } catch (err) {
    throw new Error("사용자 정보 추가 patch 요청 실패");
  }
};
