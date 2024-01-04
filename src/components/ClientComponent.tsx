"use client";
import React, { useEffect, useState } from "react";
// import { Button } from "./ui/button";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

const ClientComponent = () => {
  const [first, setfirst] = useState(false);
  useEffect(() => {
    setfirst(true);
  }, [first]);

  return first && <LogoutLink>Logout</LogoutLink>;
};

export default ClientComponent;
