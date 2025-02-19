import { Card, CardContent } from '@/components/ui/card'
import React from 'react'
import notFound from "../../assets/404.svg"
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Card>
        <CardContent asChild>
            <img className='w-[90%] mx-auto object-cover' src={notFound} alt="404 error" />
            <div className="text-center">
            <Button onClick={()=>navigate("/user/home")} className="bg-red-500">Go to Home Page</Button>
            </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default NotFound
