async function run() {
  try {
    console.log('Registering user...');
    let res = await fetch('http://localhost:8000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'testuser' + Date.now() + '@example.com',
        password: 'password123',
        phone: '1234567890'
      })
    });
    let data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Register failed');
    const token = data.token;
    console.log('Registered token:', token);

    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

    console.log('Fetching products...');
    res = await fetch('http://localhost:8000/api/products');
    data = await res.json();
    const product = data.products[0];
    console.log('Selected product:', product.name, product._id);

    console.log('Adding to cart...');
    res = await fetch('http://localhost:8000/api/cart/add', {
      method: 'POST',
      headers,
      body: JSON.stringify({ productId: product._id, quantity: 1 })
    });
    data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Add to cart failed');
    console.log('Cart items count:', data.items.length);

    console.log('Placing order...');
    const orderItems = data.items.map(item => ({
      product: item.product._id || item.product,
      name: product.name,
      image: product.image,
      price: item.price,
      quantity: item.quantity,
    }));
    
    res = await fetch('http://localhost:8000/api/orders', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        shippingAddress: {
          fullName: 'Test User',
          phone: '1234567890',
          street: '123 Test St',
          city: 'Test City',
          state: 'TS',
          pincode: '123456'
        },
        paymentMethod: 'COD',
        items: orderItems,
        totalPrice: data.totalPrice || 100
      })
    });
    data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Place order failed');
    console.log('Order placed:', data._id);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

run();
