export interface User {
  id: string;
  username: string;
  mpg: number;
  tankCapacity: number;
}

export interface UpdateUser {
  mpg: number;
  tankCapacity: number;
}
