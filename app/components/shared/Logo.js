import { motion } from "framer-motion";
import React from "react";
import Image from "next/image";

const Logo = () => {
  return (
    <div className="flex  justify-between drop-shadow-xl w-fit items-center space-x-3">
      <motion.div
        className="rounded-full  overflow-hidden"
        whileHover={{ scale: 1.03 }}
      >
        <Image
          src="/raj_aam_wala.jpg"
          width="60"
          height="60"
          // objectFit="contain"
          alt="Raj_ammWala_logo"
        />
      </motion.div>
      <div className="border-l-[6px] sm:border-l-8 pl-3">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-green-700">
          রাজশাহীর
        </h2>
        <span className="text-base font-semibold text-primary">আম ওয়ালা</span>
      </div>
    </div>
  );
};

export default Logo;
