export interface UserDataType {
  _id: string;
  email: string;
  refresh_token: string;
  id_token: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  locale: string;
}

export interface DailyFitnessData {
  userId: string;
  startDate: number;
  endDate: number;
  duration: number;
  step: number;
  dataSource: number;
}
