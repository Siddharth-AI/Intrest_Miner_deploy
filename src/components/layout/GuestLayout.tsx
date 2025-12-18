import { Outlet } from "react-router-dom";
import GuestHeader from "./GuestHeader";
import { Footer } from "./Footer";

export default function GuestLayout() {
  return (
    <>
      <GuestHeader />
      <div className="app-scale-wrapper flex flex-col min-h-screen">
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
}
