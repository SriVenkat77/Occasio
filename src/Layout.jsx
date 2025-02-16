import Footer from './pages/Footer';
import Header from './pages/Header';
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 w-full z-50">
        <Header />
      </header>

      {/* Scrollable Content */}
      <main className="flex-1 mt-[60px] mb-[60px] overflow-auto bg-gradient-to-b from-primarydark to-primarylight ">
        <Outlet />
      </main>

      {/* Fixed Footer */}
      <footer className="fixed bottom-0 left-0 w-full z-50">
        <Footer />
      </footer>
    </div>
  );
}
