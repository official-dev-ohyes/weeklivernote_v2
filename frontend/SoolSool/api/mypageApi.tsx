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

// export const updateProfileImage = async (newImage) => {
//   console.log("보낼값", newImage);
//   console.log("타입은", typeof newImage);
//   try {
//     const res = await axiosInstance.post(`/v2/user/profile`, newImage, {
//       headers: {
//         "Content-Type":
//           "multipart/form-data; boundary=someArbitraryUniqueString",
//       },
//       transformRequest: (data, headers) => {
//         return data;
//       },
//     });
//     return res.data;
//   } catch (err) {
//     console.log("??", err);
//     throw new Error("이미지 변경 요청 실패");
//   }
// };

export const updateProfileImage = async (body) => {
  console.log("보내기 직전에 formData확인", body);
  try {
    const res = await fetch(
      process.env.REACT_APP_BACK_URL + `/v2/user/profile`,
      {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data", // fetch는 자동으로 설정해주므로 주석 처리
        },
        body: body,
      }
    );

    if (!res.ok) {
      throw new Error("이미지 변경 요청 실패");
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.log("?왜 이미지 변경 요청이 안될까?", err);
    throw new Error("이미지 변경 요청 실패");
  }
};
