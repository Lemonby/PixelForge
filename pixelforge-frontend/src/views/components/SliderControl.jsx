import React, { useState, useEffect } from "react";
import * as Slider from "@radix-ui/react-slider";

const SliderControl = ({ label, min = -100, max = 100, step = 1, defaultValue = 0, onChange }) => {
  const [value, setValue] = useState([defaultValue]);

  useEffect(() => {
    setValue([defaultValue]);
  }, [defaultValue]);

  return (
    <div className="mb-4 w-full select-none">
      {/* Label and numeric indicator block */}
      <div className="flex justify-between items-center mb-1.5">
        <label className="text-[10.5px] font-medium text-[#cccccc] tracking-wide">{label}</label>
        <span className="text-[10px] bg-[#1e1e1e] border border-[#3e3e3e] px-1.5 py-0.5 rounded font-mono text-white shadow-inner min-w-[32px] text-center">
          {value[0]}
        </span>
      </div>

      {/* Radix UI Slider Root */}
      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-4 cursor-pointer"
        value={value}
        max={max}
        min={min}
        step={step}
        onValueChange={(val) => setValue(val)}
        onPointerUp={() => onChange(value[0])}
      >
        {/* Track Line */}
        <Slider.Track className="bg-[#1a1a1a] border-b border-[#3e3e3e] relative grow rounded-full h-[4px] overflow-hidden">
          <Slider.Range className="absolute bg-[#007acc] h-full" />
        </Slider.Track>
        
        {/* Sleek Circular Thumb Knob */}
        <Slider.Thumb
          className="block w-3.5 h-3.5 bg-[#cccccc] hover:bg-white border border-[#111111] shadow-md rounded-full focus:outline-none transition-transform hover:scale-105 active:scale-95 cursor-grab active:cursor-grabbing"
          aria-label={label}
        />
      </Slider.Root>
    </div>
  );
};

export default SliderControl;

