import React from 'react'
import Nav from '@components/Nav'
import ProductCard from '@components/ProductCard'

import Footer from '@components/Footer'

function layout({ children }) {
  return (
    <html lang ="en">
    <body className=''>
         <main className='overflow-y-auto h-lvh '>
          <div className='min-h-screen'>
            <Nav />
           {children}
           </div>
           <Footer />

        </main>
    </body>
</html>

  )
}

export default layout