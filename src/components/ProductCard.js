import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
//   handleAddToCart=()=>{
//  return localStorage.getItem("token")
//   }
//console.log(product)
//console.log("products in cardview",product)
  return (
    <Card className="card">
     
     <CardMedia style={{ height: "300px" }} component="img" image={product.image} alt={product.name}/>
     <CardContent>
     <Typography color="primary" variant="h5">
      {product.name}
    </Typography>
      <Typography component="legend">${product.cost}</Typography>
      <Rating name="read-only" value={product.rating} readOnly />
     
      </CardContent>
     
      <CardActions>
    
      <Button className="button" variant="contained" name="add to cart" startIcon={<AddShoppingCartOutlined />} 
      onClick={handleAddToCart}>
      ADD TO CART
      
           </Button>
           </CardActions>
    </Card>
  
   
  );
};

export default ProductCard;
