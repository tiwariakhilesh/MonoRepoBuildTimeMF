import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import "./style.css";
import { IframeWrapper } from "@repo/ui";
import { PolicyManagement } from "@repo/policymanagement"
import NavBar from "./Navbar";
import { CaseManagement } from "@repo/casemanagement";

const App = () => (
  <BrowserRouter>

    <NavBar />

    <Routes>
      <Route path="/" element={<PolicyManagement />} />
      <Route path="/CaseManagement" element={<CaseManagement />} />
      <Route path="/oldFeature" element={<IframeWrapper />} />
    </Routes>

  </BrowserRouter>
);

createRoot(document.getElementById("app")!).render(<App />);
