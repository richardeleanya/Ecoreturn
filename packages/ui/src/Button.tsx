import React from "react";
import { cn } from "./utils";

export const Button = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={cn(
      "px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors",
      props.className
    )}
    {...props}
  >
    {children}
  </button>
);