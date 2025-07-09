import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./Pages/LandingPage/Landing";
import Login from "./Pages/Login/Login";
import Signup from "./Pages/Signup/Signup";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Category from "./Pages/Dashboard/Category/Category";
import Expiring from "./Pages/Dashboard/Expiriy/Expiring";
import LowStock from "./Pages/Dashboard/LowStock/LowStock";
import PurchaseList from "./Pages/Dashboard/PurchaseList/PurchaseList";
import ShelfMap from "./Pages/Dashboard/ShelfMap";
import AIAssistantTab from "./Pages/Dashboard/AI Page/AIAssistantTab";
import UserHomepage from './Pages/USER/Homepage/Homepage'
import Navigation from "./Pages/USER/Navigation/Navigation";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/categories" element={<Category />} />
        <Route path="/expiring" element={<Expiring />} />
        <Route path="/low-stock" element={<LowStock/>} />
        <Route path="/purchase-list" element={<PurchaseList/>} />
        <Route path="/shelf-map" element={<ShelfMap/>} />
        <Route path="/ai-assistant" element={<AIAssistantTab/>} />
        <Route path="/customer-dashboard" element={<UserHomepage/>} />
        <Route path="/navigate" element={<Navigation/>} />
      </Routes>
    </Router>
  );
}

export default App;
