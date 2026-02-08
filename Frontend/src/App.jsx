import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProblemList from './pages/problems/ProblemList';
import ProblemDetail from './pages/problems/ProblemDetail';

import { AuthProvider } from './context/AuthContext';

function App() {
    return (
        <AuthProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/problems" element={<ProblemList />} />
                    <Route path="/problem" element={<ProblemList />} />
                    <Route path="/problems/:id" element={<ProblemDetail />} />
                    {/* Add more routes here as needed */}
                </Routes>
            </div>
        </AuthProvider>
    );
}

export default App;
