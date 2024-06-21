import React, { useContext, useState, useEffect } from 'react';
import CartContext from '../CartContext/CartContext';
import './Cart.css';

const Cart = () => {
  const { cart, updateCart, notification, setNotification } = useContext(CartContext);
  const [isCartVisible, setIsCartVisible] = useState(false);

  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ show: false, message: '' });
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [notification, setNotification]);

  const toggleCartVisibility = () => {
    setIsCartVisible(!isCartVisible);
  };

  const handleQuantityChange = (index, type) => {
    const updatedCart = [...cart];
    let message = '';
    switch (type) {
      case 'increase':
        updatedCart[index].quantity += 1;
        message = 'Змінено кількість товару!';
        break;
      case 'decrease':
        if (updatedCart[index].quantity > 1) {
          updatedCart[index].quantity -= 1;
          message = 'Змінено кількість товару!';
        } else {
          updatedCart.splice(index, 1);
          message = 'Товар видалено з кошика!';
        }
        break;
      case 'remove':
        updatedCart.splice(index, 1);
        message = 'Товар видалено з кошика!';
        break;
      default:
        break;
    }
    updateCart(updatedCart);
    setNotification({ show: true, message });
  };

  const getTotalItemsCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getNotificationClass = (message) => {
    switch (message) {
      case 'Товар додано до кошика!':
        return 'notification-success';
      case 'Змінено кількість товару!':
        return 'notification-default';
      case 'Товар видалено з кошика!':
        return 'notification-red';
      default:
        return 'notification-default';
    }
  };

  return (
    <>
      <button className="cart-button" onClick={toggleCartVisibility}>
        <img src="cart-logo.png" alt="Cart" className="cart-logo" />
        {cart.length > 0 && <span className="cart-count">{getTotalItemsCount()}</span>}
      </button>
      {isCartVisible && (
        <div className="cart">
          <button className="close-button" onClick={toggleCartVisibility}>
            &times;
          </button>
          <h2>Кошик</h2>
          <ul>
            {cart.map((item, index) => (
              <li key={index}>
                <span>{item.name}</span>
                <span>{item.price}</span>
                <span className="quantity-controls">
                  Кількість: {item.quantity}{' '}
                  <button className="quantity-button" onClick={() => handleQuantityChange(index, 'increase')}>+</button>{' '}
                  <button className="quantity-button" onClick={() => handleQuantityChange(index, 'decrease')}>-</button>{' '}
                  <button className="remove-button" onClick={() => handleQuantityChange(index, 'remove')}>Видалити</button>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {notification.show && (
        <div className={`notification active ${getNotificationClass(notification.message)}`}>
          {notification.message}
        </div>
      )}
    </>
  );
};

export default Cart;
