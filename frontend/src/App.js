import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./components/auth/Register";
import VerifyCode from "./components/auth/VerifyCode";
import PasswordReset from "./components/auth/PasswordReset";
import ResetPassword from "./components/auth/ResetPassword";
import Login from "./components/auth/Login";
import MainScreen from "./components/app/MainScreen";


import CreateAccessLink from "./components/app/CreateAccessLink";
import AccessLinkDetail from "./components/app/AccessLinkDetail";
import FileUpload from "./components/app/FileUpload";




function App() {
  return (
      <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-code" element={<VerifyCode />} />
            <Route path="/password-reset" element={<PasswordReset />} />
            <Route path="/reset-password/:user_id/:token" element={<ResetPassword />} />


            {/* Маршруты для файлового менеджера */}
            <Route path="/dashboard" element={<MainScreen />} />
            <Route path='/fileupload' element={<FileUpload />} />
            <Route path="/create-access-link" element={<CreateAccessLink />} />
            <Route path="/access/:linkId" element={<AccessLinkDetail/>} />




        </Routes>
      </Router>
  );
}

export default App;
