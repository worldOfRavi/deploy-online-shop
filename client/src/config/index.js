// register form elements
export const registerFormControl = [
    {
        name:"userName",
        label:"User Name",
        placeholder:"Enter your name",
        componentType:"input",
        type:"text"
    },
    {
        name:"email",
        label:"Email",
        placeholder:"Enter your email",
        componentType:"input",
        type:"email"
    },
    {
        name:"password",
        label:"Password",
        placeholder:"Enter password",
        componentType:"input",
        type:"password"
    },
]


// login form elements
export const loginFormControl = [
    {
        name:"email",
        label:"Email",
        placeholder:"Enter your email",
        componentType:"input",
        type:"email"
    },
    {
        name:"password",
        label:"Password",
        placeholder:"Enter password",
        componentType:"input",
        type:"password"
    },
]

// add product form elements

export const addProductFormElements = [
    {
        label:"Title",
        name:"title",
        componentType:"input",
        type:"text",
        placeholder:"Enter product title"
    },
    {
        label:"Description",
        name:"description",
        componentType:"textarea",
        placeholder:"Enter product description"
    },
    {
        label:"Category",
        name:"category",
        componentType:"select",
        options:[
            {id:'men', label:"Men"},
            {id:"women",label:"Women"},
            {id:"kids",label:"Kids"},
            {id:"accessories",label:"Accessories"},
            {id:"footwear",label:"Footwear"},
            
        ],
    },
    {
       label:"Brand",
        name:"brand",
        componentType:"select",
        options:[
            {id:'nike', label:"Nike"},
            {id:"addidas",label:"Addidas"},
            {id:"puma",label:"Puma"},
            {id:"levis",label:"Levis"},
            {id:"zara",label:"Zara"},
            {id:"h&m",label:"H&M"},
        ],
    },
    {
        label:"Price",
        name:"price",
        componentType:"input",
        type:"number",
        placeholder:"Enter product price"
    },
    {
        label:"Sale Price",
        name:"salePrice",
        componentType:"input",
        type:"number",
        placeholder:"Enter sale price (optional)"
    },
    {
        label:"Total Stock",
        name:"totalStock",
        componentType:"input",
        type:"number",
        placeholder:"Enter total stock"
    },

]


// User View Menu items
export const shoppingViewMenuItems = [
    {
        id:"home",
        label:"Home",
        path:"/user/home"
    },
    {
        id:"products",
        label:"Products",
        path:"/user/listing"
    },
    {
        id:"men",
        label:"Men",
        path:"/user/listing"
    },
    {
        id:"women",
        label:"Women",
        path:"/user/listing"
    },
    {
        id:"kids",
        label:"Kids",
        path:"/user/listing"
    },
    {
        id:"footwear",
        label:"Footwear",
        path:"/user/listing"
    },
    {
        id:"accessories",
        label:"Accessories",
        path:"/user/listing"
    },
    {
        id:"search",
        label:"Search",
        path:"/user/search"
    },
]


// mapping category filter
export const categoryFilterMap = {
    "men":"Men",
    "women":"Women",
    "kids":"Kids",
    "accessories":"Accessories",
    "footwear":"Footwear"
}

// mapping brand filter
export const brandFilterMap = {
    "nike":"Nike",
    "addidas":"Addidas",
    "puma":"Puma",
    "levis":"Levi's",
    "h&m":"H&M",
    "zara":"Zara"
}



// product filters options
export const filterOptions = {
    category :[
        {id:"men", label:"Men"},
        {id:"women", label:"Women"},
        {id:"kids", label:"Kids"},
        {id:"accessories", label:"Accessories"},
        {id:"footwear", label:"Footwear"},
        
    ],
    brand:[
            {id:"nike", label:"Nike"},
            {id:"addidas", label:"Addidas"},
            {id:"puma", label:"Puma"},
            {id:"levis", label:"Levi's"},
            {id:"zara", label:"Zara"},
            {id:"h&m", label:"H&N"},
    ]
}

// product sort options

export const sortOptions = [
    {id:"price-lowtohigh", label:"Price: Low to High"},
    {id:"price-hightolow", label:"Price: High to Low"},
    {id:"title-atoz", label:"Title: A to Z"},
    {id:"title-ztoa", label:"Title: Z to A"},
]

// address form control
export const addressFormControls = [
    {
      label: "Address",
      name: "address",
      componentType: "input",
      type: "text",
      placeholder: "Enter your address",
    },
    {
      label: "City",
      name: "city",
      componentType: "input",
      type: "text",
      placeholder: "Enter your city",
    },
    {
      label: "Pincode",
      name: "pincode",
      componentType: "input",
      type: "text",
      placeholder: "Enter your pincode",
    },
    {
      label: "Phone",
      name: "phone",
      componentType: "input",
      type: "text",
      placeholder: "Enter your phone number",
    },
    {
      label: "Notes",
      name: "notes",
      componentType: "textarea",
      placeholder: "Enter any additional notes",
    },
  ];