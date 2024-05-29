"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  authenticateUser,
  getUserRoles,
  fetchByRestaurantOwnerId,
  getTokenFromCookie,
} from "../utils/auth";
import { jwtDecode } from "jwt-decode";

function Page() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      const data = await authenticateUser(email, password);
      const token = data.data.jwToken;
      const roles = getUserRoles(token);

      if (roles.includes("SuperAdmin")) {
        router.push("/admin");
      } else if (roles.includes("RestaurantOwner")) {
        const decodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken); // Log decoded token to check its structure

        const ownerId = decodedToken.uid; // Assuming the token's subject is the ownerId
        console.log("Owner ID:", ownerId);
        const ownerDetails = await fetchByRestaurantOwnerId(ownerId);
        // Access the restaurantId and isVerified fields
        const restaurantId = ownerDetails.data[0]?.restaurantId;
        const isVerified = ownerDetails.data[0]?.isVerified;
        console.log("is verifieDDDDD:????" + isVerified);
        console.log("Restaurant ID:", restaurantId);
        console.log("Is Verified:", isVerified);
        if (!isVerified) {
          setError(
            "Your account is not verified yet. Please wait for verification."
          );
          return;
        }

        if (restaurantId) {
          router.push(`/store/${restaurantId}`);
        } else {
          setError("Restaurant details not found.");
        }
      } else {
        setError("Unauthorized access.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    }
  };

  return (
    <div className="login relative flex justify-center items-center ">
      <Image
        className="background-image"
        src={"/background_image.jpg"}
        alt="Background"
        layout="fill"
        objectFit="cover"
      />
      <form
        onSubmit={handleSubmit}
        className="login-form bg-white flex flex-col items-center relative gap-4 rounded-3xl h-[550px] border-2 border-[#FF8B00]"
      >
        <h1 className="text-2xl font-bold md:text-3xl my-4">Login</h1>
        {error && <p className="text-red-500">{error}</p>}
        <div className="form-div px-6 flex flex-col gap-4">
          <label className="flex flex-col text-lg md:text-xl">
            Email
            <input
              className="bg-[#f9f9f9] rounded w-[280px] border-solid border-2 border-gray-200 placeholder:pl-2 placeholder:text-md"
              type="text"
              placeholder="Email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="flex flex-col text-lg md:text-xl">
            Password
            <input
              className="bg-[#f9f9f9] rounded w-[280px] border-solid border-2 border-gray-200 placeholder:pl-2 placeholder:text-md"
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </div>
        <button
          type="submit"
          className="bg-[#FF8B00] text-white font-[300] text-lg md:text-xl  flex items-center rounded-[20px] py-1 px-6"
        >
          Login
        </button>
        <p className="w-[280px] my-4 font-[300]">
          If you&apos;re a restaurant/cafe owner and you don&apos;t have an
          account you can{" "}
          <a
            className="underline hover:cursor-pointer font-bold text-[#FF8B00]"
            onClick={() => router.push("/signup")}
          >
            Sign Up
          </a>
        </p>
        <Link
          className="absolute bottom-4 italic  text-[#FF8B00] font-bold "
          href="/"
        >
          {" "}
          &lt; Go back
        </Link>
      </form>
    </div>
  );
}

export default Page;
