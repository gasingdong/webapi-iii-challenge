export interface User {
  id: number;
  name: string;
}

export interface Post {
  id: number;
  text: string;
  user_id: number;
}
