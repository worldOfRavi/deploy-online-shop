import { LogOut, Menu, ShoppingCart, UserCog } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewMenuItems } from "@/config";
import appLogo from "../../assets/logo.jpg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { authLogout } from "@/store/auth-slice";
import UserCartWrapper from "@/pages/user-view/cart-wrapper";
import { fetchCartItems } from "@/store/user/cart-slice";
import { Label } from "../ui/label";

// function to create menu items
function MenuItems() {
  const navigate = useNavigate();

  /*
  state give the current url location from which I could get the pathname.
  */
  const location = useLocation();
  /*
get the url of the page from which I could extract the category or any parameter using searchParams and 
using setSearchParams I can change the url 
*/
  const [searchParams, setSearchParams] = useSearchParams();

  function handleNavigation(getCurrentMenuItem) {
    /*
here the logic is, when we click on any nav button it will navigate us to listig page, but what we need here is to get the product according to the category,
so for that we use location to get the pathname, If the location includes listing already, and the filter is not null means it could be men, women or something, then we have to change the url seachParams, for that we can use useSearchParams hook which gives a state searchParams which contains the search parameters and setSearchParams could be used to change the url.
location.pathname.includes("listing") && currentFilters !== null
      ? setSearchParams(`?category=${getCurrentMenuItem.id}`)
      : navigate(getCurrentMenuItem.path);
      in above line of code, location.pathname inludes listing and currentFilters is not null then It should go to listing page with some particular category which is received by this function which is used to change the url seach param as setSearchParams(`?category=${getCurrentMenuItem.id}`)

      it only change the url, which is used lising page refer it for more logic.
*/
    sessionStorage.removeItem("filters");
    const currentFilters =
      getCurrentMenuItem.id !== "home" && getCurrentMenuItem.id !== "products" && getCurrentMenuItem.id !== "search"
        ? { category: [getCurrentMenuItem.id] }
        : null;
    sessionStorage.setItem("filters", JSON.stringify(currentFilters));
    location.pathname.includes("listing") && currentFilters !== null
      ? setSearchParams(`?category=${getCurrentMenuItem.id}`)
      : navigate(getCurrentMenuItem.path);
  }
  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {shoppingViewMenuItems.map((menuItem) => (
        <Label
          onClick={() => handleNavigation(menuItem)}
          className="text-sm font-medium cursor-pointer"
          key={menuItem.id}
        >
          {menuItem.label}
        </Label>
      ))}
    </nav>
  );
}

// function to render header right content
function HeaderRightContent() {
  const { user } = useSelector((state) => state.authReducer);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const { cartItems } = useSelector((state) => state.cartSlice);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    if (user && user.id) {
      dispatch(fetchCartItems(user?.id));
    }
  }, [user, dispatch]);
  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setOpenCartSheet(true)}
          className="relative"
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="sr-only">User cart</span>
          <span className="absolute top-[-1px] right-[4px] font-bold">{cartItems?.length > 0 ? cartItems?.length : null}</span>
        </Button>
        {/* UsercartWrapper component contains all the cart item */}
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={cartItems}
        />
      </Sheet>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-black cursor-pointer">
            {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
            <AvatarFallback className="bg-black text-white font-extrabold">
              {user?.userName[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" className="w-56">
          <DropdownMenuLabel>Logged in as {user?.userName}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/user/account")}>
            <UserCog className="mr-2 h-4 w-4 " />
            Account
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => dispatch(authLogout())}>
            <LogOut className="mr-2 h-4 w-4 " />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

const UserHeader = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/user/home" className="flex items-center gap-2">
          <img
            src={appLogo}
            alt="logo"
            className="w-[65px] h-[62px] rounded-full"
          />
          <span className="font-bold">Ecommerce</span>
        </Link>
        {/* this sheet content will be visisble only on small devices */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="w-6 h-6" />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full max-w-xs">
            <MenuItems />
            <HeaderRightContent />
          </SheetContent>
        </Sheet>
        <div className="hidden lg:block">
          <MenuItems />
        </div>
        {/* render right side content of the header */}
        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
};

export default UserHeader;
