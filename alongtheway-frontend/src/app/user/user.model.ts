export interface User {
  id: string;
  username: string;
  mpg: { $numberInt: string; };
  tankCapacity: { $numberInt: string; };
}




export interface UserForUpdate {
  id: string;
  username: string;
  mpg: number;
  tankCapacity: number;
}
