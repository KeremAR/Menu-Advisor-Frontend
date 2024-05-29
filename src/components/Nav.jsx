"use client";

import React, { useEffect, useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import Image from "next/image";
import { deleteCookie, getCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode"; // Ensure the correct import
import Link from "next/link";
import { usePathname } from "next/navigation";

function Nav() {
  const [username, setUsername] = useState("User");
  const [roles, setRoles] = useState([]);
  const pathname = usePathname();
  useEffect(() => {
    const tokenCookie = getCookie("token");

    if (tokenCookie) {
      const token = JSON.parse(tokenCookie);
      const decodedToken = jwtDecode(token.jwToken);
      const userName = decodedToken.sub || "User"; // Use 'sub' (subject) for the username

      const roles = decodedToken.roles || [];
      setRoles(roles);
      setUsername(userName);
    }
  }, []);

  const handleLogout = () => {
    deleteCookie("token");
    window.location.reload();
  };

  const isActiveLink = (path) => {
    return pathname === path ? "text-orange-500" : "text-black";
  };

  return (
    <nav className="nav flex w-full justify-between items-center p-4">
      <div className="flex items-center">
        <Image src="/logo.svg" alt="Logo" width={40} height={40} />
        <span className="ml-2 text-xl font-bold text-black">MenuAdvisor</span>
      </div>

      {roles.includes("SuperAdmin") && (
        <div className="flex gap-4">
          <Link href="/admin/reviews">
            <p
              className={`text-lg xl:text-2xl border-r-2 pr-2 hover:text-orange-700 ${isActiveLink(
                "/admin/reviews"
              )}`}
            >
              Reviews
            </p>
          </Link>
          <Link href="/admin">
            <p
              className={`text-lg xl:text-2xl hover:text-orange-700 ${isActiveLink(
                "/admin"
              )}`}
            >
              Stores
            </p>
          </Link>
          <Link href="/admin/owners">
            <p
              className={`text-lg xl:text-2xl border-l-2 pl-2 hover:text-orange-700 ${isActiveLink(
                "/admin/owners"
              )}`}
            >
              Restaurant Owners
            </p>
          </Link>
        </div>
      )}

      <div className="user flex items-center gap-5 pr-4">
        <p className="text-lg xl:text-2xl">{username}</p>
        <FaRegUserCircle className="text-3xl xl:text-5xl" />
        <Link href="/login">
          <button
            onClick={handleLogout}
            className="text-lg xl:text-2xl text-orange-500 hover:text-orange-700"
          >
            Logout
          </button>
        </Link>
      </div>
    </nav>
  );
}

export default Nav;
