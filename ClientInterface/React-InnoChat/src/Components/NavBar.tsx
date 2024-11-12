import { Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState, useContext, useRef } from "react";
import { UserContext } from "../context/AuthContext";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../UserProfile.css";
import PlayOnce from "../Components/ButtPlay";
import ICON from "../assets/system-solid-8-account.json";
import { Player } from "@lordicon/react";
import { baseUrl, putRequest } from "../utils/services";

const NavBar = () => {
  const { user, logout } = useContext(UserContext);
  const [show, setShow] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState(user?.name);
  const playerRef = useRef<Player>(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleEdit = () => setEditMode(true);

  const handlelogout = () => {
    logout();
  };

  const handleSave = async () => {
    // Save new name logic here
    updateUserName(user?._id, newName);
    setEditMode(false);
  };

  const updateUserName = async (userId: any, newName: any) => {
    const url = `${baseUrl}/update/${userId}`;
    const body = { name: newName };

    const result = await putRequest(url, body);

    if (result.error) {
      console.error(result.message);
    } else {
      console.log("User updated successfully:", result);
    }
  };

  const onhover = () => {
    if (playerRef.current) {
      setTimeout(() => {
        playerRef.current?.playFromBeginning();
      }, 500);
    }
  };

  return (
    <div className="NAVBarr">
      <Navbar className="Navbar vw-100 p-0 m-0 ">
        <Link className="no-link-style" to={"../Pages/Message.tsx"}>
          <h3 className="p-2 ms-0 m-2">
            <span>Inno</span>Chat
          </h3>
        </Link>
      </Navbar>
      <div className="profile_container">
        <div className="profile_information">
          <div className="userimage" onClick={handleShow}>
            <PlayOnce
              imglink={ICON}
              tsize={40}
              color={"#58a6ff"}
              onComplete={onhover}
            />
          </div>
          <h2 className="username">{user?.name}</h2>
        </div>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>User Profile Settings</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {editMode ? (
              <Form>
                <Form.Group>
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </Form.Group>
                <Button variant="primary" onClick={handleSave}>
                  Save
                </Button>
              </Form>
            ) : (
              <>
                <p>
                  Username: {user?.name}{" "}
                  <span className="edit-icon" onClick={handleEdit}>
                    ✒️
                  </span>
                </p>
                <p>Email: {user?.email}</p>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="danger" onClick={handlelogout}>
              Logout
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default NavBar;
