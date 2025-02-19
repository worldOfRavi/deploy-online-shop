

import { Card, CardContent } from '@/components/ui/card'
import React from 'react'
import unauthorize from "../assets/401.svg"
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

const UnAuthPage = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Card className="">
        <CardContent asChild>
            <img className='w-[900px] h-[670px] mx-auto object-center m-0 p-0' src={unauthorize} alt="401 error" />
            <div className="text-center">
            <Button onClick={()=>navigate("/user/home")} className="bg-red-500">Go to Home Page</Button>
            </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default UnAuthPage

