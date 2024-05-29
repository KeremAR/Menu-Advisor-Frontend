import Image from "next/image";

export default function Home() {
  return (
    <div className="container  flex justify-center ">
      <div className="absolute top-0 left-0 mt-3 ml-3 flex items-center">
        <Image src="/logo.svg" alt="Logo" width={40} height={40} />
        <span className="ml-2 text-xl font-bold text-white">MenuAdvisor</span>
      </div>

      <button className="bg-[#FF8B00] text-white  font-[300] text-lg  md:text-2xl   right-0 absolute flex items-center rounded-[20px] my-5 mx-6">
        <a href="/login" className="px-5 py-1 md:px-10 md:py-2">
          Login
        </a>
      </button>
      <Image
        className="background-image"
        src={"/background_image.jpg"}
        alt="Background"
        layout="fill"
        objectFit="cover"
      />
      <div className="downloads relative flex flex-row gap-10 ">
        <Image
          className="md:w-[200px]"
          src={"/App_Store.svg"}
          alt="App Store"
          width={100}
          height={60}
        />
        <Image
          className="md:w-[200px]"
          src={"/Google_Play.svg"}
          alt="App Store"
          width={100}
          height={60}
        />
      </div>

      <div className="content flex flex-col gap-10 w-60 md:w-[1100px]">
        <h1 className="font-[400] text-xl  md:text-5xl">
          Discover and Rate Restaurants with{" "}
          <span className="text-[#FF8B00]">MenuAdvisor</span>
        </h1>
        <p className="font-[300] text-md  md:text-2xl">
          MenuAdvisor is your ultimate guide to finding the best restaurants and
          dishes in town. Whether you&apos;re looking for a cozy cafe or a
          trendy bistro, MenuAdvisor helps you explore, discover, and share your
          dining experiences with others.
        </p>
      </div>
    </div>
  );
}
