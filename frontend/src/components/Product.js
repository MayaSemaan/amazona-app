import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import Rating from "./Rating";
import axios from "axios";
import { useContext } from "react";
import { Store } from "../Store";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";

function Product(props) {
  const { product } = props;

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, wishlist } = state;

  const cartItem = cart.cartItems.find((x) => x._id === product._id);

  const remainingStock =
    product.countInStock - (cartItem ? cartItem.quantity : 0);

  const addToCartHandler = async (item) => {
    const existItem = cart.cartItems.find((x) => x._id === item._id);

    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(
      `https://amazona-app-78n8.onrender.com/api/products/${item._id}`,
    );
    if (data.countInStock < quantity) {
      window.alert("Sorry. Product is out of stock");
      return;
    }

    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    });

    ctxDispatch({
      type: "WISHLIST_REMOVE_ITEM",
      payload: item,
    });
  };

  const addToWishlistHandler = () => {
    const existItem = wishlist.wishlistItems.find((x) => x._id === product._id);

    if (existItem) {
      ctxDispatch({
        type: "WISHLIST_REMOVE_ITEM",
        payload: product,
      });
    } else {
      ctxDispatch({
        type: "WISHLIST_ADD_ITEM",
        payload: product,
      });
    }
  };

  const isInWishlist = wishlist.wishlistItems.find(
    (x) => x._id === product._id,
  );

  return (
    <Card>
      <Link to={`/product/${product.slug}`}>
        <img src={product.image} className="card-img-top" alt={product.name} />
      </Link>

      <Card.Body>
        <Link to={`/product/${product.slug}`}>
          <Card.Title>{product.name}</Card.Title>
        </Link>

        <Rating rating={product.rating} numReviews={product.numReviews} />

        <Card.Text>${product.price}</Card.Text>

        <div className="d-grid gap-2">
          <Row className="g-2 align-items-stretch">
            <Col>
              {remainingStock <= 0 ? (
                <Button variant="light" disabled className="w-100">
                  Out of stock
                </Button>
              ) : (
                <Button
                  onClick={() => addToCartHandler(product)}
                  className="w-100"
                  variant="primary"
                >
                  Add to cart
                </Button>
              )}
            </Col>

            <Col xs="auto">
              <Button
                onClick={() => addToWishlistHandler(product)}
                variant="light"
              >
                <i
                  className={
                    isInWishlist ? "fas fa-heart text-danger" : "far fa-heart"
                  }
                ></i>
              </Button>
            </Col>
          </Row>
        </div>
      </Card.Body>
    </Card>
  );
}
export default Product;
