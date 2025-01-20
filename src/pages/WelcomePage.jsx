import React from "react";

const WelcomePage = ({ title = "Sign in to Your Account" }) => {
  return (
    <div className="lg:w-[55%] relative  bg-gradient-to-br from-blue-400 to-purple-500  items-center justify-center hidden md:hidden lg:flex">
      {/* Flowing shapes ===========*/}
      <svg
        viewBox="0 0 400 400"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
      >
        <path
          d="M0,100 Q100,50 200,100 T400,80 V0 H0 Z"
          className="fill-blue-400/30"
        />

        <path
          d="M0,150 Q150,100 300,150 T400,130 V0 H0 Z"
          className="fill-purple-400/20"
        />
        <path
          d="M0,150 Q250,150 400,150 T400,130 V0 H0 Z"
          className="fill-purple-400/20"
        />

        <circle cx="200" cy="80" r="40" className="fill-white/10" />
        <circle cx="320" cy="120" r="25" className="fill-white/10" />
        <circle cx="80" cy="160" r="30" className="fill-white/10" />
      </svg>
      {/ Bottom wave ============= /}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 500 150"
          preserveAspectRatio="none"
          className="w-full h-40"
        >
          <path
            d="M0,10 C250,150 350,0 500,150 L500,150 L0,150 Z"
            className="fill-white"
          />
        </svg>
      </div>
      {/ Content /}
      <div className="relative z-10  px-8  text-white flex items-start flex-col justify-start">
        <h1 className="text-4xl font-semibold mb-3">Welcome Page</h1>
        <p className="text-sm tracking-wider opacity-90">{title}</p>
      </div>

      {/ Website URL /}
      <div className="absolute bottom-6 left-0 right-0 text-center z-10">
        <a
          className="text-gray-600 text-sm"
          href="https://softfix.in/"
          target="_blank"
        >
          https://softfix.in
        </a>
      </div>
    </div>
  );
};

export default WelcomePage;
