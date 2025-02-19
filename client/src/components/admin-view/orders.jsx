import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import AdminOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersByAmin, getOrderDetailsByAdmin, resetAminOrdeDetails } from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";

const AdminOrders = () => {
  const [openOrderDetails, setOpenOrderDetails] = useState(false);
  const dispatch = useDispatch();
  const { orderList, orderDetails } = useSelector((state) => state.adminOrder);


  function handleOrderDetails(getOrderId){
    dispatch(getOrderDetailsByAdmin(getOrderId));
  }

  useEffect(() => {
    dispatch(getAllOrdersByAmin())
  }, [dispatch]);

  useEffect(()=>{
    if(orderDetails !== null) setOpenOrderDetails(true)
  },[orderDetails])


  return (
    <Card>
      <CardHeader>
        <CardTitle>All Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Order Price</TableHead>
              <TableHead>
                <span className="sr-only">Details</span>{" "}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList &&
              orderList.length > 0 &&
              orderList.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>{order._id}</TableCell>
                  <TableCell>{order.orderDate.split("T")[0]}</TableCell>
                  <TableCell>
                    <Badge
                      className={`py-1 px-3 ${
                        order.orderStatus === "confirmed"
                          ? "bg-green-600" :order.orderStatus === "rejected"
                          ? "bg-red-600" : order.orderStatus === "delivered"
                          ? "bg-green-600"
                          : "bg-black"
                      }`}
                    >
                      {order.orderStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>${order.totalAmount}</TableCell>
                  <TableCell>
                    <Dialog
                      open={openOrderDetails}
                      onOpenChange={() => {
                        setOpenOrderDetails(false);
                        // this function makes the orderDetails to null so that when we visit account page, order detials dialog does not popup by default.
                        dispatch(resetAminOrdeDetails());
                      }}
                    >
                      <Button 
                      onClick={() => handleOrderDetails(order._id)}
                       >
                        View Details
                      </Button>
                      <AdminOrderDetailsView order={orderDetails} />
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AdminOrders;
