import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Create from './pages/Create'; // Import the new Create component
import TravelBlogs from './pages/TravelBlogs'; // Assuming this is a page listing blogs

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/create" element={<Create />} /> {/* Updated route */}
        <Route path="/travelblogs" element={<TravelBlogs />} />
        {/* Add other routes here */}
      </Routes>
    </Router>
  );
}
