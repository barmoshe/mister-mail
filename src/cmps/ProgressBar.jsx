import React from "react";

export function ProgressBar({ value, max }) {
  return (
    <div className="progress-bar">
      <div
        className="progress-bar-inner"
        style={{ width: `${(value / max) * 100}%` }}
      ></div>
    </div>
  );
}
