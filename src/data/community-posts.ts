export interface CommunityPost {
  id: string;
  author: string;
  avatar: string;
  date: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
  tag: string;
}

export const communityPosts: CommunityPost[] = [];
