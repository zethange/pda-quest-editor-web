import React, { memo } from "react";

const NavBar = ({ children }: { children: React.ReactNode }) => {
  return <nav className="navigation">{children}</nav>;
};

export default memo(NavBar);
