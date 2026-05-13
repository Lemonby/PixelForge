import React from "react";
import { Sparkles, Image as ImageIcon, Zap, BookOpen, ArrowRight, Activity, Cpu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const HomePage = () => {
  const navigate = useNavigate();

  // Futuristic animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 10 }
    }
  };

  const glowPulse = {
    animate: {
      boxShadow: [
        "0px 0px 0px 0px rgba(0,240,255,0.0)",
        "0px 0px 20px 5px rgba(0,240,255,0.4)",
        "0px 0px 0px 0px rgba(0,240,255,0.0)"
      ],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    }
  };

  return (
    <div className="min-h-screen relative bg-cyber-bg font-sans flex flex-col items-center pb-20">
      {/* Background Orbs */}
      <div className="orb-1 fixed pointer-events-none"></div>
      <div className="orb-2 fixed pointer-events-none"></div>
      
      {/* Grid Pattern */}
      <div className="fixed inset-0 opacity-[0.04] z-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>

      {/* Navigation */}
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-7xl mx-auto px-8 py-6 flex justify-between items-center z-10 sticky top-0 backdrop-blur-sm bg-cyber-bg/50 border-b border-white/5"
      >
        <div className="flex items-center gap-3 group cursor-pointer">
          <motion.div 
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.6 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center font-bold text-white shadow-[0_0_20px_rgba(0,240,255,0.4)]"
          >
            PF
          </motion.div>
          <h1 className="text-2xl font-bold tracking-widest text-white group-hover:text-cyber-cyan transition-colors">PIXELFORGE</h1>
        </div>
        <div className="flex gap-8 items-center">
          <a href="#features" className="text-white/60 hover:text-white hover:text-shadow-glow text-sm font-medium transition-all">Features</a>
          <a href="#about" className="text-white/60 hover:text-white hover:text-shadow-glow text-sm font-medium transition-all">Engine</a>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/editor')}
            className="px-6 py-2 bg-white/5 hover:bg-cyber-cyan/20 border border-white/10 hover:border-cyber-cyan/50 rounded-lg transition-all text-white font-medium text-sm flex items-center gap-2"
          >
            Launch Core <Activity size={16} className="text-cyber-cyan" />
          </motion.button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 w-full max-w-7xl mx-auto px-8 flex flex-col justify-center items-center text-center z-10 pt-24 pb-16"
      >
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-[0.2em] mb-10 shadow-[0_0_15px_rgba(255,255,255,0.05)] backdrop-blur-md hover:bg-white/10 transition-colors cursor-default">
          <Cpu size={14} className="text-cyber-cyan animate-pulse" /> Next-Gen Neural Processing
        </motion.div>
        
        <motion.h2 variants={itemVariants} className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-8 leading-[1.1] drop-shadow-2xl">
          Forge Your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink animate-gradient-x">
            Perfect Pixels
          </span>
        </motion.h2>
        
        <motion.p variants={itemVariants} className="text-cyber-muted text-lg md:text-xl max-w-2xl mb-14 font-light leading-relaxed">
          Step into the future of image manipulation. PixelForge harnesses matrix algorithms, spatial filtering, and advanced morphology within a breathtaking cybernetic interface.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6">
          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0, 240, 255, 0.5)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/editor')}
            className="group relative px-8 py-4 bg-white text-black font-bold rounded-xl text-lg flex items-center justify-center gap-3 overflow-hidden transition-all"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyber-cyan to-cyber-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10 group-hover:text-white transition-colors duration-300">Initialize Studio</span>
            <ArrowRight size={20} className="relative z-10 group-hover:text-white transition-colors duration-300 group-hover:translate-x-1" />
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl text-white font-medium text-lg flex items-center justify-center gap-3 transition-all backdrop-blur-md"
          >
            <BookOpen size={20} className="text-cyber-muted group-hover:text-white" /> View Documentation
          </motion.button>
        </motion.div>

        {/* Feature Highlights Grid */}
        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 w-full text-left"
        >
          {/* Card 1 */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(0,240,255,0.1)" }}
            className="glass-panel p-8 relative overflow-hidden group cursor-default"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-cyan to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <motion.div variants={glowPulse} animate="animate" className="w-14 h-14 rounded-xl bg-cyber-cyan/10 flex items-center justify-center mb-6 border border-cyber-cyan/30">
              <Zap size={28} className="text-cyber-cyan" />
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-3 tracking-wide">Real-Time Core</h3>
            <p className="text-cyber-muted text-sm leading-relaxed">Experience instant visual feedback powered by an optimized Python backend utilizing heavy OpenCV matrix operations.</p>
          </motion.div>
          
          {/* Card 2 */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(138,43,226,0.1)" }}
            className="glass-panel p-8 relative overflow-hidden group cursor-default"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-cyber-purple/20 blur-3xl rounded-full group-hover:bg-cyber-purple/30 transition-colors"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-purple to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-14 h-14 rounded-xl bg-cyber-purple/10 flex items-center justify-center mb-6 border border-cyber-purple/30 relative z-10 group-hover:scale-110 transition-transform">
              <ImageIcon size={28} className="text-cyber-purple" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 relative z-10 tracking-wide">Spatial Filtering</h3>
            <p className="text-cyber-muted text-sm leading-relaxed relative z-10">Advanced kernel convolutions from basic enhancements to complex edge detection (Canny, Sobel) and morphology.</p>
          </motion.div>
          
          {/* Card 3 */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(255,0,60,0.1)" }}
            className="glass-panel p-8 relative overflow-hidden group cursor-default"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-pink to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.5 }} className="w-14 h-14 rounded-xl bg-cyber-pink/10 flex items-center justify-center mb-6 border border-cyber-pink/30">
              <Sparkles size={28} className="text-cyber-pink" />
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-3 tracking-wide">Premium Glass UX</h3>
            <p className="text-cyber-muted text-sm leading-relaxed">A sleek, modern glassmorphism interface that makes professional grade image manipulation deeply immersive.</p>
          </motion.div>
        </motion.div>
      </motion.main>
    </div>
  );
};

export default HomePage;
