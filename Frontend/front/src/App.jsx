import './App.css';
import { Routes, Route, useNavigate } from 'react-router-dom';

import TripPage from './pages/TripPage';
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
        <Route path="/gallery" element={<GalleryPage />}></Route>
        <Route path="*" element={<NotfoundPage />}></Route>
      </Routes>
    </>
  )
};

export default App;
