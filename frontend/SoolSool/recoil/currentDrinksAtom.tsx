import { atom, selector } from "recoil";
import { getAlcoholAmountById } from "../utils/drinkUtils";

export const currentDrinksAtom = atom<Record<number, number>>({
  key: "currentDrinks",
  default: {} as Record<number, number>,
});

export const currentAlcoholAtom = selector<number>({
  key: "currentAlcohol",
  get: ({ get }) => {
    const currentDrinks = get(currentDrinksAtom);

    let totalAlcoholConsumed = 0;

    for (const id in currentDrinks) {
      if (currentDrinks.hasOwnProperty(id)) {
        const amount = currentDrinks[id];
        const alcoholAmount = getAlcoholAmountById(Number(id));
        totalAlcoholConsumed += amount * alcoholAmount;
      }
    }

    return totalAlcoholConsumed;
  },
});
