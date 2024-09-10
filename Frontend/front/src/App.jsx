import './App.css';
import { Routes, Route, useNavigate } from 'react-router-dom';

import TripPage from './pages/TripPage';
import TripCreate from './pages/TripCreate'
import GalleryPage from './pages/GalleryPage';
import NotfoundPage from './pages/NotfoundPage';

function App() {
  const nav = useNavigate();

  const goGallery = () => {
    nav('/gallery/:tripId')
  }

  return (
    <>
    <div>
      <button onClick={goGallery}>Gallery</button>
    </div>
      <Routes>
        <Route path="/trip" element={<TripPage />}></Route>
        <Route path="/gallery/:tripId" element={<GalleryPage />}></Route>
        <Route path="*" element={<NotfoundPage />}></Route>
        <Route path="/trip/create" element={<TripCreate />}></Route>
      </Routes>
    </>
  )
};

export default App;
