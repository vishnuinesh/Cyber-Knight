import React, { useState, useEffect, useRef } from "react";
import { Shield, Eye, EyeOff, Loader2, Sparkles, KeyRound, Mail, UserPlus, Info } from "lucide-react";
import { motion } from "motion/react";

interface LoginProps {
  onLoginSuccess: (user: { rollNumber: string; email: string }) => void;
  onShowNotification: (title: string, message: string, type: 'email' | 'push') => void;
}

export default function Login({ onLoginSuccess, onShowNotification }: LoginProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'forgot'>('login');
  const [rollNumber, setRollNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Password validation state
  const [pwdValidations, setPwdValidations] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Dynamic automation particles canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (canvas) {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);

    // Grid particles
    const particles: { x: number; y: number; vx: number; vy: number; radius: number; color: string }[] = [];
    const particleCount = 60;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2 + 1,
        color: Math.random() > 0.5 ? 'rgba(2, 132, 199, 0.4)' : 'rgba(16, 185, 129, 0.4)'
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw background grid
      ctx.strokeStyle = 'rgba(2, 132, 199, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Update and draw particles
      particles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Draw connections
        for (let j = index + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.15;
            ctx.strokeStyle = `rgba(2, 132, 199, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Real-time password check
  const checkPasswordStrength = (val: string) => {
    setPwdValidations({
      length: val.length >= 6 && val.length <= 12,
      upper: /[A-Z]/.test(val),
      lower: /[a-z]/.test(val),
      number: /\d/.test(val),
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (activeTab === 'signup') {
      setPassword(val);
      checkPasswordStrength(val);
    } else if (activeTab === 'forgot') {
      setNewPassword(val);
      checkPasswordStrength(val);
    } else {
      setPassword(val);
    }
  };

  const resetState = () => {
    setRollNumber('');
    setEmail('');
    setPassword('');
    setNewPassword('');
    setError('');
    setSuccessMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (activeTab === 'login') {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rollNumber, password })
        });
        const data = await res.json();
        if (data.success) {
          onLoginSuccess(data.user);
          onShowNotification("Secure Login Established", `User ID ${data.user.rollNumber} session generated.`, 'push');
        } else {
          setError(data.error || "Login Failed");
        }
      } else if (activeTab === 'signup') {
        // Validate client side
        const isAllValid = pwdValidations.length && pwdValidations.upper && pwdValidations.lower && pwdValidations.number;
        if (!isAllValid) {
          setError("Password does not meet all cyber-defense requirements.");
          setLoading(false);
          return;
        }

        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rollNumber, email, password })
        });
        const data = await res.json();
        if (data.success) {
          setSuccessMsg("Account successfully provisioned! Please login.");
          onShowNotification("Welcome Cyber Knight!", `Welcome Initiate! Your account has been registered.`, 'email');
          onShowNotification("Account Registered", `Credentials active for User ID: ${rollNumber}`, 'push');
          // Switch tab to login
          setTimeout(() => {
            setActiveTab('login');
            resetState();
          }, 2000);
        } else {
          setError(data.error || "Registration Failed.");
        }
      } else if (activeTab === 'forgot') {
        const isAllValid = pwdValidations.length && pwdValidations.upper && pwdValidations.lower && pwdValidations.number;
        if (!isAllValid) {
          setError("New Password must satisfy cyber security standard criteria.");
          setLoading(false);
          return;
        }

        const res = await fetch("/api/auth/forgot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, newPassword })
        });
        const data = await res.json();
        if (data.success) {
          setSuccessMsg("Security clearance accepted! Password updated. Re-connect email notification sent.");
          onShowNotification("Credentials Restored", `Password reset successfully completed for email: ${email}`, 'email');
          onShowNotification("Password Reset Success", `Inbox alert dispatched to ${email}`, 'push');
          setTimeout(() => {
            setActiveTab('login');
            resetState();
          }, 2500);
        } else {
          setError(data.error || "Reset Failed.");
        }
      }
    } catch (err) {
      console.error(err);
      setError("Network or server connection failure.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="login-container" className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden select-none">
      {/* Interactive Canvas Background */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0 bg-[#060a13]" />

      {/* Decorative scanline overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 cyber-grid opacity-30" />

      {/* Central Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        id="login-card"
        className="relative z-20 w-full max-w-md bg-cyber-slate/90 border border-cyber-blue/30 rounded-2xl p-8 backdrop-blur-xl shadow-2xl shadow-cyber-blue/10"
      >
        {/* Neon corner accents */}
        <div className="absolute -top-[1px] -left-[1px] w-8 h-8 border-t-2 border-l-2 border-cyber-blue rounded-tl-2xl" />
        <div className="absolute -top-[1px] -right-[1px] w-8 h-8 border-t-2 border-r-2 border-cyber-blue rounded-tr-2xl" />
        <div className="absolute -bottom-[1px] -left-[1px] w-8 h-8 border-b-2 border-l-2 border-cyber-blue rounded-bl-2xl" />
        <div className="absolute -bottom-[1px] -right-[1px] w-8 h-8 border-b-2 border-r-2 border-cyber-blue rounded-br-2xl" />

        {/* Title / Logo Header */}
        <div className="flex flex-col items-center justify-center text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyber-blue to-cyber-neon flex items-center justify-center shadow-lg shadow-cyber-blue/30 mb-3 border border-white/10">
            <Shield className="w-9 h-9 text-white animate-pulse" id="cyber-knight-logo-shield" />
          </div>
          <h1 className="text-3xl font-display font-bold tracking-wider text-white uppercase flex items-center gap-1.5">
            CYBER <span className="text-cyber-blue">KNIGHT</span>
          </h1>
          <p className="text-xs font-mono text-gray-400 mt-1 uppercase tracking-widest">
            Campus Portal • Initiate Ingress
          </p>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-cyber-dark/80 rounded-lg border border-cyber-blue/15 mb-6">
          <button
            id="tab-login"
            onClick={() => { setActiveTab('login'); resetState(); }}
            className={`py-2 text-sm font-mono rounded-md transition-all uppercase tracking-wider ${
              activeTab === 'login'
                ? "bg-cyber-blue text-white shadow-md shadow-cyber-blue/20"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Login
          </button>
          <button
            id="tab-signup"
            onClick={() => { setActiveTab('signup'); resetState(); }}
            className={`py-2 text-sm font-mono rounded-md transition-all uppercase tracking-wider ${
              activeTab === 'signup'
                ? "bg-cyber-blue text-white shadow-md shadow-cyber-blue/20"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Sign-Up
          </button>
        </div>

        {/* Feedback Messages */}
        {error && (
          <div id="login-error-alert" className="mb-4 p-3 bg-red-950/50 border border-red-500/30 rounded-lg text-xs text-red-200 flex items-start gap-2 animate-shake">
            <Info className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}
        {successMsg && (
          <div id="login-success-alert" className="mb-4 p-3 bg-emerald-950/50 border border-emerald-500/30 rounded-lg text-xs text-emerald-200 flex items-start gap-2">
            <Sparkles className="w-4 h-4 shrink-0 text-cyber-neon" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Dynamic Forms */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === 'login' && (
            <>
              {/* User ID */}
              <div className="space-y-1">
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-wide">User ID</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">@</span>
                  <input
                    id="input-roll-login"
                    type="text"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
                    placeholder="2026CK001"
                    required
                    className="w-full pl-9 pr-4 py-2.5 bg-cyber-dark/60 border border-cyber-blue/20 rounded-lg focus:outline-none focus:border-cyber-blue text-sm text-white placeholder-gray-500 font-mono"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-mono text-gray-400 uppercase tracking-wide">Security Key</label>
                  <button
                    type="button"
                    onClick={() => setActiveTab('forgot')}
                    className="text-xs font-mono text-cyber-blue hover:underline uppercase"
                  >
                    Forgot Key?
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 w-5 h-5" />
                  <input
                    id="input-password-login"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="••••••••••••"
                    required
                    className="w-full pl-9 pr-10 py-2.5 bg-cyber-dark/60 border border-cyber-blue/20 rounded-lg focus:outline-none focus:border-cyber-blue text-sm text-white placeholder-gray-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === 'signup' && (
            <>
              {/* User ID */}
              <div className="space-y-1">
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-wide">User ID</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">@</span>
                  <input
                    id="input-roll-signup"
                    type="text"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
                    placeholder="2026CK001"
                    required
                    className="w-full pl-9 pr-4 py-2.5 bg-cyber-dark/60 border border-cyber-blue/20 rounded-lg focus:outline-none focus:border-cyber-blue text-sm text-white placeholder-gray-500 font-mono"
                  />
                </div>
                <p className="text-[10px] font-mono text-gray-400">Use your unique college User ID / roll code (letters & numbers).</p>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-wide">Student Email</label>
                <div className="relative">
                  <Mail className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 w-5 h-5" />
                  <input
                    id="input-email-signup"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="fresher@cyberknight.edu"
                    required
                    className="w-full pl-9 pr-4 py-2.5 bg-cyber-dark/60 border border-cyber-blue/20 rounded-lg focus:outline-none focus:border-cyber-blue text-sm text-white placeholder-gray-500 font-mono"
                  />
                </div>
                <p className="text-[10px] font-mono text-gray-400">Linked for registration summaries and connect codes.</p>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-wide">Shield Password</label>
                <div className="relative">
                  <KeyRound className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 w-5 h-5" />
                  <input
                    id="input-password-signup"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Cyber@123"
                    required
                    className="w-full pl-9 pr-10 py-2.5 bg-cyber-dark/60 border border-cyber-blue/20 rounded-lg focus:outline-none focus:border-cyber-blue text-sm text-white placeholder-gray-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password strength dynamic checker */}
                <div className="p-2.5 bg-cyber-dark/80 rounded-lg border border-cyber-blue/10 space-y-1.5 mt-2">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">Cyber-Defense Requirements:</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    <span className={`text-[10px] font-mono flex items-center gap-1 ${pwdValidations.length ? 'text-cyber-neon' : 'text-gray-500'}`}>
                      {pwdValidations.length ? "✓" : "✗"} 6-12 Characters
                    </span>
                    <span className={`text-[10px] font-mono flex items-center gap-1 ${pwdValidations.upper ? 'text-cyber-neon' : 'text-gray-500'}`}>
                      {pwdValidations.upper ? "✓" : "✗"} Uppercase [A-Z]
                    </span>
                    <span className={`text-[10px] font-mono flex items-center gap-1 ${pwdValidations.lower ? 'text-cyber-neon' : 'text-gray-500'}`}>
                      {pwdValidations.lower ? "✓" : "✗"} Lowercase [a-z]
                    </span>
                    <span className={`text-[10px] font-mono flex items-center gap-1 ${pwdValidations.number ? 'text-cyber-neon' : 'text-gray-500'}`}>
                      {pwdValidations.number ? "✓" : "✗"} Number [0-9]
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'forgot' && (
            <>
              <div className="space-y-2 p-3 bg-cyber-blue/10 border border-cyber-blue/20 rounded-lg text-xs text-gray-300">
                <p className="font-mono text-[10px] uppercase text-cyber-blue tracking-wide flex items-center gap-1 font-semibold">
                  <Info className="w-3.5 h-3.5" /> Reconnection Facility
                </p>
                <p>Provide your registered email address below. A validation trigger will re-route a secure reconnect dispatch to your mailbox to reset your cryptographic shield password.</p>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-wide">Registered Email Address</label>
                <div className="relative">
                  <Mail className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 w-5 h-5" />
                  <input
                    id="input-forgot-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="fresher@cyberknight.edu"
                    required
                    className="w-full pl-9 pr-4 py-2.5 bg-cyber-dark/60 border border-cyber-blue/20 rounded-lg focus:outline-none focus:border-cyber-blue text-sm text-white placeholder-gray-500 font-mono"
                  />
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-1">
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-wide">Create New Shield Key</label>
                <div className="relative">
                  <KeyRound className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 w-5 h-5" />
                  <input
                    id="input-forgot-newpassword"
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={handlePasswordChange}
                    placeholder="NewCyber@123"
                    required
                    className="w-full pl-9 pr-10 py-2.5 bg-cyber-dark/60 border border-cyber-blue/20 rounded-lg focus:outline-none focus:border-cyber-blue text-sm text-white placeholder-gray-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password strength dynamic checker */}
                <div className="p-2.5 bg-cyber-dark/80 rounded-lg border border-cyber-blue/10 space-y-1.5 mt-2">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">Defense Standards:</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    <span className={`text-[10px] font-mono flex items-center gap-1 ${pwdValidations.length ? 'text-cyber-neon' : 'text-gray-500'}`}>
                      {pwdValidations.length ? "✓" : "✗"} 6-12 Characters
                    </span>
                    <span className={`text-[10px] font-mono flex items-center gap-1 ${pwdValidations.upper ? 'text-cyber-neon' : 'text-gray-500'}`}>
                      {pwdValidations.upper ? "✓" : "✗"} Uppercase [A-Z]
                    </span>
                    <span className={`text-[10px] font-mono flex items-center gap-1 ${pwdValidations.lower ? 'text-cyber-neon' : 'text-gray-500'}`}>
                      {pwdValidations.lower ? "✓" : "✗"} Lowercase [a-z]
                    </span>
                    <span className={`text-[10px] font-mono flex items-center gap-1 ${pwdValidations.number ? 'text-cyber-neon' : 'text-gray-500'}`}>
                      {pwdValidations.number ? "✓" : "✗"} Number [0-9]
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => { setActiveTab('login'); resetState(); }}
                  className="text-xs font-mono text-gray-400 hover:text-white uppercase"
                >
                  Return to Login
                </button>
              </div>
            </>
          )}

          {/* Action button */}
          <button
            id="button-auth-submit"
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyber-blue to-cyan-600 text-white font-mono uppercase tracking-wider py-3 rounded-lg text-sm hover:from-cyan-600 hover:to-cyber-blue transition-all shadow-lg hover:shadow-cyber-blue/20 border border-white/10 disabled:opacity-50 font-bold active:scale-98 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Validating Node...
              </>
            ) : activeTab === 'login' ? (
              <>
                <Shield className="w-4 h-4" />
                Initialize Access
              </>
            ) : activeTab === 'signup' ? (
              <>
                <UserPlus className="w-4 h-4" />
                Register Knight
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Reset Crypt Key
              </>
            )}
          </button>
        </form>

        {/* Guest credentials display helper */}
        {activeTab === 'login' && (
          <div className="mt-6 pt-5 border-t border-cyber-blue/15 text-center">
            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Default Campus Demo Access:</p>
            <div className="mt-1.5 inline-flex flex-col gap-0.5 px-3 py-1.5 bg-cyber-dark/40 border border-cyber-blue/10 rounded-lg text-[10px] font-mono text-cyber-blue text-left">
              <span>Roll Code: <strong className="text-white">2026CK001</strong></span>
              <span>Password: <strong className="text-white">Password@123</strong></span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
