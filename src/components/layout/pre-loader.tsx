'use client';

import { motion } from 'framer-motion';

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
          <img
            src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMXZkZzVoZ2tmeTZvN3JyYnp6cW51eDRqd2l2d3g4aWxjcjV4eTM0diZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/3o7bu3XilJ5BOiSGic/giphy.gif"
            alt="Loading animation"
            width={120}
            height={120}
            className="my-4"
          />
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
