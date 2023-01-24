import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
  Typography
} from "@mui/material";
import {Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard.js"
import Cart,{generateCartItemsFrom} from "./Cart.js"
// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */


const Products = () => {
  
const[product,setproducts]=useState([])
const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setisLoading] = useState(false);  
const[isloggedin,setisloggedin]=useState(false);
  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
 
 useEffect(() => {
  performAPICall();
  if(localStorage.getItem("token")){
  //console.log("yes")
    setisloggedin(localStorage.getItem("token"))
  fetchCart(localStorage.getItem("token"));
  }
 },[])
 //console.log(localStorage.getItem("token"))

const performAPICall = async () => {
  const url=`${config.endpoint}/products`
  setisLoading(true);
  try {
    const res = await axios.get(url);
    let data=res.data
  //  console.log(data);
    setproducts(data)
  } catch (e) {
    enqueueSnackbar("Something went wrong. Check that the backend is running, reachable and returns valid JSON.", {variant: 'error'})
  }
  setisLoading(false);
}
 
  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const [searchKey, setSearchKey] = React.useState("");
  const performSearch = async (text) => {
    let value=[];
    setSearchKey(text);
    try {
      const res = await axios.get(`${config.endpoint}/products/search?value=${text}`);
      value=res.data  
      const filteredData = value.filter((item) => {
      return Object.values(item).join('').toLowerCase().includes(searchKey.toLowerCase())
       })
    
    setproducts(filteredData)
    
    } catch (error) {
      if (error.response.data) {
       setproducts(error.response.data)
      }
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
   // console.log(event)
   let targetvalue=event.target.value;
    if(debounceTimeout){
      clearTimeout(debounceTimeout)
    }
    debounceTimeout=setTimeout(()=>performSearch(targetvalue),500)
    
  };


  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const [cartProduct,setcartProduct]=useState([]);
  
  const fetchCart = async (token) => {
    if (!token) return;
    let url=`${config.endpoint}/cart`
   
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      try {
        const res = await axios.get(url,{
          headers:{
            Authorization: `Bearer ${token}` 
          }
        });
        let data=res.data
       //console.log(data);
        setcartProduct(data)
       
          //console.log("cart product in product",cartProduct)
        return cartProduct;
        
      } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }

  };


  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    return items.some(function(el) {
      return el.productId === productId;
    }); 
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {

 
    if(!token){
      enqueueSnackbar("Login to add an item to the Cart", { variant: "warning" });
    }
    else{
      //if(options===true){
      if(options===true && isItemInCart(items,productId)){
        enqueueSnackbar("Item already in cart. Use the cart sidebar to update quantity or remove item.", { variant: "warning" });
        
      }
     //}
      else{
      const headers={
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
      const productval={
        productId:productId,
        qty:qty
      }
      
       const res = await axios.post(`${config.endpoint}/cart`,productval,{headers})
       let responsedata=res.data
       
      let index=responsedata.findIndex((element)=>{
         return element.productId===productId
        });
     
       if(index===-1){
           responsedata.push({productId:productId ,qty:qty})
          }
         if(qty===0){
        responsedata.splice(index,1);
         }
         else{
            responsedata[index].qty = qty;
         }
   
     setcartProduct(responsedata)
     }
  }

 }


return (
    <div>
      <Header children={true} debounceSearch={debounceSearch}>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        
      </Header>

      {/* Search view for mobiles */}
     
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={debounceSearch}
      />
      <Grid container spacing={2} flexWrap="nowrap" sx={{ flexDirection: { xs: "column", md: "row"} }}>
     
      
        <Grid item  md={isloggedin ? 9 : 12}>
        
      <Grid container>
         <Grid item className="product-grid">
           <Box className="hero">
             <p className="hero-heading">
               India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
               to your door step
             </p>
           </Box>
         </Grid>
         
       </Grid>
       {isLoading?  (
           <Grid container spacing={0}
           direction="column"
           alignItems="center"
           justify="center"
           sx={{ mt: 6 }}
           >
             <Grid item style={{height: '300px'}}>      
                 <CircularProgress
          justify="center">
          
          </CircularProgress >
          <Typography justify="center">Loading Products</Typography>
          </Grid>

      </Grid>
        ):(
          <Grid container spacing={0}
direction="column"
alignItems="center"
justify="center">
  {product.length===0?
  (
    <Grid container direction="row"
    alignItems="center"
    justifyContent="center">
    <Grid item style={{height: '300px'}} sx={{ mt: 5 }}  alignItems="center" justifyContent="center">
    <SentimentDissatisfied justify = "center" >
    </SentimentDissatisfied>
    </Grid>
    <Grid item style={{height: '300px'}} sx={{ mt: 5 }}  alignItems="center" justifyContent="center">
     <Typography  variant="h6" align="center">No products found</Typography>
     </Grid>
     </Grid>
  ):(
              <Grid container spacing={2} sx={{m:2}}>
              {product.map((products,index) => (
      <Grid item xs={6} md={3} key={products["_id"]}>
     <ProductCard product={products} handleAddToCart={()=>{
        
       addToCart(localStorage.getItem("token"),cartProduct,product,products._id,1,true)
       }}>

       </ProductCard>
      
     </Grid>
     ))}
            </Grid>
             )}


             </Grid>
           
        )}
     
     </Grid>
     
      <Grid item  md={isloggedin ? 3 : 0}>
           {isloggedin &&
           
            <Cart products={product} items={generateCartItemsFrom(cartProduct,product)} handleQuantity={addToCart}>
              
            </Cart>
           
        }
        </Grid> 
     

     </Grid>
        
      <Footer />

    </div>
  );
};

export default Products;
