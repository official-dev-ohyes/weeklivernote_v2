import axiosInstance from "./axiosConfig";

export const fetchMonthRecord = async (day) => {
  try {
    const res = await axiosInstance.get(`/v1/drink/monthly/${day}`);
    // console.log("성공!", res.data);
    return res.data;
  } catch (err) {
    // console.log(err);
    throw new Error("실패!");
  }
};

export const fetchDailyDrink = async (day) => {
  try {
    const res = await axiosInstance.get(`/v1/drink/daily/${day}`);
    console.log("성공!", res.data);
    return res.data;
  } catch (err) {
    throw new Error("실패!");
  }
};
