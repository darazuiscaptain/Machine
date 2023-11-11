import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Animate4 } from "../Framer/Framer";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PulseLoader from "react-spinners/PulseLoader";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { getData } from "../Redux/FetchUserDetailSlice";
import { Mycontext } from "../Components/Context";
import ScrollTo from "../Components/ScrollTo";


const Contact = ({ logged }) => {
  const navigate = useNavigate();
  const [loader, setloader] = useState(false);
  const [input, setinput] = useState({
    email: "",
    message: "",
    type: "user",
  });

  const context = useContext(Mycontext);
  const { Dark, setDark ,Server} = context;

  const dispatch = useDispatch();

  const UserDetails = useSelector((state) => state.userData);

  const handleChange = (e) => {
    setinput({ ...input, [e.target.name]: e.target.value });
  };

  const fetchData = () => {
    UserDetails.data == 0 && dispatch(getData());
    UserDetails.data?.email?.length > 0 &&
      setinput({ ...input, email: UserDetails.data?.email });
  };

  useEffect(() => {
    logged && fetchData();
  }, [UserDetails.data?.email?.length > 0]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (input.message.length < 10) {
        return toast.info("Message is too short");
      }
      setloader(true);
      const res = await axios.post(
        `${Server}/contact`,
        input
      );
      if (res.data.message !== "Message sent") {
        setloader(false);
        return toast.info(res.data.message);
      } else {
        toast.success(res.data.message);
        setloader(false);
        setinput({ email: "", message: "" });
        setTimeout(() => {
          navigate("/login");
        }, 8000);
      }
    } catch (error) {
      setloader(false);
      toast.error("Something went wrong");
      console.log(error);
    }
  };

  return (
    <div className="Contact pb-20 pt-32">
      <ScrollTo/>
      <motion.form
        onSubmit={handleSubmit}
        className={`   h-fit    text-lg rounded-3xl   mx-auto font-Mont
      xl:w-4/12
      lg:w-5/12
      md:w-1/2
      sm:w-8/12
      w-11/12
      font-Poppins

     backdrop-blur-md
    ${Dark ? "Dark1" : "Light1"}
  `}
        initial={"Offscreen"}
        whileInView={"onScreen"}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ staggerChildren: 0.1 }}
        variants={Animate4}
      >
        <h1 className=" text-center text-2xl pt-6">Contact Us</h1>
        <h2 className=" text-center text-base mt-2">
          ( We try to reply within 30 minutes )
        </h2>
        <div
          className="SignIn  flex flex-col mx-auto    py-7
      md:px-10
      px-6
      "
        >
          <label>Your Email</label>
          {logged ? (
            <input
              name="email"
              type="email"
              readOnly
              value={input.email ? input.email : "loading..."}
            />
          ) : (
            <input
              name="email"
              type="email"
              readOnly={logged}
              value={input.email}
              onChange={handleChange}
            />
          )}
          <br />
          <label>Message</label>
          <textarea
            required
            value={input.message}
            onChange={handleChange}
            name="message"
            className=" font-semibold capitalize max-h-20"
            rows="3"
            style={{ minHeight: "5rem" }}
          ></textarea>
          <br />
          <button
            className={` h-10 mt-4 font-Poppins text-lg text-white
           ${
             input.message.length < 10 &&
             input.message.length > 0 &&
             " brightness-75"
           }
          `}
          >
            {loader ? <PulseLoader color="white" size={10} /> : "Submit"}
          </button>
        </div>
      </motion.form>
    </div>
  );
};

export default Contact;
