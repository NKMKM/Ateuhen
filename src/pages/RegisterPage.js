import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import WestIcon from '@mui/icons-material/West';


const RegisterForm = ({ setUser }) => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // Текущий шаг формы
  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleNextStep = () => {
    if (step === 1 && (!firstName || !secondName || !email)) {
      alert("Please fill in all fields.");
      return;
    }
    if (step === 2 && !nickname) {
      alert("Please enter a nickname.");
      return;
    }
    setStep(step + 1);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      // Регистрируем пользователя
      const registerResponse = await axios.post(
        "http://localhost:5000/auth/register",
        { first_name: firstName, second_name: secondName, email, nickname, password },
        { withCredentials: true }
      );

      if (registerResponse.status === 201) {
        // Если регистрация успешна, сразу логиним пользователя
        const loginResponse = await axios.post(
          "http://localhost:5000/auth/login",
          { email, password },
          { withCredentials: true }
        );

        if (loginResponse.status === 200) {
          setUser(loginResponse.data.user); // Обновляем состояние пользователя
          navigate("/home"); // Перенаправляем на Home
        }
      }
    } catch (error) {
      alert(error.response?.data?.error || "An error occurred during registration.");
    }
  };

  return (
    <>
      {/* размытый кружок зеленый сверху слева */}
      <div className="bg-[#3ECF8E] fixed top-0 left-0 opacity-25 w-[500px] h-[400px] rounded-br-full "></div>
      {/* контейнер с инфо */}
      <div className="backdrop-blur-[100px] w-full h-screen fixed  z-10 ">
        <Link to="/" className="w-[100px] h-[50px] border-2 border-gray-400 rounded-lg flex items-center justify-center text-center fixed top-5 left-5 button-violet-hover bg-black"> <WestIcon fontSize="small"/> <p className="block w-[5px]"></p>Back</Link>

        <form onSubmit={handleRegister} className="w-[700px] h-[700px] mx-auto mt-32 p-10 flex items-center flex-col justify-around ">
          <div className="flex flex-col items-center space-y-5 mb-2">
            <h1 className="text-7xl text-center font-bold ">Registration</h1>
            <p>Welcome to our community!</p>
          </div>
          {step === 1 && (
            <>
              <div className=" flex flex-col space-y-4 w-[70%] p-4">
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="w-full mx-auto h-[60px] border-2 rounded-lg bg-black p-2"

                  />
                <input
                  type="text"
                  placeholder="Second Name"
                  value={secondName}
                  onChange={(e) => setSecondName(e.target.value)}
                  required
                  className="w-full mx-auto h-[60px] border-2 rounded-lg bg-black p-2"

                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full mx-auto h-[60px] border-2 rounded-lg bg-black p-2"

                  />
              </div>
              <div className="flex items-center flex-col mb-4 space-y-3  p-4">
                <button type="button" onClick={handleNextStep} className="w-[110%] bg-[#3ECF8E] h-[70px] font-bold text-3xl rounded-lg hover:bg-[#66ffba] hover:scale-105 transition duration-300  ">Next</button>
                <Link to="/login" className="text-glow-hover underline">Already have an account?</Link>

              </div>
            </>
          )}

          {step === 2 && (
            <>
              <input
                type="text"
                placeholder="Nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                required
                className="w-[67%] mx-auto h-[60px] border-2 rounded-lg bg-black p-2"

                />
              <button type="button" onClick={handleNextStep} className="w-[198px] bg-[#3ECF8E] h-[70px] font-bold text-3xl rounded-lg hover:bg-[#66ffba] hover:scale-105 transition duration-300 mb-4 " >Next</button>
            </>
          )}

          {step === 3 && (
            <>
              <div className=" flex flex-col space-y-4 w-[70%] p-4">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full mx-auto h-[60px] border-2 rounded-lg bg-black p-2"
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full mx-auto h-[60px] border-2 rounded-lg bg-black p-2"
                />
              </div>
              <button type="submit" className="w-[198px] bg-[#3ECF8E] h-[70px] font-bold text-3xl rounded-lg hover:bg-[#66ffba] hover:scale-105 transition duration-300  mb-4"> Register</button>
            </>
          )}
        </form>
      </div>


      {/* размытый кружок зеленый снизу справа */}
      <div className="bg-[#3ECF8E] fixed bottom-0 right-0 opacity-25 w-[500px] h-[400px] rounded-tl-full " ></div>
    </>
    
  );
};

export default RegisterForm;
