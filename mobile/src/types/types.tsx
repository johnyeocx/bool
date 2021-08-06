export interface Event {
  date: string;
  description: string;
  eventDP: string;
  id: string;
  name: string;
  photos: Array<string>;
  members: Array<string>;
}

export interface Message {
  id: string;
  messagetype: number;
  body: string;
  sender: string;
  room: string;
}
export interface ChatBucket {
  id: string;
  event: string;
  messages: Array<Message>;
  count: number;
  bucket: number;
  active: boolean;
}

export interface User {
  id: string;
  username: string;
  email: string;
  profileImg: string;
  settingsId: string;
  events: Array<string>;
  friendships: Array<string>;
}

export interface FriendshipType {
  id: string;
  source: string;
  target: string;
  sourceName: string;
  targetName: string;
  status: false;
}
