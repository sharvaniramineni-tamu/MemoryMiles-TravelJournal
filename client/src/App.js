import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Create from "./pages/Create";
import ViewBlog from "./pages/ViewBlog";
import EditBlog from "./pages/EditBlog.jsx";
import { AuthContextProvider } from "./authContext";
import Navbar from './components/Navbar';
import Profile from "./pages/Profile";
import RecapVideo from "./pages/RecapVideo";

function App() {
  return (
    <AuthContextProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create" element={<Create />} />
          <Route path="/blogs/:id" element={<ViewBlog />} />
          <Route path="/blogs/:id/edit" element={<EditBlog />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/recap" element={<RecapVideo />} />
        </Routes>
      </BrowserRouter>
    </AuthContextProvider>
  );
}

export default App;