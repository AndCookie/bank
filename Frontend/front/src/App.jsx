import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route, useNavigate } from 'react-router-dom';

import HomePage from './pages/HomePage';
import TripPage from './pages/TripPage';
import TripCreatePage from './pages/TripCreatePage'
import TripDetailPage from './pages/TripDetailPage'
import TripFinishPage from './pages/TripFinishPage'
import GalleryPage from './pages/GalleryPage';
import NotfoundPage from './pages/NotfoundPage';
import ErrorModal from './components/ErrorModal';

function App() {
  return (
    <>
      <ErrorModal />
      <Routes>
        <Route path="" element={<HomePage />}></Route>
        <Route path="/trip" element={<TripPage />}></Route>
        <Route path="/trip/create" element={<TripCreatePage />}></Route>
        <Route path="/trip/:tripId" element={<TripDetailPage />}></Route>
        <Route path="/finish/:tripId" element={<TripFinishPage />}></Route>
        <Route path="/gallery/:tripId" element={<GalleryPage />}></Route>
        <Route path="*" element={<NotfoundPage />}></Route>
        <Route path="/finish/:tripId" element={<TripFinishPage />}></Route>
      </Routes>
    </>
  )
};

export default App;
