import { BadgeCheck, ChartNoAxesCombined, LayoutDashboard, ShoppingBasket } from 'lucide-react'
import React, { Fragment } from 'react'
import { useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';

const adminSidebarMenuItems = [
  {
    id:'dashboard',
    label:"Dashboard",
    path:"/admin/dashboard",
    icon: <LayoutDashboard />
  },
  {
    id:'products',
    label:"Products",
    path:"/admin/products",
    icon: <ShoppingBasket />
  },
  {
    id:'orders',
    label:"Orders",
    path:"/admin/orders",
    icon: <BadgeCheck />
  }
];

const MenuItems = ({setOpen}) =>{
  
  const navigate = useNavigate();
  return <nav className='flex mt-8 flex-col gap-2'>
{
  adminSidebarMenuItems.map(menuItem=><div onClick={()=>{
    navigate(menuItem.path);
    setOpen ? setOpen(false) : null

  }}  key={menuItem.id} className='flex items-center gap-2 rounded-md px-3 py-2 cursor-pointer text-muted-foreground hover:bg-muted hover:text-foreground'>
{menuItem.icon}
<span>{menuItem.label}</span>
  </div>)
}
  </nav>
}


const Adminsidebar = ({open, setOpen}) => {
  const navigate = useNavigate();
  return (
   <Fragment>
   <Sheet open={open} onOpenChange={setOpen}>
   <SheetContent side="left" className="w-64">
    <div className="flex flex-col h-full">
      <SheetHeader className="border-b" onClick={()=>{
        navigate("/admin/dashboard");
        setOpen ? setOpen(false) : null;
      }}>
      <SheetTitle className="flex gap-2 mt-5 mb-4"><ChartNoAxesCombined size={30} /><h1 className='text-2xl font-extrabold'>Admin Panel</h1></SheetTitle>
      </SheetHeader>
      <MenuItems setOpen = {setOpen} />
    </div>
   </SheetContent>

   </Sheet>
    <aside className='hidden w-64 flex-col border-r bg-background p-6 lg:flex'>
      <div onClick={()=>navigate("/admin/dashboard")} className="flex items-center gap-2 cursor-pointer">
        <ChartNoAxesCombined size={20} />
        <h1 className='text-2xl font-extrabold'>Admin Panel</h1>
      </div>
      <MenuItems />
    </aside>
   </Fragment>
  )
}

export default Adminsidebar
