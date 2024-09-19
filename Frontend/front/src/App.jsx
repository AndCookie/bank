import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route, useNavigate } from 'react-router-dom';

import HomePage from './pages/HomePage';
import TripPage from './pages/TripPage';
import TripCreatePage from './pages/TripCreatePage'
import GalleryPage from './pages/GalleryPage';
import NotfoundPage from './pages/NotfoundPage';

function App() {
  return (
    <>
      <Routes>
        <Route path="" element={<HomePage />}></Route>
        <Route path="/trip" element={<TripPage />}></Route>
        <Route path="/gallery/:tripId" element={<GalleryPage />}></Route>
        <Route path="/trip/create" element={<TripCreatePage />}></Route>
        <Route path="*" element={<NotfoundPage />}></Route>
      </Routes>
    </>
  )
};

export default App;
