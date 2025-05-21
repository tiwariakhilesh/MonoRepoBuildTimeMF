import { createRoot } from "react-dom/client";
import "./style.css";
import { Header, Counter } from "@repo/ui";
import {PolicyManagement} from "@repo/policymanagement"

const App = () => (
  <section>
    <Header title="Web" />
    <section className="card">
      <Counter />
    </section>
    <PolicyManagement/>
  </section>
);

createRoot(document.getElementById("app")!).render(<App />);
