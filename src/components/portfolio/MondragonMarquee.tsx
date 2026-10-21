import React from 'react';

export const MondragonMarquee: React.FC = () => {
  const items = [
    'AGENTIC AI WORKFLOWS',
    '9.11 CGPA • 10TH VTU RANK',
    'MODEL CONTEXT PROTOCOL (MCP)',
    '6-DOF AGRIBOT ROBOTICS',
    'AUTODESK FUSION 360',
    'N8N LOW-CODE AUTOMATION',
    'HERMES AGENT & CLAUDE CODE',
    'OBSIDIAN SECOND BRAIN',
    'B2B INDUSTRIAL MANUFACTURING',
    'UNATTENDED CRON AUTOMATION',
    'RASPBERRY PI PICO & ESP32-CAM'
  ];

  return (
    <div className="py-6 border-b border-black/10 bg-[#f4f4f4] overflow-hidden select-none">
      <div className="animate-marquee flex items-center space-x-8 text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-black uppercase">
        {items.concat(items).map((item, idx) => (
          <div key={idx} className="flex items-center space-x-8 shrink-0">
            <span>{item}</span>
            <span className="w-3 h-3 rounded-full bg-black/80 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
};
