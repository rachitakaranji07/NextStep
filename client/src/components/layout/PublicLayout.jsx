import Navbar from './Navbar'
import Footer from './Footer'

export function PublicLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

export default PublicLayout
