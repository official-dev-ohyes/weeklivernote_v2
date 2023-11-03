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
