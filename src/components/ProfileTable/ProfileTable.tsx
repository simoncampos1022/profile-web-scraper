'use client'
import Image from "next/image";
import { ProfileModel } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { toast } from "react-toastify";

const ProfileTable = ({
  loading,
  profiles,
  handleOverview,
  onStatusUpdate,
}: {
  loading: boolean;
  profiles: ProfileModel[];
  handleOverview: (profile: ProfileModel) => void;
  onStatusUpdate: (profileId: string, status: boolean | null, viewers?: Record<string, boolean>) => void;
}) => {
  const { token, user } = useAuth();
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const handleStatusChange = async (profileId: string, status: boolean | null, e?: React.MouseEvent | React.ChangeEvent) => {
    e?.stopPropagation(); // Prevent row click
    setUpdatingStatus(profileId);
    
    try {
      const response = await fetch("/api/profiles/status", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          profileId,
          status,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        onStatusUpdate(profileId, status, responseData.viewers);
        
        // Show success toast
        const statusText = status === true ? "Good" : status === false ? "Bad" : "Yet";
        toast.success(`Profile status updated to "${statusText}"`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        const errorData = await response.json();
        console.error("Failed to update status:", errorData.error || "Unknown error");
        
        // Show error toast
        toast.error(`Failed to update status: ${errorData.error || "Unknown error"}`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } 
    } catch (error) {
      console.error("Error updating status:", error);
      
      // Show error toast for network errors
      toast.error("Network error. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusColor = (profile: ProfileModel) => {
    if (!profile.viewers || !user) return "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
    
    const userStatus = profile.viewers[user.id];
    if (userStatus === true) return "bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200";
    if (userStatus === false) return "bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200";
    return "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
  };

  const getStatusText = (profile: ProfileModel) => {
    if (!profile.viewers || !user) return "Yet";
    
    const userStatus = profile.viewers[user.id];
    if (userStatus === true) return "Good";
    if (userStatus === false) return "Bad";
    return "Yet";
  };
  
  const getTechnicalStatus = (profile: ProfileModel) => {
    const summary = (profile.sumary || "").toLowerCase();
    if (!summary) return "N/A";
    if (/\bnon[- ]?technical\b/.test(summary)) return "Non-technical";
    if (/\btechnical\b/.test(summary)) return "Technical";
    return "N/A";
  };
  
  const formatUpdatedAtUTC = (value: unknown) => {
    try {
      const d = new Date(value as string);
      if (isNaN(d.getTime())) return "N/A";
      const formatted = new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "UTC",
      }).format(d);
      return `${formatted} UTC`;
    } catch {
      return "N/A";
    }
  };
  return (
    <div className="flex-1 overflow-hidden">
      <div className="h-full overflow-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
        <table className="min-w-full divide-y divide-gray-200 relative">
          <thead className="text-left bg-gray-50 dark:bg-gray-800 shadow-lg sticky top-0 z-10">
            <tr className="font-semibold text-gray-600 dark:text-gray-400 uppercase">
              <th className="p-4"></th>
              <th className="p-4">Name</th>
              <th className="p-4">Technical Status</th>
              <th className="p-4">Location</th>
              <th className="p-4">Funding Status</th>
              <th className="p-4">Last Seen</th>
              <th className="p-4">Updated Date</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading
              ? Array(12)
                  .fill(null)
                  .map((_, index) => (
                    <tr key={`loading-${index}`}>
                      <td colSpan={7} className="text-center p-4">
                        <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-4 rounded"></div>
                      </td>
                    </tr>
                  ))
              : profiles.map((profile, index) => (
                  <tr
                    key={profile.userId || index}
                    className="even:bg-gray-100 dark:even:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-600 hover:cursor-pointer"
                    onClick={handleOverview.bind(null, profile)}
                  >
                    <td className="p-2">
                      <Image
                        src={profile.avatar ? (profile.avatar.startsWith("http") ? profile.avatar : ("https:" + profile.avatar)) : "/cutestar.png"} // Use a static fallback image
                        alt="Profile"
                        width={72}
                        height={72}
                        className="rounded-full"
                      />
                    </td>
                    <td className="p-2 whitespace-nowrap">
                      {profile.name || "N/A"}
                    </td>
                <td className="p-2 whitespace-nowrap">
                  {getTechnicalStatus(profile)}
                </td>
                <td className="p-2 whitespace-nowrap">
                  {profile.location || "N/A"}
                </td>
                <td className="p-2 max-w-80 text-ellipsis overflow-hidden whitespace-nowrap">
                  {profile.startup?.funding || "N/A"}
                </td>
                    <td className="p-2 whitespace-nowrap">
                      {profile.lastSeen ? profile.lastSeen : "N/A"}
                    </td>
                <td className="p-2 whitespace-nowrap">
                  {profile.updatedAt ? formatUpdatedAtUTC(profile.updatedAt) : "N/A"}
                </td>
                    <td className="p-2">
                      <div className="relative">
                        <select
                          value={getStatusText(profile)}
                          onChange={(e) => {
                            const value = e.target.value;
                            let status: boolean | null = null;
                            if (value === "Good") status = true;
                            else if (value === "Bad") status = false;
                            else status = null;
                            handleStatusChange(profile.userId, status, e);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          disabled={updatingStatus === profile.userId}
                          className={`px-3 py-3 rounded text-sm font-medium border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${getStatusColor(profile)} ${
                            updatingStatus === profile.userId ? "opacity-50" : ""
                          }`}
                          style={{
                            colorScheme: 'auto'
                          }}
                        >
                          <option value="Yet" className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">Yet</option>
                          <option value="Good" className="bg-white dark:bg-gray-800 text-green-800 dark:text-green-200">Good</option>
                          <option value="Bad" className="bg-white dark:bg-gray-800 text-red-800 dark:text-red-200">Bad</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProfileTable;
