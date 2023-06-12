export interface User {
  _id: string;
  username: string;
  mpg: { $numberInt: string; };
  tankCapacity: { $numberInt: string; };
}




export interface UserForUpdate {
  _id: string;
  username: string;
  mpg: number;
  tankCapacity: number;
}
