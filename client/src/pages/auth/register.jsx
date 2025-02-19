import CommonForm from '@/components/common/form';
import { registerFormControl } from '@/config';
import { useToast } from '@/hooks/use-toast';
import { registerUser } from '@/store/auth-slice';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'

const initialState = {
  userName : "",
  email : "",
  password : ""
};
const Register = () => {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {toast} = useToast();

  function onSubmit(event){
    event.preventDefault();
    // dispatch(registerUser(formData))
      dispatch(registerUser(formData)).then((data)=>{
      if(data?.payload?.success){
        toast({
          title: data?.payload?.message
        })
        navigate("/auth/login")
      }
      else{
        toast({
          title:data?.payload?.message,
          variant:"destructive"
        })
      }
    })
    
  }
  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Create new account</h1>
        <p>Aleady have an account 
        <Link className='font-medium ml-2 text-primary hover:underline ' to = "/auth/login">Login</Link>
        </p>
        
      </div>
      <CommonForm 
      formControls={registerFormControl}
      buttonText={"Sign up"}
      formData={formData}
      setFormData={setFormData}
      onSubmit={onSubmit}
      />
    </div>
  )
}

export default Register
