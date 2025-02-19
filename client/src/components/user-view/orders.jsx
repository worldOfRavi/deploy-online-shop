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
import UserOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersByUser,
  getOrderDetails,
  resetOrderDetails,
} from "@/store/user/order-slice";
import { Badge } from "../ui/badge";

const UserOrders = () => {
  const [openOrderDetails, setOpenOrderDetails] = useState(false);
  const { user } = useSelector((state) => state.authReducer);
  const { orderList, orderDetails } = useSelector((state) => state.orderSlice);
  const dispatch = useDispatch();

  // when we visit page for fist time or when the page gets refreshed, need to fetch the orderList
  useEffect(() => {
    dispatch(getAllOrdersByUser(user?.id));
  }, [user, dispatch]);

  // onClick of view details button call this function to fetch the order details and also need to display the data for that need to set the toggle button to true, for that use Effect with orderDetails dependency, so that on every change it is show the new order details
  const handleOrderDetails = (getId) => {
    dispatch(getOrderDetails(getId));
  };

  // when ever the view details button is clicked, orderDetails will be changed and need to render new data.
  useEffect(() => {
    if (orderDetails !== null) setOpenOrderDetails(true);
  }, [orderDetails]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
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
                        order?.orderStatus === "confirmed"
                          ? "bg-green-600"
                          : order?.orderStatus === "delivered"
                          ? "bg-green-600"
                          : order?.orderStatus === "rejected"
                          ? "bg-red-600"
                          : "bg-black"
                      }`}
                    >
                      {order?.orderStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>${order.totalAmount}</TableCell>
                  <TableCell>
                    <Dialog
                      open={openOrderDetails}
                      onOpenChange={() => {
                        setOpenOrderDetails(false);
                        // this function makes the orderDetails to null so that when we visit account page, order detials dialog does not popup by default.
                        dispatch(resetOrderDetails());
                      }}
                    >
                      <Button onClick={() => handleOrderDetails(order._id)}>
                        View Details
                      </Button>
                      <UserOrderDetailsView order={orderDetails} />
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

export default UserOrders;
