import React, { useState } from "react";
import * as Slider from "@radix-ui/react-slider";

const SliderControl = ({ label, min = -100, max = 100, step = 1, defaultValue = 0, onChange }) => {
  const [value, setValue] = useState([defaultValue]);

  return (
    <div className="mb-5 w-full">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-semibold text-white/90 tracking-wide">{label}</label>
        <span className="text-xs bg-white/10 px-2 py-1 rounded font-mono text-cyber-cyan shadow-inner">
          {value[0]}
        </span>
      </div>
      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        value={value}
        max={max}
        min={min}
        step={step}
        onValueChange={(val) => setValue(val)}
        onPointerUp={() => onChange(value[0])}
      >
        <Slider.Track className="bg-white/10 relative grow rounded-full h-1.5 overflow-hidden">
          <Slider.Range className="absolute bg-gradient-to-r from-cyber-cyan to-cyber-purple h-full" />
        </Slider.Track>
        <Slider.Thumb
          className="block w-5 h-5 bg-white border border-white/40 shadow-lg rounded-full focus:outline-none focus:ring-4 focus:ring-cyber-cyan/30 transition-transform hover:scale-110 cursor-grab active:cursor-grabbing"
          aria-label={label}
        />
      </Slider.Root>
    </div>
  );
};

export default SliderControl;
