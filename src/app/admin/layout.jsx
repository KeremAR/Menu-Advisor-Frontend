import React from 'react'
import Nav from '@components/Nav'
import StoreCard from '@components/StoreCard'
import Footer from '@components/Footer'



function layout({children}) {
  return (
             <main className='overflow-y-auto h-lvh '>
              <div className='min-h-screen'>
                <Nav />
               {children}
               </div>
               <Footer />

            </main>
   
  )
}

export default layout