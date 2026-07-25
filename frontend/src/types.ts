export interface User {
  rollNumber: string;
  email: string;
  password?: string;
  joinedAt: string;
}

export interface CampusEvent {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  category: 'past' | 'current' | 'upcoming';
  eligibleYear: string;
  imageUrl: string;
  registrationCount: number;
}

export interface Club {
  id: number;
  name: string;
  description: string;
  lead: string;
  contact: string;
  membersCount: number;
  imageUrl?: string;
}

export interface Faculty {
  id: number;
  name: string;
  department: string;
  designation: string;
  email: string;
  office: string;
}

export interface TimetableItem {
  id: number;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  timeSlot: string;
  subject: string;
  room: string;
  facultyName: string;
  courseCode: string;
}

export interface Registration {
  id: number;
  rollNumber: string;
  eventId: number;
  registeredAt: string;
}

export interface Notification {
  id: number;
  rollNumber: string;
  type: 'email' | 'push';
  title: string;
  message: string;
  status: 'sent' | 'unread' | 'read';
  timestamp: string;
}

export interface SQLQueryLog {
  id: number;
  query: string;
  timestamp: string;
  success: boolean;
  rowsCount: number;
  error?: string;
}
