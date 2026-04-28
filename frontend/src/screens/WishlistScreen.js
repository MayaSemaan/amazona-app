import { useContext } from "react";
import { Store } from "../Store";
import { Helmet } from "react-helmet-async";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import MessageBox from "../components/MessageBox";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import axios from "axios";

export default function WishlistScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    wishlist: { wishlistItems },
    cart,
  } = state;

  const removeItemHandler = (item) => {
    ctxDispatch({ type: "WISHLIST_REMOVE_ITEM", payload: item });
  };

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

  return (
    <div>
      <Helmet>
        <title>Wishlist</title>
      </Helmet>
      <h1>My Wishlist</h1>
      <Row>
        <Col md={8}>
          {wishlistItems.length === 0 ? (
            <MessageBox variant="primary">
              Wishlist is empty. <Link to="/">Add To Wishlist</Link>
            </MessageBox>
          ) : (
            <Table responsive hover className="align-middle">
              <thead>
                <tr>
                  <th></th>
                  <th>Product name</th>
                  <th>Price</th>
                  <th>Stock status</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {wishlistItems.map((item) => {
                  // dynamic stock based on cart
                  const cartItem = cart.cartItems.find(
                    (x) => x._id === item._id,
                  );

                  const remainingStock =
                    item.countInStock - (cartItem ? cartItem.quantity : 0);

                  return (
                    <tr key={item._id}>
                      <td>
                        <Button
                          variant="light"
                          onClick={() => removeItemHandler(item)}
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      </td>

                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="img-thumbnail"
                            style={{ width: "50px", height: "50px" }}
                          />
                          <Link to={`/product/${item.slug}`}>{item.name}</Link>
                        </div>
                      </td>

                      <td>${item.price}</td>

                      <td>
                        {remainingStock > 0 ? (
                          <span className="text-primary">In Stock</span>
                        ) : (
                          <span className="text-black">Out of Stock</span>
                        )}
                      </td>

                      <td>
                        {remainingStock <= 0 ? (
                          <Button variant="light" disabled>
                            Add to cart
                          </Button>
                        ) : (
                          <Button onClick={() => addToCartHandler(item)}>
                            Add to cart
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
    </div>
  );
}
