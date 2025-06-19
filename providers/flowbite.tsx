"use client";

import { useEffect } from "react";
import 'flowbite';

export const FlowbiteProvider = () => {
  useEffect(() => {
    import('flowbite');
  }, []);

  return null;
};
