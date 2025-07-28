import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AppOriginal from './AppOriginal';
import App from './App'; // App 컴포넌트가 정의된 파일
import './index.css';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    {/* <AppOriginal /> */}
    <App />
  </StrictMode>
);
