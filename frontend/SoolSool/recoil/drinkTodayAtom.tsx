import { atom } from "recoil";

export const drinkTodayAtom = atom<any>({
  key: "drinkToday",
  default: null,
});
