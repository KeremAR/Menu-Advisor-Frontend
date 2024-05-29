"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

function ConfirmEmail() {
  const router = useRouter();
  const [confirmationCode, setConfirmationCode] = useState("");
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      // Redirect to signup if no userId is found in localStorage
      router.push("/signup");
    }
  }, [router]);

  const handleInputChange = (e) => {
    setConfirmationCode(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://menuadv.azurewebsites.net/api/Account/confirm-email?userId=${userId}&code=${encodeURIComponent(
          confirmationCode
        )}`,
        {
          method: "GET",
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to confirm email");
      }
      const data = await response.json();
      console.log("Email confirmed:", data);
      router.push("/login"); // Redirect to login page
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    }
  };

  return (
    <div className="confirm-email flex justify-center items-center h-screen">
      <Image
        className="background-image"
        src={"/background_image.jpg"}
        alt="Background"
        layout="fill"
        objectFit="cover"
      />
      <form
        onSubmit={handleSubmit}
        className="bg-white flex flex-col items-center gap-4 p-6 rounded-3xl border-2 border-[#FF8B00]"
      >
        <h1 className="text-2xl font-bold md:text-3xl my-4">Confirm Email</h1>
        {error && <p className="text-red-500">{error}</p>}
        <label className="flex flex-col text-lg md:text-xl">
          Confirmation Code
          <input
            className="bg-[#f9f9f9] rounded w-full border-solid border-2 border-gray-200 placeholder:pl-2 placeholder:text-md"
            type="text"
            name="confirmationCode"
            placeholder="Enter your confirmation code"
            value={confirmationCode}
            onChange={handleInputChange}
            required
          />
        </label>
        <button
          type="submit"
          className="bg-[#FF8B00] text-white font-[300] text-lg md:text-xl flex items-center rounded-[20px] py-1 px-6"
        >
          Confirm
        </button>
      </form>
    </div>
  );
}

export default ConfirmEmail;
