import { ImageProps } from "react-native";
import * as assets from "../assets";
import drinkData from "../data/drinks.json";

const IdImageMap: Record<number, ImageProps["source"]> = {};

for (let i = 1; i <= 15; i++) {
  IdImageMap[i] = assets[`drink${i.toString().padStart(2, "0")}`];
}

export const getDrinkImageById = (id: number): ImageProps["source"] => {
  const image = IdImageMap[id];
  if (image === undefined) {
    throw new Error(`Invalid drink ID: ${id}`);
  }
  return image;
};

export const getIdByCategoryAndUnit = (
  category: string,
  unit: string
): number | null => {
  const matchingDrink = drinkData.find(
    (item) => item.name === category && item.unit === unit
  );
  return matchingDrink ? matchingDrink.id : null;
};
