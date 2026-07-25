import React, { useState } from 'react';
import {
  MapPin,
  Building,
  Coffee,
  Utensils,
  BookOpen,
  Trophy,
  Search,
  Compass,
  Layers,
  Sparkles,
  Users,
  Shield,
  Zap,
  Info,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getStudentProfile } from './Dashboard';

interface CampusMapProps {
  user: { rollNumber: string; email: string };
}

export interface MapLocation {
  id: string;
  name: string;
  category: 'dept' | 'admin' | 'sports' | 'amenity' | 'club' | 'library';
  typeLabel: string;
  deptCode?: string;
  headOrLead?: string;
  officeOrRoom: string;
  description: string;
  gridPos: { row: number; col: number; colSpan?: number; rowSpan?: number };
  color: string;
  borderColor: string;
  icon: any;
  status: 'OPEN' | 'ACTIVE' | '24/7' | 'LIVE MATCH';
  details: string[];
}

export default function CampusMap({ user }: CampusMapProps) {
  const studentProfile = getStudentProfile(user.rollNumber);
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedDept, setHighlightedDept] = useState<string | null>(studentProfile.deptCode);

  const locations: MapLocation[] = [
    // --- ADMINISTRATION & PRINCIPAL ---
    {
      id: 'principal-hq',
      name: "Principal & Director's Office Suite",
      category: 'admin',
      typeLabel: 'Executive Command',
      headOrLead: 'Dr. Elizabeth Vance (Principal)',
      officeOrRoom: 'Main Admin Tower, Floor 3',
      description: 'The executive office of the Academy Principal and Vice-Chancellor. Handles institutional policies, university governance, and honors.',
      gridPos: { row: 1, col: 4, colSpan: 2 },
      color: 'from-amber-500/20 to-yellow-600/10',
      borderColor: 'border-amber-500/40 text-amber-400',
      icon: Shield,
      status: 'OPEN',
      details: ['Principal Suite Room 301', 'Vice-Chancellor Boardroom', 'Academic Honors Gallery']
    },
    {
      id: 'admin-office',
      name: 'Central Administration & Accounts Office',
      category: 'admin',
      typeLabel: 'Administrative Services',
      headOrLead: 'Honorable Registrar & Finance Officer',
      officeOrRoom: 'Central Admin Block, Ground Floor',
      description: 'Central registry for student admissions, fee clearance, scholarships, official transcripts, and university ID card issuance.',
      gridPos: { row: 2, col: 4, colSpan: 2 },
      color: 'from-blue-600/20 to-indigo-600/10',
      borderColor: 'border-blue-500/40 text-blue-400',
      icon: Building,
      status: 'OPEN',
      details: ['Student Accounts Counter 1-4', 'Admissions Clearance Desk', 'Registrar Helpdesk']
    },

    // --- ACADEMIC DEPARTMENTS ---
    {
      id: 'dept-cse',
      name: 'Computer Science & Engineering (CSE) Block',
      category: 'dept',
      typeLabel: 'Academic Department',
      deptCode: 'CSE',
      headOrLead: 'Dr. Alan Turing (HOD)',
      officeOrRoom: 'Room 401, CSE Block',
      description: 'High-performance computing core housing Advanced Systems Labs, Software Engineering Studios, and AI Development Hubs.',
      gridPos: { row: 1, col: 1, colSpan: 2 },
      color: 'from-cyan-500/20 to-blue-600/10',
      borderColor: 'border-cyan-400/50 text-cyan-300',
      icon: Zap,
      status: 'ACTIVE',
      details: ['Programming Lab T1-T5', 'Algorithm Research Studio', 'Linux Kernel Lab (Torvalds Hall)']
    },
    {
      id: 'dept-ece',
      name: 'Electronics & Communication (ECE) Block',
      category: 'dept',
      typeLabel: 'Academic Department',
      deptCode: 'ECE',
      headOrLead: 'Dr. Nikola Tesla (HOD)',
      officeOrRoom: 'Room 210, ECE Block',
      description: 'Dedicated to microelectronics, VLSI design, wireless signal processing, and antenna design laboratories.',
      gridPos: { row: 2, col: 1, colSpan: 2 },
      color: 'from-emerald-500/20 to-teal-600/10',
      borderColor: 'border-emerald-400/50 text-emerald-300',
      icon: Building,
      status: 'ACTIVE',
      details: ['VLSI Simulation Center', 'Signal Processing Lab L1-L3', 'Electromagnetics Chamber']
    },
    {
      id: 'dept-aids',
      name: 'Artificial Intelligence & Data Science (AI DS) Block',
      category: 'dept',
      typeLabel: 'Academic Department',
      deptCode: 'AI DS',
      headOrLead: 'Dr. Yann LeCun (HOD)',
      officeOrRoom: 'Room 501, AI DS Block',
      description: 'Supercomputing cluster for deep learning models, big data analytics, computer vision, and neural network research.',
      gridPos: { row: 3, col: 1, colSpan: 2 },
      color: 'from-purple-500/20 to-indigo-600/10',
      borderColor: 'border-purple-400/50 text-purple-300',
      icon: Sparkles,
      status: 'ACTIVE',
      details: ['GPU Supercluster (NVIDIA H100s)', 'Computer Vision Lab AI1', 'Big Data Engineering Lab']
    },
    {
      id: 'dept-aiml',
      name: 'Artificial Intelligence & Machine Learning (AI ML) Block',
      category: 'dept',
      typeLabel: 'Academic Department',
      deptCode: 'AI ML',
      headOrLead: 'Dr. Arthur Samuel (HOD)',
      officeOrRoom: 'Room 601, AI ML Block',
      description: 'Advanced machine intelligence research center exploring reinforcement learning, robotics AI, and natural language processing.',
      gridPos: { row: 4, col: 1, colSpan: 2 },
      color: 'from-fuchsia-500/20 to-pink-600/10',
      borderColor: 'border-fuchsia-400/50 text-fuchsia-300',
      icon: Sparkles,
      status: 'ACTIVE',
      details: ['Reinforcement Learning Lab ML1', 'NLP & LLM Research Lab', 'Autonomous Systems Hub']
    },
    {
      id: 'dept-eee',
      name: 'Electrical & Electronics Engineering (EEE) Block',
      category: 'dept',
      typeLabel: 'Academic Department',
      deptCode: 'EEE',
      headOrLead: 'Dr. Michael Faraday (HOD)',
      officeOrRoom: 'Room 101, EEE Block',
      description: 'Power systems engineering, renewable energy grids, high-voltage laboratories, and electric vehicle technology centers.',
      gridPos: { row: 1, col: 8, colSpan: 2 },
      color: 'from-yellow-500/20 to-amber-600/10',
      borderColor: 'border-yellow-400/50 text-yellow-300',
      icon: Zap,
      status: 'ACTIVE',
      details: ['High Voltage Power Lab', 'Smart Grid Simulation Studio', 'EV Powertrain Lab']
    },
    {
      id: 'dept-ice',
      name: 'Instrumentation & Control Engineering (ICE) Block',
      category: 'dept',
      typeLabel: 'Academic Department',
      deptCode: 'ICE',
      headOrLead: 'Dr. Rudolf Kalman (HOD)',
      officeOrRoom: 'Room 201, ICE Block',
      description: 'Focuses on industrial automation, sensor networks, process control loops, and biomedical instrumentation.',
      gridPos: { row: 2, col: 8, colSpan: 2 },
      color: 'from-teal-500/20 to-cyan-600/10',
      borderColor: 'border-teal-400/50 text-teal-300',
      icon: Layers,
      status: 'ACTIVE',
      details: ['Process Control Lab L6-L7', 'Biomedical Sensors Hub', 'PLC Automation Studio']
    },
    {
      id: 'dept-mech',
      name: 'Mechanical Engineering (MECH) Heavy Block',
      category: 'dept',
      typeLabel: 'Academic Department',
      deptCode: 'MECH',
      headOrLead: 'Dr. James Watt (HOD)',
      officeOrRoom: 'Room 301, MECH Block',
      description: 'Thermodynamics labs, CNC machining workshops, 3D additive manufacturing centers, and automotive testing bays.',
      gridPos: { row: 3, col: 8, colSpan: 2 },
      color: 'from-orange-500/20 to-red-600/10',
      borderColor: 'border-orange-400/50 text-orange-300',
      icon: Building,
      status: 'ACTIVE',
      details: ['Heavy Machine Workshop H1-H2', 'CNC Precision Lab', '3D Printing & Fabrication Bay']
    },
    {
      id: 'dept-aero',
      name: 'Civil & Aerospace Engineering (AERO) Complex',
      category: 'dept',
      typeLabel: 'Academic Department',
      deptCode: 'AERO',
      headOrLead: 'Dr. Wernher von Braun (HOD)',
      officeOrRoom: 'Room 701, AERO Block',
      description: 'Supersonic wind tunnel testing facility, flight simulation cockpit, structural materials testing, and satellite design lab.',
      gridPos: { row: 4, col: 8, colSpan: 2 },
      color: 'from-sky-500/20 to-blue-700/10',
      borderColor: 'border-sky-400/50 text-sky-300',
      icon: Compass,
      status: 'ACTIVE',
      details: ['Aerodynamics Subsonic Wind Tunnel H3', 'Flight Simulator Cockpit', 'Satellite & CubeSat Clean Room']
    },

    // --- LIBRARY & CLUBS ---
    {
      id: 'central-library',
      name: 'Central Cyber Library & Knowledge Commons',
      category: 'library',
      typeLabel: 'Academic Library & Research',
      headOrLead: 'Dr. Barbara Liskov (Chief Librarian)',
      officeOrRoom: 'Central Knowledge Complex',
      description: '4-story modern digital library equipped with 200,000+ print volumes, e-journal terminals, private study pods, and 24/7 reading halls.',
      gridPos: { row: 3, col: 4, colSpan: 2 },
      color: 'from-emerald-600/25 to-cyan-600/10',
      borderColor: 'border-emerald-400/60 text-emerald-300',
      icon: BookOpen,
      status: '24/7',
      details: ['Ground Floor: Silent Reading Commons', 'Floor 2: E-Journal Terminals & IEEE Access', 'Floor 3: Private Group Discussion Pods']
    },
    {
      id: 'clubs-hq',
      name: "Student Clubs Office & Societies Headquarters",
      category: 'club',
      typeLabel: 'Student Activity Hub',
      headOrLead: 'Sarah Connor (Student Body President)',
      officeOrRoom: 'Student Activity Center (SAC) Block B',
      description: 'Central hub for all 15+ student organizations including Cyber Security Base, Robotics Arena, Drama Circle, and Literary Guild.',
      gridPos: { row: 4, col: 4, colSpan: 2 },
      color: 'from-pink-500/20 to-purple-600/10',
      borderColor: 'border-pink-400/50 text-pink-300',
      icon: Users,
      status: 'OPEN',
      details: [
        'Room 201: Cyber Knight Security Club HQ',
        'Room 105: Autonomous Robotics Society Arena',
        'Plaza Annex: Fine Arts & Drama Studio',
        'Admin Yard: NSS Social Service Unit'
      ]
    },

    // --- DINING & CAFES ---
    {
      id: 'tech-cafe',
      name: 'Cyber Knight Tech Cafe & Coffee Lounge',
      category: 'amenity',
      typeLabel: 'Cafeteria & Refreshments',
      headOrLead: 'Chef Marco & Espresso Team',
      officeOrRoom: 'Central Plaza Arcade, Shop 1-3',
      description: 'Modern coffee bar serving artisan coffees, fresh pastries, quick snacks, sandwiches, and fresh juices with high-speed Wi-Fi.',
      gridPos: { row: 1, col: 3 },
      color: 'from-amber-600/20 to-yellow-700/10',
      borderColor: 'border-amber-400/50 text-amber-300',
      icon: Coffee,
      status: 'OPEN',
      details: ['Specialty Cold Brew & Espresso', 'Fresh Bakery & Pastry Counter', 'Outdoor Patio Seating']
    },
    {
      id: 'central-dining',
      name: 'Grand Student Dining Hall & Food Court',
      category: 'amenity',
      typeLabel: 'Campus Mess & Dining',
      headOrLead: 'Campus Dining Services',
      officeOrRoom: 'Dining Complex, Ground & 1st Floor',
      description: 'Air-conditioned 1,200-seat multi-cuisine dining hall serving nutritious breakfast, lunch, snacks, and dinner for students and staff.',
      gridPos: { row: 2, col: 3 },
      color: 'from-orange-600/20 to-amber-700/10',
      borderColor: 'border-orange-400/50 text-orange-300',
      icon: Utensils,
      status: 'OPEN',
      details: ['North & South Indian Buffet Counters', 'Healthy Juice & Salad Bar', 'Live Dosa & Chat Station']
    },

    // --- SPORTS GROUNDS & COURTS ---
    {
      id: 'stadium-football-cricket',
      name: 'Cyber Knight Main Sports Stadium (Football & Cricket Pitch)',
      category: 'sports',
      typeLabel: 'Outdoor Stadium',
      headOrLead: 'Coach Marcus Vance (Sports Director)',
      officeOrRoom: 'Stadium Pavilion Room 1',
      description: 'Floodlit Olympic-size grass football pitch surrounded by a professional 400m running track and international standard cricket oval pitch with pavilion stands.',
      gridPos: { row: 1, col: 6, colSpan: 2 },
      color: 'from-green-600/25 to-emerald-700/15',
      borderColor: 'border-green-400/60 text-green-300',
      icon: Trophy,
      status: 'LIVE MATCH',
      details: ['Full-size Football Pitch (Grass Turf)', 'Turf Cricket Pitch with Net Practice Nets', '400m 8-Lane Synthetic Athletic Track']
    },
    {
      id: 'sports-courts-outdoor',
      name: 'Outdoor Sports Arena (Tennis, Basketball, Volleyball & Baseball)',
      category: 'sports',
      typeLabel: 'Multi-Sport Courts',
      headOrLead: 'Department of Physical Education',
      officeOrRoom: 'Outdoor Sports Office',
      description: 'Synthetic acrylic courts equipped with LED floodlights for evening games. Includes Tennis courts, Basketball courts, Volleyball courts, and Baseball diamond field.',
      gridPos: { row: 2, col: 6, colSpan: 2 },
      color: 'from-blue-600/25 to-teal-700/15',
      borderColor: 'border-blue-400/60 text-blue-300',
      icon: Trophy,
      status: 'OPEN',
      details: [
        '🏀 2 Synthetic Acrylic Basketball Courts',
        '🎾 2 Professional Hard Surface Tennis Courts',
        '🏐 2 Floodlit Volleyball Courts',
        '⚾ Baseball Practice Diamond & Batting Cage'
      ]
    },
    {
      id: 'indoor-sports-badminton',
      name: 'Indoor Games Stadium & Badminton Complex',
      category: 'sports',
      typeLabel: 'Indoor Athletics & Gaming',
      headOrLead: 'Indoor Athletics Supervisor',
      officeOrRoom: 'Indoor Sports Complex Gate 2',
      description: 'State-of-the-art indoor sports arena housing wooden-floor Badminton courts, Table Tennis arena, Chess/Carrom halls, Squash court, and E-Sports Gaming Lounge.',
      gridPos: { row: 3, col: 6, colSpan: 2 },
      color: 'from-violet-600/25 to-purple-700/15',
      borderColor: 'border-purple-400/60 text-purple-300',
      icon: Trophy,
      status: 'OPEN',
      details: [
        '🏸 4 Yonex Synthetic Wooden Badminton Courts',
        '🏓 6 Stiga Table Tennis Boards',
        '♟️ Chess & Carrom Tournament Hall',
        '🎮 Cyber Esports Simulator Arena'
      ]
    }
  ];

  // Filtering logic
  const filteredLocations = locations.filter(loc => {
    const matchesCategory = activeCategory === 'all' || loc.category === activeCategory;
    const matchesSearch =
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.typeLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (loc.deptCode && loc.deptCode.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-cyber-slate/40 border border-cyber-blue/15 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyber-blue/5 rounded-full blur-3xl pointer-events-none" />
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyber-neon animate-ping" />
            <span className="font-mono text-xs text-cyber-neon uppercase tracking-widest font-bold">LIVE CAMPUS GIS SATELLITE MAP</span>
          </div>
          <h2 className="text-xl font-display font-black text-white mt-1 uppercase tracking-wider">
            Cyber Knight Academy Campus Master Plan
          </h2>
          <p className="text-xs text-gray-400 font-mono mt-0.5">
            Interactive blueprints with real-time GPS tracking for Academic Blocks, Sports Arenas, Dining, Administration & Clubs.
          </p>
        </div>

        {/* User Enrolled Badge */}
        <div className="bg-cyber-dark/80 border border-cyber-neon/30 p-3 rounded-xl flex items-center gap-3 shadow-lg shadow-cyber-neon/5">
          <div className="w-9 h-9 rounded-lg bg-cyber-neon/10 border border-cyber-neon/40 flex items-center justify-center text-cyber-neon shrink-0">
            <MapPin className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <span className="text-[9px] font-mono uppercase text-gray-400 block tracking-wider">Your Assigned Primary Location</span>
            <span className="text-xs font-mono font-bold text-cyber-neon uppercase block">
              {studentProfile.deptCode} WING ({studentProfile.class})
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 bg-cyber-slate/20 border border-cyber-blue/15 p-3 rounded-xl">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 md:pb-0">
          {[
            { id: 'all', label: 'All Campus (16)', icon: Compass },
            { id: 'dept', label: 'Academic Blocks (8)', icon: Building },
            { id: 'sports', label: 'Grounds & Courts (3)', icon: Trophy },
            { id: 'admin', label: 'Admin & Principal (2)', icon: Shield },
            { id: 'amenity', label: 'Cafe & Dining (2)', icon: Utensils },
            { id: 'library', label: 'Library (1)', icon: BookOpen },
            { id: 'club', label: 'Clubs HQ (1)', icon: Users }
          ].map(cat => {
            const CatIcon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg font-mono text-[11px] font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-cyber-blue text-white shadow-md shadow-cyber-blue/20'
                    : 'bg-cyber-dark/60 text-gray-400 hover:text-white border border-cyber-blue/10 hover:border-cyber-blue/30'
                }`}
              >
                <CatIcon className="w-3.5 h-3.5" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative shrink-0 md:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search building, court, cafe..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-cyber-dark/80 border border-cyber-blue/20 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyber-neon font-mono"
          />
        </div>
      </div>

      {/* Main Grid: Live Interactive Map + Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Visual Interactive Campus Blueprint Grid */}
        <div className="lg:col-span-2 bg-cyber-dark/90 border border-cyber-blue/20 rounded-xl p-5 flex flex-col gap-4 relative overflow-hidden">
          <div className="absolute inset-0 cyber-grid opacity-15 pointer-events-none" />
          
          <div className="flex justify-between items-center relative z-10">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-cyber-blue uppercase font-bold tracking-widest">REAL-TIME ARCHITECTURAL GRID</span>
              <span className="text-[10px] font-mono text-gray-400">Scale: 1:500 • North Up</span>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-mono text-gray-400">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyber-neon" /> Student Dept</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> Admin/HQ</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400" /> Sports</span>
            </div>
          </div>

          {/* Interactive Map Layout Grid */}
          <div className="relative z-10 border border-cyber-blue/20 rounded-xl bg-cyber-slate/20 p-4 space-y-4">
            
            {/* North Roadway Access */}
            <div className="bg-cyber-dark/70 border border-dashed border-gray-700 p-2 rounded-lg text-center font-mono text-[9px] text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2">
              <span>🛣️ NORTH ACADEMY AVENUE (MAIN ENTRANCE GATE & SECURITY)</span>
            </div>

            {/* Campus Grid Layout (4 Rows x 9 Cols) */}
            <div className="grid grid-cols-9 gap-2.5 min-h-[460px]">
              {locations.map(loc => {
                const isSelected = selectedLocation?.id === loc.id;
                const isUserDept = loc.deptCode === studentProfile.deptCode;
                const isFilteredOut = !filteredLocations.some(f => f.id === loc.id);
                const LocIcon = loc.icon;

                // Position styles
                const colSpanClass = loc.gridPos.colSpan ? `col-span-${loc.gridPos.colSpan}` : 'col-span-1';
                
                return (
                  <motion.button
                    key={loc.id}
                    onClick={() => setSelectedLocation(loc)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      gridRowStart: loc.gridPos.row,
                      gridColumnStart: loc.gridPos.col,
                      gridColumnEnd: `span ${loc.gridPos.colSpan || 1}`
                    }}
                    className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                      isFilteredOut ? 'opacity-25 grayscale' : 'opacity-100'
                    } ${
                      isSelected
                        ? 'bg-cyber-blue/30 border-cyber-neon ring-2 ring-cyber-neon/50 shadow-xl shadow-cyber-neon/15 z-20'
                        : isUserDept
                        ? 'bg-cyber-blue/20 border-cyber-neon text-white shadow-lg shadow-cyber-neon/10 animate-pulse z-10'
                        : `bg-gradient-to-br ${loc.color} ${loc.borderColor} hover:border-cyber-blue/50`
                    }`}
                  >
                    {/* User Enrolled Marker Pin */}
                    {isUserDept && (
                      <div className="absolute -top-2.5 -right-2 bg-cyber-neon text-cyber-dark font-mono font-black text-[8px] px-1.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-0.5 shadow-md">
                        <MapPin className="w-2.5 h-2.5" /> YOUR DEPT
                      </div>
                    )}

                    {/* Card Top Row */}
                    <div>
                      <div className="flex justify-between items-start gap-1">
                        <span className="font-mono text-[9px] uppercase tracking-wider font-bold text-gray-400 block">
                          {loc.typeLabel}
                        </span>
                        <span className={`text-[7px] font-mono px-1.5 py-0.5 rounded font-extrabold uppercase shrink-0 ${
                          loc.status === 'LIVE MATCH' ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse' :
                          loc.status === '24/7' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                          'bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/30'
                        }`}>
                          {loc.status}
                        </span>
                      </div>

                      <h4 className="font-sans font-extrabold text-xs text-white leading-snug mt-1 flex items-center gap-1.5">
                        <LocIcon className="w-3.5 h-3.5 text-cyber-neon shrink-0" />
                        <span className="line-clamp-1">{loc.name}</span>
                      </h4>
                    </div>

                    {/* Card Bottom Row */}
                    <div className="mt-2 pt-1.5 border-t border-white/5 flex justify-between items-end text-[9px] font-mono text-gray-400">
                      <span className="truncate pr-1">{loc.officeOrRoom}</span>
                      <ArrowUpRight className="w-3 h-3 text-cyber-blue shrink-0" />
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* South Roadway & Central Plaza Walkway */}
            <div className="bg-cyber-dark/70 border border-dashed border-gray-700 p-2 rounded-lg text-center font-mono text-[9px] text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2">
              <span>🌴 SOUTH CAMPUS WALKWAY & AUDITORIUM COMPLEX</span>
            </div>
          </div>

          {/* User Location Guidance Footer */}
          <div className="p-3 bg-cyber-slate/30 border border-cyber-blue/15 rounded-xl flex items-center justify-between font-mono text-xs text-gray-300">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-cyber-neon animate-spin" />
              <span>Click any building or court on the map to inspect full facility details & schedules.</span>
            </div>
            <span className="text-cyber-neon font-bold text-[10px] uppercase">CAD GIS ENGINE v3.4</span>
          </div>
        </div>

        {/* Right Col: Selected Location Details & Full Campus Directory */}
        <div className="space-y-5">
          
          {/* Selected Location Card */}
          <AnimatePresence mode="wait">
            {selectedLocation ? (
              <motion.div
                key={selectedLocation.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-cyber-slate/30 border-2 border-cyber-neon/40 rounded-xl p-5 space-y-4 shadow-xl shadow-cyber-neon/5 relative overflow-hidden"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-[10px] text-cyber-neon uppercase tracking-widest font-bold block">
                      SELECTED FACILITY DOSSIER
                    </span>
                    <h3 className="text-base font-display font-black text-white mt-0.5">
                      {selectedLocation.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedLocation(null)}
                    className="text-gray-400 hover:text-white text-xs font-mono bg-cyber-dark px-2 py-1 rounded border border-cyber-blue/20 cursor-pointer"
                  >
                    CLOSE ✕
                  </button>
                </div>

                <div className="p-3 bg-cyber-dark/80 border border-cyber-blue/15 rounded-lg space-y-2 text-xs font-mono">
                  <div className="flex justify-between border-b border-cyber-blue/10 pb-1.5">
                    <span className="text-gray-400">Category:</span>
                    <span className="text-cyber-blue font-bold uppercase">{selectedLocation.typeLabel}</span>
                  </div>
                  {selectedLocation.headOrLead && (
                    <div className="flex justify-between border-b border-cyber-blue/10 pb-1.5">
                      <span className="text-gray-400">Head / Advisor:</span>
                      <span className="text-cyber-neon font-bold">{selectedLocation.headOrLead}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-b border-cyber-blue/10 pb-1.5">
                    <span className="text-gray-400">Location/Room:</span>
                    <span className="text-white">{selectedLocation.officeOrRoom}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Operational Status:</span>
                    <span className="text-emerald-400 font-bold">{selectedLocation.status}</span>
                  </div>
                </div>

                <p className="text-xs text-gray-300 font-sans leading-relaxed">
                  {selectedLocation.description}
                </p>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-cyber-blue uppercase font-bold tracking-wider block">
                    Facility Highlights & Sub-Units
                  </span>
                  <div className="space-y-1">
                    {selectedLocation.details.map((detail, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-mono text-gray-300 bg-cyber-dark/50 p-2 rounded border border-cyber-blue/10">
                        <CheckCircle className="w-3.5 h-3.5 text-cyber-neon shrink-0" />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="bg-cyber-slate/20 border border-cyber-blue/15 rounded-xl p-5 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-cyber-blue/10 border border-cyber-blue/30 flex items-center justify-center text-cyber-blue mx-auto">
                  <Compass className="w-6 h-6 animate-pulse" />
                </div>
                <h4 className="text-sm font-mono font-bold text-white uppercase">No Building Selected</h4>
                <p className="text-xs text-gray-400">
                  Click any building block, dining hall, sports ground, or office on the campus map to view detailed descriptions, room numbers, and faculty advisors.
                </p>
              </div>
            )}
          </AnimatePresence>

          {/* Complete Directory Quick List */}
          <div className="bg-cyber-slate/20 border border-cyber-blue/15 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-mono text-[10px] text-cyber-blue uppercase tracking-widest font-bold">
                CAMPUS DIRECTORY INDEX ({filteredLocations.length})
              </span>
              <span className="text-[9px] font-mono text-gray-400">Real-time Data</span>
            </div>

            <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1 custom-scrollbar">
              {filteredLocations.map(loc => {
                const LocIcon = loc.icon;
                const isUserDept = loc.deptCode === studentProfile.deptCode;
                return (
                  <div
                    key={loc.id}
                    onClick={() => setSelectedLocation(loc)}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      selectedLocation?.id === loc.id
                        ? 'bg-cyber-blue/30 border-cyber-neon text-white'
                        : isUserDept
                        ? 'bg-cyber-blue/15 border-cyber-neon/40 text-gray-200'
                        : 'bg-cyber-dark/50 border-cyber-blue/10 text-gray-300 hover:border-cyber-blue/30 hover:bg-cyber-dark/80'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-sans font-bold text-xs flex items-center gap-1.5 text-white">
                        <LocIcon className="w-3.5 h-3.5 text-cyber-neon shrink-0" />
                        {loc.name}
                      </span>
                      {isUserDept && (
                        <span className="text-[8px] font-mono bg-cyber-neon/20 text-cyber-neon px-1.5 py-0.5 rounded font-bold">
                          YOUR DEPT
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] font-mono text-gray-400 mt-1">
                      {loc.officeOrRoom} {loc.headOrLead ? `• ${loc.headOrLead}` : ''}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
