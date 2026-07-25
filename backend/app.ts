import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { CyberKnightDB } from "./dbSim";

dotenv.config();

const app = express();

export const BACKEND_PORT = process.env.BACKEND_PORT
  ? parseInt(process.env.BACKEND_PORT, 10)
  : 3001;

app.use(express.json());

// Initialize the database engine
const db = new CyberKnightDB();

// Initialize the Gemini API client safely (with lazy check so it doesn't crash if key is missing)
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY") {
      try {
        aiClient = new GoogleGenAI({ apiKey: key });
      } catch (err) {
        console.error("Failed to initialize Google Gen AI:", err);
      }
    }
  }
  return aiClient;
}

// Robust JSON extraction helper to handle markdown wrapper backticks, smart quotes, and trailing garbage
function extractAndParseJSON(text: string): any {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch (err) {
    const firstBrace = trimmed.indexOf("{");
    const lastBrace = trimmed.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const candidate = trimmed.substring(firstBrace, lastBrace + 1);
      try {
        return JSON.parse(candidate);
      } catch (innerErr: any) {
        // Basic sanitization
        const cleaned = candidate
          .replace(/[\u201C\u201D]/g, '"') // smart quotes
          .trim();
        try {
          return JSON.parse(cleaned);
        } catch (finalErr) {
          throw new Error(
            `Failed to parse extracted JSON block. Error: ${innerErr.message || innerErr}`
          );
        }
      }
    }
    throw err;
  }
}

// ==========================================
// API ROUTES FIRST
// ==========================================

// Auth Endpoints
app.post("/api/auth/signup", async (req, res) => {
  const { rollNumber, email, password } = req.body;
  if (!rollNumber || !email || !password) {
    return res
      .status(400)
      .json({ success: false, error: "Missing required fields." });
  }
  // Validate rollNumber / User ID
  if (!/^[a-zA-Z0-9]{4,15}$/.test(rollNumber)) {
    return res.status(400).json({
      success: false,
      error: "User ID must be alphanumeric and 4-15 characters long.",
    });
  }
  // Validate password rules (6-12 char, at least 1 uppercase, 1 lowercase, 1 number)
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,12}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      success: false,
      error:
        "Password must be 6-12 characters, including at least one uppercase letter, one lowercase letter, and one number.",
    });
  }

  const result = db.signup(rollNumber, email, password);
  if (result.success) {
    // Generate Gemini welcome email
    const ai = getGeminiClient();
    let emailSubject = "⚔️ [ACCESS GRANTED] Welcome to Cyber Knight Academy Portal!";
    let emailBody = `AUTHENTICATION NODE RECOGNIZED.

Greetings Initiate ${rollNumber},

Welcome to the central intelligence grid of Cyber Knight Academy! Your account has been successfully provisioned.

[ CREDENTIALS RECORDED ]
- Username / User ID: ${rollNumber}
- Communications Array: ${email}
- Security Authorization: Level-1 Clearance

[ ACADEMY DIRECTORIES SYNCHRONIZED ]
1. Campus Events Node: Discover CTFs, seminars, and expos on your Dashboard.
2. Student Clubs Hub: Register and network with ethical hackers, robotics engineers, and creators.
3. Faculty Intel: Locate classrooms, department heads, and office schedules.
4. Timetable Matrix: Real-time academic calendar and course schedules.
5. Direct SQL Terminal: Inspect database tables, logs, and execute queries.

For any grid errors or clearance updates, dispatch an alert to the terminal.

Ingress Supervisor:
CyberKnight200726`;

    if (ai) {
      try {
        const prompt = `You are "CyberKnight200726", the chief automated notification system and security administrator of Cyber Knight Academy.
Write a welcoming, highly stylized, tech-themed and immersive welcome email for a new fresher student who has just registered.
Student User ID: "${rollNumber}"
Student Email: "${email}"

Return a JSON object only with two fields:
{
  "subject": "The email subject line (make it punchy, cyber/military-tech academy style, starting with a cool emoji)",
  "body": "The detailed email welcome message body. Include mentions of available features in their portal: the interactive Events Dashboard, Student Clubs directory, Faculty Directory, Class Timetable, and the Direct SQL Console where they can learn and execute queries. Keep it extremely welcoming and cool."
}

Do not wrap the output in markdown block code tags other than json. Return strictly the raw JSON object.`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          },
        });

        if (response && response.text) {
          const parsed = extractAndParseJSON(response.text);
          if (parsed.subject && parsed.body) {
            emailSubject = parsed.subject;
            emailBody = parsed.body;
          }
        }
      } catch (err) {
        console.error("Failed to generate Gemini welcome email:", err);
      }
    }

    // Insert Gemini email to notifications table
    db.addNotification(rollNumber, "email", emailSubject, emailBody);

    res.json({
      success: true,
      message: "Signup successful. Welcome, Cyber Knight!",
    });
  } else {
    res.status(400).json({ success: false, error: result.error });
  }
});

app.post("/api/auth/login", (req, res) => {
  const { rollNumber, password } = req.body;
  if (!rollNumber || !password) {
    return res.status(400).json({
      success: false,
      error: "Please enter both Roll Number and Password.",
    });
  }
  const result = db.login(rollNumber, password);
  if (result.success) {
    res.json({ success: true, user: result.user });
  } else {
    res.status(401).json({ success: false, error: result.error });
  }
});

app.post("/api/auth/forgot", (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) {
    return res.status(400).json({
      success: false,
      error: "Email and New Password are required.",
    });
  }
  // Validate password rules (6-12 char, at least 1 uppercase, 1 lowercase, 1 number)
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,12}$/;
  if (!passwordRegex.test(newPassword)) {
    return res.status(400).json({
      success: false,
      error:
        "Password must be 6-12 characters, including at least one uppercase letter, one lowercase letter, and one number.",
    });
  }

  const result = db.resetPassword(email, newPassword);
  if (result.success) {
    res.json({
      success: true,
      message: "Password reset successful! Reconnect email notification sent.",
    });
  } else {
    res.status(404).json({ success: false, error: result.error });
  }
});

// Campus Data Endpoints
app.get("/api/events", (req, res) => {
  const sqlResult = db.executeSQL("SELECT * FROM events");
  if (sqlResult.success) {
    res.json({ success: true, events: sqlResult.rows });
  } else {
    res.status(500).json({ success: false, error: sqlResult.error });
  }
});

app.get("/api/clubs", (req, res) => {
  const sqlResult = db.executeSQL("SELECT * FROM clubs");
  if (sqlResult.success) {
    res.json({ success: true, clubs: sqlResult.rows });
  } else {
    res.status(500).json({ success: false, error: sqlResult.error });
  }
});

app.get("/api/faculty", (req, res) => {
  const sqlResult = db.executeSQL("SELECT * FROM faculty");
  if (sqlResult.success) {
    res.json({ success: true, faculty: sqlResult.rows });
  } else {
    res.status(500).json({ success: false, error: sqlResult.error });
  }
});

app.get("/api/timetable", (req, res) => {
  const sqlResult = db.executeSQL("SELECT * FROM timetable");
  if (sqlResult.success) {
    res.json({ success: true, timetable: sqlResult.rows });
  } else {
    res.status(500).json({ success: false, error: sqlResult.error });
  }
});

// Event registration
app.post("/api/events/register", (req, res) => {
  const { rollNumber, eventId } = req.body;
  if (!rollNumber || !eventId) {
    return res
      .status(400)
      .json({ success: false, error: "Missing roll number or event ID" });
  }
  const result = db.registerForEvent(rollNumber, Number(eventId));
  if (result.success) {
    res.json({ success: true, message: "Successfully registered for event!" });
  } else {
    res.status(400).json({ success: false, error: result.error });
  }
});

// Event unregistration
app.post("/api/events/unregister", (req, res) => {
  const { rollNumber, eventId } = req.body;
  if (!rollNumber || !eventId) {
    return res
      .status(400)
      .json({ success: false, error: "Missing roll number or event ID" });
  }
  const result = db.unregisterFromEvent(rollNumber, Number(eventId));
  if (result.success) {
    res.json({
      success: true,
      message: "Successfully unregistered from event!",
    });
  } else {
    res.status(400).json({ success: false, error: result.error });
  }
});

// Club Join
app.post("/api/clubs/join", (req, res) => {
  const { clubName } = req.body;
  if (!clubName) {
    return res
      .status(400)
      .json({ success: false, error: "Missing club name" });
  }
  const result = (db as any).joinClub(clubName);
  if (result.success) {
    res.json({ success: true, message: "Joined club successfully!" });
  } else {
    res.status(400).json({ success: false, error: result.error });
  }
});

// Club Leave
app.post("/api/clubs/leave", (req, res) => {
  const { clubName } = req.body;
  if (!clubName) {
    return res
      .status(400)
      .json({ success: false, error: "Missing club name" });
  }
  const result = (db as any).leaveClub(clubName);
  if (result.success) {
    res.json({
      success: true,
      message: "Resigned club membership successfully!",
    });
  } else {
    res.status(400).json({ success: false, error: result.error });
  }
});

// Get registrations
app.get("/api/registrations/:rollNumber", (req, res) => {
  const rollNumber = req.params.rollNumber;
  const sqlResult = db.executeSQL(
    "SELECT * FROM registrations WHERE roll_number = ?",
    [rollNumber]
  );
  if (sqlResult.success) {
    res.json({ success: true, registrations: sqlResult.rows });
  } else {
    res.status(500).json({ success: false, error: sqlResult.error });
  }
});

// Notifications
app.get("/api/notifications/:rollNumber", (req, res) => {
  const rollNumber = req.params.rollNumber;
  const list = db.getNotifications(rollNumber);
  res.json({ success: true, notifications: list });
});

// SQL Direct Execution Portal
app.post("/api/sql/execute", (req, res) => {
  const { sql, params } = req.body;
  if (!sql) {
    return res
      .status(400)
      .json({ success: false, error: "No SQL statement provided." });
  }
  const result = db.executeSQL(sql, params || [], true);
  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
});

// SQL Log access
app.get("/api/sql/logs", (req, res) => {
  res.json({ success: true, logs: db.getQueryLog() });
});

// Deterministic student profile helper
function getStudentProfile(rollNumber: string) {
  let sum = 0;
  for (let i = 0; i < rollNumber.length; i++) {
    sum += rollNumber.charCodeAt(i);
  }

  const firstNames = [
    "James","Sarah","Elena","Alex","David","Emma","John","Grace",
    "Michael","Sophia","Robert","Olivia","Daniel","Emily","William","Lily",
  ];
  const lastNames = [
    "Connor","Vance","Miller","Smith","Turing","Lovelace","Tesla","Curie",
    "Hopper","Feynman","Bohr","Dirac","Newton","Franklin","Galileo","Pasteur",
  ];
  const name = `${firstNames[sum % firstNames.length]} ${lastNames[(sum + 3) % lastNames.length]}`;

  const depts = [
    { name: "Computer Science (CSE)", code: "CSE", head: "Dr. Alan Turing", office: "CSE Block, Room 401" },
    { name: "Electronics & Communication (ECE)", code: "ECE", head: "Dr. Nikola Tesla", office: "ECE Block, Room 210" },
    { name: "Artificial Intelligence & Data Science (AI DS)", code: "AI DS", head: "Dr. Yann LeCun", office: "AI DS Block, Room 501" },
    { name: "Artificial Intelligence & Machine Learning (AI ML)", code: "AI ML", head: "Dr. Arthur Samuel", office: "AI ML Block, Room 601" },
    { name: "Electrical & Electronics (EEE)", code: "EEE", head: "Dr. Michael Faraday", office: "EEE Block, Room 101" },
    { name: "Instrumentation & Control (ICE)", code: "ICE", head: "Dr. Rudolf Kalman", office: "ICE Block, Room 201" },
    { name: "Mechanical (MECH)", code: "MECH", head: "Dr. James Watt", office: "MECH Block, Room 301" },
    { name: "Civil & Aerospace (AERO)", code: "AERO", head: "Dr. Wernher von Braun", office: "AERO Block, Room 701" },
  ];

  const dept = depts[sum % depts.length];
  const year = (sum % 4) + 1;
  const section = (sum % 2) === 0 ? "A" : "B";
  const studentClass = `${dept.code} - Year ${year}, Sec ${section}`;

  const facultyIncharge = {
    name: dept.head,
    office: dept.office,
    email: `${dept.head.toLowerCase().replace("dr. ", "").replace("prof. ", "").replace(" ", ".")}@cyberknights.edu`,
    phone: `+1 (555) 019-${100 + (sum % 900)}`,
  };

  return {
    name,
    department: dept.name,
    deptCode: dept.code,
    year: `${year}${year === 1 ? "st" : year === 2 ? "nd" : year === 3 ? "rd" : "th"} Year`,
    class: studentClass,
    facultyIncharge,
  };
}

// Help Desk Gemini-backed API
app.post("/api/helpdesk", async (req, res) => {
  const { message, rollNumber } = req.body;
  if (!message || !rollNumber) {
    return res
      .status(400)
      .json({ success: false, error: "Missing message or roll number." });
  }

  const profile = getStudentProfile(rollNumber);
  const ai = getGeminiClient();

  const contextPrompt = `
You are the "Cyber Knight Help Desk Advisor", an empathetic, clear, and helpful student services advisor.
A student is asking a question about their account, department, faculty, classes, or general academy rules.

Here is the student's verified profile from our database:
- User ID / Roll Number: ${rollNumber}
- Department: ${profile.department} (${profile.deptCode})
- Academic Year: ${profile.year}
- Class Section: ${profile.class}
- Faculty In-charge: ${profile.facultyIncharge.name} (Office: ${profile.facultyIncharge.office}, Email: ${profile.facultyIncharge.email})

Respond to the student's query in simple, warm, easily understandable words. Avoid complex tech jargon.
Directly address their query based on their profile if relevant (for example, if they ask who their advisor is, where their office is, or how to contact them).
Keep the tone helpful, clear, and neat. Use lists or simple bullet points if necessary.

Student's query: "${message}"
`;

  if (!ai) {
    let reply = `Hello Initiate! I am operating in offline support mode. Based on your profile:
- Your department is **${profile.department}**.
- Your class is **${profile.class}**.
- Your Faculty Advisor is **${profile.facultyIncharge.name}**, located in **${profile.facultyIncharge.office}**. You can email them at **${profile.facultyIncharge.email}**.

For help with course registration, fees, or exam schedules, please visit the Academic Dean's office or submit an official inquiry once connection is restored!`;
    return res.json({ success: true, reply });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contextPrompt,
    });
    res.json({
      success: true,
      reply:
        response.text ||
        "I'm here to help, but no text was returned. Please try asking again!",
    });
  } catch (err: any) {
    console.error("Helpdesk Gemini API error:", err);
    res.status(500).json({
      success: false,
      error: err.message,
      reply: `I'm having trouble connecting to the assistance neural link, but here are your local credentials: you are registered under the ${profile.department} and your faculty advisor is ${profile.facultyIncharge.name}.`,
    });
  }
});

// AI Chat Assistant utilizing Gemini Generate Content
app.post("/api/chat", async (req, res) => {
  const { message, history, rollNumber } = req.body;

  if (!message) {
    return res
      .status(400)
      .json({ success: false, error: "Message is required." });
  }

  // Retrieve current database stats/events to supply context to the assistant!
  const events = db.executeSQL("SELECT * FROM events").rows || [];
  const clubs = db.executeSQL("SELECT * FROM clubs").rows || [];
  const faculty = db.executeSQL("SELECT * FROM faculty").rows || [];
  const timetable = db.executeSQL("SELECT * FROM timetable").rows || [];

  const contextPrompt = `
You are the "Cyber Knight Campus AI", an intelligent, witty, helpful, and technologically advanced assistant of Cyber Knight Academy.
You help university Freshers (1st Year Students) navigate their student portal, campus events, active clubs, teachers/faculty, schedules, and registration.

Here is the REAL-TIME information from the campus SQL Database:
- CLUBS: ${JSON.stringify(clubs.map((c: any) => ({ name: c.name, lead: c.lead, contact: c.contact })))}
- FACULTY: ${JSON.stringify(faculty.map((f: any) => ({ name: f.name, dept: f.department, office: f.office })))}
- TIMETABLE: ${JSON.stringify(timetable)}
- ACTIVE EVENTS: ${JSON.stringify(events.map((e: any) => ({ title: e.title, date: e.date, venue: e.venue, category: e.category, eligible: e.eligibleYear })))}

User Information:
- Current Roll Number: ${rollNumber || "Not logged in"}

Rules for Response:
1. Always maintain a cyber-themed, helpful, welcoming, and elite academy persona (refer to students as "Initiates" or "Knights").
2. Answer queries accurately using the supplied SQL Database context. If asked about scheduling, events, registrations, or faculty, look up the data from the lists above.
3. Be friendly and concise. Keep responses to 2-3 brief, highly formatting-rich paragraphs or quick lists.
4. If asked to navigate or show a tab, tell them they can click the respective tab in the main navigation menu (e.g., "Dashboard/Events", "Timetable", "Clubs", "Faculty", "SQL Database").
5. If the Gemini API key is missing, you are running in offline backup intelligence mode, which is still perfectly responsive!

User's Query: "${message}"
`;

  const ai = getGeminiClient();

  if (!ai) {
    // Elegant offline fallback so user gets a brilliant simulation even without API keys!
    let fallbackReply = `Greetings Initiate! I am operating in secure offline safety mode. `;
    const msgLower = message.toLowerCase();

    if (msgLower.includes("event") || msgLower.includes("happen")) {
      fallbackReply += "Currently, the Cyber Knight Capture The Flag (CTF) and Annual Club Exhibition are LIVE on campus! You can browse them on your Dashboard and click 'Register' for upcoming events like the AI & Neural Networks Seminar on July 24.";
    } else if (msgLower.includes("club") || msgLower.includes("join")) {
      fallbackReply += "We have several legendary clubs like the 'Cyber Knight Security Club' led by Sarah Connor and 'Autonomous Robotics Society'. Go to the 'Clubs' tab to look them up and get contact info!";
    } else if (msgLower.includes("faculty") || msgLower.includes("teacher") || msgLower.includes("turing")) {
      fallbackReply += "Dr. Alan Turing leads our Computer Science Department and teaches Intro to Programming in Lab 101. Dr. Grace Hopper teaches Digital Logic. You can inspect their rooms and office hours under the 'Faculty' tab.";
    } else if (msgLower.includes("timetable") || msgLower.includes("schedule") || msgLower.includes("class")) {
      fallbackReply += "Your fresher schedule is available under the 'Timetable' tab! Classes run Monday through Friday starting at 09:00 AM. Check it out to plan your week.";
    } else if (msgLower.includes("sql") || msgLower.includes("database") || msgLower.includes("query")) {
      fallbackReply += "Fascinating! Our database runs on SQL. Click the 'SQL Database' tab to see live query execution logs, inspect the schema, and run direct custom queries against the database tables.";
    } else {
      fallbackReply += "I am ready to assist you. Ask me about events, clubs, timetables, faculty offices, or registration, and I'll query our relational intelligence grid instantly!";
    }

    return res.json({ success: true, reply: fallbackReply });
  }

  try {
    // Format conversation history for Gemini API
    const formattedContents: any[] = [];
    if (history && Array.isArray(history)) {
      history.forEach((chat: any) => {
        formattedContents.push({
          role: chat.sender === "user" ? "user" : "model",
          parts: [{ text: chat.text }],
        });
      });
    }

    // Append current prompt
    formattedContents.push({
      role: "user",
      parts: [{ text: contextPrompt }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: formattedContents,
    });

    const reply =
      response.text ||
      "Connection secure, but no signal returned from command node. Try again!";
    res.json({ success: true, reply });
  } catch (error: any) {
    console.error("Gemini API calling error:", error);
    res.status(500).json({
      success: false,
      error: "Command node overload. Falling back to local offline response.",
      reply: "I'm having trouble reaching the neural network grid. However, you can register for events, check faculty, or run queries using the local tabs above!",
    });
  }
});

export { app };
