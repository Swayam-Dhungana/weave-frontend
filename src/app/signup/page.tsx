"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { FaEnvelope, FaLock, FaUser, FaEye } from "react-icons/fa";
import { Button } from "@/components/ui/button";

const signUpSchema = z.object({
  fullName: z.string().min(1, "Name cannot be empty"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function Signup() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit: SubmitHandler<SignUpFormData> = async (data) => {
    setLoading(true);
    setErrorMessage("");

    try {
      await axios.post(
        "http://localhost:3000/api/v1/user/signUp",
        {
          fullName: data.fullName,
          email: data.email,
          password: data.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          withCredentials: true,
        }
      );
      router.push("/verification");
    } catch (error: any) {
      setErrorMessage(error.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden star-background bg-black">
      {/* Blurred Background Elements */}
      <div className="absolute top-[-100px] left-[-100px] w-72 h-72 bg-[hsla(28,97%,46%,0.4)] rounded-full blur-[100px] " />
      <div className="absolute bottom-[-100px] right-[-100px] w-72 h-72 bg-[hsla(28,97%,46%,0.4)] rounded-full blur-[100px]" />
      {/* Signup Form Container */}
      <div className="bg-[hsla(229,41%,11%,0.4)] backdrop-blur-lg shadow-lg flex flex-col items-center py-12 px-8 w-96 rounded-2xl">
        <h1 className="text-3xl text-[#E76F04] mb-6">Sign Up</h1>

        {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="w-[80%]">
          {/* Name Input */}
          <div className="flex items-center w-full mb-4 border-b border-[#E76F04]">
            <input 
              {...register("fullName")} 
              placeholder="Full Name"
              className="bg-transparent outline-none flex-1 text-sm pl-3 text-white placeholder:text-[#E76F04]"
            />
            <FaUser className="text-[#E76F04]" />
          </div>
          <p className="text-red-500 text-xs">{errors.fullName?.message}</p>

          {/* Email Input */}
          <div className="flex items-center w-full mb-4 border-b border-[#E76F04]">
            <input 
              {...register("email")}
              placeholder="Email"
              className="bg-transparent outline-none flex-1 text-sm pl-3 text-white placeholder:text-[#E76F04]"
            />
            <FaEnvelope className="text-[#E76F04]" />
          </div>
          <p className="text-red-500 text-xs">{errors.email?.message}</p>

          {/* Password Input */}
          <div className="flex items-center w-full mb-4 border-b border-[#E76F04]">
            <input 
              {...register("password")} 
              type="password" 
              placeholder="Password"
              className="bg-transparent outline-none flex-1 text-sm pl-3 text-white placeholder:text-[#E76F04]"
            />
            <FaEye className="text-[#E76F04]" />
          </div>
          <p className="text-red-500 text-xs">{errors.password?.message}</p>

          {/* Confirm Password Input */}
          <div className="flex items-center w-full mb-4 border-b border-[#E76F04]">
            <input 
              {...register("confirmPassword")} 
              type="password" 
              placeholder="Confirm Password"
              className="bg-transparent outline-none flex-1 text-sm pl-3 text-white placeholder:text-[#E76F04]"
            />
            <FaEye className="text-[#E76F04]" />
          </div>
          <p className="text-red-500 text-xs">{errors.confirmPassword?.message}</p>

          {/* Terms and Conditions */}
          <div className="flex mb-4 justify-center" >  
            <input type="checkbox"  required className="accent-[#E76F04]"/>
            <p className="text-[#E76F04] text-[10px] tracking-wider pl-2">I agree with terms and conditions</p>
          </div>

          {/* Sign Up Button */}
          <Button type="submit" className="w-full bg-[#E76F04] text-black hover:opacity-90 transition" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </Button>
        </form>

        {/* Login Link */}
        <p className="text-gray-400 mt-4 text-xs">
          Already have an account? <a href="/login" className="text-[#E76F04] hover:underline">Log In</a>
        </p>
      </div>

      {/* Help Text at the Bottom */}
      <p className="absolute bottom-4 text-gray-500 text-xs">
        Having trouble signing up? Contact us at xxx
      </p>
    </div>
  );
}