import React from "react";
import { Button } from "../ui/button";
import { AlignJustify, LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { authLogout, resetTokenAndCredentials } from "@/store/auth-slice";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const AdminHeader = ({ setOpen }) => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();

  function handleLogout() {
    //   dispatch(authLogout()).then((data) => {
    //   // console.log(data?.payload)
    //   if (data?.payload?.success) {
    //     toast({
    //       title: data?.payload?.message,
    //     });
    //     navigate("/auth/login");
    //   } else {
    //     toast({
    //       title: "Something went wrong...!",
    //       variant: "destructive",
    //     });
    //   }
    // });
    dispatch(resetTokenAndCredentials());
    sessionStorage.clear();
    navigate("/auth/login");
  }

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background border-b">
      <Button onClick={() => setOpen(true)} className="lg:hidden sm:block">
        <AlignJustify />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      <div className="flex flex-1 justify-end">
        <Button
          className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow"
          onClick={handleLogout}
        >
          <LogOut />
          Logout
        </Button>
      </div>
    </header>
  );
};

export default AdminHeader;
