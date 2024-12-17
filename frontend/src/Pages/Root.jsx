import { Outlet } from "react-router-dom";
import MainNav from "../Components/MainNav/MainNav";
import MainFooter from "../Components/Footer/MainFooter";
import { useEffect, useState } from "react";
import NetworkError from "./Error/NetworkError";

const Root = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const handleOnline = () => setIsOnline(true);
  const handleOffline = () => setIsOnline(false);

  useEffect(() => {
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <>
      {isOnline ? (
        <>
          <MainNav />
          <Outlet />
          <MainFooter />
        </>
      ) : (
        <NetworkError />
      )}
    </>
  );
};

export default Root;
