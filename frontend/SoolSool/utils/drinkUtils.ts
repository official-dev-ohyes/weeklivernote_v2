import { ImageProps } from "react-native";
import * as assets from "../assets";

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
