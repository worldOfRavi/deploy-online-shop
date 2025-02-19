import React, { useEffect, useState } from "react";
import CommonForm from "../common/form";
import { addressFormControls } from "@/config";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useDispatch, useSelector } from "react-redux";
import { addNewAddress, deleteAddress, fetchAllAddresses, UpdateAddress } from "@/store/user/address-slice";
import AddressCard from "./address-card";
import { useToast } from "@/hooks/use-toast";

// initial form data
const initialFomData = {
  address: "",
  city: "",
  pincode: "",
  phone: "",
  notes: "",
};

const Address = ({setAddressInfo, selectedAddress, setSelectedAddress}) => {
  const [formData, setFormData] = useState(initialFomData);
  const { user } = useSelector((state) => state.authReducer);
  const { addressList } = useSelector((state) => state.addressSlice);
  // state to hold the address which is going to be updated
  const [currentEditAddress, setCurrentEditAddress] = useState(null);

  const {toast}  =  useToast();

  const dispatch = useDispatch();

  // function to handle the form submission while adding new address and editing the address
  const handleOnSubmit = (e) => {
    e.preventDefault();

    if(addressList.length >= 3 && currentEditAddress === null){
      setFormData(initialFomData)
      toast({
        variant :"destructive",
          title:"You cannot add more than three addresses!"
        })
      return 
    }

    currentEditAddress !== null ? 
    dispatch(UpdateAddress({userId:user?.id, addressId: currentEditAddress, formData})).then((data)=>{
      if(data?.payload?.success){
        dispatch(fetchAllAddresses(user?.id));
        setFormData(initialFomData);
        setCurrentEditAddress(null)
        toast({
          title:"Address updated successfully"
        })
      }
    })

    :dispatch(
      addNewAddress({
        ...formData,
        userId: user?.id,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllAddresses(user?.id));
        setFormData(initialFomData);
        toast({
          title:"Address added successfully"
        })
      }
    });
  };

  // function to handle address deletion
  function handleDeleteAddress(currentAddress){
    
    dispatch(deleteAddress({userId:user?.id, addressId : currentAddress._id})).then(data=>{
      if(data?.payload?.success){
        dispatch(fetchAllAddresses(user?.id));
        toast({
          title:"Address deleted successfully"
        })
      }
    })
  }

// function to to edit the address
function editAddress(currentAddress){
setCurrentEditAddress(currentAddress._id);
setFormData({
  ...formData,
  address: currentAddress.address,
  city: currentAddress.city,
  pincode: currentAddress.pincode,
  phone: currentAddress.phone,
  notes: currentAddress.notes,
})

// rest of the condition will be handled in form submission function.
}

  // fetch the list list on the page relaod;
  useEffect(() => {
    dispatch(fetchAllAddresses(user?.id));
  }, [dispatch]);

  // function to check every input is filled
  function isFormValid() {
    return Object.keys(formData) // return the array of keys of formDat
      .map((key) => formData[key].trim() !== "") // return the results of the condition formData[key] !== "", basically it returns array of [true or false].
      .every((item) => item); // it returns the combined value, either treu if all the conditions gets satisfied or else false.

    // basically is it returns true that means are fields are filled. so while passing it to commanForm component we need to pass negetation.
  }

  return (
    <Card>
      <div className="mb-5 p-3 gap-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {addressList && addressList.length > 0
          ? addressList.map((currentAddress) => (
              <AddressCard
                key={currentAddress._id}
                addressInfo={currentAddress}
                deleteAddress={handleDeleteAddress}
                editAddress={editAddress}
                setAddressInfo = {setAddressInfo}
                 selectedAddress = {selectedAddress}
                setSelectedAddress = {setSelectedAddress}
              />
            ))
          : null}
      </div>

      <CardHeader>
        <CardTitle>{currentEditAddress === null ? "Add New Address" : "Edit Address" }</CardTitle>
      </CardHeader>
      <CardContent className="y-4">
        <CommonForm
          formControls={addressFormControls}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleOnSubmit}
          buttonText={currentEditAddress !==null ? "Edit" : "Add"}
          isButtonDisabled={!isFormValid()}
        />
      </CardContent>
    </Card>
  );
};

export default Address;
