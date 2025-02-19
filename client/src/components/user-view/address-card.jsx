import React from 'react'
import { Card, CardContent, CardFooter } from '../ui/card'
import { Label } from '../ui/label'
import { Button } from '../ui/button'

const AddressCard = ({addressInfo, deleteAddress,editAddress, setAddressInfo, selectedAddress, setSelectedAddress}) => {
  return (
   <Card  className={`cursor-pointer ${selectedAddress === addressInfo?._id ? "border-[2px] border-red-500" : "border-[2px] border-black"}`} onClick={()=>{
    setAddressInfo(addressInfo);
    setSelectedAddress(addressInfo?._id)
   }}>
        <CardContent className = "grid p-4 gap-4">
        <Label>Address: {addressInfo?.address}</Label>
        <Label>city: {addressInfo?.city}</Label>
        <Label>pincode: {addressInfo?.pincode}</Label>
        <Label>phone: {addressInfo?.pincode}</Label>
        <Label>notes: {addressInfo?.notes}</Label>
        </CardContent>
        <CardFooter className="flex justify-between mt-2">
            <Button onClick = {()=>editAddress(addressInfo)}>Edit</Button>
            <Button onClick={()=>deleteAddress(addressInfo)}>Delete</Button>
        </CardFooter>
   </Card>
  )
}

export default AddressCard
