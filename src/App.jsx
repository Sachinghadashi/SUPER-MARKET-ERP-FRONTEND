import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import CashierDashboard from "./pages/CashierDashboard";
import AllBills from "./pages/AllBills";
import Products from "./pages/Products";

import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layout/MainLayout";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* DEFAULT ROUTE */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ADMIN DASHBOARD */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <MainLayout>
                <AdminDashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* CASHIER DASHBOARD */}
        <Route
          path="/cashier"
          element={
            <ProtectedRoute role="cashier">
              <MainLayout>
                <CashierDashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* ALL BILLS */}
        <Route
          path="/bills"
          element={
            <ProtectedRoute>
              <MainLayout>
                <AllBills />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* PRODUCTS (ADMIN ONLY) */}
        <Route
          path="/products"
          element={
            <ProtectedRoute role="admin">
              <MainLayout>
                <Products />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* ❗ CATCH ALL (IMPORTANT) */}
        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>
    </BrowserRouter>
  );
};

export default App;




// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import AdminDashboard from "./pages/AdminDashboard";
// import CashierDashboard from "./pages/CashierDashboard";
// import AllBills from "./pages/AllBills";
// import Products from "./pages/Products";

// import ProtectedRoute from "./components/ProtectedRoute";
// import MainLayout from "./layout/MainLayout";

// const App = () => {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* DEFAULT ROUTE */}
//         <Route path="/" element={<Navigate to="/login" />} />

//         {/* PUBLIC ROUTES */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />

//         {/* ADMIN DASHBOARD */}
//         <Route
//           path="/admin"
//           element={
//             <ProtectedRoute role="admin">
//               <MainLayout>
//                 <AdminDashboard />
//               </MainLayout>
//             </ProtectedRoute>
//           }
//         />

//         {/* CASHIER DASHBOARD */}
//         <Route
//           path="/cashier"
//           element={
//             <ProtectedRoute role="cashier">
//               <MainLayout>
//                 <CashierDashboard />
//               </MainLayout>
//             </ProtectedRoute>
//           }
//         />

//         {/* ALL BILLS PAGE (ADMIN + CASHIER) */}
//         <Route
//           path="/bills"
//           element={
//             <ProtectedRoute>
//               <MainLayout>
//                 <AllBills />
//               </MainLayout>
//             </ProtectedRoute>
//           }
//         />

//         {/* PRODUCT MANAGEMENT PAGE (ADMIN ONLY) */}
//         <Route
//           path="/products"
//           element={
//             <ProtectedRoute role="admin">
//               <MainLayout>
//                 <Products />
//               </MainLayout>
//             </ProtectedRoute>
//           }
//         />
//       </Routes>
//     </BrowserRouter>
//   );
// };

// export default App;




// // import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// // import Login from "./pages/Login";
// // import Register from "./pages/Register";
// // import AdminDashboard from "./pages/AdminDashboard";
// // import CashierDashboard from "./pages/CashierDashboard";
// // import ProtectedRoute from "./components/ProtectedRoute";
// // import AllBills from "./pages/AllBills";

// // const App = () => {
// //   return (
// //     <BrowserRouter>
// //       <Routes>

// //         {/* DEFAULT ROUTE */}
// //         <Route path="/" element={<Navigate to="/login" />} />

// //         <Route path="/register" element={<Register />} />

// //         <Route path="/login" element={<Login />} />

// //         <Route path="/bills" element={<AllBills />} />

// //         <Route
// //           path="/admin"
// //           element={
// //             <ProtectedRoute role="admin">
// //               <AdminDashboard />
// //             </ProtectedRoute>
// //           }
// //         />

// //         <Route
// //           path="/cashier"
// //           element={
// //             <ProtectedRoute role="cashier">
// //               <CashierDashboard />
// //             </ProtectedRoute>
// //           }
// //         />

// //       </Routes>
// //     </BrowserRouter>
// //   );
// // };

// // export default App;