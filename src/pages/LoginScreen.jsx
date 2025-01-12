import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { setUser, setLoading, setError } from "../redux/AuthSlice";
import Swal from "sweetalert2";
import axios from "axios";
import { useEffect } from "react";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state) => state.auth.loading); // Mengambil state loading dari Redux
  const error = useSelector((state) => state.auth.error); // Mengambil error dari Redux

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("User:", user);

      await axios.post("http://localhost:3000/api/users/login", {
        uid: user.uid,
        email: user.email,
      });

      dispatch(
        setUser({ uid: user.uid, email: user.email, name: user.displayName })
      );

      Swal.fire({
        icon: "success",
        title: "Login Berhasil",
        text: "Selamat datang",
      });

      navigate("/");
    } catch (error) {
      console.error("Error occurred:", error.message);
      dispatch(setError(error.message)); // Dispatch error ke global store
      Swal.fire({
        icon: "error",
        title: "Login Gagal",
        text: error.message,
      });
    }
  };

  // use Effect for default set loading and setError to null
  useEffect(() => {
    dispatch(setLoading(false));
    dispatch(setError(null));
  }, [dispatch]);

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md space-y-6">
        <div className="bg-white shadow-md rounded-lg px-8 py-10">
          <h2 className="text-2xl font-bold text-center text-gray-700">
            Login
          </h2>
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-4 py-2"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-4 py-2"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? "Loading..." : "Login"}
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link to="/register" className="text-indigo-600 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
