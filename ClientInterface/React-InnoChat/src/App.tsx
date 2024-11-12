import { Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./Pages/Login";
import Register from "./Pages/Register";
import Message from "./Pages/Message";
import NavBar from "./Components/NavBar";
import { useContext } from "react";
import { UserContext } from "./context/AuthContext";

import "./indexCSS.css";
import { ChatProvider } from "./context/ChatContext";
import { UserProfile } from "./Pages/UserProfile";

function App() {
  const { user } = useContext(UserContext);
  return (
    <ChatProvider user={user}>
      <NavBar></NavBar>
      <Routes>
        <Route path="/login" element={user ? <Message /> : <LoginForm />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={user ? <Message /> : <LoginForm />} />
        <Route path="*" element={<Navigate to="/" />} />
        {/* <Route path="/profile" element={<UserProfile />} /> */}
      </Routes>
    </ChatProvider>
  );
}

export default App;
