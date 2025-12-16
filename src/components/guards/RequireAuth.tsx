import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { fetchProfileData } from "../../../store/features/profileSlice";

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [initialLoad, setInitialLoad] = useState(true);
  
  const {
    data: userProfile,
    loading,
    error,
  } = useAppSelector((state) => state.profile);

  useEffect(() => {
    if (!token) return;
    
    // Only fetch if no profile data exists and not already loading
    if (!userProfile && !loading) {
      dispatch(fetchProfileData());
    } else if (userProfile) {
      // Profile exists, no need to show loading
      setInitialLoad(false);
    }
  }, [token, userProfile, loading, dispatch]);

  useEffect(() => {
    // Hide loading after profile is loaded or error occurs
    if (userProfile || error) {
      setInitialLoad(false);
    }
  }, [userProfile, error]);

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Show loading only on initial load when no profile data exists
  if (initialLoad && loading && !userProfile) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-3 border-[#3b82f6] border-t-transparent"></div>
          <p className="text-[#2d3748] font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  // If error and no cached profile, redirect to login
  if (error && !userProfile) {
    console.error("Profile fetch error:", error);
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RequireAuth;
