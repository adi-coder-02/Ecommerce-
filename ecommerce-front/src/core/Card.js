import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';  // Import Navigate
import ShowImage from './ShowImage';
import moment from 'moment';
import { addItem, updateItem, removeItem } from './cartHelpers';

const Card = ({
  product,
  showViewProductButton = true,
  showAddToCartButton = true,
  cartUpdate = false,
  showRemoveProductButton = false,
  setRun = () => {},  // Just use an empty function as default
  run = undefined
}) => {
  const [redirect, setRedirect] = useState(false);
  const [count, setCount] = useState(product.count || 1);  // Default to 1 if product.count is undefined

  const showViewButton = () => {
    return (
      showViewProductButton && (
        <Link to={`/product/${product._id}`} className="mr-2">
          <button className="btn btn-outline-primary mt-2 mb-2 card-btn-1">View Product</button>
        </Link>
      )
    );
  };

  const addToCart = () => {
    addItem(product, () => setRedirect(true));  // Add item and trigger redirect
  };

  const shouldRedirect = () => {
    return redirect && <Navigate to="/cart" />;  // Replace Redirect with Navigate
  };

  const showAddToCartBtn = () => {
    return (
      showAddToCartButton && (
        <button onClick={addToCart} className="btn btn-outline-warning mt-2 mb-2 card-btn-1">
          Add to cart
        </button>
      )
    );
  };

  const showStock = (quantity) => {
    return quantity > 0 ? (
      <span className="badge badge-primary badge-pill">In Stock</span>
    ) : (
      <span className="badge badge-danger badge-pill">Out of Stock</span>
    );
  };

  const handleChange = (productId) => (event) => {
    const newCount = Math.max(1, event.target.value);  // Prevent count from going below 1
    setCount(newCount);
    updateItem(productId, newCount);
    setRun(!run);  // Trigger the useEffect in the parent Cart component
  };

  const showCartUpdateOptions = () => {
    return (
      cartUpdate && (
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text">Adjust Quantity</span>
          </div>
          <input
            type="number"
            className="form-control"
            value={count}
            onChange={handleChange(product._id)}
          />
        </div>
      )
    );
  };

  const showRemoveButton = () => {
    return (
      showRemoveProductButton && (
        <button
          onClick={() => {
            removeItem(product._id);
            setRun(!run);  // Trigger the useEffect in the parent Cart component
          }}
          className="btn btn-outline-danger mt-2 mb-2"
        >
          Remove Product
        </button>
      )
    );
  };

  return (
    <div className="card">
      <div className="card-header card-header-1">{product.name}</div>
      <div className="card-body">
        {shouldRedirect()}  {/* Trigger the redirect */}
        <ShowImage item={product} url="product" />
        <p className="card-p mt-2">{product.description.substring(0, 100)}</p>
        <p className="card-p black-10">$ {product.price}</p>
        <p className="black-9">Category: {product.category && product.category.name}</p>
        <p className="black-8">Added on {moment(product.createdAt).fromNow()}</p>
        {showStock(product.quantity)}
        <br />

        {showViewButton()}

        {showAddToCartBtn()}

        {showRemoveButton()}

        {showCartUpdateOptions()}
      </div>
    </div>
  );
};

export default Card;
