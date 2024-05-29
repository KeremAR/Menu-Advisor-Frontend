"use client";
import React, { useState, useEffect } from "react";
import Combobox from "@components/Customcombobox";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    userName: "",
    password: "",
    confirmPassword: "",
    restaurantId: 0,
  });
  const router = useRouter();

  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // State for error message

  useEffect(() => {
    const fetchRestaurants = async () => {
      if (searchQuery.trim() === "") {
        setRestaurants([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `https://menuadv.azurewebsites.net/api/v1/Place?PageSize=11&PageNumber=1&Name=${searchQuery}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch restaurants");
        }
        const data = await response.json();
        if (data && Array.isArray(data.data)) {
          setRestaurants(data.data);
        } else {
          setRestaurants([]);
        }
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        setRestaurants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [searchQuery]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://menuadv.azurewebsites.net/api/Account/restaurant-owner-register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to register user");
      }
      const data = await response.json();
      console.log("User registered:", data);
      localStorage.setItem("userId", data.data);
      router.push("/signup/confirm-email");

      // Handle successful registration (e.g., redirect or show success message)
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
        <h1 className="text-2xl font-bold md:text-3xl my-4">Signup</h1>
        {error && <p className="text-red-500">{error}</p>}
        <div className="form-div px-6 flex flex-col gap-4">
          <div className="flex gap-4">
            <label className="flex flex-col text-lg md:text-xl">
              First Name
              <input
                className="bg-[#f9f9f9] rounded w-[280px] border-solid border-2 border-gray-200 placeholder:pl-2 placeholder:text-md"
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </label>
            <label className="flex flex-col text-lg md:text-xl">
              Last Name
              <input
                className="bg-[#f9f9f9] rounded w-[280px] border-solid border-2 border-gray-200 placeholder:pl-2 placeholder:text-md"
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>
          <div className="flex gap-4">
            <label className="flex flex-col text-lg md:text-xl">
              Email
              <input
                className="bg-[#f9f9f9] rounded w-[280px] border-solid border-2 border-gray-200 placeholder:pl-2 placeholder:text-md"
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </label>

            <label className="flex flex-col text-lg md:text-xl">
              Username
              <input
                className="bg-[#f9f9f9] rounded w-[280px] border-solid border-2 border-gray-200 placeholder:pl-2 placeholder:text-md"
                type="text"
                name="userName"
                placeholder="Username"
                value={formData.userName}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>
          <div className="flex gap-4">
            <label className="flex flex-col text-lg md:text-xl">
              Password
              <input
                className="bg-[#f9f9f9] rounded w-[280px] border-solid border-2 border-gray-200 placeholder:pl-2 placeholder:text-md"
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </label>
            <label className="flex flex-col text-lg md:text-xl">
              Confirm Password
              <input
                className="bg-[#f9f9f9] rounded w-[280px] border-solid border-2 border-gray-200 placeholder:pl-2 placeholder:text-md"
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>

          <Combobox
            className="bg-[#FF8B00] text-white font-[300] text-lg md:text-xl flex items-center rounded-[20px] py-1 px-6"
            items={restaurants}
            value={formData.restaurantId}
            onChange={(value) =>
              setFormData({ ...formData, restaurantId: value })
            }
            onSearch={handleSearch}
            placeholder="Select restaurant..."
          />
          {loading && <div>Loading...</div>}
        </div>

        <button
          type="submit"
          className="bg-[#FF8B00] text-white font-[300] text-lg md:text-xl flex items-center rounded-[20px] py-1 px-6"
        >
          Signup
        </button>
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

export default Signup;
