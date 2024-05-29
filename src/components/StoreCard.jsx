"use client"
import React from 'react';
import Link from 'next/link';
import { IoStorefront } from "react-icons/io5";

function StoreCard({ stores }) {
    return (
        <div className="flex flex-col gap-10 mx-auto md:w-[800px] lg:w-[1000px] xl:w-[1200px] mb-[40px]">
            {(stores.length > 0) ? stores.map(store => (
                <Link href={`/store/${store.id}`} key={store.id}>
                    <div className="border p-4 rounded flex gap-5 items-center">
                        <IoStorefront className='text-4xl'/>
                        <div className=''>
                            <h3 className="text-lg font-bold">{store.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">Address: {store.address}</p>
                            <p className="text-sm text-gray-600 mb-2">Rating: {store.rating}</p>
                        </div>
                    </div>
                </Link>
            )) : <p>No stores found</p>}
        </div>
    );
}

export default StoreCard;
