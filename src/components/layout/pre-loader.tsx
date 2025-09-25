'use client';

import { motion } from 'framer-motion';

const FourSquare = ({ color }: { color: string[] }) => {
  const squareVariants = {
    initial: { opacity: 0.5, scale: 0.8 },
    animate: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        repeat: Infinity,
        repeatType: 'reverse',
        delay: i * 0.15,
      },
    }),
  };

  return (
    <div className="grid grid-cols-2 gap-2 w-24 h-24 my-4">
      {color.map((c, i) => (
        <motion.div
          key={c}
          custom={i}
          variants={squareVariants}
          initial="initial"
          animate="animate"
          style={{ backgroundColor: c }}
          className="w-full h-full rounded-md"
        />
      ))}
    </div>
  );
};


export default function PreLoader() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.33, 1, 0.68, 1], // A nice ease-out cubic bezier
      },
    },
  };

  return (
    <motion.div
      className="flex items-center justify-center h-screen bg-white"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex flex-col items-center text-center gap-4">
        <motion.p
          className="text-lg text-muted-foreground font-medium"
          variants={itemVariants}
        >
          Welcome to
        </motion.p>
        <motion.h1
          className="text-4xl font-bold text-primary tracking-wider"
          variants={itemVariants}
        >
          Trusted Vehicle Marketplace
        </motion.h1>
        <motion.div variants={itemVariants}>
           <FourSquare color={["#3254b2", "#b23294", "#b29032", "#32b250"]} />
        </motion.div>
        <motion.p
          className="text-md text-muted-foreground italic animate-pulse-slow"
          variants={itemVariants}
        >
          Boosting your experience with turbo...
        </motion.p>
      </div>
    </motion.div>
  );
}
