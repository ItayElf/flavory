export default interface User {
  idx: number;
  name: string;
  bio: string;
  link: string;
  followers: string[];
  following: string[];
  posts: number[];
}
