import axiosInstance from "./axiosConfig";

export const fetchUserProfile = async () => {
  try {
    const res = await axiosInstance.get(`/api/v1/user/info`);
    return res.data;
  } catch (err) {
    throw new Error("user profile data를 가져오는데 실패");
  }
};
