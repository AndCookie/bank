import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route, useNavigate } from 'react-router-dom';

import HomePage from './pages/HomePage';
import TripPage from './pages/TripPage';
import TripCreate from './pages/TripCreate'
import GalleryPage from './pages/GalleryPage';
import NotfoundPage from './pages/NotfoundPage';

function App() {
  return (
    <>
      <Routes>
        <Route path="" element={<HomePage />}></Route>
        <Route path="/trip" element={<TripPage />}></Route>
        <Route path="/gallery/:tripId" element={<GalleryPage />}></Route>
        <Route path="*" element={<NotfoundPage />}></Route>
        <Route path="/trip/create" element={<TripCreate />}></Route>
      </Routes>
    </>
  )
};

export default App;
