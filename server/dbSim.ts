import fs from 'fs';
import path from 'path';
import { CampusEvent, Club, Faculty, TimetableItem, User, Registration, Notification, SQLQueryLog } from '../src/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'cyber_knight_db.json');

interface DatabaseSchema {
  users: User[];
  events: CampusEvent[];
  clubs: Club[];
  faculty: Faculty[];
  timetable: TimetableItem[];
  registrations: Registration[];
  notifications: Notification[];
  queryLog: SQLQueryLog[];
}

// Initial seed data
const initialEvents: CampusEvent[] = [
  {
    id: 1,
    title: "Freshers Orientation 2026",
    description: "Welcome to Cyber Knight Academy! Get to know your campus, faculty, and peers. Discover essential resources, student clubs, and take a guided tour of our modern engineering labs.",
    date: "2026-07-15",
    time: "09:00 AM - 01:00 PM",
    venue: "Main Convocation Hall",
    category: "past",
    eligibleYear: "1st Year Only",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60",
    registrationCount: 420
  },
  {
    id: 2,
    title: "Campus Coding Hackathon v1.0",
    description: "A fast-paced 12-hour hackathon to solve real campus problems. Build web solutions, work in teams, and win exciting tech prizes and mentorship opportunities.",
    date: "2026-07-18",
    time: "08:00 AM - 08:00 PM",
    venue: "Cyber Labs - Block B",
    category: "past",
    eligibleYear: "All Years",
    imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=60",
    registrationCount: 150
  },
  {
    id: 3,
    title: "Cyber Knight Capture The Flag (CTF)",
    description: "The ultimate cybersecurity showdown! Test your skills in cryptography, reverse engineering, web exploitation, and forensics. Perfect for freshers starting their security journey.",
    date: "2026-07-19",
    time: "10:00 AM - 06:00 PM",
    venue: "Advanced Networks Laboratory",
    category: "current",
    eligibleYear: "All Years",
    imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=60",
    registrationCount: 89
  },
  {
    id: 4,
    title: "Annual Club Exhibition Expo",
    description: "Explore and interact with all active student clubs. From Robotics and Cybersecurity to Drama and Literary clubs, find your community and register on the spot.",
    date: "2026-07-20",
    time: "11:00 AM - 04:00 PM",
    venue: "Student Activity Center (SAC) Courtyard",
    category: "current",
    eligibleYear: "All Years",
    imageUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=60",
    registrationCount: 235
  },
  {
    id: 5,
    title: "AI & Neural Networks Seminar",
    description: "An introductory session on machine learning, generative models, and neural network architectures. Led by senior industry experts and research faculty.",
    date: "2026-07-24",
    time: "02:00 PM - 04:30 PM",
    venue: "Newton Seminar Hall (Block A)",
    category: "upcoming",
    eligibleYear: "All Years",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=60",
    registrationCount: 112
  },
  {
    id: 6,
    title: "Autumn Cultural Music & Arts Fest",
    description: "Celebrate campus diversity with student performances, music bands, food stalls, art galleries, and a high-energy live concert under the stars.",
    date: "2026-08-05",
    time: "04:00 PM - 10:00 PM",
    venue: "Open Air Theater (OAT)",
    category: "upcoming",
    eligibleYear: "All Years",
    imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=60",
    registrationCount: 350
  },
  {
    id: 7,
    title: "Robotics Design & Assembly Workshop",
    description: "Hands-on workshop using Arduino boards and motor drivers. Learn structural assembly, basic motor control, and sensor integration to build your first autonomous rover.",
    date: "2026-08-12",
    time: "10:00 AM - 04:00 PM",
    venue: "Robotics Lab (Room 205, Block C)",
    category: "upcoming",
    eligibleYear: "1st & 2nd Year",
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=60",
    registrationCount: 45
  }
];

const initialClubs: Club[] = [
  {
    id: 1,
    name: "Cyber Knight Security Club",
    description: "Focused on ethical hacking, system hardening, capture the flag contests, and web applications safety. We build the digital shield.",
    lead: "Sarah Connor (4th Year)",
    contact: "security.club@cyberknight.edu",
    membersCount: 145,
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: 2,
    name: "Autonomous Robotics Society",
    description: "Bringing mechanical designs, embedded software, and electrical wiring together. From rovers to drone swarms, we code systems in motion.",
    lead: "James Smith (3rd Year)",
    contact: "robotics@cyberknight.edu",
    membersCount: 98,
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: 3,
    name: "Literary & Public Speaking Guild",
    description: "A hub for debate, creative writing, poetry, and developing confident public speakers. Elevate your voice and construct bulletproof arguments.",
    lead: "Elena Vance (4th Year)",
    contact: "literary@cyberknight.edu",
    membersCount: 74,
    imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: 4,
    name: "Fine Arts & Drama Circle",
    description: "Fostering creative expression through painting, music, theatre productions, and stage design. Bring campus stories to vibrant life.",
    lead: "David Miller (3rd Year)",
    contact: "arts.drama@cyberknight.edu",
    membersCount: 82,
    imageUrl: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&auto=format&fit=crop&q=60"
  }
];

const initialFaculty: Faculty[] = [
  // Computer Science (CSE)
  { id: 1, name: "Dr. Alan Turing", department: "Computer Science (CSE)", designation: "Professor & HOD", email: "alan.turing@cyberknight.edu", office: "Room 401, CSE Block" },
  { id: 2, name: "Prof. Linus Torvalds", department: "Computer Science (CSE)", designation: "Senior Lecturer", email: "linus.torvalds@cyberknight.edu", office: "Room 402, CSE Block" },
  { id: 3, name: "Dr. Tim Berners-Lee", department: "Computer Science (CSE)", designation: "Professor", email: "tim.blee@cyberknight.edu", office: "Room 403, CSE Block" },
  { id: 4, name: "Dr. Ken Thompson", department: "Computer Science (CSE)", designation: "Associate Professor", email: "ken.thompson@cyberknight.edu", office: "Room 404, CSE Block" },
  { id: 5, name: "Dr. Barbara Liskov", department: "Computer Science (CSE)", designation: "Assistant Professor", email: "barbara.liskov@cyberknight.edu", office: "Room 405, CSE Block" },

  // Electronics & Communication (ECE)
  { id: 6, name: "Dr. Nikola Tesla", department: "Electronics & Communication (ECE)", designation: "Professor & HOD", email: "nikola.tesla@cyberknight.edu", office: "Room 210, ECE Block" },
  { id: 7, name: "Prof. Claude Shannon", department: "Electronics & Communication (ECE)", designation: "Associate Professor", email: "claude.shannon@cyberknight.edu", office: "Room 211, ECE Block" },
  { id: 8, name: "Dr. Heinrich Hertz", department: "Electronics & Communication (ECE)", designation: "Professor", email: "heinrich.hertz@cyberknight.edu", office: "Room 212, ECE Block" },
  { id: 9, name: "Dr. Guglielmo Marconi", department: "Electronics & Communication (ECE)", designation: "Assistant Professor", email: "guglielmo.marconi@cyberknight.edu", office: "Room 213, ECE Block" },
  { id: 10, name: "Prof. Edwin Armstrong", department: "Electronics & Communication (ECE)", designation: "Senior Lecturer", email: "edwin.armstrong@cyberknight.edu", office: "Room 214, ECE Block" },

  // Artificial Intelligence & Data Science (AI DS)
  { id: 11, name: "Dr. Yann LeCun", department: "Artificial Intelligence & Data Science (AI DS)", designation: "Professor & HOD", email: "yann.lecun@cyberknight.edu", office: "Room 501, AI DS Block" },
  { id: 12, name: "Prof. Fei-Fei Li", department: "Artificial Intelligence & Data Science (AI DS)", designation: "Associate Professor", email: "feifei.li@cyberknight.edu", office: "Room 502, AI DS Block" },
  { id: 13, name: "Dr. Andrew Ng", department: "Artificial Intelligence & Data Science (AI DS)", designation: "Professor", email: "andrew.ng@cyberknight.edu", office: "Room 503, AI DS Block" },
  { id: 14, name: "Dr. Geoffrey Hinton", department: "Artificial Intelligence & Data Science (AI DS)", designation: "Senior Professor", email: "geoffrey.hinton@cyberknight.edu", office: "Room 504, AI DS Block" },
  { id: 15, name: "Dr. Yoshua Bengio", department: "Artificial Intelligence & Data Science (AI DS)", designation: "Associate Professor", email: "yoshua.bengio@cyberknight.edu", office: "Room 505, AI DS Block" },

  // Artificial Intelligence & Machine Learning (AI ML)
  { id: 16, name: "Dr. Arthur Samuel", department: "Artificial Intelligence & Machine Learning (AI ML)", designation: "Professor & HOD", email: "arthur.samuel@cyberknight.edu", office: "Room 601, AI ML Block" },
  { id: 17, name: "Dr. Demis Hassabis", department: "Artificial Intelligence & Machine Learning (AI ML)", designation: "Professor", email: "demis.hassabis@cyberknight.edu", office: "Room 602, AI ML Block" },
  { id: 18, name: "Dr. Ian Goodfellow", department: "Artificial Intelligence & Machine Learning (AI ML)", designation: "Associate Professor", email: "ian.goodfellow@cyberknight.edu", office: "Room 603, AI ML Block" },
  { id: 19, name: "Prof. Sebastian Thrun", department: "Artificial Intelligence & Machine Learning (AI ML)", designation: "Associate Professor", email: "sebastian.thrun@cyberknight.edu", office: "Room 604, AI ML Block" },
  { id: 20, name: "Dr. Daphne Koller", department: "Artificial Intelligence & Machine Learning (AI ML)", designation: "Assistant Professor", email: "daphne.koller@cyberknight.edu", office: "Room 605, AI ML Block" },

  // Electrical & Electronics (EEE)
  { id: 21, name: "Dr. Michael Faraday", department: "Electrical & Electronics (EEE)", designation: "Professor & HOD", email: "michael.faraday@cyberknight.edu", office: "Room 101, EEE Block" },
  { id: 22, name: "Dr. Thomas Edison", department: "Electrical & Electronics (EEE)", designation: "Professor", email: "thomas.edison@cyberknight.edu", office: "Room 102, EEE Block" },
  { id: 23, name: "Prof. George Westinghouse", department: "Electrical & Electronics (EEE)", designation: "Associate Professor", email: "george.westinghouse@cyberknight.edu", office: "Room 103, EEE Block" },
  { id: 24, name: "Dr. James Clerk Maxwell", department: "Electrical & Electronics (EEE)", designation: "Associate Professor", email: "james.maxwell@cyberknight.edu", office: "Room 104, EEE Block" },
  { id: 25, name: "Prof. Charles Proteus Steinmetz", department: "Electrical & Electronics (EEE)", designation: "Assistant Professor", email: "charles.steinmetz@cyberknight.edu", office: "Room 105, EEE Block" },

  // Instrumentation & Control (ICE)
  { id: 26, name: "Dr. Rudolf Kalman", department: "Instrumentation & Control (ICE)", designation: "Professor & HOD", email: "rudolf.kalman@cyberknight.edu", office: "Room 201, ICE Block" },
  { id: 27, name: "Dr. Harry Nyquist", department: "Instrumentation & Control (ICE)", designation: "Professor", email: "harry.nyquist@cyberknight.edu", office: "Room 202, ICE Block" },
  { id: 28, name: "Dr. Hendrik Wade Bode", department: "Instrumentation & Control (ICE)", designation: "Associate Professor", email: "hendrik.bode@cyberknight.edu", office: "Room 203, ICE Block" },
  { id: 29, name: "Prof. Albert Gopal", department: "Instrumentation & Control (ICE)", designation: "Associate Professor", email: "albert.gopal@cyberknight.edu", office: "Room 204, ICE Block" },
  { id: 30, name: "Dr. William Myer", department: "Instrumentation & Control (ICE)", designation: "Assistant Professor", email: "william.myer@cyberknight.edu", office: "Room 205, ICE Block" },

  // Mechanical (MECH)
  { id: 31, name: "Dr. James Watt", department: "Mechanical (MECH)", designation: "Professor & HOD", email: "james.watt@cyberknight.edu", office: "Room 301, MECH Block" },
  { id: 32, name: "Dr. Rudolf Diesel", department: "Mechanical (MECH)", designation: "Professor", email: "rudolf.diesel@cyberknight.edu", office: "Room 302, MECH Block" },
  { id: 33, name: "Prof. Henry Ford", department: "Mechanical (MECH)", designation: "Associate Professor", email: "henry.ford@cyberknight.edu", office: "Room 303, MECH Block" },
  { id: 34, name: "Dr. Nikolaus Otto", department: "Mechanical (MECH)", designation: "Assistant Professor", email: "nikolaus.otto@cyberknight.edu", office: "Room 304, MECH Block" },
  { id: 35, name: "Prof. Sadi Carnot", department: "Mechanical (MECH)", designation: "Senior Lecturer", email: "sadi.carnot@cyberknight.edu", office: "Room 305, MECH Block" },

  // Civil & Aerospace (AERO)
  { id: 36, name: "Dr. Wernher von Braun", department: "Civil & Aerospace (AERO)", designation: "Professor & HOD", email: "wernher.vonbraun@cyberknight.edu", office: "Room 701, AERO Block" },
  { id: 37, name: "Dr. Orville Wright", department: "Civil & Aerospace (AERO)", designation: "Professor", email: "orville.wright@cyberknight.edu", office: "Room 702, AERO Block" },
  { id: 38, name: "Prof. Wilbur Wright", department: "Civil & Aerospace (AERO)", designation: "Associate Professor", email: "wilbur.wright@cyberknight.edu", office: "Room 703, AERO Block" },
  { id: 39, name: "Dr. Robert Goddard", department: "Civil & Aerospace (AERO)", designation: "Assistant Professor", email: "robert.goddard@cyberknight.edu", office: "Room 704, AERO Block" },
  { id: 40, name: "Dr. Kelly Johnson", department: "Civil & Aerospace (AERO)", designation: "Senior Lecturer", email: "kelly.johnson@cyberknight.edu", office: "Room 705, AERO Block" }
];

const initialTimetable: TimetableItem[] = [
  { id: 1, day: "Monday", timeSlot: "09:00 AM - 10:30 AM", subject: "Introduction to Programming", room: "Lab 101, Block A", facultyName: "Dr. Alan Turing", courseCode: "CSE-101" },
  { id: 2, day: "Monday", timeSlot: "11:00 AM - 12:30 PM", subject: "Applied Physics & Quantum Mechanics", room: "Room 302, Block B", facultyName: "Dr. Richard Feynman", courseCode: "PHY-103" },
  { id: 3, day: "Tuesday", timeSlot: "09:00 AM - 10:30 AM", subject: "Calculus & Linear Algebra", room: "Room 205, Block B", facultyName: "Dr. Ada Lovelace", courseCode: "MAT-101" },
  { id: 4, day: "Tuesday", timeSlot: "01:30 PM - 03:00 PM", subject: "Digital Logic Design", room: "Lab 203, Block A", facultyName: "Dr. Grace Hopper", courseCode: "CSE-105" },
  { id: 5, day: "Wednesday", timeSlot: "09:00 AM - 10:30 AM", subject: "Introduction to Programming", room: "Lab 101, Block A", facultyName: "Dr. Alan Turing", courseCode: "CSE-101" },
  { id: 6, day: "Wednesday", timeSlot: "11:00 AM - 12:30 PM", subject: "Applied Physics & Quantum Mechanics", room: "Room 302, Block B", facultyName: "Dr. Richard Feynman", courseCode: "PHY-103" },
  { id: 7, day: "Thursday", timeSlot: "09:00 AM - 10:30 AM", subject: "Calculus & Linear Algebra", room: "Room 205, Block B", facultyName: "Dr. Ada Lovelace", courseCode: "MAT-101" },
  { id: 8, day: "Thursday", timeSlot: "01:30 PM - 03:00 PM", subject: "Professional Communication", room: "Seminar Hall 1, Block A", facultyName: "Prof. Margaret Hamilton", courseCode: "COM-102" },
  { id: 9, day: "Friday", timeSlot: "10:00 AM - 12:00 PM", subject: "Open Source Systems Lab", room: "Lab 310, Block A", facultyName: "Prof. Linus Torvalds", courseCode: "CSE-108" }
];

export class CyberKnightDB {
  private db: DatabaseSchema;

  constructor() {
    this.db = {
      users: [],
      events: initialEvents,
      clubs: initialClubs,
      faculty: initialFaculty,
      timetable: initialTimetable,
      registrations: [],
      notifications: [],
      queryLog: []
    };
    this.initDatabase();
  }

  private initDatabase() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(fileContent);
        // Merge file loaded records with default tables just in case we add schemas
        this.db = {
          users: parsed.users || [],
          events: parsed.events && parsed.events.length ? parsed.events : initialEvents,
          clubs: parsed.clubs && parsed.clubs.length ? parsed.clubs : initialClubs,
          faculty: initialFaculty,
          timetable: initialTimetable,
          registrations: parsed.registrations || [],
          notifications: parsed.notifications || [],
          queryLog: parsed.queryLog || []
        };
      } catch (e) {
        console.error("Failed to parse database file, starting fresh", e);
      }
    }

    // Seed default user 2026CK001
    if (this.db.users.length === 0) {
      this.db.users.push({
        rollNumber: "2026CK001",
        email: "fresher@cyberknight.edu",
        password: "Password@123", // Has upper, lower, number, special, 8-12 char
        joinedAt: new Date().toISOString()
      });
      this.save();
    }
  }

  private save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.db, null, 2), 'utf-8');
    } catch (e) {
      console.error("Error saving database file", e);
    }
  }

  public getQueryLog(): SQLQueryLog[] {
    return this.db.queryLog;
  }

  private logQuery(query: string, success: boolean, rowsCount: number, error?: string): SQLQueryLog {
    const log: SQLQueryLog = {
      id: this.db.queryLog.length + 1,
      query,
      timestamp: new Date().toISOString(),
      success,
      rowsCount,
      error
    };
    this.db.queryLog.push(log);
    // limit logs
    if (this.db.queryLog.length > 200) {
      this.db.queryLog.shift();
    }
    this.save();
    return log;
  }

  /**
   * Main SQL query runner!
   * Handles basic SELECT, INSERT, UPDATE queries against our internal structures.
   * This allows the student frontend or core services to run clean SQL queries and log them.
   */
  public executeSQL(sql: string, params: any[] = []): { success: boolean; rows?: any[]; affectedRows?: number; error?: string } {
    const cleanSql = sql.trim();
    const queryLower = cleanSql.toLowerCase();

    try {
      // 1. SELECT queries
      if (queryLower.startsWith('select')) {
        // SELECT * FROM users WHERE roll_number = ? AND password = ?
        // SELECT * FROM events
        // SELECT * FROM registrations WHERE roll_number = ?
        const tableMatch = queryLower.match(/from\s+(\w+)/);
        if (!tableMatch) {
          throw new Error("SQL Syntax Error: Cannot find table name in FROM clause");
        }
        const tableName = tableMatch[1] as keyof DatabaseSchema;
        const table = this.db[tableName];
        if (!table || !Array.isArray(table)) {
          throw new Error(`SQL Error: Table '${tableName}' does not exist`);
        }

        let filteredRows = [...table];

        // Parse simple WHERE clause
        const whereMatch = cleanSql.match(/WHERE\s+(.+?)(?:\s+ORDER\s+BY|\s+LIMIT|$)/i);
        if (whereMatch) {
          const whereClause = whereMatch[1];
          // E.g. roll_number = ? AND password = ?
          // We can break down compound expressions separated by AND
          const conditions = whereClause.split(/\s+AND\s+/i);
          let paramIdx = 0;

          filteredRows = filteredRows.filter((row: any) => {
            return conditions.every(cond => {
              // E.g. roll_number = ? or roll_number = '2026CK001' or event_id = 3
              const parts = cond.split(/=|<=|>=|<|>/);
              if (parts.length !== 2) return true; // ignore complex conditions

              let key = parts[0].trim();
              let valStr = parts[1].trim();

              // Convert camelCase lookup
              let rowKey = key;
              if (key === 'roll_number') rowKey = 'rollNumber';
              if (key === 'event_id') rowKey = 'eventId';
              if (key === 'registered_at') rowKey = 'registeredAt';
              if (key === 'members_count') rowKey = 'membersCount';
              if (key === 'course_code') rowKey = 'courseCode';
              if (key === 'faculty_name') rowKey = 'facultyName';

              let expectedVal: any;
              if (valStr === '?') {
                expectedVal = params[paramIdx++];
              } else {
                // Strip quotes
                if (valStr.startsWith("'") && valStr.endsWith("'")) {
                  expectedVal = valStr.substring(1, valStr.length - 1);
                } else if (valStr.startsWith('"') && valStr.endsWith('"')) {
                  expectedVal = valStr.substring(1, valStr.length - 1);
                } else if (!isNaN(Number(valStr))) {
                  expectedVal = Number(valStr);
                } else {
                  expectedVal = valStr;
                }
              }

              // Evaluate
              const rowVal = row[rowKey];
              if (cond.includes('<=')) return Number(rowVal) <= Number(expectedVal);
              if (cond.includes('>=')) return Number(rowVal) >= Number(expectedVal);
              if (cond.includes('<')) return Number(rowVal) < Number(expectedVal);
              if (cond.includes('>')) return Number(rowVal) > Number(expectedVal);
              return String(rowVal).toLowerCase() === String(expectedVal).toLowerCase();
            });
          });
        }

        // Apply column filter (e.g. SELECT roll_number, email FROM ...)
        const columnsPart = cleanSql.match(/SELECT\s+(.+?)\s+FROM/i);
        let selectedRows = filteredRows;
        if (columnsPart && columnsPart[1].trim() !== '*') {
          const selectCols = columnsPart[1].split(',').map(c => c.trim().toLowerCase());
          selectedRows = filteredRows.map(row => {
            const projected: any = {};
            selectCols.forEach(col => {
              let originalKey = col;
              if (col === 'roll_number') originalKey = 'rollNumber';
              if (col === 'event_id') originalKey = 'eventId';
              if (col === 'registered_at') originalKey = 'registeredAt';
              if (row[originalKey] !== undefined) {
                projected[col] = row[originalKey];
              }
            });
            return projected;
          });
        }

        this.logQuery(cleanSql, true, selectedRows.length);
        return { success: true, rows: selectedRows };
      }

      // 2. INSERT queries
      if (queryLower.startsWith('insert')) {
        // INSERT INTO registrations (roll_number, event_id, registered_at) VALUES (?, ?, ?)
        const tableMatch = queryLower.match(/insert\s+into\s+(\w+)/);
        if (!tableMatch) {
          throw new Error("SQL Syntax Error: Cannot find table name in INSERT statement");
        }
        const tableName = tableMatch[1] as keyof DatabaseSchema;
        const table = this.db[tableName];
        if (!table || !Array.isArray(table)) {
          throw new Error(`SQL Error: Table '${tableName}' does not exist`);
        }

        const columnsMatch = cleanSql.match(/\((.+?)\)\s*VALUES/i);
        const valuesMatch = cleanSql.match(/VALUES\s*\((.+?)\)/i);
        if (!columnsMatch || !valuesMatch) {
          throw new Error("SQL Syntax Error: INSERT missing columns or VALUES clauses");
        }

        const cols = columnsMatch[1].split(',').map(c => c.trim());
        const rawVals = valuesMatch[1].split(',').map(v => v.trim());

        let paramIdx = 0;
        const newRecord: any = { id: table.length + 1 };

        cols.forEach((col, i) => {
          let fieldName = col;
          if (col === 'roll_number') fieldName = 'rollNumber';
          if (col === 'event_id') fieldName = 'eventId';
          if (col === 'registered_at') fieldName = 'registeredAt';
          if (col === 'joined_at') fieldName = 'joinedAt';

          let val: any;
          const rawVal = rawVals[i];
          if (rawVal === '?') {
            val = params[paramIdx++];
          } else {
            if (rawVal.startsWith("'") && rawVal.endsWith("'")) {
              val = rawVal.substring(1, rawVal.length - 1);
            } else if (rawVal.startsWith('"') && rawVal.endsWith('"')) {
              val = rawVal.substring(1, rawVal.length - 1);
            } else if (!isNaN(Number(rawVal))) {
              val = Number(rawVal);
            } else {
              val = rawVal;
            }
          }
          newRecord[fieldName] = val;
        });

        table.push(newRecord);
        this.save();
        this.logQuery(cleanSql, true, 1);
        return { success: true, affectedRows: 1, rows: [newRecord] };
      }

      // 3. UPDATE queries
      if (queryLower.startsWith('update')) {
        // UPDATE users SET password = ? WHERE email = ?
        const tableMatch = queryLower.match(/update\s+(\w+)/i);
        if (!tableMatch) {
          throw new Error("SQL Syntax Error: Cannot find table name in UPDATE statement");
        }
        const tableName = tableMatch[1] as keyof DatabaseSchema;
        const table = this.db[tableName];
        if (!table || !Array.isArray(table)) {
          throw new Error(`SQL Error: Table '${tableName}' does not exist`);
        }

        const setMatch = cleanSql.match(/SET\s+(.+?)(?:\s+WHERE|$)/i);
        if (!setMatch) {
          throw new Error("SQL Syntax Error: UPDATE missing SET clause");
        }

        const setAssignments = setMatch[1].split(',');
        let paramIdx = 0;

        // Parse filters
        let whereConditions: string[] = [];
        const whereMatch = cleanSql.match(/WHERE\s+(.+?)$/i);
        if (whereMatch) {
          whereConditions = whereMatch[1].split(/\s+AND\s+/i);
        }

        let updatedCount = 0;

        this.db[tableName] = table.map((row: any) => {
          let matchesFilter = true;
          if (whereConditions.length > 0) {
            matchesFilter = whereConditions.every(cond => {
              const parts = cond.split(/=/);
              if (parts.length !== 2) return true;
              let key = parts[0].trim();
              let valStr = parts[1].trim();

              let rowKey = key;
              if (key === 'roll_number') rowKey = 'rollNumber';
              if (key === 'email') rowKey = 'email';

              let expectedVal: any;
              // Note: params used in WHERE could be after params in SET
              // We must account for params order. The simplest is to resolve params indices correctly.
              // To be safe, we calculate how many '?' are in the SET clause first.
              const setQuestionCount = (setMatch[1].match(/\?/g) || []).length;
              let filterParamIdx = setQuestionCount;

              if (valStr === '?') {
                expectedVal = params[filterParamIdx++];
              } else {
                if (valStr.startsWith("'") && valStr.endsWith("'")) {
                  expectedVal = valStr.substring(1, valStr.length - 1);
                } else {
                  expectedVal = valStr;
                }
              }
              return String(row[rowKey]).toLowerCase() === String(expectedVal).toLowerCase();
            });
          }

          if (matchesFilter) {
            updatedCount++;
            const newRow = { ...row };
            setAssignments.forEach(assignment => {
              const parts = assignment.split('=');
              if (parts.length === 2) {
                let key = parts[0].trim();
                let valStr = parts[1].trim();
                let fieldName = key;
                if (key === 'password') fieldName = 'password';

                let newVal: any;
                if (valStr === '?') {
                  newVal = params[paramIdx++];
                } else {
                  if (valStr.startsWith("'") && valStr.endsWith("'")) {
                    newVal = valStr.substring(1, valStr.length - 1);
                  } else {
                    newVal = valStr;
                  }
                }
                newRow[fieldName] = newVal;
              }
            });
            return newRow;
          }
          return row;
        }) as any;

        this.save();
        this.logQuery(cleanSql, true, updatedCount);
        return { success: true, affectedRows: updatedCount };
      }

      // Default or unsupported SQL statements
      throw new Error(`SQL Error: Statement execution not supported or has syntax errors. Supported: SELECT, INSERT, UPDATE.`);
    } catch (err: any) {
      console.error("SQL Error running:", cleanSql, err);
      this.logQuery(cleanSql, false, 0, err.message);
      return { success: false, error: err.message };
    }
  }

  // Help seed or simulate user-specific queries
  public signup(rollNumber: string, email: string, pass: string): { success: boolean; error?: string } {
    const existing = this.executeSQL("SELECT * FROM users WHERE roll_number = ?", [rollNumber]);
    if (existing.success && existing.rows && existing.rows.length > 0) {
      return { success: false, error: `User ID ${rollNumber} is already registered.` };
    }

    const emailCheck = this.executeSQL("SELECT * FROM users WHERE email = ?", [email]);
    if (emailCheck.success && emailCheck.rows && emailCheck.rows.length > 0) {
      return { success: false, error: `Email ${email} is already linked to another User ID.` };
    }

    // Insert user
    const insertQuery = "INSERT INTO users (roll_number, email, password, joined_at) VALUES (?, ?, ?, ?)";
    const res = this.executeSQL(insertQuery, [rollNumber, email, pass, new Date().toISOString()]);
    if (res.success) {
      // Trigger notification for signup
      this.addNotification(rollNumber, 'push', 'Registration Success', 'Your campus credentials are now active!');
      return { success: true };
    }
    return { success: false, error: res.error || "Failed to create user" };
  }

  public login(rollNumber: string, pass: string): { success: boolean; user?: User; error?: string } {
    const res = this.executeSQL("SELECT * FROM users WHERE roll_number = ? AND password = ?", [rollNumber, pass]);
    if (res.success && res.rows && res.rows.length > 0) {
      return { success: true, user: res.rows[0] as User };
    }
    return { success: false, error: "Invalid User ID or Password." };
  }

  public resetPassword(email: string, pass: string): { success: boolean; error?: string } {
    const existing = this.executeSQL("SELECT * FROM users WHERE email = ?", [email]);
    if (!existing.success || !existing.rows || existing.rows.length === 0) {
      return { success: false, error: `No account found with email ${email}.` };
    }

    const rollNumber = existing.rows[0].rollNumber;
    const updateRes = this.executeSQL("UPDATE users SET password = ? WHERE email = ?", [pass, email]);
    if (updateRes.success && updateRes.affectedRows && updateRes.affectedRows > 0) {
      this.addNotification(rollNumber, 'email', 'Password Updated', 'Your Cyber Knight password has been reset successfully. If you did not do this, contact admin.');
      this.addNotification(rollNumber, 'push', 'Security Alert', 'Your password was changed.');
      return { success: true };
    }
    return { success: false, error: updateRes.error || "Failed to reset password." };
  }

  public registerForEvent(rollNumber: string, eventId: number): { success: boolean; error?: string } {
    // 1. Check if event exists
    const eventQuery = this.executeSQL("SELECT * FROM events WHERE id = ?", [eventId]);
    if (!eventQuery.success || !eventQuery.rows || eventQuery.rows.length === 0) {
      return { success: false, error: "Event not found" };
    }
    const event = eventQuery.rows[0] as CampusEvent;

    // 2. Check if already registered
    const regCheck = this.executeSQL("SELECT * FROM registrations WHERE roll_number = ? AND event_id = ?", [rollNumber, eventId]);
    if (regCheck.success && regCheck.rows && regCheck.rows.length > 0) {
      return { success: false, error: "You have already registered for this event." };
    }

    // 3. Register!
    const insertRes = this.executeSQL("INSERT INTO registrations (roll_number, event_id, registered_at) VALUES (?, ?, ?)", [rollNumber, eventId, new Date().toISOString()]);
    if (insertRes.success) {
      // Increment event registration count
      this.db.events = this.db.events.map(ev => {
        if (ev.id === eventId) {
          return { ...ev, registrationCount: ev.registrationCount + 1 };
        }
        return ev;
      });
      this.save();

      // Trigger alerts
      this.addNotification(rollNumber, 'email', `Event Registered: ${event.title}`, `Congratulations! You have successfully registered for ${event.title} scheduled on ${event.date} at ${event.time} located in ${event.venue}.`);
      this.addNotification(rollNumber, 'push', `Registration Confirmed`, `Registered for ${event.title}! See you there.`);

      return { success: true };
    }
    return { success: false, error: insertRes.error || "Registration failed." };
  }

  public unregisterFromEvent(rollNumber: string, eventId: number): { success: boolean; error?: string } {
    // 1. Check if registered
    const regCheck = this.executeSQL("SELECT * FROM registrations WHERE roll_number = ? AND event_id = ?", [rollNumber, eventId]);
    if (!regCheck.success || !regCheck.rows || regCheck.rows.length === 0) {
      return { success: false, error: "You are not registered for this event." };
    }

    // 2. Remove registration
    this.db.registrations = this.db.registrations.filter(r => !(r.rollNumber === rollNumber && r.eventId === eventId));
    
    // Decrement event registration count
    this.db.events = this.db.events.map(ev => {
      if (ev.id === eventId) {
        return { ...ev, registrationCount: Math.max(0, ev.registrationCount - 1) };
      }
      return ev;
    });
    this.save();

    // Trigger alerts
    this.addNotification(rollNumber, 'push', `Registration Cancelled`, `You exited registration list.`);
    return { success: true };
  }

  public addNotification(rollNumber: string, type: 'email' | 'push', title: string, message: string): Notification {
    const newNotif: Notification = {
      id: this.db.notifications.length + 1,
      rollNumber,
      type,
      title,
      message,
      status: 'sent',
      timestamp: new Date().toISOString()
    };
    this.db.notifications.push(newNotif);
    this.save();
    return newNotif;
  }

  public getNotifications(rollNumber: string): Notification[] {
    const res = this.executeSQL("SELECT * FROM notifications WHERE roll_number = ?", [rollNumber]);
    if (res.success && res.rows) {
      return res.rows.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) as Notification[];
    }
    return [];
  }

  public joinClub(clubName: string): { success: boolean; error?: string } {
    this.db.clubs = this.db.clubs.map(club => {
      if (club.name === clubName) {
        return { ...club, membersCount: club.membersCount + 1 };
      }
      return club;
    });
    this.save();
    return { success: true };
  }

  public leaveClub(clubName: string): { success: boolean; error?: string } {
    this.db.clubs = this.db.clubs.map(club => {
      if (club.name === clubName) {
        return { ...club, membersCount: Math.max(0, club.membersCount - 1) };
      }
      return club;
    });
    this.save();
    return { success: true };
  }
}
