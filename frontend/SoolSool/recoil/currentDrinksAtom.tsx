import { atom } from "recoil";

export const currentDrinksAtom = atom<Record<number, number>>({
  key: "currentDrinks",
  default: {} as Record<number, number>,
});
