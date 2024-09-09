import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom'
import './index.css';

// QueryClient 인스턴스 생성
const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </BrowserRouter>
);