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
  drinkStartTime: string | null;
  height: number;
  weight: number;
  gender: string;
  bacAt5: number;
  alcoholAt5: number;
}

export class DrinkToday {
  drinkTotal: number;
  alcoholAmount: number;
  drinkStartTime: string | null;
  height: number;
  weight: number;
  gender: string;
  bacAt5: number;
  alcoholAt5: number;

  constructor(data: DrinkTodayData) {
    this.drinkTotal = data.drinkTotal;
    this.alcoholAmount = data.alcoholAmount;
    this.drinkStartTime = data.drinkStartTime;
    this.height = data.height;
    this.weight = data.weight;
    this.gender = data.gender;
    this.bacAt5 = data.bacAt5;
    this.alcoholAt5 = data.alcoholAt5;
  }

  get bloodAlcoholContent(): number {
    if (this.drinkTotal === 0) {
      return 0;
    }

    let genderConstant: number;
    if (this.gender === "여자") {
      genderConstant = 0.64;
    } else {
      genderConstant = 0.86;
    }

    const bac =
      ((this.alcoholAmount * 0.7) / (this.weight * 1000 * genderConstant)) *
      100;
    const roundedBAC = bac.toFixed(2);

    return parseFloat(roundedBAC);
  }

  private get elapsedHours(): number {
    if (this.drinkStartTime) {
      const currentTime = new Date().getTime();
      const startTime = new Date(this.drinkStartTime).getTime();
      const elapsedMilliseconds = currentTime - startTime;
      return elapsedMilliseconds / (1000 * 60 * 60);
    } else {
      return 0;
    }
  }

  get currentBloodAlcoholContent(): number {
    const initialBAC = this.bloodAlcoholContent;
    const currentBAC = Math.max(0, initialBAC - this.elapsedHours * 0.015);

    return parseFloat(currentBAC.toFixed(2));
  }

  private get intoxicationLevel(): IntoxicationLevel {
    const bac = this.currentBloodAlcoholContent;

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

  get cannotDriveFor(): number {
    const requiredTime = (200 * this.bloodAlcoholContent) / 3;
    const roundedRequiredTime = requiredTime.toFixed(2);

    return parseFloat(roundedRequiredTime);
  }

  get requiredTimeForDetox(): number {
    const requiredTimeInSeconds = this.alcoholAmount / 0.002;
    const requiredTimeInHours = (requiredTimeInSeconds / 3600).toFixed(1);

    return Number(requiredTimeInHours);
  }

  get stillNeedSoberTimeFor(): number {
    const requiredTime = (200 * this.bacAt5) / 3;
    const roundedRequiredTime = requiredTime.toFixed(2);

    return parseFloat(roundedRequiredTime);
  }

  get stillNeedDetoxTimeFor(): number {
    const requiredTimeInSeconds = this.alcoholAt5 / 0.002;
    const requiredTimeInHours = (requiredTimeInSeconds / 3600).toFixed(1);

    return Number(requiredTimeInHours);
  }

  update(updateData: Partial<DrinkTodayData>): DrinkToday {
    return new DrinkToday({
      ...this,
      ...updateData,
    });
  }
}
