import paypal from "paypal-rest-sdk";

paypal.configure({
    mode:"sandbox",
    client_id:process.env.Paypal_Client_Id,
    client_secret : process.env.Paypal_Secret_Key
})

export default paypal;