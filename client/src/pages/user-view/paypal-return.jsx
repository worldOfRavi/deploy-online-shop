import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { captureOrderPayment } from '@/store/user/order-slice';
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation, useSearchParams } from 'react-router-dom';

const PaypalReturnPage = () => {
    const dispatch  = useDispatch();
    // now we need to fetch the paymentId and payerId from the URL, we can use either of the following method
    //  method 1.
    // const [searchParams] = useSearchParams();
    // const paymentId = searchParams.get("paymentId");
    // const payerId = searchParams.get("PayerID");

    // method 2.
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const paymentId = params.get("paymentId");
    const payerId = params.get("PayerID");


    useEffect(()=>{
        if(paymentId && payerId){
            const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));
            dispatch(captureOrderPayment({paymentId, payerId, orderId})).then((data)=>{
                if(data?.payload?.success){
                    sessionStorage.removeItem("currentOrderId");
                    window.location.href = "/user/payment-success"
                }
            })}
    },[paymentId, payerId, dispatch])
    

  return (
    <Card>
        <CardHeader>
            <CardTitle>Processing Payment... Please Wait!</CardTitle>
        </CardHeader>
    </Card>
  )
}

export default PaypalReturnPage
