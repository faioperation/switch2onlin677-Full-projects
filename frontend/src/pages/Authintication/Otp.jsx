import React, { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router";
import logo from "../../assets/Vector.png";
import useAxiosSecure from "../../hooks/useAxios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

const Otp = () => {

  const { register, setValue } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const axiosSecure = useAxiosSecure();

  const email = location.state?.email;

  const inputs = useRef([]);
  const [timer, setTimer] = useState(30);

  /* ======================
      Email Guard
  ====================== */

  useEffect(() => {

    if (!email) {
      toast.error("Email not found. Please try again.");
      navigate("/auth/forget-password");
    }

  }, [email, navigate]);

  /* ======================
      Countdown Timer
  ====================== */

  useEffect(() => {

    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);

  }, [timer]);

  /* ======================
      Verify OTP
  ====================== */

  const verifyMutation = useMutation({

    mutationFn: (data) =>
      axiosSecure.post("/auth/verify-otp/", data),

    onSuccess: (_, variables) => {

      toast.success("OTP Verified");

      navigate("/auth/set-password", {
        state: { email: variables.email }
      });

    },

    onError: () => {
      toast.error("Invalid OTP");
    }

  });

  /* ======================
      Resend OTP
  ====================== */

  const resendMutation = useMutation({

    mutationFn: (data) =>
      axiosSecure.post("/auth/resend-otp/", data),

    onSuccess: () => {
      toast.success("OTP Resent");
      setTimer(30);
    }

  });

  /* ======================
      Submit OTP
  ====================== */

  const submitOtp = (otp) => {

    if (!email) {
      toast.error("Email not found. Please try again.");
      navigate("/auth/forget-password");
      return;
    }

    if (verifyMutation.isPending) return;

    verifyMutation.mutate({
      email,
      otp
    });

  };

  /* ======================
      Handle Typing
  ====================== */

  const handleChange = (e, index) => {

    const value = e.target.value;

    if (!/^[0-9]?$/.test(value)) return;

    setValue(`otp${index + 1}`, value);

    if (value && index < 5) {
      inputs.current[index + 1].focus();
    }

    const otpArray = inputs.current.map((input) => input?.value || "");
    const otp = otpArray.join("");

    if (otp.length === 6 && !otp.includes("")) {
      submitOtp(otp);
    }

  };

  const handleKeyDown = (e, index) => {

    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputs.current[index - 1].focus();
    }

  };

  /* ======================
      Paste OTP
  ====================== */

  const handlePaste = (e) => {

    const pasteData = e.clipboardData.getData("text");

    if (!/^\d{6}$/.test(pasteData)) return;

    pasteData.split("").forEach((num, i) => {

      setValue(`otp${i + 1}`, num);

      if (inputs.current[i]) {
        inputs.current[i].value = num;
      }

    });

    submitOtp(pasteData);

  };

  const handleSubmitOtp = () => {

    const otp = inputs.current.map((input) => input?.value || "").join("");

    if (otp.length !== 6) {
      toast.error("Please enter complete OTP");
      return;
    }

    submitOtp(otp);

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-[#1D1D1D] text-white">

      <div className="w-[650px] border border-[#636363] rounded-2xl p-10 bg-white/[0.03]">

        {/* Logo */}

        <div className="flex flex-col items-center mb-8">

          <div className="flex items-center gap-2 mb-3">
            <img src={logo} alt="logo" className="w-12 h-12" />
            <h1 className="text-3xl font-semibold">LoGo</h1>
          </div>

          <h2 className="text-lg font-semibold">
            OTP Verification
          </h2>

          <p className="text-sm text-[#A4A4A4] mt-2 text-center">
            We sent a code to your email address. Please check <br />
            your email for the 6 digit code.
          </p>

        </div>

        {/* OTP Inputs */}

        <div
          className="flex justify-center gap-4"
          onPaste={handlePaste}
        >

          {[...Array(6)].map((_, index) => {

            const { ref, ...rest } = register(`otp${index + 1}`);

            return (
              <input
                key={index}
                maxLength={1}
                inputMode="numeric"
                pattern="[0-9]*"
                type="text"
                {...rest}
                ref={(el) => {
                  ref(el);
                  inputs.current[index] = el;
                }}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 text-center border border-[#00CE51] rounded-lg bg-transparent text-lg font-semibold"
              />
            );

          })}

        </div>

        {/* Continue Button */}

        <button
          onClick={handleSubmitOtp}
          className="btn-primary mb-2 mt-10 w-full"
        >
          Continue
        </button>

        {/* Resend */}

        <div className="text-center mt-6">

          {timer > 0 ? (

            <p className="text-[#A4A4A4] text-sm">
              Resend OTP in {timer}s
            </p>

          ) : (

            <button
              onClick={() => resendMutation.mutate({ email })}
              className="text-[#00CE51] text-sm hover:underline"
            >
              Resend OTP
            </button>

          )}

        </div>

      </div>

    </div>

  );
};

export default Otp;