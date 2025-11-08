export interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  distanceOptions: number[];
  activity: string;
  attendees: number;
}

export interface Registration {
  id: string;
  eventId: string;
  userId: string;
  createdAt: Date;
}

export interface AppUser {
  id: string;
  username: string;
  email: string;
  registeredEvents: Registration[];
}