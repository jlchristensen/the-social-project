export interface DailyQuestion {
  id: string;
  question_text: string;
  category: string;
  active_date: string;
}

export interface Answer {
  id: string;
  question_id: string;
  user_id: string;
  body: string;
  is_anonymous: boolean;
  created_at: string;
  // Joined from profiles
  display_name: string | null;
  // Computed
  upvote_count: number;
  reply_count: number;
  has_upvoted: boolean;
}

export interface Reply {
  id: string;
  answer_id: string;
  user_id: string;
  body: string;
  is_anonymous: boolean;
  created_at: string;
  display_name: string | null;
}
