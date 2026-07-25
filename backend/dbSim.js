// ===================================================================
// Cyber Knight In-Memory Database (JavaScript)
// Fully Vercel-compatible: no filesystem, no node:sqlite, no binaries.
// ===================================================================

// ---------- Seed Data ----------

const initialEvents = [
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
  },
  {
    id: 8,
    title: "Freshers Party 2026",
    description: "Welcome Freshers! This is an opportunity for the newcomers to showcase their talent. Scan the QR code to register (signup through your roll number). Highlights: DJ Music, Dance Floor, Stage Performances by seniors and batchmates, and delicious refreshments!",
    date: "2026-07-25",
    time: "04:00 PM - 08:00 PM",
    venue: "Silver Jubilee Auditorium",
    category: "upcoming",
    eligibleYear: "1st Year Only",
    imageUrl: "/assets/freshers_party.jpg",
    registrationCount: 0
  }
];

const initialClubs = [
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

const initialFaculty = [
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

const initialTimetable = [
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

// ---------- The Database Class ----------

export class CyberKnightDB {
  constructor() {
    // Initialize store with seed data
    this.store = {
      users: [
        { rollNumber: "2026CK001", email: "fresher@cyberknight.edu", password: "Password@123", joinedAt: new Date().toISOString() }
      ],
      events: JSON.parse(JSON.stringify(initialEvents)),
      clubs: JSON.parse(JSON.stringify(initialClubs)),
      faculty: JSON.parse(JSON.stringify(initialFaculty)),
      timetable: JSON.parse(JSON.stringify(initialTimetable)),
      registrations: [],
      notifications: [],
      queryLogs: []
    };

    // Set auto-increment counters
    this.ids = {
      events: Math.max(...this.store.events.map(e => e.id), 0) + 1,
      clubs: Math.max(...this.store.clubs.map(c => c.id), 0) + 1,
      faculty: Math.max(...this.store.faculty.map(f => f.id), 0) + 1,
      timetable: Math.max(...this.store.timetable.map(t => t.id), 0) + 1,
      registrations: 1,
      notifications: 1,
      queryLogs: 1
    };

    console.log("[Cyber Knight DB] In-memory database initialized with seed data.");
  }

  // ---------- Query Log ----------

  getQueryLog() {
    return [...this.store.queryLogs].reverse().slice(0, 200);
  }

  logQuery(query, success, rowsCount, error) {
    this.store.queryLogs.push({
      id: this.ids.queryLogs++,
      query,
      timestamp: new Date().toISOString(),
      success,
      rowsCount,
      error
    });
  }

  // ---------- SQL Executor (simulated for in-memory store) ----------

  executeSQL(sql, params = [], log = false) {
    const cleanSql = sql.trim();
    const queryLower = cleanSql.toLowerCase();

    try {
      if (queryLower.startsWith('select')) {
        return this.handleSelect(cleanSql, queryLower, params, log);
      } else if (queryLower.startsWith('insert')) {
        return this.handleInsert(cleanSql, queryLower, params, log);
      } else if (queryLower.startsWith('update')) {
        return this.handleUpdate(cleanSql, queryLower, params, log);
      } else if (queryLower.startsWith('delete')) {
        return this.handleDelete(cleanSql, queryLower, params, log);
      } else if (queryLower.startsWith('pragma') || queryLower.startsWith('show')) {
        const tables = ['users', 'events', 'clubs', 'faculty', 'timetable', 'registrations', 'notifications', 'query_logs'];
        if (log) this.logQuery(cleanSql, true, tables.length);
        return { success: true, rows: tables.map(t => ({ name: t })) };
      } else {
        if (log) this.logQuery(cleanSql, false, 0, 'Unsupported SQL operation in demo mode.');
        return { success: false, error: 'Unsupported SQL operation in demo mode. Supported: SELECT, INSERT, UPDATE, DELETE.' };
      }
    } catch (err) {
      console.error("[SQL Execution Error]:", cleanSql, err);
      if (log) this.logQuery(cleanSql, false, 0, err.message);
      return { success: false, error: err.message };
    }
  }

  getTableByName(tableName) {
    const map = {
      users: this.store.users,
      events: this.store.events,
      clubs: this.store.clubs,
      faculty: this.store.faculty,
      timetable: this.store.timetable,
      registrations: this.store.registrations,
      notifications: this.store.notifications,
      query_logs: this.store.queryLogs
    };
    return map[tableName] || null;
  }

  extractTableName(queryLower) {
    const fromMatch = queryLower.match(/(?:from|into|update)\s+(\w+)/);
    return fromMatch ? fromMatch[1] : null;
  }

  handleSelect(sql, queryLower, params, log) {
    const tableName = this.extractTableName(queryLower);
    if (!tableName) {
      if (log) this.logQuery(sql, false, 0, 'Could not determine table name');
      return { success: false, error: 'Could not determine table name from query.' };
    }

    if (queryLower.includes('last_insert_rowid')) {
      const id = Math.max(this.ids.notifications - 1, 0);
      if (log) this.logQuery(sql, true, 1);
      return { success: true, rows: [{ id }] };
    }

    if (queryLower.includes('count(*)')) {
      const table = this.getTableByName(tableName);
      if (!table) {
        if (log) this.logQuery(sql, false, 0, `Table '${tableName}' not found`);
        return { success: false, error: `Table '${tableName}' not found.` };
      }
      let filtered = this.applyWhere(table, queryLower, params, tableName);
      if (log) this.logQuery(sql, true, 1);
      return { success: true, rows: [{ count: filtered.length }] };
    }

    const table = this.getTableByName(tableName);
    if (!table) {
      if (log) this.logQuery(sql, false, 0, `Table '${tableName}' not found`);
      return { success: false, error: `Table '${tableName}' not found.` };
    }

    let rows = this.applyWhere(table, queryLower, params, tableName);

    const orderMatch = queryLower.match(/order\s+by\s+(\w+)\s*(asc|desc)?/);
    if (orderMatch) {
      const orderCol = this.snakeToCamel(orderMatch[1]);
      const desc = orderMatch[2] === 'desc';
      rows.sort((a, b) => {
        if (a[orderCol] < b[orderCol]) return desc ? 1 : -1;
        if (a[orderCol] > b[orderCol]) return desc ? -1 : 1;
        return 0;
      });
    }

    const limitMatch = queryLower.match(/limit\s+(\d+)/);
    if (limitMatch) {
      rows = rows.slice(0, parseInt(limitMatch[1], 10));
    }

    if (log) this.logQuery(sql, true, rows.length);
    return { success: true, rows };
  }

  handleInsert(sql, queryLower, params, log) {
    const tableName = this.extractTableName(queryLower);
    if (!tableName) {
      if (log) this.logQuery(sql, false, 0, 'Could not determine table name');
      return { success: false, error: 'Could not determine table name from query.' };
    }

    const colMatch = sql.match(/\(([^)]+)\)\s*values/i);
    if (!colMatch) {
      if (log) this.logQuery(sql, false, 0, 'Could not parse column names');
      return { success: false, error: 'Could not parse column names from INSERT.' };
    }

    const columns = colMatch[1].split(',').map(c => this.snakeToCamel(c.trim()));
    const row = {};

    columns.forEach((col, i) => {
      row[col] = params[i] !== undefined ? params[i] : null;
    });

    if (!row.id) {
      if (this.ids[tableName] !== undefined) {
        row.id = this.ids[tableName]++;
      }
    }

    const table = this.getTableByName(tableName);
    if (!table) {
      if (log) this.logQuery(sql, false, 0, `Table '${tableName}' not found`);
      return { success: false, error: `Table '${tableName}' not found.` };
    }

    if (tableName === 'users') {
      if (table.find(u => u.rollNumber === row.rollNumber)) {
        const err = `UNIQUE constraint failed: users.roll_number`;
        if (log) this.logQuery(sql, false, 0, err);
        return { success: false, error: err };
      }
      if (table.find(u => u.email === row.email)) {
        const err = `UNIQUE constraint failed: users.email`;
        if (log) this.logQuery(sql, false, 0, err);
        return { success: false, error: err };
      }
    }

    if (tableName === 'registrations') {
      if (table.find(r => r.rollNumber === row.rollNumber && r.eventId === row.eventId)) {
        const err = `UNIQUE constraint failed: registrations.roll_number, registrations.event_id`;
        if (log) this.logQuery(sql, false, 0, err);
        return { success: false, error: err };
      }
    }

    table.push(row);
    if (log) this.logQuery(sql, true, 1);
    return { success: true, affectedRows: 1 };
  }

  handleUpdate(sql, queryLower, params, log) {
    const tableName = this.extractTableName(queryLower);
    if (!tableName) {
      if (log) this.logQuery(sql, false, 0, 'Could not determine table name');
      return { success: false, error: 'Could not determine table name from query.' };
    }

    const table = this.getTableByName(tableName);
    if (!table) {
      if (log) this.logQuery(sql, false, 0, `Table '${tableName}' not found`);
      return { success: false, error: `Table '${tableName}' not found.` };
    }

    const setMatch = sql.match(/set\s+(.+?)(?:\s+where\s+|$)/i);
    if (!setMatch) {
      if (log) this.logQuery(sql, false, 0, 'Could not parse SET clause');
      return { success: false, error: 'Could not parse SET clause.' };
    }

    const rows = this.applyWhere(table, queryLower, params, tableName);
    let affected = 0;

    const setClauses = setMatch[1].split(',').map(c => c.trim());

    for (const row of rows) {
      const idx = table.indexOf(row);
      if (idx === -1) continue;

      let paramIdx = 0;
      for (const clause of setClauses) {
        const eqMatch = clause.match(/(\w+)\s*=\s*\?/);
        if (eqMatch) {
          const col = this.snakeToCamel(eqMatch[1]);
          table[idx][col] = params[paramIdx++];
          continue;
        }

        const incrMatch = clause.match(/(\w+)\s*=\s*\1\s*\+\s*(\d+)/);
        if (incrMatch) {
          const col = this.snakeToCamel(incrMatch[1]);
          table[idx][col] = (table[idx][col] || 0) + parseInt(incrMatch[2], 10);
          continue;
        }

        const caseDecrMatch = clause.match(/(\w+)\s*=\s*case\s+when\s+\1\s*>\s*0\s+then\s+\1\s*-\s*1\s+else\s+0\s+end/i);
        if (caseDecrMatch) {
          const col = this.snakeToCamel(caseDecrMatch[1]);
          table[idx][col] = Math.max((table[idx][col] || 0) - 1, 0);
          continue;
        }
      }
      affected++;
    }

    if (log) this.logQuery(sql, true, affected);
    return { success: true, affectedRows: affected };
  }

  handleDelete(sql, queryLower, params, log) {
    const tableName = this.extractTableName(queryLower);
    if (!tableName) {
      if (log) this.logQuery(sql, false, 0, 'Could not determine table name');
      return { success: false, error: 'Could not determine table name from query.' };
    }

    const table = this.getTableByName(tableName);
    if (!table) {
      if (log) this.logQuery(sql, false, 0, `Table '${tableName}' not found`);
      return { success: false, error: `Table '${tableName}' not found.` };
    }

    const toDelete = this.applyWhere(table, queryLower, params, tableName);
    let affected = 0;

    for (const row of toDelete) {
      const idx = table.indexOf(row);
      if (idx !== -1) {
        table.splice(idx, 1);
        affected++;
      }
    }

    if (log) this.logQuery(sql, true, affected);
    return { success: true, affectedRows: affected };
  }

  applyWhere(table, queryLower, params, tableName) {
    const whereMatch = queryLower.match(/where\s+(.+?)(?:\s+order|\s+limit|\s+group|\s*$)/i);
    if (!whereMatch) return [...table];

    const whereClause = whereMatch[1].trim();

    const conditions = whereClause.split(/\s+and\s+/i);
    let paramIdx = 0;

    if (queryLower.startsWith('update')) {
      const setMatch = queryLower.match(/set\s+(.+?)\s+where/i);
      if (setMatch) {
        const setClauses = setMatch[1].split(',');
        for (const clause of setClauses) {
          if (clause.includes('?')) paramIdx++;
        }
      }
    }

    return table.filter(row => {
      let localParamIdx = paramIdx;
      return conditions.every(cond => {
        const eqMatch = cond.match(/(\w+)\s*=\s*\?/);
        if (eqMatch) {
          const col = this.snakeToCamel(eqMatch[1]);
          const val = params[localParamIdx++];
          return String(row[col]) === String(val);
        }

        const litMatch = cond.match(/(\w+)\s*=\s*'([^']+)'/);
        if (litMatch) {
          const col = this.snakeToCamel(litMatch[1]);
          return String(row[col]) === litMatch[2];
        }

        return true;
      });
    });
  }

  snakeToCamel(s) {
    return s.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  }

  signup(rollNumber, email, pass) {
    const existing = this.executeSQL("SELECT * FROM users WHERE roll_number = ?", [rollNumber]);
    if (existing.success && existing.rows && existing.rows.length > 0) {
      return { success: false, error: `User ID ${rollNumber} is already registered.` };
    }

    const emailCheck = this.executeSQL("SELECT * FROM users WHERE email = ?", [email]);
    if (emailCheck.success && emailCheck.rows && emailCheck.rows.length > 0) {
      return { success: false, error: `Email ${email} is already linked to another User ID.` };
    }

    const res = this.executeSQL("INSERT INTO users (roll_number, email, password, joined_at) VALUES (?, ?, ?, ?)", [rollNumber, email, pass, new Date().toISOString()]);
    if (res.success) {
      this.addNotification(rollNumber, 'push', 'Registration Success', 'Your campus credentials are now active!');
      return { success: true };
    }
    return { success: false, error: res.error || "Failed to create user" };
  }

  login(rollNumber, pass) {
    const res = this.executeSQL("SELECT * FROM users WHERE roll_number = ?", [rollNumber]);
    if (res.success && res.rows && res.rows.length > 0) {
      const user = res.rows[0];
      if (user.password === pass) {
        return { success: true, user: { rollNumber: user.rollNumber, email: user.email, joinedAt: user.joinedAt } };
      }
    }
    return { success: false, error: "Invalid User ID or Password." };
  }

  resetPassword(email, pass) {
    const existing = this.executeSQL("SELECT * FROM users WHERE email = ?", [email]);
    if (!existing.success || !existing.rows || existing.rows.length === 0) {
      return { success: false, error: `No account found with email ${email}.` };
    }

    const rollNumber = existing.rows[0].rollNumber;
    const updateRes = this.executeSQL("UPDATE users SET password = ? WHERE email = ?", [pass, email]);
    if (updateRes.success && updateRes.affectedRows && updateRes.affectedRows > 0) {
      this.addNotification(rollNumber, 'email', 'Password Updated', 'Your Cyber Knight password has been reset successfully.');
      this.addNotification(rollNumber, 'push', 'Security Alert', 'Your password was changed.');
      return { success: true };
    }
    return { success: false, error: updateRes.error || "Failed to reset password." };
  }

  registerForEvent(rollNumber, eventId) {
    const eventQuery = this.executeSQL("SELECT * FROM events WHERE id = ?", [eventId]);
    if (!eventQuery.success || !eventQuery.rows || eventQuery.rows.length === 0) {
      return { success: false, error: "Event not found" };
    }
    const event = eventQuery.rows[0];

    const regCheck = this.executeSQL("SELECT * FROM registrations WHERE roll_number = ? AND event_id = ?", [rollNumber, eventId]);
    if (regCheck.success && regCheck.rows && regCheck.rows.length > 0) {
      return { success: false, error: "You have already registered for this event." };
    }

    const insertRes = this.executeSQL("INSERT INTO registrations (roll_number, event_id, registered_at) VALUES (?, ?, ?)", [rollNumber, eventId, new Date().toISOString()]);
    if (insertRes.success) {
      const ev = this.store.events.find(e => e.id === eventId);
      if (ev) ev.registrationCount++;
      this.addNotification(rollNumber, 'email', `Event Registered: ${event.title}`, `Congratulations! You have successfully registered for ${event.title} scheduled on ${event.date} at ${event.time} located in ${event.venue}.`);
      this.addNotification(rollNumber, 'push', `Registration Confirmed`, `Registered for ${event.title}! See you there.`);
      return { success: true };
    }
    return { success: false, error: insertRes.error || "Registration failed." };
  }

  unregisterFromEvent(rollNumber, eventId) {
    const regCheck = this.executeSQL("SELECT * FROM registrations WHERE roll_number = ? AND event_id = ?", [rollNumber, eventId]);
    if (!regCheck.success || !regCheck.rows || regCheck.rows.length === 0) {
      return { success: false, error: "You are not registered for this event." };
    }

    const deleteRes = this.executeSQL("DELETE FROM registrations WHERE roll_number = ? AND event_id = ?", [rollNumber, eventId]);
    if (deleteRes.success) {
      const ev = this.store.events.find(e => e.id === eventId);
      if (ev) ev.registrationCount = Math.max(ev.registrationCount - 1, 0);
      this.addNotification(rollNumber, 'push', `Registration Cancelled`, `You exited the registration list.`);
      return { success: true };
    }
    return { success: false, error: deleteRes.error || "Unregistration failed." };
  }

  addNotification(rollNumber, type, title, message) {
    const notification = {
      id: this.ids.notifications++,
      rollNumber,
      type,
      title,
      message,
      status: 'sent',
      timestamp: new Date().toISOString()
    };
    this.store.notifications.push(notification);
    return notification;
  }

  getNotifications(rollNumber) {
    return this.store.notifications
      .filter(n => n.rollNumber === rollNumber)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  joinClub(clubName) {
    const club = this.store.clubs.find(c => c.name === clubName);
    if (!club) return { success: false, error: "Club not found." };
    club.membersCount++;
    return { success: true };
  }

  leaveClub(clubName) {
    const club = this.store.clubs.find(c => c.name === clubName);
    if (!club) return { success: false, error: "Club not found." };
    club.membersCount = Math.max(club.membersCount - 1, 0);
    return { success: true };
  }
}
