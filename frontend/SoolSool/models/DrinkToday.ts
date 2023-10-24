export interface DrinkTodayData {
  drinkTotal: number;
  alcoholAmount: number;
  drinkStartTime: number;
  height: number;
  weight: number;
  gender: string;
}

export class DrinkToday {
  drinkTotal: number;
  alcoholAmount: number;
  drinkStartTime: number;
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
    return (this.alcoholAmount / (this.weight * genderConstant)) * 100;
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
