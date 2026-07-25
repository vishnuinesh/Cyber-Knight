import React, { useState, useEffect } from "react";
import {
  Calendar,
  Users,
  Briefcase,
  Clock,
  Database,
  Bell,
  Mail,
  Smartphone,
  LogOut,
  Search,
  BookOpen,
  MapPin,
  ChevronRight,
  Filter,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Award,
  Globe,
  Shield,
  Settings,
  HelpCircle,
  Map as MapIcon,
  Check,
  FileText,
  X,
  Building,
  BookmarkCheck,
  ChevronDown,
  User
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import SQLConsole from "./SQLConsole";
import Chatbot from "./Chatbot";
import CampusMap from "./CampusMap";
import { CampusEvent, Club, Faculty, TimetableItem, Notification } from "../types";

interface DashboardProps {
  user: { rollNumber: string; email: string };
  onLogout: () => void;
  notifications: Notification[];
  onTriggerNotification: (title: string, message: string, type: 'email' | 'push') => void;
  onRefreshNotifications: () => void;
}

export type TabType = 'events' | 'clubs' | 'faculty' | 'timetable' | 'map' | 'helpdesk' | 'sql';

// Deterministic student profile generator helper
export function getStudentProfile(rollNumber: string) {
  let sum = 0;
  for (let i = 0; i < rollNumber.length; i++) {
    sum += rollNumber.charCodeAt(i);
  }
  
  const firstNames = ["James", "Sarah", "Elena", "Alex", "David", "Emma", "John", "Grace", "Michael", "Sophia", "Robert", "Olivia", "Daniel", "Emily", "William", "Lily"];
  const lastNames = ["Connor", "Vance", "Miller", "Smith", "Turing", "Lovelace", "Tesla", "Curie", "Hopper", "Feynman", "Bohr", "Dirac", "Newton", "Franklin", "Galileo", "Pasteur"];
  const name = `${firstNames[sum % firstNames.length]} ${lastNames[(sum + 3) % lastNames.length]}`;

  const depts = [
    { name: "Computer Science (CSE)", code: "CSE", head: "Dr. Alan Turing", office: "CSE Block, Room 401" },
    { name: "Electronics & Communication (ECE)", code: "ECE", head: "Dr. Nikola Tesla", office: "ECE Block, Room 210" },
    { name: "Artificial Intelligence & Data Science (AI DS)", code: "AI DS", head: "Dr. Yann LeCun", office: "AI DS Block, Room 501" },
    { name: "Artificial Intelligence & Machine Learning (AI ML)", code: "AI ML", head: "Dr. Arthur Samuel", office: "AI ML Block, Room 601" },
    { name: "Electrical & Electronics (EEE)", code: "EEE", head: "Dr. Michael Faraday", office: "EEE Block, Room 101" },
    { name: "Instrumentation & Control (ICE)", code: "ICE", head: "Dr. Rudolf Kalman", office: "ICE Block, Room 201" },
    { name: "Mechanical (MECH)", code: "MECH", head: "Dr. James Watt", office: "MECH Block, Room 301" },
    { name: "Civil & Aerospace (AERO)", code: "AERO", head: "Dr. Wernher von Braun", office: "AERO Block, Room 701" }
  ];
  
  const dept = depts[sum % depts.length];
  const year = (sum % 4) + 1;
  const section = (sum % 2) === 0 ? "A" : "B";
  const studentClass = `${dept.code} - Year ${year}, Sec ${section}`;
  
  const facultyIncharge = {
    name: dept.head,
    office: dept.office,
    email: `${dept.head.toLowerCase().replace("dr. ", "").replace("prof. ", "").replace(" ", ".")}@cyberknights.edu`,
    phone: `+1 (555) 019-${100 + (sum % 900)}`
  };
  
  return {
    name,
    department: dept.name,
    deptCode: dept.code,
    year: `${year}${year === 1 ? 'st' : year === 2 ? 'nd' : year === 3 ? 'rd' : 'th'} Year`,
    class: studentClass,
    facultyIncharge
  };
}

// Deterministic student timetable generator
export function getStudentTimetable(rollNumber: string): TimetableItem[] {
  const profile = getStudentProfile(rollNumber);
  const deptCode = profile.deptCode;
  
  const courses: Record<string, { code: string; subject: string; room: string; faculty: string }[]> = {
    CSE: [
      { code: "CSE-101", subject: "Introduction to Programming & Computing", room: "Lab 101, CSE Block", faculty: "Dr. Alan Turing" },
      { code: "MAT-101", subject: "Discrete Mathematics & Graph Theory", room: "Room 401, CSE Block", faculty: "Dr. Tim Berners-Lee" },
      { code: "PHY-103", subject: "Applied Physics for Computer Scientists", room: "Room 402, CSE Block", faculty: "Dr. Ken Thompson" },
      { code: "CSE-105", subject: "Digital Logic & Computer Organization", room: "Lab 203, CSE Block", faculty: "Dr. Barbara Liskov" },
      { code: "CSE-108", subject: "Systems Engineering Lab", room: "Lab 310, CSE Block", faculty: "Prof. Linus Torvalds" }
    ],
    ECE: [
      { code: "ECE-101", subject: "Solid State Devices & Circuits", room: "ECE Lab 210, ECE Block", faculty: "Dr. Nikola Tesla" },
      { code: "ECE-102", subject: "Information Theory & Coding Systems", room: "Room 211, ECE Block", faculty: "Prof. Claude Shannon" },
      { code: "MAT-104", subject: "Differential Equations & Signal Calculus", room: "Room 212, ECE Block", faculty: "Dr. Heinrich Hertz" },
      { code: "ECE-103", subject: "Microprocessors & Embedded Hardware", room: "ECE Lab 213, ECE Block", faculty: "Dr. Guglielmo Marconi" },
      { code: "ECE-104", subject: "Wireless Communications & Antenna Arrays", room: "Room 214, ECE Block", faculty: "Prof. Edwin Armstrong" }
    ],
    "AI DS": [
      { code: "AIDS-101", subject: "Principles of Artificial Intelligence", room: "AI Lab 501, AI DS Block", faculty: "Dr. Yann LeCun" },
      { code: "AIDS-102", subject: "Machine Learning Models & Optimization", room: "AI Lab 502, AI DS Block", faculty: "Prof. Fei-Fei Li" },
      { code: "AIDS-103", subject: "Big Data & Predictive Analytics", room: "Room 503, AI DS Block", faculty: "Dr. Andrew Ng" },
      { code: "AIDS-104", subject: "Deep Neural Networks & Visual Systems", room: "AI Lab 504, AI DS Block", faculty: "Dr. Geoffrey Hinton" },
      { code: "AIDS-105", subject: "Statistical Data Foundations", room: "Room 505, AI DS Block", faculty: "Dr. Yoshua Bengio" }
    ],
    "AI ML": [
      { code: "AIML-101", subject: "Introduction to Machine Learning Core", room: "AI Lab 601, AI ML Block", faculty: "Dr. Arthur Samuel" },
      { code: "AIML-102", subject: "Reinforcement Learning & Game Theory", room: "AI Lab 602, AI ML Block", faculty: "Dr. Demis Hassabis" },
      { code: "AIML-103", subject: "Generative Models & GAN Architectures", room: "Room 603, AI ML Block", faculty: "Dr. Ian Goodfellow" },
      { code: "AIML-104", subject: "Robotic Perception & Autonomous Vision", room: "AI Lab 604, AI ML Block", faculty: "Prof. Sebastian Thrun" },
      { code: "AIML-105", subject: "Natural Language Processing Foundations", room: "Room 605, AI ML Block", faculty: "Dr. Daphne Koller" }
    ],
    EEE: [
      { code: "EEE-101", subject: "DC Circuits & Network Analysis", room: "EEE Lab 101, EEE Block", faculty: "Dr. Michael Faraday" },
      { code: "EEE-102", subject: "Alternating Current Machinery", room: "EEE Lab 102, EEE Block", faculty: "Dr. Thomas Edison" },
      { code: "EEE-103", subject: "Power Generation & Distribution Systems", room: "Room 103, EEE Block", faculty: "Prof. George Westinghouse" },
      { code: "EEE-104", subject: "Electromagnetic Wave Propagation Theory", room: "Room 104, EEE Block", faculty: "Dr. James Clerk Maxwell" },
      { code: "EEE-105", subject: "Analog Electronics & Operational Amplifiers", room: "Room 105, EEE Block", faculty: "Prof. Charles Proteus Steinmetz" }
    ],
    ICE: [
      { code: "ICE-101", subject: "Transducers & Physical Measurements", room: "ICE Lab 201, ICE Block", faculty: "Dr. Rudolf Kalman" },
      { code: "ICE-102", subject: "Signal Conditioning & Telemetry Systems", room: "ICE Lab 202, ICE Block", faculty: "Dr. Harry Nyquist" },
      { code: "ICE-103", subject: "Control Systems & Feedback Design", room: "Room 203, ICE Block", faculty: "Dr. Hendrik Wade Bode" },
      { code: "ICE-104", subject: "Process Instrumentation & Loop Control", room: "Room 204, ICE Block", faculty: "Prof. Albert Gopal" },
      { code: "ICE-105", subject: "Industrial Automation & PLC Programming", room: "Room 205, ICE Block", faculty: "Dr. William Myer" }
    ],
    MECH: [
      { code: "MECH-101", subject: "Thermodynamics & Heat Cycles", room: "MECH Lab 301, MECH Block", faculty: "Dr. James Watt" },
      { code: "MECH-102", subject: "Internal Combustion Engine Design", room: "MECH Lab 302, MECH Block", faculty: "Dr. Rudolf Diesel" },
      { code: "MECH-103", subject: "Fluid Mechanics & Turbo Machinery", room: "Room 303, MECH Block", faculty: "Prof. Henry Ford" },
      { code: "MECH-104", subject: "Dynamics of Rigid Mechanical Systems", room: "Room 304, MECH Block", faculty: "Dr. Nikolaus Otto" },
      { code: "MECH-105", subject: "Kinematics of Machinery Layouts", room: "Room 305, MECH Block", faculty: "Prof. Sadi Carnot" }
    ],
    AERO: [
      { code: "AERO-101", subject: "Rocket Propulsion & Flight Kinetics", room: "AERO Lab 701, AERO Block", faculty: "Dr. Wernher von Braun" },
      { code: "AERO-102", subject: "Aerodynamics & Wing Contour Flow", room: "AERO Lab 702, AERO Block", faculty: "Dr. Orville Wright" },
      { code: "AERO-103", subject: "Aircraft Structural Frame Engineering", room: "Room 703, AERO Block", faculty: "Prof. Wilbur Wright" },
      { code: "AERO-104", subject: "Astro-navigation & Spacecraft Orbit Mechanics", room: "Room 704, AERO Block", faculty: "Dr. Robert Goddard" },
      { code: "AERO-105", subject: "Supersonic Structural Design & Stealth", room: "Room 705, AERO Block", faculty: "Dr. Kelly Johnson" }
    ]
  };

  const selectedCourses = courses[deptCode] || courses.CSE;
  const days: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday')[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const slots = [
    "09:00 AM - 10:30 AM",
    "11:00 AM - 12:30 PM"
  ];

  const studentTimetable: TimetableItem[] = [];
  let idCounter = 1;
  const shiftIdx = rollNumber.length % 3;

  days.forEach((day, dayIdx) => {
    const lec1 = selectedCourses[(dayIdx + shiftIdx) % selectedCourses.length];
    const lec2 = selectedCourses[(dayIdx + shiftIdx + 2) % selectedCourses.length];
    
    studentTimetable.push({
      id: idCounter++,
      day: day,
      timeSlot: slots[0],
      subject: lec1.subject,
      room: lec1.room,
      facultyName: lec1.faculty,
      courseCode: lec1.code
    });

    studentTimetable.push({
      id: idCounter++,
      day: day,
      timeSlot: slots[1],
      subject: lec2.subject,
      room: lec2.room,
      facultyName: lec2.faculty,
      courseCode: lec2.code
    });
  });

  return studentTimetable;
}

// Deterministic student test timetable generator
export function getStudentTests(rollNumber: string): TimetableItem[] {
  const profile = getStudentProfile(rollNumber);
  const deptCode = profile.deptCode;
  
  // Return a set of 3 test items for different days (e.g., Monday, Wednesday, Friday)
  return [
    { id: 101, day: "Monday", timeSlot: "09:30 AM - 11:00 AM", subject: `Continuous Assessment Test 1: ${profile.deptCode} Core Theory`, room: "Seminar Hall A", facultyName: profile.facultyIncharge.name, courseCode: `${profile.deptCode}-101-T` },
    { id: 102, day: "Wednesday", timeSlot: "09:30 AM - 11:00 AM", subject: "Mathematics Applied Diagnostics", room: "Drawing Hall B", facultyName: "Dr. Ada Lovelace", courseCode: "MAT-101-T" },
    { id: 103, day: "Friday", timeSlot: "09:30 AM - 11:00 AM", subject: "Engineering Systems Calibration Test", room: "Main Block Lab 3", facultyName: "Dr. Richard Feynman", courseCode: "SYS-103-T" }
  ];
}

// Deterministic student exam timetable generator
export function getStudentExams(rollNumber: string): TimetableItem[] {
  const profile = getStudentProfile(rollNumber);
  // Return end-semester exam slots (e.g. Tuesday, Thursday)
  return [
    { id: 201, day: "Tuesday", timeSlot: "02:00 PM - 05:00 PM", subject: `End Semester Examination: ${profile.deptCode} Specialization Core`, room: "Central Examination Complex", facultyName: "Chief Superintendent", courseCode: `${profile.deptCode}-301-E` },
    { id: 202, day: "Thursday", timeSlot: "02:00 PM - 05:00 PM", subject: "Advanced Engineering Mathematics & Numerical Methods", room: "Central Examination Complex", facultyName: "Chief Superintendent", courseCode: "MAT-201-E" }
  ];
}

// Club Details static data for modal rendering
const clubDetailsData: Record<number, {
  achievements: string[];
  projects: string[];
  eventsConducted: string[];
  president: string;
  facultyIncharge: string;
  terms: string;
}> = {
  1: {
    achievements: [
      "🏆 1st Place at National Cyber-Defense Hackathon 2025",
      "🛡️ Discovered and patched 3 critical Zero-Day CVEs in university network grid",
      "🎯 Ranked Top 10 in Global DefCon CTF Qualifiers"
    ],
    projects: [
      "Project ShieldNode - An open-source campus visual security scanner",
      "DeepCortex - Adversarial machine learning model for malware detection"
    ],
    eventsConducted: [
      "Capture The Flag (CTF) Freshman Ingress 2026",
      "Locked & Loaded: Hardware Security & Lockpicking Workshop"
    ],
    president: "Sarah Connor (3rd Year CSF)",
    facultyIncharge: "Dr. Bruce Schneier (Office CSF 101)",
    terms: "I hereby pledge to uphold the ethical hacking code of conduct of Cyber Knight Academy. I will not engage in unauthorized penetration testing, credential decoding, or system disruption. All activities are monitored."
  },
  2: {
    achievements: [
      "🏆 Grand Champions of International RoboWars 2025",
      "🛰️ Developed autonomous solar-tracking drone swarm for crop intelligence",
      "🤖 Best Design Award at National Robotics Expo"
    ],
    projects: [
      "Project ExoArm - Low-cost bionic prosthetic arm with EMG sensor feedback",
      "HexaQuad - A 6-legged self-balancing search-and-rescue crawler"
    ],
    eventsConducted: [
      "Arduino & Embedded Systems Bootcamp",
      "Line-Follower Arena Battle Championship"
    ],
    president: "James Smith (3rd Year Robotics)",
    facultyIncharge: "Dr. Nikola Tesla (Office ECE 210)",
    terms: "I agree to adhere to strict hardware safety protocols in the Robotics workshops. I will handle high-voltage circuits and mechanical actuators with certified supervision and respect laboratory equipment limits."
  },
  3: {
    achievements: [
      "🏆 Winners of the Great Inter-University Debating Championship 2025",
      "✍️ Published 12 award-winning short stories in National Literary Anthology",
      "🎤 Best Speaker award at National MUN"
    ],
    projects: [
      "The Knightly Chronicle - Campus monthly digital newsletter and podcast",
      "Socrates Grid - Interactive digital forum for philosophical debate"
    ],
    eventsConducted: [
      "Model United Nations (MUN) 2025",
      "Creative Writing and Poetry Slam Night"
    ],
    president: "Elena Vance (4th Year English)",
    facultyIncharge: "Dr. Ada Lovelace (Office Science 205)",
    terms: "I agree to promote respectful, constructive debate in all speaking grids. I will maintain high literary standards and respect diverse opinions voiced in the public panels."
  },
  4: {
    achievements: [
      "🏆 Best Theatrical Production at National Youth Festival 2025",
      "🎨 Commissioned for the Massive Campus Mural Beautification Project",
      "🎼 Featured in Regional Symphonic Competition"
    ],
    projects: [
      "The Turing Test - Original multi-media sci-fi theatrical play",
      "Campus Sculpture Garden Installations"
    ],
    eventsConducted: [
      "Street Play on Cyber Hygiene & Privacy Awareness",
      "Annual Spring Arts & Craft Exhibition"
    ],
    president: "David Miller (3rd Year Fine Arts)",
    facultyIncharge: "Dr. Richard Feynman (Office Science 103)",
    terms: "I agree to contribute actively to rehearsals and studio workshops. I will handle costume, sound, paint, and stage craft tools with integrity and maintain creative excellence."
  }
};

// Event Details static data
const eventDetailsData: Record<number, {
  summary: string;
  rules: string[];
}> = {
  1: {
    summary: "The ultimate 24-hour offensive and defensive cybersecurity warfare. Teams will defend virtual servers while hacking into rival teams' machines to capture flags and gain network supremacy.",
    rules: [
      "Strictly no physical device access or DDoS attacks against competition infrastructure.",
      "Teams must consist of 2 to 4 members. Collaboration outside the team is strictly prohibited.",
      "All automated scan tools must be throttled to prevent server overload."
    ]
  },
  2: {
    summary: "Welcome to the grand showcase of Cyber Knight Academy's leading tech, robotics, and creative student associations. Meet team representatives, inspect hardware projects, and register for slots.",
    rules: [
      "Attendees must register at the reception desk to receive an attendance token.",
      "Demonstrations must be confined to the allocated society booth area.",
      "Respect lab property and refrain from unauthorized handling of drone components."
    ]
  },
  3: {
    summary: "An intensive seminar and workshop on Deep Learning, Convolutional Neural Networks, and modern Transformer architectures. Guided by leading department scientists.",
    rules: [
      "Bring a fully charged laptop with Python 3.10+ and PyTorch pre-installed.",
      "All workshop notebooks will be shared via our secure campus GitHub repository.",
      "Please arrive 15 minutes early to synchronize your cloud GPU instances."
    ]
  }
};

// Campus Circulars static data
const campusCirculars = [
  { id: 1, title: "Department Course Registration Deadline", date: "July 20, 2026", description: "Students in CSE, ECE, AI DS, AI ML, EEE, ICE, MECH, and AERO must finalize elective approvals with their respective designated HODs.", tag: "URGENT", style: "border-red-500/30 text-red-400 bg-red-950/20" },
  { id: 2, title: "Calibration of Lab Oscilloscopes & Drone Kits", date: "July 22, 2026", description: "The Instrumentation (ICE) and Aerospace (AERO) labs are hosting a joint hardware precision tuning workshop for freshman microcontroller boards.", tag: "WORKSHOP", style: "border-cyber-blue/30 text-cyber-blue bg-cyber-blue/10" },
  { id: 3, title: "Centralized End-Semester Exam Schedule Release", date: "July 24, 2026", description: "The exam cell has uploaded the test matrices and seating arrangements. Please check the integrated Timetable and Exam viewer for details.", tag: "ACADEMICS", style: "border-yellow-500/30 text-yellow-400 bg-yellow-950/20" }
];

const getClubEvents = (clubId: number, events: CampusEvent[]): CampusEvent[] => {
  if (clubId === 1) {
    return events.filter(e => e.id === 1 || e.title.toLowerCase().includes("cyber") || e.title.toLowerCase().includes("ctf"));
  }
  if (clubId === 2) {
    return events.filter(e => e.id === 2 || e.title.toLowerCase().includes("robot") || e.title.toLowerCase().includes("hardware"));
  }
  if (clubId === 3) {
    return events.filter(e => e.id === 3 || e.title.toLowerCase().includes("ai") || e.title.toLowerCase().includes("deep") || e.title.toLowerCase().includes("learning"));
  }
  return [];
};

export default function Dashboard({ user, onLogout, notifications, onTriggerNotification, onRefreshNotifications }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('events');
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [timetable, setTimetable] = useState<TimetableItem[]>([]);

  // Side tab & custom state declarations
  const [isSideTabOpen, setIsSideTabOpen] = useState(false);
  const [registeredEventIds, setRegisteredEventIds] = useState<number[]>([]);
  const [scheduleType, setScheduleType] = useState<'classes' | 'tests' | 'exams'>('classes');
  const [mapDestination, setMapDestination] = useState<string>("");
  const [expandedClubInProfile, setExpandedClubInProfile] = useState<number | null>(null);

  const [enrolledClubs, setEnrolledClubs] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`enrolled_${user.rollNumber}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [helpMessage, setHelpMessage] = useState("");
  const [helpLogs, setHelpLogs] = useState<{ query: string; reply: string; id: string }[]>(() => {
    try {
      const saved = localStorage.getItem(`helpdesk_${user.rollNumber}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [helpLoading, setHelpLoading] = useState(false);

  const [selectedClubForModal, setSelectedClubForModal] = useState<Club | null>(null);
  const [acceptedClubTerms, setAcceptedClubTerms] = useState(false);

  const [selectedEventForModal, setSelectedEventForModal] = useState<CampusEvent | null>(null);
  const [eventForTermsModal, setEventForTermsModal] = useState<CampusEvent | null>(null);
  const [acceptedEventTerms, setAcceptedEventTerms] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      return (localStorage.getItem(`theme_${user.rollNumber}`) as 'light' | 'dark') || 'dark';
    } catch {
      return 'dark';
    }
  });

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    try {
      localStorage.setItem(`theme_${user.rollNumber}`, newTheme);
    } catch (e) {
      console.error(e);
    }
  };

  // Sync enrolled clubs to local storage
  useEffect(() => {
    localStorage.setItem(`enrolled_${user.rollNumber}`, JSON.stringify(enrolledClubs));
  }, [enrolledClubs, user.rollNumber]);

  // Sync help logs
  useEffect(() => {
    localStorage.setItem(`helpdesk_${user.rollNumber}`, JSON.stringify(helpLogs));
  }, [helpLogs, user.rollNumber]);

  // Search/Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [facultyDeptFilter, setFacultyDeptFilter] = useState("All");
  const [eventCategoryFilter, setEventCategoryFilter] = useState("all");

  // Notifications toggle dropdown
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [registerLoading, setRegisterLoading] = useState<number | null>(null);

  // Load database tables
  const loadData = async () => {
    try {
      const [eventsRes, clubsRes, facultyRes, timetableRes, regRes] = await Promise.all([
        fetch("/api/events"),
        fetch("/api/clubs"),
        fetch("/api/faculty"),
        fetch("/api/timetable"),
        fetch(`/api/registrations/${user.rollNumber}`)
      ]);

      const [eventsData, clubsData, facultyData, timetableData, regData] = await Promise.all([
        eventsRes.json(),
        clubsRes.json(),
        facultyRes.json(),
        timetableRes.json(),
        regRes.json()
      ]);

      if (eventsData.success) setEvents(eventsData.events);
      if (clubsData.success) setClubs(clubsData.clubs);
      if (facultyData.success) setFaculty(facultyData.faculty);
      if (timetableData.success) setTimetable(timetableData.timetable);
      if (regData.success) {
        const ids = regData.registrations.map((r: any) => Number(r.eventId || r.event_id));
        setRegisteredEventIds(ids);
      }
    } catch (e) {
      console.error("Error fetching campus data:", e);
    }
  };

  useEffect(() => {
    loadData();
    onRefreshNotifications();
  }, [activeTab]);

  // Handle Event Registration
  const handleRegisterEvent = async (eventId: number) => {
    setRegisterLoading(eventId);
    try {
      const res = await fetch("/api/events/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rollNumber: user.rollNumber, eventId })
      });
      const data = await res.json();
      if (data.success) {
        onTriggerNotification(
          "Registration Successful",
          `Secured seat for event. Confirmation email has been sent to ${user.email}`,
          'push'
        );
        // Reload events and notifications
        loadData();
        onRefreshNotifications();
      } else {
        alert(data.error || "Failed to register.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRegisterLoading(null);
    }
  };

  // Handle Event Unregistration
  const handleUnregisterEvent = async (eventId: number) => {
    try {
      const res = await fetch("/api/events/unregister", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rollNumber: user.rollNumber, eventId })
      });
      const data = await res.json();
      if (data.success) {
        onTriggerNotification(
          "Exited Event",
          "Successfully unregistered. Your seat has been released.",
          'push'
        );
        loadData();
        onRefreshNotifications();
      } else {
        alert(data.error || "Failed to unregister.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Join club action
  const handleJoinClub = async (clubName: string) => {
    try {
      const res = await fetch("/api/clubs/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clubName })
      });
      const data = await res.json();
      if (data.success) {
        if (!enrolledClubs.includes(clubName)) {
          setEnrolledClubs(prev => [...prev, clubName]);
        }
        onTriggerNotification(
          "Club Application Filed",
          `Welcome to ${clubName}! Your request has been written using SQL. Security and member logs updated.`,
          'email'
        );
        onTriggerNotification(
          "Joined Club",
          `Membership confirmed for ${clubName}`,
          'push'
        );
        // Reload database counts
        loadData();
        onRefreshNotifications();
      }
    } catch (err) {
      console.error("Failed to join club:", err);
    }
  };

  const handleLeaveClub = async (clubName: string) => {
    try {
      const res = await fetch("/api/clubs/leave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clubName })
      });
      const data = await res.json();
      if (data.success) {
        setEnrolledClubs(prev => prev.filter(c => c !== clubName));
        onTriggerNotification(
          "Resigned Membership",
          `Successfully exited from ${clubName}. Your records have been updated.`,
          'push'
        );
        // Reload database counts
        loadData();
        onRefreshNotifications();
      }
    } catch (err) {
      console.error("Failed to leave club:", err);
    }
  };

  const handleHelpQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!helpMessage.trim()) return;

    const userMsg = helpMessage.trim();
    const lowerMsg = userMsg.toLowerCase();
    setHelpMessage("");
    setHelpLoading(true);

    // Auto-navigation detection based on query keywords
    let navigatedTo: string | null = null;
    if (lowerMsg.includes("map") || lowerMsg.includes("blueprint") || lowerMsg.includes("location") || lowerMsg.includes("where is")) {
      setActiveTab("map");
      navigatedTo = "Campus Map";
    } else if (lowerMsg.includes("timetable") || lowerMsg.includes("schedule") || lowerMsg.includes("exam") || lowerMsg.includes("test") || lowerMsg.includes("class")) {
      setActiveTab("timetable");
      navigatedTo = "My Timetable";
    } else if (lowerMsg.includes("club")) {
      setActiveTab("clubs");
      navigatedTo = "Student Clubs";
    } else if (lowerMsg.includes("faculty") || lowerMsg.includes("teacher") || lowerMsg.includes("advisor") || lowerMsg.includes("professor") || lowerMsg.includes("hod") || lowerMsg.includes("incharge")) {
      setActiveTab("faculty");
      navigatedTo = "Faculty Directory";
    } else if (lowerMsg.includes("event") || lowerMsg.includes("dashboard") || lowerMsg.includes("circular") || lowerMsg.includes("notice") || lowerMsg.includes("announcement")) {
      setActiveTab("events");
      navigatedTo = "Dashboard & Events";
    }

    if (navigatedTo) {
      onTriggerNotification(
        "Auto-Navigation Triggered",
        `Redirected to "${navigatedTo}" tab to assist with your inquiry.`,
        'push'
      );
    }

    // Optimistically insert user query
    const userLogId = String(Date.now());
    setHelpLogs(prev => [...prev, { query: userMsg, reply: "Consulting Cyber Knight core intelligence...", id: userLogId }]);

    try {
      const res = await fetch("/api/helpdesk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, rollNumber: user.rollNumber })
      });
      const data = await res.json();
      if (data.success) {
        setHelpLogs(prev => prev.map(log => log.id === userLogId ? { ...log, reply: data.reply } : log));
      } else {
        setHelpLogs(prev => prev.map(log => log.id === userLogId ? { ...log, reply: "Error: " + (data.error || "Intelligence link failure.") } : log));
      }
    } catch (err) {
      console.error(err);
      setHelpLogs(prev => prev.map(log => log.id === userLogId ? { ...log, reply: "Error contacting local backup systems." } : log));
    } finally {
      setHelpLoading(false);
    }
  };

  // Filter lists
  const filteredFaculty = faculty.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || f.office.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = facultyDeptFilter === "All" || f.department === facultyDeptFilter;
    return matchesSearch && matchesDept;
  });

  const filteredEvents = events.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) || e.venue.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = eventCategoryFilter === "all" || e.category === eventCategoryFilter;
    return matchesSearch && matchesCat;
  });

  const unreadNotifCount = notifications.filter(n => n.status === 'sent').length;

  return (
    <div 
      id="dashboard-container" 
      className={`min-h-screen flex flex-col font-sans select-none relative transition-colors duration-300 ${
        theme === 'light' 
          ? "bg-slate-50 text-slate-900" 
          : "bg-cyber-dark text-slate-100"
      }`}
    >
      {theme === 'light' && (
        <style dangerouslySetInnerHTML={{ __html: `
          /* Clean professional light theme overrides */
          #dashboard-container {
            background-color: #f8fafc !important;
            color: #0f172a !important;
          }
          #dashboard-container .bg-cyber-slate\\/40,
          #dashboard-container .bg-cyber-slate\\/30,
          #dashboard-container .bg-cyber-slate\\/20,
          #dashboard-container .bg-cyber-dark\\/95,
          #dashboard-container .bg-cyber-dark\\/85,
          #dashboard-container .bg-cyber-dark\\/80,
          #dashboard-container .bg-cyber-dark\\/60,
          #dashboard-container .bg-cyber-dark\\/40,
          #dashboard-container .bg-cyber-dark\\/50 {
            background-color: #ffffff !important;
            border-color: #e2e8f0 !important;
          }
          #dashboard-container header {
            background-color: #ffffff !important;
            border-bottom-color: #e2e8f0 !important;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05) !important;
          }
          #dashboard-container nav {
            background-color: #f1f5f9 !important;
            border-color: #cbd5e1 !important;
          }
          #dashboard-container nav button {
            color: #475569 !important;
          }
          #dashboard-container nav button[class*="bg-cyber-blue"] {
            background-color: #06b6d4 !important;
            color: #ffffff !important;
          }
          #dashboard-container .text-white,
          #dashboard-container h1,
          #dashboard-container h2,
          #dashboard-container h3,
          #dashboard-container h4 {
            color: #0f172a !important;
          }
          #dashboard-container .text-gray-300,
          #dashboard-container .text-gray-400,
          #dashboard-container .text-gray-500,
          #dashboard-container p {
            color: #475569 !important;
          }
          #dashboard-container .border-cyber-blue\\/5,
          #dashboard-container .border-cyber-blue\\/10,
          #dashboard-container .border-cyber-blue\\/15,
          #dashboard-container .border-cyber-blue\\/20,
          #dashboard-container .border-cyber-blue\\/25,
          #dashboard-container .border-cyber-blue\\/30,
          #dashboard-container .border-cyber-blue\\/35,
          #dashboard-container .border-cyber-blue\\/45 {
            border-color: #e2e8f0 !important;
          }
          #dashboard-container input,
          #dashboard-container select,
          #dashboard-container textarea {
            background-color: #ffffff !important;
            border-color: #cbd5e1 !important;
            color: #0f172a !important;
          }
          #dashboard-container .text-cyber-blue {
            color: #0891b2 !important;
          }
          #dashboard-container .text-cyber-neon {
            color: #0d9488 !important;
          }
          #dashboard-container button[class*="bg-cyber-slate"] {
            background-color: #f1f5f9 !important;
            color: #0f172a !important;
            border-color: #e2e8f0 !important;
          }
          #dashboard-container .cyber-grid {
            opacity: 0.02 !important;
          }
          /* Profile side tab drawer light theme */
          #dashboard-container .fixed[class*="bg-cyber-dark"] {
            background-color: #ffffff !important;
            border-color: #e2e8f0 !important;
            color: #0f172a !important;
          }
          #dashboard-container .fixed[class*="bg-cyber-dark"] .text-gray-300,
          #dashboard-container .fixed[class*="bg-cyber-dark"] .text-gray-400 {
            color: #475569 !important;
          }
          #dashboard-container .fixed[class*="bg-cyber-dark"] .text-white {
            color: #0f172a !important;
          }
        ` }} />
      )}
      {/* Background Cyber Glow Grid */}
      <div className="absolute inset-0 pointer-events-none z-0 cyber-grid opacity-20" />

      {/* Top Header */}
      <header className="relative z-30 bg-cyber-dark/95 border-b border-cyber-blue/15 backdrop-blur-md px-6 py-4 flex items-center justify-between shadow-lg">
        {/* Logo and Identity - Interactive to open Side Drawer */}
        <button
          onClick={() => setIsSideTabOpen(true)}
          className="flex items-center gap-3 text-left hover:opacity-85 transition-opacity group cursor-pointer"
          id="logo-trigger-side-tab"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyber-blue to-cyber-neon flex items-center justify-center border border-white/15 shadow-md shadow-cyber-blue/20">
            <Shield className="w-5.5 h-5.5 text-white group-hover:scale-105 transition-transform animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-display font-bold text-white uppercase tracking-wider flex items-center gap-1">
              CYBER <span className="text-cyber-blue font-extrabold">KNIGHT</span>
            </h1>
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">Campus Intelligence Node</span>
          </div>
        </button>

        {/* Navigation Tabs (Desktop) */}
        <nav className="hidden md:flex bg-cyber-slate/60 p-1 border border-cyber-blue/10 rounded-xl">
          {[
            { id: 'events', label: 'Dashboard & Events', icon: Calendar },
            { id: 'clubs', label: 'Student Clubs', icon: Users },
            { id: 'faculty', label: 'Faculty Directory', icon: Briefcase },
            { id: 'timetable', label: 'My Timetable', icon: Clock },
            { id: 'map', label: 'Campus Map', icon: MapIcon },
            { id: 'helpdesk', label: 'Help Desk', icon: HelpCircle }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => { setActiveTab(item.id as TabType); setSearchQuery(""); }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === item.id
                    ? "bg-cyber-blue text-white shadow-md shadow-cyber-blue/35"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* User Badge, Notifications, and Logout */}
        <div className="flex items-center gap-4">
          {/* Notifications Dropdown Toggle */}
          <div className="relative">
            <button
              id="notif-dropdown-trigger"
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              className="relative p-2 rounded-lg bg-cyber-slate/50 border border-cyber-blue/15 hover:border-cyber-blue/40 text-gray-300 hover:text-white transition-all cursor-pointer"
            >
              <Bell className="w-4.5 h-4.5" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded-full animate-bounce">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            {/* Notifications Panel */}
            <AnimatePresence>
              {showNotifDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  id="notifications-panel"
                  className="absolute right-0 mt-3 w-80 max-h-[400px] overflow-hidden bg-cyber-slate/95 border border-cyber-blue/30 rounded-xl shadow-2xl backdrop-blur-xl flex flex-col z-50 text-xs"
                >
                  <div className="p-3 border-b border-cyber-blue/15 bg-cyber-dark/80 flex justify-between items-center">
                    <span className="font-mono font-bold text-white uppercase tracking-wider">Campus Alert Grid</span>
                    <span className="text-[10px] font-mono text-cyber-blue uppercase">{notifications.length} Logs</span>
                  </div>
                  <div className="flex-1 overflow-y-auto divide-y divide-cyber-blue/10 max-h-[300px] custom-scrollbar">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-gray-500 font-mono">No notifications triggered yet.</div>
                    ) : (
                      notifications.map((notif) => (
                        <div key={notif.id} className="p-3 hover:bg-cyber-blue/5 transition-colors">
                          <div className="flex justify-between items-start gap-2 mb-1">
                            <span className="font-bold text-white font-sans">{notif.title}</span>
                            <span className="text-[8px] font-mono text-gray-500 uppercase">
                              {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-gray-300 leading-normal text-[11px] mb-2">{notif.message}</p>
                          <div className="flex items-center gap-1.5 text-[8px] font-mono uppercase tracking-widest font-bold">
                            {notif.type === 'email' ? (
                              <span className="text-cyber-blue bg-cyber-blue/10 border border-cyber-blue/20 px-1.5 py-0.5 rounded flex items-center gap-1">
                                <Mail className="w-3 h-3" /> Email Dispatched
                              </span>
                            ) : (
                              <span className="text-cyber-neon bg-emerald-950/40 border border-cyber-neon/20 px-1.5 py-0.5 rounded flex items-center gap-1 animate-pulse">
                                <Smartphone className="w-3 h-3" /> Push Alert popped
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User roll number and info */}
          <div className="hidden lg:flex flex-col text-right">
            <span className="text-xs font-mono font-bold text-cyber-blue tracking-wider">INITIATE #{user.rollNumber}</span>
            <span className="text-[9px] text-gray-400 font-mono truncate max-w-[150px]">{user.email}</span>
          </div>

          {/* Logout Button */}
          <button
            id="btn-logout"
            onClick={onLogout}
            className="flex items-center justify-center p-2 rounded-lg bg-red-950/40 border border-red-500/20 hover:border-red-500 text-red-400 hover:text-white transition-all cursor-pointer"
            title="Disconnect Ingress"
          >
            <LogOut className="w-4.5 h-4.5" />
          </button>
        </div>
      </header>

      {/* Mobile navigation tab buttons */}
      <div className="md:hidden flex bg-cyber-slate border-b border-cyber-blue/10 p-1 divide-x divide-cyber-blue/10 overflow-x-auto">
        {[
          { id: 'events', label: 'Events', icon: Calendar },
          { id: 'clubs', label: 'Clubs', icon: Users },
          { id: 'faculty', label: 'Faculty', icon: Briefcase },
          { id: 'timetable', label: 'Schedule', icon: Clock },
          { id: 'map', label: 'Map', icon: MapIcon },
          { id: 'helpdesk', label: 'Help', icon: HelpCircle }
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id as TabType); setSearchQuery(""); }}
              className={`flex-1 flex flex-col items-center justify-center py-2 text-[10px] font-mono uppercase tracking-wider gap-1 cursor-pointer min-w-[70px] ${
                activeTab === item.id ? "text-cyber-blue" : "text-gray-400"
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Main Container Content */}
      <main className="flex-1 p-6 relative z-10 max-w-7xl mx-auto w-full">
        {/* Dynamic Greeting & Subtitle */}
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-cyber-blue/10 pb-5">
          <div>
            <h2 className="text-2xl font-display font-bold text-white tracking-wide uppercase flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyber-blue" />
              welcome, <span className="text-cyber-blue font-extrabold">{getStudentProfile(user.rollNumber).name}</span>
            </h2>
            <p className="text-xs text-gray-400 mt-1 uppercase font-mono tracking-widest">
              Secured Connection Active • Academic Database Synchronization Complete
            </p>
          </div>

          {/* Quick search bar for filtering views */}
          {activeTab !== 'timetable' && activeTab !== 'sql' && (
            <div className="relative w-full md:w-80">
              <Search className="absolute inset-y-0 left-3 flex items-center text-gray-400 w-4.5 h-4.5 mt-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  activeTab === 'events' ? "Search events or locations..." :
                  activeTab === 'clubs' ? "Search student clubs..." : "Search faculty directory..."
                }
                className="w-full bg-cyber-slate/50 border border-cyber-blue/25 focus:border-cyber-blue text-xs text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none font-sans"
              />
            </div>
          )}
        </div>

        {/* RENDERING ACTIVE TABS */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            {/* 1. EVENTS VIEW */}
            {activeTab === 'events' && (
              <div className="space-y-8" id="events-grid-tab">
                {/* Event Filter and Stats Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-cyber-slate/40 border border-cyber-blue/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase font-bold text-gray-300">
                    <Filter className="w-4 h-4 text-cyber-blue" />
                    <span>Filter Timeline Grid:</span>
                    <div className="flex gap-1.5 ml-2">
                      {['all', 'upcoming', 'current', 'past'].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setEventCategoryFilter(cat)}
                          className={`px-3 py-1.5 rounded-md border text-[10px] uppercase font-bold transition-all cursor-pointer ${
                            eventCategoryFilter === cat
                              ? "bg-cyber-blue text-white border-cyber-blue shadow shadow-cyber-blue/25"
                              : "bg-cyber-dark/40 border-cyber-blue/10 text-gray-400 hover:text-white"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="text-[11px] font-mono text-gray-400 uppercase tracking-widest">
                    Synchronized Relational SQL Tables: <strong className="text-cyber-blue">EVENTS, REGISTRATIONS</strong>
                  </div>
                </div>

                {/* Academy Circulars Banner */}
                <div className="space-y-3" id="campus-notices-ticker">
                  <div className="flex items-center gap-2 mb-1">
                    <Bell className="w-4 h-4 text-cyber-neon animate-pulse" />
                    <span className="text-xs font-mono uppercase font-bold text-gray-300 tracking-wider">Active Campus Circulars & Intel Notices</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {campusCirculars.map((circ) => (
                      <div key={circ.id} className={`p-4 rounded-xl border ${circ.style} space-y-1.5 backdrop-blur-sm relative overflow-hidden`}>
                        <div className="absolute top-0 right-0 w-16 h-16 bg-white/2 rotate-45 translate-x-8 -translate-y-8" />
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-mono font-extrabold px-1.5 py-0.5 rounded border border-white/15 uppercase bg-white/5">{circ.tag}</span>
                          <span className="text-[9px] font-mono text-gray-400">{circ.date}</span>
                        </div>
                        <h4 className="text-xs font-sans font-bold text-white uppercase tracking-wide leading-tight">{circ.title}</h4>
                        <p className="text-[10px] text-gray-300 leading-relaxed">{circ.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Main Events Cards Grid */}
                {filteredEvents.length === 0 ? (
                  <div className="py-16 text-center text-gray-500 font-mono text-sm border border-cyber-blue/10 bg-cyber-slate/10 rounded-xl">
                    No records found matching query parameters.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map((ev) => {
                      const isPast = ev.category === 'past';
                      const isCurrent = ev.category === 'current';
                      return (
                        <motion.div
                          key={ev.id}
                          layout
                          className={`relative bg-cyber-slate/40 border rounded-xl overflow-hidden flex flex-col group transition-all duration-300 ${
                            isCurrent
                              ? "border-cyber-neon shadow-lg shadow-emerald-500/10"
                              : isPast
                                ? "border-gray-800 opacity-65"
                                : "border-cyber-blue/20 hover:border-cyber-blue/45"
                          }`}
                        >
                          {/* Banner Image */}
                          <div className="h-44 relative overflow-hidden bg-cyber-dark">
                            <img
                              src={ev.imageUrl}
                              alt={ev.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {/* Category Badge overlay */}
                            <div className="absolute top-3 left-3 flex gap-1.5">
                              <span className={`px-2.5 py-1 rounded-md text-[9px] font-mono font-bold uppercase border tracking-wider ${
                                isCurrent
                                  ? "bg-emerald-950/90 text-emerald-300 border-emerald-500/35 animate-pulse"
                                  : isPast
                                    ? "bg-gray-900/90 text-gray-400 border-gray-700"
                                    : "bg-cyber-blue/90 text-white border-cyber-blue/30"
                              }`}>
                                {ev.category}
                              </span>
                              <span className="px-2.5 py-1 rounded-md text-[9px] font-mono font-bold uppercase bg-cyber-slate/90 border border-cyber-blue/15 text-cyber-blue">
                                {ev.eligibleYear}
                              </span>
                            </div>
                          </div>

                          {/* Info area */}
                          <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                            <div className="space-y-2">
                              <h3 className="text-base font-display font-bold text-white group-hover:text-cyber-blue transition-colors leading-snug">
                                {ev.title}
                              </h3>
                              <p className="text-xs text-gray-400 leading-relaxed font-sans line-clamp-3">
                                {ev.description}
                              </p>
                            </div>

                            {/* Details meta */}
                            <div className="pt-3 border-t border-cyber-blue/10 space-y-2 text-[11px] font-mono text-gray-400">
                              <div className="flex items-center gap-2">
                                <Clock className="w-3.5 h-3.5 text-cyber-blue" />
                                <span>{ev.date} | {ev.time}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-3.5 h-3.5 text-cyber-blue" />
                                <span>{ev.venue}</span>
                              </div>
                            </div>

                            {/* CTAs */}
                            <div className="pt-2 flex items-center justify-between gap-2">
                              <div className="text-[10px] font-mono">
                                <span className="text-gray-500 uppercase block">Signed Up</span>
                                <strong className="text-white text-xs">{ev.registrationCount} Knights</strong>
                              </div>

                              <div className="flex gap-2">
                                <button
                                  onClick={() => setSelectedEventForModal(ev)}
                                  className="px-3 py-2 bg-cyber-slate/55 hover:bg-cyber-slate border border-cyber-blue/15 hover:border-cyber-blue/30 text-gray-300 hover:text-white text-xs font-mono uppercase tracking-wider rounded-lg transition-all cursor-pointer"
                                >
                                  Rules
                                </button>
                                {isPast ? (
                                  <button
                                    disabled
                                    className="px-3 py-2 bg-gray-800 text-gray-500 border border-gray-700 text-xs font-mono uppercase tracking-wider rounded-lg"
                                  >
                                    Ended
                                  </button>
                                ) : (
                                  <button
                                    id={`register-btn-${ev.id}`}
                                    disabled={registerLoading === ev.id}
                                    onClick={() => {
                                      setEventForTermsModal(ev);
                                      setAcceptedEventTerms(false);
                                    }}
                                    className="px-3 py-2 bg-cyber-blue hover:bg-cyan-600 border border-white/10 text-white text-xs font-mono uppercase tracking-wider rounded-lg transition-all flex items-center gap-1 shadow hover:shadow-cyber-blue/20 cursor-pointer disabled:opacity-50"
                                  >
                                    {registerLoading === ev.id ? "..." : "Register"}
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 2. CLUBS VIEW */}
            {activeTab === 'clubs' && (
              <div className="space-y-6">
                <div className="bg-cyber-slate/40 border border-cyber-blue/10 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider">Campus Club Directory</h3>
                    <p className="text-[11px] text-gray-400 font-mono mt-0.5">Explore active associations, coordinate leads, and submit registrations directly to the relational grid.</p>
                  </div>
                  <div className="text-[11px] font-mono text-gray-400 uppercase tracking-widest">
                    SQL Tables synchronized: <strong className="text-cyber-blue">CLUBS, NOTIFICATIONS</strong>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {clubs.map((club) => (
                    <div
                      key={club.id}
                      className="bg-cyber-slate/40 border border-cyber-blue/15 rounded-xl overflow-hidden flex flex-col md:flex-row shadow-lg hover:border-cyber-blue/35 transition-all group"
                    >
                      {/* Left image banner on desktop */}
                      <div className="md:w-44 h-48 md:h-auto relative shrink-0 bg-cyber-dark">
                        <img
                          src={club.imageUrl || "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=60"}
                          alt={club.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform"
                        />
                      </div>

                      {/* Details Area */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <h4 className="text-base font-display font-bold text-white uppercase tracking-wide group-hover:text-cyber-blue transition-colors">
                            {club.name}
                          </h4>
                          <p className="text-xs text-gray-400 leading-relaxed font-sans">{club.description}</p>
                        </div>

                        <div className="pt-3 border-t border-cyber-blue/10 space-y-1 text-[11px] font-mono text-gray-400">
                          <div>
                            <span className="text-gray-500 uppercase">Lead Strategist:</span> <strong className="text-white">{club.lead}</strong>
                          </div>
                          <div>
                            <span className="text-gray-500 uppercase">Comm Link:</span> <strong className="text-cyber-blue hover:underline">{club.contact}</strong>
                          </div>
                        </div>

                        <div className="pt-2 flex items-center justify-between">
                          <span className="text-xs font-mono text-cyber-neon font-bold">
                            {club.membersCount} active members
                          </span>
                          <button
                            id={`join-club-${club.id}`}
                            onClick={() => {
                              setSelectedClubForModal(club);
                              setAcceptedClubTerms(false);
                            }}
                            className={`px-4 py-2 border font-mono text-xs uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                              enrolledClubs.includes(club.name)
                                ? "bg-emerald-950/40 border-emerald-500/30 text-cyber-neon"
                                : "bg-cyber-slate hover:bg-cyber-blue border-cyber-blue/30 text-white"
                            }`}
                          >
                            {enrolledClubs.includes(club.name) ? "✓ Enrolled" : "View & Join"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. FACULTY VIEW */}
            {activeTab === 'faculty' && (
              <div className="space-y-6">
                {/* Faculty Filters */}
                <div className="bg-cyber-slate/40 border border-cyber-blue/10 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex flex-wrap gap-2 items-center text-xs font-mono">
                    <span className="text-gray-400 uppercase font-bold">Filter Department:</span>
                    {["All", "Computer Science & Engineering", "Software Engineering", "Cyber Security & Forensics", "Artificial Intelligence & Data Science", "Electronics & Communication Engineering", "Applied Sciences & Physics", "Mathematics"].map((dept) => (
                      <button
                        key={dept}
                        onClick={() => setFacultyDeptFilter(dept)}
                        className={`px-3 py-1.5 rounded-md border text-[10px] uppercase font-bold transition-all cursor-pointer ${
                          facultyDeptFilter === dept
                            ? "bg-cyber-blue text-white border-cyber-blue"
                            : "bg-cyber-dark/40 border-cyber-blue/10 text-gray-400 hover:text-white"
                        }`}
                      >
                        {dept.replace("Computer Science & Engineering", "CSE").replace("Software Engineering", "SE").replace("Applied Sciences & Physics", "Physics").replace("Mathematics", "Math")}
                      </button>
                    ))}
                  </div>
                  <div className="text-[11px] font-mono text-gray-400 uppercase tracking-widest">
                    SQL Tables synchronized: <strong className="text-cyber-blue">FACULTY</strong>
                  </div>
                </div>

                {/* Faculty Grid List */}
                {filteredFaculty.length === 0 ? (
                  <div className="py-16 text-center text-gray-500 font-mono text-sm border border-cyber-blue/10 bg-cyber-slate/10 rounded-xl">
                    No faculty found matching the current department filters.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredFaculty.map((fac) => (
                      <div
                        key={fac.id}
                        className="bg-cyber-slate/40 border border-cyber-blue/15 rounded-xl p-5 hover:border-cyber-blue/40 hover:shadow-lg hover:shadow-cyber-blue/5 transition-all flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-sm font-display font-bold text-white">{fac.name}</h4>
                              <span className="text-[10px] font-mono text-cyber-blue uppercase tracking-wider font-semibold block mt-0.5">{fac.designation}</span>
                            </div>
                            <span className="px-2 py-0.5 rounded text-[8px] font-mono uppercase bg-cyber-dark text-gray-400 border border-cyber-blue/10">
                              ID: #{fac.id}
                            </span>
                          </div>
                          <p className="text-[11px] font-sans text-gray-400 uppercase tracking-widest bg-cyber-dark/40 px-2 py-1.5 rounded border border-cyber-blue/5">
                            {fac.department}
                          </p>
                        </div>

                        <div className="mt-5 pt-4 border-t border-cyber-blue/10 space-y-1.5 font-mono text-xs text-gray-400">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Office coordinates:</span>
                            <span className="text-white flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-cyber-blue" />
                              {fac.office}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Comm Node:</span>
                            <span className="text-cyber-blue hover:underline break-all ml-4 truncate text-right">
                              {fac.email}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 4. TIMETABLE VIEW */}
            {activeTab === 'timetable' && (
              <div className="space-y-6">
                <div className="bg-cyber-slate/40 border border-cyber-blue/10 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider">Campus Timetable Schedule</h3>
                    <p className="text-[11px] text-gray-400 font-mono mt-0.5">Automated matrix for lectures, continuous assessments, and exams.</p>
                  </div>
                  <div className="text-[11px] font-mono text-gray-400 uppercase tracking-widest">
                    SQL Tables synchronized: <strong className="text-cyber-blue">TIMETABLE</strong>
                  </div>
                </div>

                {/* Schedule Type Selection Tabs */}
                <div className="flex flex-wrap gap-2 p-1.5 bg-cyber-slate/30 border border-cyber-blue/10 rounded-xl max-w-lg">
                  {[
                    { id: 'classes', label: 'Classes & Lectures', icon: BookOpen },
                    { id: 'tests', label: 'Assessment Tests', icon: FileText },
                    { id: 'exams', label: 'Semester Exams', icon: Calendar }
                  ].map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        onClick={() => setScheduleType(type.id as 'classes' | 'tests' | 'exams')}
                        className={`flex-1 min-w-[120px] flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg font-mono text-[10px] uppercase font-bold tracking-wider transition-all cursor-pointer ${
                          scheduleType === type.id
                            ? "bg-cyber-blue text-white shadow shadow-cyber-blue/25"
                            : "text-gray-400 hover:text-white hover:bg-cyber-blue/5"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{type.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Day Grid Display */}
                <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => {
                    const items = 
                      scheduleType === 'classes' 
                        ? getStudentTimetable(user.rollNumber) 
                        : scheduleType === 'tests' 
                          ? getStudentTests(user.rollNumber) 
                          : getStudentExams(user.rollNumber);
                    const dayLectures = items.filter(t => t.day === day);
                    return (
                      <div
                        key={day}
                        className="bg-cyber-slate/30 border border-cyber-blue/15 rounded-xl p-4 flex flex-col gap-4"
                      >
                        <div className="border-b border-cyber-blue/15 pb-2 text-center bg-cyber-dark/60 rounded-lg py-1.5 border">
                          <span className="font-display font-bold text-white uppercase tracking-wider text-xs block">{day}</span>
                        </div>

                        <div className="space-y-3 flex-1">
                          {dayLectures.length === 0 ? (
                            <div className="h-24 flex items-center justify-center text-[10px] font-mono text-gray-500 italic bg-cyber-dark/10 rounded-lg border border-dashed border-cyber-blue/5 text-center px-2">
                              {scheduleType === 'classes' ? "No Lectures Scheduled" :
                               scheduleType === 'tests' ? "No Assessments Scheduled" : "No Exams Scheduled"}
                            </div>
                          ) : (
                            dayLectures.map((lec) => (
                              <div
                                key={lec.id}
                                className={`p-3 border rounded-lg hover:border-cyber-blue/35 transition-all space-y-2 flex flex-col justify-between min-h-[140px] ${
                                  scheduleType === 'classes'
                                    ? "bg-cyber-dark/60 border-cyber-blue/10"
                                    : scheduleType === 'tests'
                                      ? "bg-amber-950/15 border-amber-500/15 text-amber-100"
                                      : "bg-red-950/15 border-red-500/15 text-red-100"
                                }`}
                              >
                                <div className="space-y-1">
                                  <div className="flex justify-between items-center text-[10px] font-mono">
                                    <span className={
                                      scheduleType === 'classes'
                                        ? "text-cyber-blue font-bold"
                                        : scheduleType === 'tests'
                                          ? "text-amber-400 font-bold"
                                          : "text-red-400 font-bold"
                                    }>{lec.courseCode}</span>
                                    <span className="text-gray-500 uppercase flex items-center gap-0.5">
                                      <BookOpen className="w-3 h-3" /> Info
                                    </span>
                                  </div>
                                  <h4 className="text-xs font-display font-bold text-white leading-normal line-clamp-2">
                                    {lec.subject}
                                  </h4>
                                </div>

                                <div className="space-y-1 text-[10px] font-mono text-gray-400 pt-2 border-t border-cyber-blue/5">
                                  <div className="flex items-center gap-1.5 text-cyber-neon font-semibold">
                                    <Clock className="w-3 h-3 shrink-0" />
                                    <span>{lec.timeSlot}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <MapPin className="w-3 h-3 text-cyber-blue shrink-0" />
                                    <span className="truncate">{lec.room}</span>
                                  </div>
                                  <div className="text-[9px] text-gray-500 font-semibold truncate block">
                                    {lec.facultyName}
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 5. CAMPUS MAP VIEW */}
            {activeTab === 'map' && (
              <CampusMap user={user} />
            )}

            {/* 6. HELP DESK VIEW */}
            {activeTab === 'helpdesk' && (
              <div className="space-y-6">
                <div className="bg-cyber-slate/40 border border-cyber-blue/10 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider">AI Student Assistance Desk</h3>
                    <p className="text-[11px] text-gray-400 font-mono mt-0.5">Ask questions about your account management, courses, faculty, and college rules. Responded by Gemini AI.</p>
                  </div>
                  <div className="text-xs font-mono text-gray-400 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-cyber-blue animate-pulse" /> Secure Connection • Powered by Gemini AI
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Account Metadata Side-Panel */}
                  <div className="bg-cyber-slate/20 border border-cyber-blue/15 rounded-xl p-5 space-y-4 flex flex-col justify-between">
                    <div>
                      <span className="font-mono text-[10px] text-cyber-blue uppercase tracking-widest block mb-3">Verified Student Profile</span>
                      <div className="p-4 bg-cyber-dark/60 border border-cyber-blue/10 rounded-xl space-y-3">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-mono text-gray-500 uppercase">Roll Number / User ID</span>
                          <span className="text-sm font-mono font-bold text-white">{user.rollNumber}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] font-mono text-gray-500 uppercase">Respective Department</span>
                          <span className="text-xs font-sans font-semibold text-gray-200">{getStudentProfile(user.rollNumber).department}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] font-mono text-gray-500 uppercase">Respective Year & Class</span>
                          <span className="text-xs font-mono font-semibold text-cyber-neon">{getStudentProfile(user.rollNumber).year} • {getStudentProfile(user.rollNumber).class}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] font-mono text-gray-500 uppercase">Faculty Advisor In-charge</span>
                          <span className="text-xs font-sans font-bold text-white">{getStudentProfile(user.rollNumber).facultyIncharge.name}</span>
                          <span className="text-[10px] font-mono text-gray-400">{getStudentProfile(user.rollNumber).facultyIncharge.office}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-cyber-neon/5 border border-cyber-neon/15 rounded-xl text-[11px] text-gray-400 leading-normal font-sans">
                      ⚠️ <strong>Portal Guide</strong>: For physical grade sheets or course drops, you must consult your Faculty Advisor directly during their official office hours.
                    </div>
                  </div>

                  {/* Interactive Chat Board */}
                  <div className="lg:col-span-2 bg-cyber-slate/20 border border-cyber-blue/15 rounded-xl p-5 flex flex-col h-[480px] justify-between relative overflow-hidden">
                    <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
                    
                    {/* Log Header */}
                    <div className="border-b border-cyber-blue/15 pb-2 mb-3 flex justify-between items-center relative z-10">
                      <span className="font-mono text-[10px] text-gray-400 uppercase tracking-widest">Enquiry Log Stream</span>
                      <button
                        onClick={() => setHelpLogs([])}
                        className="text-[10px] font-mono text-red-400 hover:text-red-300 uppercase cursor-pointer"
                      >
                        Clear Session Logs
                      </button>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1 custom-scrollbar relative z-10">
                      {helpLogs.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                          <HelpCircle className="w-10 h-10 text-cyber-blue opacity-55 animate-bounce" />
                          <div>
                            <h4 className="text-xs font-mono font-bold text-white uppercase">No Active Inquiries</h4>
                            <p className="text-[11px] text-gray-500 max-w-xs mt-1 leading-normal font-sans">
                              Enter any question in the console below regarding your college schedule, class coordinates, or student advisor in-charge.
                            </p>
                          </div>
                        </div>
                      ) : (
                        helpLogs.map((log) => (
                          <div key={log.id} className="space-y-2">
                            {/* User query */}
                            <div className="flex justify-end">
                              <div className="bg-cyber-blue/20 border border-cyber-blue/30 text-white p-3 rounded-xl max-w-[80%] text-xs font-sans">
                                {log.query}
                              </div>
                            </div>
                            {/* Advisor reply */}
                            <div className="flex justify-start">
                              <div className="bg-cyber-dark/85 border border-cyber-blue/15 text-gray-300 p-3 rounded-xl max-w-[85%] text-xs space-y-1.5 font-sans relative">
                                <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-cyber-neon rounded-full border border-cyber-dark animate-ping opacity-75" />
                                <div className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-cyber-neon uppercase tracking-wider mb-1">
                                  <span>🤖 Cyber Advisor</span>
                                </div>
                                <p className="leading-relaxed whitespace-pre-wrap">{log.reply}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                      {helpLoading && (
                        <div className="flex justify-start">
                          <div className="bg-cyber-dark/50 border border-cyber-blue/5 text-gray-400 p-3 rounded-xl text-xs font-mono flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-cyber-blue animate-ping" />
                            Advisor core decoding request...
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Submit Box */}
                    <form onSubmit={handleHelpQuery} className="flex gap-2 relative z-10 border-t border-cyber-blue/15 pt-3">
                      <input
                        type="text"
                        value={helpMessage}
                        onChange={(e) => setHelpMessage(e.target.value)}
                        placeholder="Type query (e.g. Where is my advisor's office? / Who is my HOD?)"
                        className="flex-1 bg-cyber-dark/90 border border-cyber-blue/25 text-xs text-white rounded-lg px-4 py-3 focus:outline-none focus:border-cyber-neon font-sans"
                        disabled={helpLoading}
                      />
                      <button
                        type="submit"
                        className="px-5 py-3 bg-cyber-blue text-white font-mono text-xs uppercase tracking-wider rounded-lg border border-white/10 hover:bg-cyber-blue/80 transition-all cursor-pointer font-bold shrink-0 disabled:opacity-50"
                        disabled={helpLoading || !helpMessage.trim()}
                      >
                        Ask Gemini
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer credits and system coordinate lines */}
      <footer className="mt-12 py-6 border-t border-cyber-blue/15 text-center text-[11px] font-mono text-gray-500 relative z-10 bg-cyber-dark/95">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 CYBER KNIGHT ACADEMY • INDUCTION PROTOCOL SECURE</p>
          <div className="flex gap-4 uppercase tracking-widest text-[10px]">
            <span className="flex items-center gap-1 text-cyber-blue">
              <Globe className="w-3.5 h-3.5" /> ONLINE GRID ACCESS
            </span>
            <span className="text-gray-600">|</span>
            <span>RESTRICTED INGRESS FOR INITIATES ONLY</span>
          </div>
        </div>
      </footer>

      {/* Slide-out Left Side Drawer (Account Management, Settings, Enrolled Clubs & Events) */}
      <AnimatePresence>
        {isSideTabOpen && (
          <>
            {/* Backdrop blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSideTabOpen(false)}
              className="fixed inset-0 bg-black z-45 backdrop-blur-sm"
            />

            {/* Sliding Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-80 sm:w-96 bg-cyber-dark/95 border-r border-cyber-blue/25 shadow-2xl z-50 p-5 flex flex-col justify-between backdrop-blur-xl animate-fade-in"
            >
              {/* Header */}
              <div className="flex justify-between items-center border-b border-cyber-blue/15 pb-3">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-cyber-blue" />
                  <span className="font-display font-bold text-white uppercase tracking-wider text-sm">Student Profile</span>
                </div>
                <button
                  onClick={() => setIsSideTabOpen(false)}
                  className="p-1 rounded-md bg-cyber-slate hover:bg-cyber-blue/10 text-gray-400 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Container for compact options */}
              <div className="flex-1 overflow-y-auto my-3 pr-1 space-y-4 custom-scrollbar text-xs">
                {/* Personal Card */}
                <div className="bg-gradient-to-br from-cyber-blue/10 to-purple-950/10 border border-cyber-blue/20 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cyber-blue flex items-center justify-center font-bold text-white text-xs uppercase shadow-md shadow-cyber-blue/20 shrink-0">
                    {getStudentProfile(user.rollNumber).name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="font-display font-bold text-white text-xs truncate">welcome, {getStudentProfile(user.rollNumber).name}</h3>
                    <span className="font-mono text-[9px] text-gray-400 block tracking-wider uppercase">User ID: #{user.rollNumber}</span>
                  </div>
                </div>

                {/* Account Details Tab */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 px-1">
                    <Shield className="w-3.5 h-3.5 text-cyber-blue" />
                    <span className="font-mono text-[10px] uppercase font-bold text-gray-300 tracking-wider">Account Management</span>
                  </div>
                  <div className="bg-cyber-slate/30 border border-cyber-blue/10 rounded-xl p-3 space-y-2.5">
                    <div>
                      <span className="text-gray-500 font-mono text-[8px] uppercase block">Respective Department</span>
                      <span className="text-white font-sans font-semibold text-[11px] block">{getStudentProfile(user.rollNumber).department}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-gray-500 font-mono text-[8px] uppercase block">Respective Year</span>
                        <span className="text-cyber-neon font-mono font-bold block">{getStudentProfile(user.rollNumber).year}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 font-mono text-[8px] uppercase block">Class Section</span>
                        <span className="text-white font-mono block">{getStudentProfile(user.rollNumber).class}</span>
                      </div>
                    </div>
                    <div className="border-t border-cyber-blue/5 pt-2">
                      <span className="text-gray-500 font-mono text-[8px] uppercase block">Faculty Incharge Advisor</span>
                      <span className="text-white font-sans font-bold block">{getStudentProfile(user.rollNumber).facultyIncharge.name}</span>
                      <span className="text-gray-400 text-[9px] block">{getStudentProfile(user.rollNumber).facultyIncharge.office}</span>
                      <span className="text-cyber-blue text-[9px] block font-mono hover:underline">{getStudentProfile(user.rollNumber).facultyIncharge.email}</span>
                    </div>
                  </div>
                </div>

                {/* Enrolled Clubs Section */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 px-1">
                    <Users className="w-3.5 h-3.5 text-cyber-neon" />
                    <span className="font-mono text-[10px] uppercase font-bold text-gray-300 tracking-wider">Enrolled Clubs ({enrolledClubs.length})</span>
                  </div>
                  <div className="space-y-2">
                    {enrolledClubs.length === 0 ? (
                      <div className="text-[10px] font-mono text-gray-500 italic p-3 bg-cyber-slate/10 rounded-xl text-center border border-dashed border-cyber-blue/5">
                        No club memberships confirmed yet.
                      </div>
                    ) : (
                      enrolledClubs.map((cName) => {
                        const clubObj = clubs.find(cl => cl.name === cName);
                        const isExpanded = clubObj && expandedClubInProfile === clubObj.id;
                        return (
                          <div key={cName} className="bg-cyber-slate/20 border border-cyber-blue/10 rounded-xl overflow-hidden transition-all duration-200">
                            <button
                              type="button"
                              onClick={() => clubObj && setExpandedClubInProfile(isExpanded ? null : clubObj.id)}
                              className="w-full p-2.5 flex items-center justify-between hover:bg-cyber-blue/5 transition-colors cursor-pointer"
                            >
                              <span className="font-display font-bold text-white text-left text-xs truncate pr-2">{cName}</span>
                              <div className="flex items-center gap-1 shrink-0">
                                <span className="text-[8px] text-cyber-neon bg-emerald-950/40 border border-cyber-neon/20 px-1 py-0.5 rounded font-bold uppercase">Member</span>
                                <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                              </div>
                            </button>

                            {isExpanded && clubObj && (
                              <div className="p-3 bg-cyber-dark/40 border-t border-cyber-blue/10 space-y-2.5 text-[10px] font-sans text-gray-300">
                                <p className="leading-relaxed text-gray-400 italic">"{clubObj.description}"</p>
                                <div className="space-y-1 bg-cyber-dark/60 p-2 rounded-lg border border-cyber-blue/5">
                                  <div><span className="text-gray-500 font-mono text-[8px] uppercase">President:</span> <span className="text-white font-medium">{clubDetailsData[clubObj.id]?.president || "Student Lead"}</span></div>
                                  <div><span className="text-gray-500 font-mono text-[8px] uppercase">Faculty HOD:</span> <span className="text-white font-medium">{clubDetailsData[clubObj.id]?.facultyIncharge || "Advisor"}</span></div>
                                </div>
                                
                                {/* Happening & Upcoming Events */}
                                <div className="space-y-1.5 pt-1">
                                  <span className="font-mono text-[8px] text-cyber-blue uppercase font-bold block tracking-wider">Club Timeline Logs:</span>
                                  {getClubEvents(clubObj.id, events).length === 0 ? (
                                    <span className="text-[9px] text-gray-500 block italic">No events currently mapped.</span>
                                  ) : (
                                    getClubEvents(clubObj.id, events).map(ev => {
                                      const isCur = ev.category === 'current';
                                      return (
                                        <div key={ev.id} className="flex justify-between items-center bg-cyber-slate/30 p-1.5 rounded border border-cyber-blue/5">
                                          <span className="text-[10px] text-white truncate max-w-[140px]">{ev.title}</span>
                                          <span className={`text-[7px] uppercase font-mono px-1 py-0.5 rounded ${isCur ? "bg-emerald-950 border border-emerald-500 text-cyber-neon animate-pulse" : "bg-blue-950 border border-blue-500 text-cyber-blue"}`}>
                                            {isCur ? "Happening Now" : "Upcoming"}
                                          </span>
                                        </div>
                                      );
                                    })
                                  )}
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleLeaveClub(cName)}
                                  className="w-full mt-2 py-1 bg-red-950/40 hover:bg-red-950 text-red-400 hover:text-white rounded border border-red-500/15 font-mono text-[9px] uppercase tracking-wider transition-colors cursor-pointer text-center"
                                >
                                  Resign Membership
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Enrolled Events Section */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 px-1">
                    <BookmarkCheck className="w-3.5 h-3.5 text-cyber-blue" />
                    <span className="font-mono text-[10px] uppercase font-bold text-gray-300 tracking-wider">Enrolled Events ({registeredEventIds.length})</span>
                  </div>
                  <div className="space-y-2">
                    {registeredEventIds.length === 0 ? (
                      <div className="text-[10px] font-mono text-gray-500 italic p-3 bg-cyber-slate/10 rounded-xl text-center border border-dashed border-cyber-blue/5">
                        No registered event seats reserved yet.
                      </div>
                    ) : (
                      registeredEventIds.map((eId) => {
                        const ev = events.find(item => item.id === eId);
                        if (!ev) return null;
                        const detailedSummary = eventDetailsData[eId]?.summary || "Seat reservation active. Complete check-in clearance physically.";
                        return (
                          <div key={eId} className="bg-cyber-slate/20 border border-cyber-blue/10 rounded-xl p-3 space-y-2 text-xs">
                            <div className="flex justify-between items-start gap-1">
                              <div>
                                <h4 className="font-display font-bold text-white">{ev.title}</h4>
                                <span className="text-[9px] font-mono text-gray-400 block mt-0.5">{ev.date} • {ev.time}</span>
                              </div>
                              <span className="text-[8px] font-mono bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/20 px-1 py-0.5 rounded font-extrabold uppercase">Registered</span>
                            </div>

                            {/* Detailed summary inside */}
                            <div className="p-2 bg-cyber-dark/50 border border-cyber-blue/5 rounded text-[10px] text-gray-300 leading-normal font-sans">
                              {detailedSummary}
                            </div>

                            <button
                              type="button"
                              onClick={() => handleUnregisterEvent(eId)}
                              className="w-full py-1 bg-red-950/20 hover:bg-red-950/80 text-red-400 hover:text-white rounded border border-red-500/10 font-mono text-[9px] uppercase tracking-wider transition-colors cursor-pointer text-center"
                            >
                              Cancel Booking / Exit
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Theme Settings Section */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 px-1">
                    <Settings className="w-3.5 h-3.5 text-cyber-blue" />
                    <span className="font-mono text-[10px] uppercase font-bold text-gray-300 tracking-wider">Settings</span>
                  </div>
                  <div className="bg-cyber-slate/30 border border-cyber-blue/10 rounded-xl p-3.5 space-y-3 font-mono">
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest block">Choose Theme Option:</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleThemeChange('light')}
                        className={`py-2 rounded-lg border font-bold uppercase text-[9px] tracking-wider transition-all cursor-pointer ${
                          theme === 'light'
                            ? "bg-white text-black border-white shadow shadow-white/10 font-extrabold"
                            : "bg-cyber-dark/40 border-cyber-blue/15 text-gray-400 hover:text-white"
                        }`}
                      >
                        light theme
                      </button>
                      <button
                        type="button"
                        onClick={() => handleThemeChange('dark')}
                        className={`py-2 rounded-lg border font-bold uppercase text-[9px] tracking-wider transition-all cursor-pointer ${
                          theme === 'dark'
                            ? "bg-cyber-blue text-white border-cyber-blue shadow shadow-cyber-blue/25 font-extrabold"
                            : "bg-cyber-dark/40 border-cyber-blue/15 text-gray-400 hover:text-white"
                        }`}
                      >
                        dark theme
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Drawer Footer info */}
              <div className="border-t border-cyber-blue/10 pt-3 text-[9px] font-mono text-gray-500 space-y-0.5 flex justify-between items-center shrink-0">
                <span>INGRESS COMPLIANT GRID</span>
                <span className="text-cyber-blue font-semibold">SECURE NODE</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Club Details Agreement Modal Dialog */}
      <AnimatePresence>
        {selectedClubForModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedClubForModal(null)}
              className="fixed inset-0 bg-black z-50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:max-w-xl mx-auto bg-cyber-dark border border-cyber-blue/35 shadow-2xl p-6 rounded-2xl z-50 text-xs flex flex-col gap-4 max-h-[85vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex justify-between items-start border-b border-cyber-blue/15 pb-3">
                <div>
                  <span className="text-[9px] font-mono text-cyber-blue uppercase tracking-widest font-bold">Campus Club Charter</span>
                  <h3 className="text-lg font-display font-extrabold text-white uppercase mt-0.5">{selectedClubForModal.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedClubForModal(null)}
                  className="p-1 rounded bg-cyber-slate hover:bg-cyber-blue/15 text-gray-400 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Achievements & Projects list */}
              <div className="space-y-3 font-sans">
                {clubDetailsData[selectedClubForModal.id] ? (
                  <>
                    <div className="space-y-1.5">
                      <h4 className="font-mono text-[10px] font-bold text-cyber-neon uppercase tracking-wider flex items-center gap-1">
                        🏆 Legendary Achievements
                      </h4>
                      <ul className="space-y-1 text-gray-300 list-disc list-inside bg-cyber-slate/25 p-3 rounded-xl border border-cyber-blue/5">
                        {clubDetailsData[selectedClubForModal.id].achievements.map((ach, idx) => (
                          <li key={idx} className="leading-relaxed">{ach}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="font-mono text-[10px] font-bold text-cyber-blue uppercase tracking-wider flex items-center gap-1">
                        ⚙️ Live Club Projects
                      </h4>
                      <ul className="space-y-1 text-gray-300 list-disc list-inside bg-cyber-slate/25 p-3 rounded-xl border border-cyber-blue/5">
                        {clubDetailsData[selectedClubForModal.id].projects.map((proj, idx) => (
                          <li key={idx} className="leading-relaxed">{proj}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="font-mono text-[10px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1">
                        📅 Events Conducted
                      </h4>
                      <ul className="space-y-1 text-gray-300 list-disc list-inside bg-cyber-slate/25 p-3 rounded-xl border border-cyber-blue/5">
                        {clubDetailsData[selectedClubForModal.id].eventsConducted.map((ev, idx) => (
                          <li key={idx} className="leading-relaxed">{ev}</li>
                        ))}
                      </ul>
                    </div>

                    {/* President & Faculty */}
                    <div className="grid grid-cols-2 gap-4 bg-cyber-slate/40 p-3 rounded-xl border border-cyber-blue/10">
                      <div>
                        <span className="text-[9px] font-mono text-gray-500 uppercase block">Student President</span>
                        <span className="text-white font-bold block">{clubDetailsData[selectedClubForModal.id].president}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono text-gray-500 uppercase block">Faculty Incharge</span>
                        <span className="text-white font-bold block">{clubDetailsData[selectedClubForModal.id].facultyIncharge}</span>
                      </div>
                    </div>

                    {/* Terms Checkbox */}
                    <div className="pt-3 border-t border-cyber-blue/15 space-y-2">
                      <div className="p-3 bg-red-950/15 border border-red-500/15 rounded-xl text-[10px] text-gray-400 leading-relaxed font-mono">
                        {clubDetailsData[selectedClubForModal.id].terms}
                      </div>
                      <label className="flex items-start gap-2.5 p-2 rounded-lg bg-cyber-dark/80 border border-cyber-blue/10 cursor-pointer text-gray-300 hover:text-white transition-colors">
                        <input
                          type="checkbox"
                          checked={acceptedClubTerms}
                          onChange={(e) => setAcceptedClubTerms(e.target.checked)}
                          className="mt-0.5 rounded bg-cyber-dark border-cyber-blue/20 text-cyber-blue focus:ring-0 cursor-pointer"
                        />
                        <span className="text-[11px] font-sans leading-normal">
                          I accept the club code of ethics and volunteer guidelines before joining.
                        </span>
                      </label>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-400">Loading charter data...</p>
                )}
              </div>

              {/* Action */}
              <div className="flex gap-3 justify-end pt-2 border-t border-cyber-blue/15">
                <button
                  onClick={() => setSelectedClubForModal(null)}
                  className="px-4 py-2 bg-cyber-slate hover:bg-cyber-blue/10 text-gray-300 hover:text-white font-mono rounded-lg border border-cyber-blue/10 transition-all cursor-pointer"
                >
                  Close
                </button>
                {!enrolledClubs.includes(selectedClubForModal.name) ? (
                  <button
                    disabled={!acceptedClubTerms}
                    onClick={() => {
                      handleJoinClub(selectedClubForModal.name);
                      setSelectedClubForModal(null);
                    }}
                    className="px-5 py-2 bg-cyber-blue disabled:opacity-50 text-white font-mono rounded-lg border border-white/10 hover:bg-cyber-blue/80 transition-all cursor-pointer font-bold"
                  >
                    Confirm Enrollment
                  </button>
                ) : (
                  <button
                    disabled
                    className="px-5 py-2 bg-emerald-950/40 text-cyber-neon font-mono rounded-lg border border-emerald-500/20"
                  >
                    Successfully Enrolled
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Event Details & Rules Modal Dialog */}
      <AnimatePresence>
        {selectedEventForModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEventForModal(null)}
              className="fixed inset-0 bg-black z-50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:max-w-xl mx-auto bg-cyber-dark border border-cyber-blue/35 shadow-2xl p-6 rounded-2xl z-50 text-xs flex flex-col gap-4 max-h-[85vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex justify-between items-start border-b border-cyber-blue/15 pb-3">
                <div>
                  <span className="text-[9px] font-mono text-cyber-blue uppercase tracking-widest font-bold">Event Rules & Protocol</span>
                  <h3 className="text-lg font-display font-extrabold text-white uppercase mt-0.5">{selectedEventForModal.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedEventForModal(null)}
                  className="p-1 rounded bg-cyber-slate hover:bg-cyber-blue/15 text-gray-400 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Detailed Summary and rules */}
              <div className="space-y-4 font-sans leading-normal">
                {/* Event Image */}
                <div className="h-44 w-full rounded-xl overflow-hidden bg-cyber-dark">
                  <img
                    src={selectedEventForModal.imageUrl}
                    alt={selectedEventForModal.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-mono text-[10px] font-bold text-cyber-blue uppercase tracking-widest">📝 Event Brief / Detailed Summary</h4>
                  <p className="text-gray-300 bg-cyber-slate/25 p-3 rounded-xl border border-cyber-blue/5">
                    {eventDetailsData[selectedEventForModal.id]?.summary || selectedEventForModal.description}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-mono text-[10px] font-bold text-red-400 uppercase tracking-widest">⚠️ Strict Rules & Regulations</h4>
                  <ul className="space-y-1.5 text-gray-300 list-decimal list-inside bg-cyber-slate/25 p-3 rounded-xl border border-cyber-blue/5">
                    {(eventDetailsData[selectedEventForModal.id]?.rules || [
                      "Attendees must register their ticket in their academic portal to receive clearance.",
                      "Any form of unethical behavior, hacking outside sandboxed zones, or plagiarism is strictly prohibited.",
                      "Respect campus property and lab space. Clean up workstations after the event closes."
                    ]).map((rule, idx) => (
                      <li key={idx} className="leading-relaxed">{rule}</li>
                    ))}
                  </ul>
                </div>

                {/* Date / Venue info */}
                <div className="grid grid-cols-2 gap-4 bg-cyber-slate/40 p-3 rounded-xl border border-cyber-blue/10 text-gray-400 font-mono">
                  <div>
                    <span className="text-[9px] uppercase block">Timeline schedule</span>
                    <strong className="text-white text-xs">{selectedEventForModal.date} | {selectedEventForModal.time}</strong>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase block">Physical Venue Coordinates</span>
                    <strong className="text-cyber-neon text-xs">{selectedEventForModal.venue}</strong>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end pt-2 border-t border-cyber-blue/15">
                <button
                  onClick={() => setSelectedEventForModal(null)}
                  className="px-4 py-2 bg-cyber-slate hover:bg-cyber-blue/10 text-gray-300 hover:text-white font-mono rounded-lg border border-cyber-blue/10 transition-all cursor-pointer"
                >
                  Close
                </button>
                {selectedEventForModal.category !== 'past' ? (
                  <button
                    disabled={registerLoading === selectedEventForModal.id}
                    onClick={() => {
                      setEventForTermsModal(selectedEventForModal);
                      setAcceptedEventTerms(false);
                      setSelectedEventForModal(null);
                    }}
                    className="px-5 py-2 bg-cyber-blue hover:bg-cyan-600 disabled:opacity-50 text-white font-mono rounded-lg border border-white/10 transition-all cursor-pointer font-bold"
                  >
                    {registerLoading === selectedEventForModal.id ? "Securing..." : "Register Seat"}
                  </button>
                ) : (
                  <button
                    disabled
                    className="px-5 py-2 bg-gray-800 text-gray-500 font-mono rounded-lg border border-gray-700"
                  >
                    Event Ended
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Event Enrollment Terms & Conditions Modal Dialog */}
      <AnimatePresence>
        {eventForTermsModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setEventForTermsModal(null)}
              className="fixed inset-0 bg-black z-55 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:max-w-md mx-auto bg-cyber-dark border border-cyber-blue/35 shadow-2xl p-6 rounded-2xl z-55 text-xs flex flex-col gap-4"
            >
              <div className="flex justify-between items-start border-b border-cyber-blue/15 pb-3">
                <div>
                  <span className="text-[9px] font-mono text-cyber-blue uppercase tracking-widest font-bold">Terms & Conditions Agreement</span>
                  <h3 className="text-base font-display font-extrabold text-white uppercase mt-0.5">Enrollment Clearance</h3>
                </div>
                <button
                  onClick={() => setEventForTermsModal(null)}
                  className="p-1 rounded bg-cyber-slate hover:bg-cyber-blue/15 text-gray-400 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 font-sans text-gray-300 leading-relaxed">
                <p>
                  To secure your seat for <strong className="text-white">{eventForTermsModal.title}</strong>, please review and accept the official Campus Event Participation and Safety protocols:
                </p>
                <div className="p-3.5 bg-red-950/15 border border-red-500/15 rounded-xl text-[10.5px] font-mono text-gray-400 space-y-2">
                  <p>1. I agree to attend the scheduled event at the designated venue: <strong className="text-white">{eventForTermsModal.venue}</strong>.</p>
                  <p>2. I will adhere to all laboratory, network safety, and campus code of conduct policies during the session.</p>
                  <p>3. I authorize the academy administration to log my participation and seat reservation details in the SQL database.</p>
                </div>

                <label className="flex items-start gap-2.5 p-3 rounded-lg bg-cyber-dark border border-cyber-blue/10 cursor-pointer text-gray-300 hover:text-white transition-colors mt-2">
                  <input
                    type="checkbox"
                    checked={acceptedEventTerms}
                    onChange={(e) => setAcceptedEventTerms(e.target.checked)}
                    className="mt-0.5 rounded bg-cyber-dark border-cyber-blue/20 text-cyber-blue focus:ring-0 cursor-pointer"
                  />
                  <span className="text-[11px] font-sans leading-normal">
                    I accept the Event Participation Terms & Conditions.
                  </span>
                </label>
              </div>

              <div className="flex gap-3 justify-end pt-3 border-t border-cyber-blue/15">
                <button
                  onClick={() => setEventForTermsModal(null)}
                  className="px-4 py-2 bg-cyber-slate hover:bg-cyber-blue/10 text-gray-300 hover:text-white font-mono rounded-lg border border-cyber-blue/10 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  disabled={!acceptedEventTerms || registerLoading === eventForTermsModal.id}
                  onClick={() => {
                    handleRegisterEvent(eventForTermsModal.id);
                    setEventForTermsModal(null);
                  }}
                  className="px-5 py-2 bg-cyber-blue disabled:opacity-50 text-white font-mono rounded-lg border border-white/10 hover:bg-cyber-blue/80 transition-all cursor-pointer font-bold"
                >
                  {registerLoading === eventForTermsModal.id ? "Enrolling..." : "Agree & Enroll"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Gemini AI Chatbot */}
      <Chatbot rollNumber={user.rollNumber} onNavigateTab={(tab) => setActiveTab(tab)} />
    </div>
  );
}
