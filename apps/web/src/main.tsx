import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import "./style.css";
import { Header, Counter, IframeWrapper } from "@repo/ui";
import { PolicyManagement } from "@repo/policymanagement"
import NavBar from "./Navbar";

const App = () => (
  <BrowserRouter>

    <NavBar />

    <Routes>
      <Route path="/" element={<Header title="POC App" />} />
      <Route path="/PolicyManagement" element={<PolicyManagement />} />
      <Route path="/CaseManagement" element={<Counter />} />
      <Route path="/oldFeature" element={<IframeWrapper />} />
    </Routes>

  </BrowserRouter>
);

createRoot(document.getElementById("app")!).render(<App />);
