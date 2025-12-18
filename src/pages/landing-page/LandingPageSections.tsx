"use client";

import {
  motion,
  useAnimation,
  useSpring,
  useTransform,
  MotionValue,
  useInView,
  useScroll,
} from "framer-motion";
import {
  FaRocket,
  FaChartLine,
  FaBrain,
  FaUsers,
  FaSearch,
  FaCog,
  FaCheck,
  FaComments,
  FaCode,
  FaChartBar,
  FaStar,
  FaFire,
  FaLightbulb,
  FaBullseye,
  FaChartArea,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  Brain,
  Menu,
  Pickaxe,
  Play,
  Rocket,
  X,
  Target,
  TrendingUp,
  AlertTriangle,
  Zap,
  BarChart3,
  Eye,
  Activity,
  Layers,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GuestHeader from "@/components/layout/GuestHeader";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0 },
};

const slideInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
};

const HeroSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, {
    once: true,
    amount: 0.1,
  });

  return (
    <section
      ref={ref}
      className="pt-7 relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.4, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        <motion.div
          className="max-w-5xl mx-auto text-center"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={staggerContainer}>
          {/* Badge */}
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center space-x-2 bg-purple-500/10 border border-purple-500/30 rounded-full px-4 py-2 mb-8">
            <Zap className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 text-sm font-medium">
              AI-Powered Facebook Interest Discovery
            </span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
              Find Facebook Interests
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              That Actually Convert
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-xl md:text-2xl text-slate-300 mb-4 max-w-3xl mx-auto">
            Stop guessing. Start targeting what works.
          </motion.p>

          <motion.p
            variants={fadeInUp}
            className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto">
            Find high-intent Facebook interests faster. Reduce fatigue before it
            kills performance.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link to="/login">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg shadow-xl shadow-purple-500/50 group">
                  Try For Free
                  <motion.span
                    className="inline-block ml-2"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}>
                    →
                  </motion.span>
                </Button>
              </motion.div>
            </Link>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                className="border-2 border-purple-500 text-purple-300 hover:bg-purple-500/10 px-8 py-6 text-lg"
                onClick={() =>
                  document
                    .getElementById("features")
                    ?.scrollIntoView({ behavior: "smooth" })
                }>
                <Play className="w-5 h-5 mr-2" />
                See How It Works
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeInUp}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { value: "10,000+", label: "Interests Analyzed" },
              { value: "500+", label: "Active Users" },
              { value: "95%", label: "Accuracy Rate" },
              { value: "3x", label: "ROI Improvement" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/50 transition-all duration-300"
                whileHover={{ y: -5 }}>
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-slate-400 text-sm mt-2">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const ProblemSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  const problems = [
    {
      icon: <AlertTriangle className="w-8 h-8" />,
      title: "Endless Interest Testing",
      description:
        "You test an interest → it works for a bit → performance drops",
      color: "from-red-500 to-orange-500",
    },
    {
      icon: <FaFire className="text-3xl" />,
      title: "Burning Budget on Broad Targeting",
      description: "You go broad → burn through budget with no clear winners",
      color: "from-orange-500 to-yellow-500",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Short-Lived Winners",
      description:
        "You finally find a winner → creative or campaign fatigue kicks in",
      color: "from-yellow-500 to-green-500",
    },
    {
      icon: <FaBullseye className="text-3xl" />,
      title: "No Clear Signal",
      description: "No clear signal on what to test next → back to guessing",
      color: "from-green-500 to-blue-500",
    },
  ];

  return (
    <section ref={ref} className="py-20 bg-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="max-w-6xl mx-auto">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                Facebook Interest Targeting
              </span>
              <br />
              <span className="text-white">Shouldn't Feel Like Gambling</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Yet for most teams, it looks like this:
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {problems.map((problem, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="relative group"
                whileHover={{ scale: 1.02 }}>
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-300">
                  <div
                    className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${problem.color} mb-4`}>
                    {problem.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {problem.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    {problem.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            variants={fadeInUp}
            className="mt-16 text-center bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl p-10">
            <h3 className="text-3xl font-bold text-white mb-4">
              Interest Miner helps you move from{" "}
              <span className="text-red-400">guesswork</span> to{" "}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                signal
              </span>
            </h3>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              It uses AI to identify high-intent Facebook interests, analyze
              what actually works, and predict creative & campaign fatigue
              before performance drops.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const FeaturesSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  const features = [
    {
      icon: <Target className="w-12 h-12" />,
      title: "AI Interest Finder",
      emoji: "🔍",
      description:
        "Discover Facebook interests with real buying intent, based on your product, audience, and positioning — not just large or popular interests.",
      highlight:
        "Instead of testing blindly, you start with interests that are more likely to convert.",
      benefits: [
        "AI-powered interest discovery",
        "Buying intent analysis",
        "Product-specific targeting",
        "Audience positioning insights",
      ],
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: <BarChart3 className="w-12 h-12" />,
      title: "Interest Analytics",
      emoji: "📊",
      description: "Understand which interests perform best across campaigns.",
      highlight: "Spend less time testing. More time scaling.",
      benefits: [
        "Compare interest performance",
        "Spot patterns across winning audiences",
        "Focus spend on what drives results",
        "Data-driven optimization",
      ],
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Brain className="w-12 h-12" />,
      title: "Creative Fatigue Prediction",
      emoji: "🧠",
      description:
        "Creative fatigue doesn't happen overnight — the signals show up early.",
      highlight:
        "Our AI models analyze signals to warn you before creatives burn out, so you can refresh assets proactively.",
      benefits: [
        "Daily CTR tracking",
        "Frequency monitoring",
        "CPM trend analysis",
        "Engagement pattern detection",
      ],
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: <Activity className="w-12 h-12" />,
      title: "Campaign Fatigue Prediction",
      emoji: "📉",
      description: "When campaigns start decaying, most teams react too late.",
      highlight:
        "Interest Miner monitors performance trends over time and flags when a campaign is entering a fatigue phase.",
      benefits: [
        "Pause or adjust earlier",
        "Reallocate budget smarter",
        "Avoid sudden ROAS drops",
        "Proactive optimization",
      ],
      gradient: "from-orange-500 to-red-500",
    },
  ];

  return (
    <section
      id="features"
      ref={ref}
      className="py-20 bg-gradient-to-br from-slate-900 via-purple-900/10 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full opacity-20"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(168, 85, 247, 0.1) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                What You Get
              </span>
              <br />
              <span className="text-white">With Interest Miner</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Powerful AI-driven features to transform your Facebook ad
              targeting
            </p>
          </motion.div>

          <div className="space-y-24">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className={`flex flex-col ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } items-center gap-12`}>
                {/* Feature Visual */}
                <motion.div
                  className="w-full md:w-1/2"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}>
                  <div
                    className={`relative bg-gradient-to-br ${feature.gradient} p-1 rounded-3xl shadow-2xl`}>
                    <div className="bg-slate-900 rounded-3xl p-12">
                      <motion.div
                        className="text-white flex items-center justify-center"
                        animate={{
                          rotateY: [0, 10, 0, -10, 0],
                        }}
                        transition={{
                          duration: 5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}>
                        {feature.icon}
                      </motion.div>
                      <div className="text-8xl text-center mt-6">
                        {feature.emoji}
                      </div>

                      {/* Animated particles */}
                      <div className="absolute inset-0 overflow-hidden rounded-3xl">
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            className={`absolute w-2 h-2 bg-gradient-to-br ${feature.gradient} rounded-full`}
                            animate={{
                              x: [0, Math.random() * 200 - 100],
                              y: [0, Math.random() * 200 - 100],
                              opacity: [0, 1, 0],
                            }}
                            transition={{
                              duration: 3 + Math.random() * 2,
                              repeat: Infinity,
                              delay: i * 0.5,
                            }}
                            style={{
                              left: `${Math.random() * 100}%`,
                              top: `${Math.random() * 100}%`,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Feature Content */}
                <div className="w-full md:w-1/2 space-y-6">
                  <h3 className="text-3xl md:text-4xl font-bold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-lg text-slate-300 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-6">
                    <p className="text-purple-200 font-medium">
                      {feature.highlight}
                    </p>
                  </div>
                  <div className="space-y-3">
                    {feature.benefits.map((benefit, idx) => (
                      <motion.div
                        key={idx}
                        className="flex items-center space-x-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={
                          inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
                        }
                        transition={{ delay: index * 0.1 + idx * 0.1 }}>
                        <div
                          className={`w-6 h-6 rounded-full bg-gradient-to-br ${feature.gradient} flex items-center justify-center flex-shrink-0`}>
                          <FaCheck className="text-white text-xs" />
                        </div>
                        <span className="text-slate-300">{benefit}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const WhoItsForSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  const audience = [
    {
      icon: <Rocket className="w-10 h-10" />,
      title: "Founders",
      subtitle: "Running Paid Acquisition",
      description:
        "Perfect for startup founders who need to maximize every ad dollar and find product-market fit faster.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: <FaChartLine className="text-4xl" />,
      title: "Performance Marketers",
      subtitle: "& Media Buyers",
      description:
        "Built for marketers who live and breathe ROAS, need to scale campaigns efficiently, and stay ahead of fatigue.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: <FaUsers className="text-4xl" />,
      title: "Agencies",
      subtitle: "Managing Multiple Ad Accounts",
      description:
        "Streamline client campaigns, deliver better results, and manage dozens of ad accounts with confidence.",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: <Target className="w-10 h-10" />,
      title: "Growth Teams",
      subtitle: "Tired of Endless Testing",
      description:
        "Stop the guesswork. Get data-driven insights that help you test smarter, not harder.",
      gradient: "from-orange-500 to-red-500",
    },
  ];

  return (
    <section ref={ref} className="py-20 bg-slate-900 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">Who </span>
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Interest Miner
              </span>
              <span className="text-white"> Is For</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              If you already run Facebook ads and care about efficiency, this is
              for you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {audience.map((item, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                whileHover={{ y: -10, scale: 1.02 }}
                className="relative group">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.gradient} rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300`}
                />
                <div className="relative bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-3xl p-8 hover:border-purple-500/50 transition-all duration-300">
                  <div
                    className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${item.gradient} mb-6`}>
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-purple-300 font-medium mb-4">
                    {item.subtitle}
                  </p>
                  <p className="text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeInUp} className="mt-16 text-center">
            <Link to="/login">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-10 py-6 text-lg shadow-xl shadow-purple-500/50">
                  Start Your Free Trial
                  <Zap className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const HowItWorksSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  const steps = [
    {
      number: "01",
      title: "Connect Your Facebook Ads Account",
      description:
        "Securely link your ad account in seconds. We use Facebook's official API - your data stays safe.",
      icon: <Layers className="w-8 h-8" />,
      color: "purple",
    },
    {
      number: "02",
      title: "Tell Us About Your Product",
      description:
        "Describe your product, target audience, and goals. Our AI analyzes your business to understand what matters.",
      icon: <FaLightbulb className="text-3xl" />,
      color: "pink",
    },
    {
      number: "03",
      title: "Get AI-Powered Interest Recommendations",
      description:
        "Receive a curated list of high-intent Facebook interests tailored to your specific needs - not generic suggestions.",
      icon: <Target className="w-8 h-8" />,
      color: "blue",
    },
    {
      number: "04",
      title: "Launch & Monitor Campaigns",
      description:
        "Test the recommended interests and watch our AI track performance metrics in real-time.",
      icon: <Eye className="w-8 h-8" />,
      color: "green",
    },
    {
      number: "05",
      title: "Get Fatigue Alerts & Optimize",
      description:
        "Receive proactive alerts when creative or campaign fatigue is detected, so you can act before performance drops.",
      icon: <AlertTriangle className="w-8 h-8" />,
      color: "orange",
    },
  ];

  return (
    <section
      id="how-it-works"
      ref={ref}
      className="py-20 bg-gradient-to-br from-slate-900 via-purple-900/10 to-slate-900 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">How </span>
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                It Works
              </span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              From setup to optimization in 5 simple steps
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-pink-500 to-blue-500 transform -translate-x-1/2" />

            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={index % 2 === 0 ? slideInLeft : slideInRight}
                className={`flex items-center mb-20 last:mb-0 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}>
                {/* Content */}
                <div
                  className={`w-full md:w-5/12 ${
                    index % 2 === 0
                      ? "md:text-right md:pr-12"
                      : "md:text-left md:pl-12"
                  }`}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-300">
                    <div
                      className={`text-6xl font-bold bg-gradient-to-r from-${step.color}-400 to-${step.color}-600 bg-clip-text text-transparent mb-4`}>
                      {step.number}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">
                      {step.title}
                    </h3>
                    <p className="text-slate-400 leading-relaxed">
                      {step.description}
                    </p>
                  </motion.div>
                </div>

                {/* Icon Circle */}
                <div className="hidden md:flex w-2/12 justify-center items-center">
                  <motion.div
                    className={`w-20 h-20 rounded-full bg-gradient-to-br from-${step.color}-500 to-${step.color}-700 flex items-center justify-center text-white shadow-xl shadow-${step.color}-500/50 relative z-10`}
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                    }}>
                    {step.icon}
                  </motion.div>
                </div>

                {/* Spacer */}
                <div className="hidden md:block w-5/12" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const TestimonialsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  const testimonials = [
    {
      quote:
        "Interest Miner helped us discover audience segments we never thought to test. Our CPAs dropped by 40% in the first month.",
      name: "Sarah Chen",
      role: "Performance Marketing Lead",
      company: "GrowthCo",
      avatar: "SC",
      rating: 5,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      quote:
        "The fatigue prediction feature is a game-changer. We now refresh creatives before they burn out, not after. ROI increased by 3x.",
      name: "Michael Rodriguez",
      role: "Founder & CEO",
      company: "EcoStore",
      avatar: "MR",
      rating: 5,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      quote:
        "Managing 15+ client accounts used to be chaos. Interest Miner brings clarity and predictability to our campaigns.",
      name: "Emma Thompson",
      role: "Agency Director",
      company: "AdScale Agency",
      avatar: "ET",
      rating: 5,
      gradient: "from-green-500 to-emerald-500",
    },
    {
      quote:
        "Finally, a tool that understands that not all 'big' interests convert. The AI recommendations are incredibly accurate.",
      name: "David Park",
      role: "Media Buyer",
      company: "TechStart",
      avatar: "DP",
      rating: 5,
      gradient: "from-orange-500 to-red-500",
    },
  ];

  return (
    <section
      id="testimonials"
      ref={ref}
      className="py-20 bg-slate-900 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">Loved by </span>
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Marketers
              </span>
            </h2>
            <p className="text-xl text-slate-400">
              See what our users have to say about Interest Miner
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                whileHover={{ y: -10 }}
                className="relative group">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${testimonial.gradient} rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300`}
                />
                <div className="relative bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-3xl p-8 hover:border-purple-500/50 transition-all duration-300">
                  {/* Rating */}
                  <div className="flex space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400 text-xl" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-slate-300 text-lg mb-6 leading-relaxed">
                    "{testimonial.quote}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-14 h-14 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white font-bold text-lg`}>
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="text-white font-bold">
                        {testimonial.name}
                      </div>
                      <div className="text-slate-400 text-sm">
                        {testimonial.role}
                      </div>
                      <div className="text-purple-400 text-sm">
                        {testimonial.company}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// const PricingSection = () => {
//   const ref = useRef(null);
//   const inView = useInView(ref, { once: true, amount: 0.2 });
//   const navigate = useNavigate();

//   const plans = [
//     {
//       name: "Starter",
//       price: "Free",
//       period: "forever",
//       description:
//         "Perfect for getting started with AI-powered interest discovery",
//       features: [
//         "50 AI interest recommendations/month",
//         "Basic interest analytics",
//         "Email support",
//         "1 ad account",
//         "Community access",
//       ],
//       buttonText: "Start Free",
//       popular: false,
//       gradient: "from-slate-600 to-slate-700",
//     },
//     {
//       name: "Pro",
//       price: "$49",
//       period: "per month",
//       description:
//         "For serious marketers who want full power of AI optimization",
//       features: [
//         "Unlimited AI interest recommendations",
//         "Advanced interest analytics",
//         "Creative fatigue prediction",
//         "Campaign fatigue prediction",
//         "Up to 5 ad accounts",
//         "Priority support",
//         "Custom reports",
//         "API access",
//       ],
//       buttonText: "Start 14-Day Free Trial",
//       popular: true,
//       gradient: "from-purple-600 to-pink-600",
//     },
//     {
//       name: "Agency",
//       price: "$199",
//       period: "per month",
//       description: "Built for agencies managing multiple clients",
//       features: [
//         "Everything in Pro",
//         "Unlimited ad accounts",
//         "White-label reports",
//         "Team collaboration",
//         "Dedicated account manager",
//         "Custom integrations",
//         "Advanced API access",
//         "SLA guarantee",
//       ],
//       buttonText: "Contact Sales",
//       popular: false,
//       gradient: "from-blue-600 to-cyan-600",
//     },
//   ];

//   return (
//     <section
//       id="pricing"
//       ref={ref}
//       className="py-20 bg-gradient-to-br from-slate-900 via-purple-900/10 to-slate-900 relative overflow-hidden">
//       <div className="container mx-auto px-6 relative z-10">
//         <motion.div
//           initial="hidden"
//           animate={inView ? "visible" : "hidden"}
//           variants={staggerContainer}>
//           <motion.div variants={fadeInUp} className="text-center mb-16">
//             <h2 className="text-4xl md:text-5xl font-bold mb-6">
//               <span className="text-white">Simple, </span>
//               <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
//                 Transparent Pricing
//               </span>
//             </h2>
//             <p className="text-xl text-slate-400 max-w-2xl mx-auto">
//               Start free. Scale as you grow. Cancel anytime.
//             </p>
//           </motion.div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
//             {plans.map((plan, index) => (
//               <motion.div
//                 key={index}
//                 variants={scaleIn}
//                 whileHover={{ y: -10, scale: 1.02 }}
//                 className="relative group">
//                 {plan.popular && (
//                   <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
//                     <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
//                       MOST POPULAR
//                     </div>
//                   </div>
//                 )}

//                 <div
//                   className={`absolute inset-0 bg-gradient-to-br ${
//                     plan.gradient
//                   } rounded-3xl blur-xl ${
//                     plan.popular ? "opacity-40" : "opacity-20"
//                   } group-hover:opacity-50 transition-opacity duration-300`}
//                 />

//                 <div
//                   className={`relative bg-slate-800/80 backdrop-blur-sm border ${
//                     plan.popular ? "border-purple-500" : "border-slate-700"
//                   } rounded-3xl p-8 hover:border-purple-500/50 transition-all duration-300 h-full flex flex-col`}>
//                   <div>
//                     <h3 className="text-2xl font-bold text-white mb-2">
//                       {plan.name}
//                     </h3>
//                     <p className="text-slate-400 text-sm mb-6 h-12">
//                       {plan.description}
//                     </p>
//                     <div className="mb-6">
//                       <span className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
//                         {plan.price}
//                       </span>
//                       <span className="text-slate-400 ml-2">{plan.period}</span>
//                     </div>
//                   </div>

//                   <div className="flex-grow">
//                     <ul className="space-y-4 mb-8">
//                       {plan.features.map((feature, idx) => (
//                         <li key={idx} className="flex items-start space-x-3">
//                           <div
//                             className={`w-5 h-5 rounded-full bg-gradient-to-br ${plan.gradient} flex items-center justify-center flex-shrink-0 mt-0.5`}>
//                             <FaCheck className="text-white text-xs" />
//                           </div>
//                           <span className="text-slate-300">{feature}</span>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>

//                   <motion.div
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}>
//                     <Button
//                       className={`w-full ${
//                         plan.popular
//                           ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-xl shadow-purple-500/50"
//                           : "bg-slate-700 hover:bg-slate-600"
//                       } text-white py-6 text-lg`}
//                       onClick={() => navigate("/login")}>
//                       {plan.buttonText}
//                     </Button>
//                   </motion.div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>

//           <motion.div variants={fadeInUp} className="text-center mt-12">
//             <p className="text-slate-400">
//               All plans include a 14-day money-back guarantee. No credit card
//               required for free tier.
//             </p>
//           </motion.div>
//         </motion.div>
//       </div>
//     </section>
//   );
// };

const CTASection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const navigate = useNavigate();

  return (
    <section ref={ref} className="py-20 bg-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            backgroundSize: "200% 200%",
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="max-w-4xl mx-auto text-center">
          <motion.div
            variants={scaleIn}
            className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-12 md:p-16 shadow-2xl">
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">Ready to Stop </span>
              <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                Guessing
              </span>
              <span className="text-white"> and Start </span>
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Winning
              </span>
              <span className="text-white">?</span>
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="text-xl text-slate-300 mb-8">
              Join hundreds of marketers who've transformed their Facebook ad
              targeting with AI
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}>
                <Button
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-10 py-6 text-lg shadow-xl shadow-purple-500/50"
                  onClick={() => navigate("/login")}>
                  Start Free Trial
                  <Zap className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
              <motion.p variants={fadeInUp} className="text-slate-400">
                No credit card required • 14-day free trial
              </motion.p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="mt-12 grid grid-cols-3 gap-8">
              {[
                { icon: <FaCheck />, text: "No setup fees" },
                { icon: <FaCheck />, text: "Cancel anytime" },
                { icon: <FaCheck />, text: "24/7 support" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white">
                    {item.icon}
                  </div>
                  <span className="text-slate-300 text-sm">{item.text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <HeroSection />
      <ProblemSection />
      <FeaturesSection />
      <HowItWorksSection />
      <WhoItsForSection />
      <TestimonialsSection />
      {/* <PricingSection /> */}
      <CTASection />
    </div>
  );
}
