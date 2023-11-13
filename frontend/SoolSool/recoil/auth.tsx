import { atom, selector } from "recoil";

export const accessTokenAtom = atom({
  key: "accessTokenAtom",
  default: null,
});

export const userNicknameAtom = atom({
  key: "userNicknameAtom",
  default: null,
});

export const userAlcoholLimitAtom = atom<number | null>({
  key: "userAlcochoLimitAtom",
  default: null,
});

export const roundedUserAlcoholLimitSelector = selector<number | null>({
  key: "roundedUserAlcoholLimitSelector",
  get: ({ get }) => {
    const userAlcoholLimit = get(userAlcoholLimitAtom);
    if (userAlcoholLimit !== null) {
      return Math.round(userAlcoholLimit * 10) / 10;
    }
    return null;
  },
});
