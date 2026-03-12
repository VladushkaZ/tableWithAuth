import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { Login } from "./pages/Login";
import { Main } from "./pages/Main";
import { RequireAuth } from "./components/ReqireAuth";
import useStore from "./store";
import { useEffect } from "react";
import Cookies from "js-cookie";

function App() {
  const { isAuth, token, remember } = useStore();
  useEffect(() => {
    if (remember && token) {
      Cookies.set("token", token, {
        expires: 30,
        secure: true,
        sameSite: "strict",
      });
    } else if (!remember) {
      Cookies.set("token", token, { secure: true });
    }
  }, [token, remember, isAuth]);
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <Main />
            </RequireAuth>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
