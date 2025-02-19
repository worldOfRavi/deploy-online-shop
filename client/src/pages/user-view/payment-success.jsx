import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  return (
    <Card className="p-10">
      <CardHeader className="p-0">
        <CardTitle>Payment is successful...!</CardTitle>
      </CardHeader>
      <Button className="mt-5" onClick={()=>navigate("/user/account")}>View Orders</Button>
    </Card>

  );
};

export default PaymentSuccessPage;
