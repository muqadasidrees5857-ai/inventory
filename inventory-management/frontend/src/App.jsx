import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Stock from "./pages/Stock";
import LowStock from "./pages/LowStock";
import Orders from "./pages/Orders";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<DashboardLayout />}>

          <Route
            path="/"
            element={<Dashboard />}
          />

          <Route
            path="/products"
            element={<Products />}
          />

          <Route
            path="/stock"
            element={<Stock />}
          />

          <Route
            path="/low-stock"
            element={<LowStock />}
          />

        </Route>
<Route
  path="/orders"
  element={<Orders />}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;