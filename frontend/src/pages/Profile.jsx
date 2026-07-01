import { useState } from "react";

import EditProfileModal from "../components/profileModal/EditProfileModal";
import ChangePasswordModal from "../components/profileModal/ChangePasswordModal";
import ProfileCard from "../components/profileModal/ProfileCard";
import Loader from "../components/Loader";
import { useAuth } from "./Provider/AuthProvider";

const Profile = () => {

  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);

  const { profile, avatar, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }


  return (

    <div className="min-h-[calc(100vh-70px)] flex justify-center px-4 pt-12 pb-10">

      {profile && (

        <ProfileCard
          profile={profile}
          avatar={avatar}
          openEdit={() => setEditOpen(true)}
          openPassword={() => setPasswordOpen(true)}
        />

      )}

      {editOpen && (

        <EditProfileModal
          profile={profile}
          avatar={avatar}
          close={() => setEditOpen(false)}
        />

      )}

      {passwordOpen && (

        <ChangePasswordModal
          close={() => setPasswordOpen(false)}
        />

      )}

    </div>

  );

};

export default Profile;