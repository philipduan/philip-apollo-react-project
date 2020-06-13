import React, { useState } from "react";

import Modal from "../../../components/Modal";

const Profile = ({ history }) => {
  const [modalOpen, setModalOpen] = useState(true);

  return (
    <Modal
      handleClose={() => {
        setModalOpen(false);
        history.push("/profile");
      }}
      isOpen={modalOpen}
      title="Create Profile"
      width="600px"
    >
      The profile settings form goes here
    </Modal>
  );
};

export default Profile;
