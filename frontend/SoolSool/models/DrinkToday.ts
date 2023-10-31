import { ImageProps } from "react-native";
import {
  soberImage,
  mildImage,
  moderateImage,
  highImage,
  veryHighImage,
  severeImage,
} from "../assets/index";

enum IntoxicationLevel {
  Sober,
  Mild,
  Moderate,
  High,
  VeryHigh,
  Severe,
}

const IntoxicationImageMap: Record<IntoxicationLevel, ImageProps["source"]> = {
  [IntoxicationLevel.Sober]: soberImage,
  [IntoxicationLevel.Mild]: mildImage,
  [IntoxicationLevel.Moderate]: moderateImage,
  [IntoxicationLevel.High]: highImage,
  [IntoxicationLevel.VeryHigh]: veryHighImage,
  [IntoxicationLevel.Severe]: severeImage,
};

interface DrinkTodayData {
  drinkTotal: number;
  alcoholAmount: number;
  drinkStartTime: string;
  height: number;
  weight: number;
  gender: string;
}

export class DrinkToday {
  drinkTotal: number;
  alcoholAmount: number;
  drinkStartTime: string;
  height: number;
  weight: number;
  gender: string;

  get bloodAlcoholContent(): number {
    let genderConstant: number;
    if (this.gender === "female") {
      genderConstant = 0.55;
    } else {
      genderConstant = 0.68;
    }
    return (this.alcoholAmount / (this.weight * 1000 * genderConstant)) * 100;
  }

  get intoxicationLevel(): IntoxicationLevel {
    const bac = this.bloodAlcoholContent;

    if (bac === 0) {
      return IntoxicationLevel.Sober;
    } else if (bac < 0.1) {
      return IntoxicationLevel.Mild;
    } else if (bac < 0.15) {
      return IntoxicationLevel.Moderate;
    } else if (bac < 0.25) {
      return IntoxicationLevel.High;
    } else if (bac < 0.35) {
      return IntoxicationLevel.VeryHigh;
    } else {
      return IntoxicationLevel.Severe;
    }
  }

  get intoxicationImage(): ImageProps["source"] {
    const level = this.intoxicationLevel;
    return IntoxicationImageMap[level];
  }

  get requiredTimeForDetox(): number {
    return 100;
  }

  constructor(data: DrinkTodayData) {
    this.drinkTotal = data.drinkTotal;
    this.alcoholAmount = data.alcoholAmount;
    this.drinkStartTime = data.drinkStartTime;
    this.height = data.height;
    this.weight = data.weight;
    this.gender = data.gender;
  }
}
