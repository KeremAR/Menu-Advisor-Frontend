import React from "react";
import Image from "next/image";
import { IoMdTime } from "react-icons/io";
import { IoLocationOutline } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import Link from "next/link";
import { IoStorefront } from "react-icons/io5";

function Hero({ storeData }) {

  if (!storeData) {
    return <div>Loading...</div>; // Handle the case when storeData is not available yet
  }

 // Handle the base64 image string without prefix
 // Assume imageSrc does not have the data:image/jpeg;base64, prefix
 const imageSrc = storeData?.data?.image;

 // Reconstruct the base64 image string for use in the Image component
 const base64Image = `data:image/jpeg;base64,${imageSrc}`;

  return (
    <nav className="hero flex-between w-full">
      <div className="hero-image-container relative">
        <Image
          src={base64Image}
          alt="Background"
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          className="hero-image disabled"
        />
        <div className="flex space-x-0">
          <div className="hero-content flex flex-col gap-2 absolute top-0 left-0 text-white w-[300px] lg:w-[400px] xl:w-[500px] my-5 mx-2">
            <Link href={`/store/${storeData.data.id}`} className="z-10">
              <h1 className="text-md lg:text-xl xl:text-3xl text-shadow">
                {storeData.data.name}
              </h1>
            </Link>
            <div className="flex items-center">
              <IoMdTime className="mr-1 text-lg xl:text-3xl text-shadow" />
              <p className="text-sm lg:text-md xl:text-xl text-shadow">
                {storeData.data.workingHours}
              </p>
            </div>
            <div className="flex items-start">
              <IoLocationOutline className="mr-1 text-xl xl:text-3xl text-shadow" />
              <p className="text-xs lg:text-md xl:text-lg font-[300] text-shadow">
                {storeData.data.address}
              </p>
            </div>
          </div>
        </div>

        <div className="hero-center absolute inset-0 flex flex-col justify-center items-center text-center text-white gap-[10px]">
          <div className="bg-white rounded-full border-8">
            <IoStorefront className="text-[150px] md:text-[200px] lg:text-[250px] xl:text-[300px] text-black p-7 md:p-10 lg:p-14 xl:p-16" />
          </div>
          <Link href={`/store/${storeData.data.id}/editprofile`}>
            <button className="absolute text-lg lg:text-xl xl:text-2xl right-2 top-2 text-white bg-orange-500 border border-solid border-orange-500 rounded-3xl px-2 flex items-center gap-1 hover:bg-orange-600 hover:border-orange-600">
              <MdEdit /> Edit Store
            </button>
          </Link>
          <p className="text-lg lg:text-xl xl:text-2xl w-[600px] lg:w-[800px] xl:w-[1000px] text-shadow">
            {storeData.data.description}
          </p>
        </div>
      </div>
    </nav>
  );
}

export default Hero;
