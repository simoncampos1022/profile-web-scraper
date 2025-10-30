"use client";
import React, { useCallback, useEffect } from "react";
import { ProfileModel, FilterModel } from "@/types";
import ProfileOverview from "@/sections/ProfileOverview";
import ProfileFilter from "@/components/ProfileFilter/ProfileFilter";
import ProfileTable from "@/components/ProfileTable/ProfileTable";
import ProfileFooter from "@/components/ProfileFooter/ProfileFooter";

const Dashboard = () => {
  const [total, setTotal] = React.useState(0);
  const [matched, setMatched] = React.useState(0);
  const [curPage, setCurPage] = React.useState(1);
  const [limit, setLimit] = React.useState(20);
  const [profile, setProfile] = React.useState<ProfileModel | null>(null);
  const [overview, setOverview] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState(false);
  const [profiles, setProfiles] = React.useState<ProfileModel[]>([]);
  // Draft filter reflects UI inputs; appliedFilter is used to fetch
  const [filter, setFilter] = React.useState<FilterModel>({
    name: "",
    age: 0,
    location: "",
    funding: "",
    keyword: "",
    technicalStatus: "",
  });
  const [appliedFilter, setAppliedFilter] = React.useState<FilterModel>({
    name: "",
    age: 0,
    location: "",
    funding: "",
    keyword: "",
    technicalStatus: "",
  });

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    try {
      const filterParams = appliedFilter
        ? Object.entries(appliedFilter).reduce(
            (acc: Record<string, string>, [key, value]) => {
              if (value) {
                acc[key] = value.toString();
              }
              return acc;
            },
            {}
          )
        : {};

      const queryParams = new URLSearchParams({
        ...filterParams,
      }).toString();

      const response = await fetch(
        `/api/profiles?page=${curPage}&limit=${limit}&${queryParams}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await response.json();
      setProfiles(data.data);
      setTotal(data.total);
      setMatched(data.matched);
    } catch (error) {
      console.error("Error fetching profiles:", error);
    } finally {
      setLoading(false);
    }
  }, [curPage, limit, appliedFilter]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilter((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSearch = () => {
    setCurPage(1);
    setAppliedFilter(filter);
  };

  const handleUpdate = (profile: ProfileModel) => {
    setProfiles(
      profiles.map((p) => (p.userId === profile.userId ? profile : p))
    );
    setProfile(profile);
  };

  const handleStatusUpdate = (profileId: string, status: boolean | null, viewers?: Record<string, boolean>) => {
    setProfiles(
      profiles.map((p) => {
        if (p.userId === profileId) {
          const updatedProfile = { ...p };
          
          // Use the viewers data from the API response if available
          if (viewers) {
            updatedProfile.viewers = viewers;
          } else {
            // Fallback to local update if no viewers data provided
            if (!updatedProfile.viewers) {
              updatedProfile.viewers = {};
            }
            
            // Get the current user ID from localStorage
            const currentUserId = localStorage.getItem("userId");
            if (currentUserId) {
              if (status === null) {
                // Remove the viewer entry (set to "Yet" status)
                delete updatedProfile.viewers[currentUserId];
              } else {
                // Set the viewer status (true = Good, false = Bad)
                updatedProfile.viewers[currentUserId] = status;
              }
            }
          }
          
          return updatedProfile;
        }
        return p;
      })
    );
  };

  const handleOverview = (profile: ProfileModel) => {
    setProfile(profile);
    setOverview(true);
  };

  const handleOverviewClose = () => {
    setOverview(false);
  };

  return (
    <>
      <div className="relative p-5 flex flex-1 flex-col gap-4 overflow-auto">
        <ProfileOverview
          profile={profile}
          show={overview}
          handleUpdate={handleUpdate}
          handleClose={handleOverviewClose}
        />
        <ProfileFilter
          filter={filter}
          handleChange={handleFilterChange}
          onSearch={handleSearch}
          onReset={() => {
            const base = { name: "", age: 0, location: "", funding: "", keyword: "", technicalStatus: "" } as FilterModel;
            setFilter(base);
            setAppliedFilter(base);
            setCurPage(1);
          }}
          loading={loading}
        />
        <ProfileTable
          loading={loading}
          profiles={profiles}
          handleOverview={handleOverview}
          onStatusUpdate={handleStatusUpdate}
        />
        <ProfileFooter
          total={total}
          matched={matched}
          curPage={curPage}
          limit={limit}
          setCurPage={setCurPage}
          setLimit={setLimit}
        />
      </div>
    </>
  );
};

export default Dashboard;
