// app/components/SignUpForm.tsx
"use client";
import { WalletMinimal } from "lucide-react";
import Logo from "../../assets/images/Logo.svg";
import { ReactNode } from "react";
import { SubmitHandler } from "react-hook-form";

interface LayoutAuthProps {
  children: ReactNode;
  title: string;
  desc: string;
  submit: SubmitHandler<any>; // Use a more general type if necessary
}

// Updated the LayoutAuth component
const LayoutAuth = ({ children, title, desc, submit }: LayoutAuthProps) => {

  // Create the form handler
  // const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault(); // Prevent the default form submission
  //   const formData = new FormData(event.currentTarget); 
  //   const data: FormData = {
  //     email: formData.get("email") as string,
  //     password: formData.get("password") as string,
  //     username: formData.get("username") as string,
  //     firstName: formData.get("firstName") as string,
  //     lastName: formData.get("lastName") as string,
  //   };
  //   submit(data);
  // };

  return (
    <>
      <div className="content-center sm:flex h-dvh sm:w-screen sm:items-center sm:justify-center">
        <div className="flex flex-col items-center sm:w-96 gap-2">
          <WalletMinimal width={35} height={35}/>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-center">{desc}</p>
          <form
            className="mt-5 gap-5 w-full sm:w-96 flex-col flex"
            onSubmit={submit} // Use the custom handleSubmit
          >
            {children}
          </form>
        </div>
      </div>
    </>
  );
};

export default LayoutAuth;
