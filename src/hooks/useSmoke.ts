import { useContext } from "react";
import { SmokeContext } from "@/context/SmokeContext";

export const useSmoke = () => {
  const context = useContext(SmokeContext);
  if (!context) {
    throw new Error("useSmoke must be used within a SmokeProvider");
  }
  return context;
};
