export type UserDTO = {
  id: string;
  name: string | undefined;
  createdAt: Date;
  image?: string | undefined;
  createdAt?: string | null;
};

export type PostDTO = {
  id: string;
  content: string;
  createdAt: string;
  authorId: string;
  author: {
    id: string;
    name: string;
    image: string | null
  }
  comments: {
    id: string;
    content: string;
    createdAt: string;
    user: {
      id: string;
      name: string;
      image: string | null
    } | null;
  }[];
  reposts: {
    id: string;
    userId: string;
  }[]
  likes: {
    userId: string;
  }[];
};