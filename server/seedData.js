const bcrypt = require('bcryptjs');

const sampleMembers = [
  {
    name: 'Priya Sharma',
    email: 'priya.sharma@gmail.com',
    phone: '9840123456',
    address: { street: '42 MG Road', city: 'Bengaluru', state: 'Karnataka', pincode: '560001' },
    isAdmin: false,
  },
  {
    name: 'Rahul Verma',
    email: 'rahul.verma@gmail.com',
    phone: '9876543210',
    address: { street: '15 Anna Nagar 2nd Ave', city: 'Chennai', state: 'Tamil Nadu', pincode: '600040' },
    isAdmin: false,
  },
  {
    name: 'Ananya Iyer',
    email: 'ananya.iyer@gmail.com',
    phone: '9811223344',
    address: { street: '78 Bandra West', city: 'Mumbai', state: 'Maharashtra', pincode: '400050' },
    isAdmin: false,
  },
  {
    name: 'Karthik Rajan',
    email: 'karthik.rajan@gmail.com',
    phone: '9765432109',
    address: { street: '12 T Nagar Main St', city: 'Chennai', state: 'Tamil Nadu', pincode: '600017' },
    isAdmin: false,
  },
  {
    name: 'Sneha Patel',
    email: 'sneha.patel@gmail.com',
    phone: '9822334455',
    address: { street: '204 SG Highway', city: 'Ahmedabad', state: 'Gujarat', pincode: '380015' },
    isAdmin: false,
  },
  {
    name: 'Mohammed Faizal',
    email: 'mohammed.faizal@gmail.com',
    phone: '9944556677',
    address: { street: '89 Commercial Street', city: 'Bengaluru', state: 'Karnataka', pincode: '560042' },
    isAdmin: false,
  },
  {
    name: 'Divya Krishnan',
    email: 'divya.krishnan@gmail.com',
    phone: '9888776655',
    address: { street: '54 RS Puram', city: 'Coimbatore', state: 'Tamil Nadu', pincode: '641002' },
    isAdmin: false,
  },
  {
    name: 'Arjun Nair',
    email: 'arjun.nair@gmail.com',
    phone: '9744112233',
    address: { street: '17 Panampilly Nagar', city: 'Kochi', state: 'Kerala', pincode: '682036' },
    isAdmin: false,
  },
  {
    name: 'Pooja Hegde',
    email: 'pooja.hegde@gmail.com',
    phone: '9855667788',
    address: { street: '33 Jubilee Hills', city: 'Hyderabad', state: 'Telangana', pincode: '500033' },
    isAdmin: false,
  },
  {
    name: 'Vikram Sundaram',
    email: 'vikram.sundaram@gmail.com',
    phone: '9819283746',
    address: { street: '9 Connaught Place', city: 'New Delhi', state: 'Delhi', pincode: '110001' },
    isAdmin: false,
  },
];

async function seedMembersAndOrders(User, Product, Order) {
  try {
    const userCount = await User.countDocuments({ isAdmin: false });
    if (userCount < 10) {
      const hashedPw = await bcrypt.hash('user123', 10);
      for (const m of sampleMembers) {
        const exists = await User.findOne({ email: m.email });
        if (!exists) {
          await User.create({
            name: m.name,
            email: m.email,
            password: hashedPw,
            phone: m.phone,
            address: m.address,
            isAdmin: false,
          });
        }
      }
      console.log('✅ Seeded 10 verified customer members');
    }

    const orderCount = await Order.countDocuments();
    if (orderCount === 0) {
      const allUsers = await User.find({ isAdmin: false });
      const allProducts = await Product.find();

      if (allUsers.length > 0 && allProducts.length > 0) {
        const orderTemplates = [
          {
            userIndex: 0,
            productIndices: [1], // Ultra-Slim Laptop Pro 15"
            status: 'Delivered',
            paymentMethod: 'Card',
            daysAgo: 12,
          },
          {
            userIndex: 1,
            productIndices: [7], // Smartphone Pro Max 256GB
            status: 'Delivered',
            paymentMethod: 'UPI',
            daysAgo: 10,
          },
          {
            userIndex: 2,
            productIndices: [3, 0], // DSLR Camera + Headphones
            status: 'Delivered',
            paymentMethod: 'Card',
            daysAgo: 9,
          },
          {
            userIndex: 3,
            productIndices: [2, 4], // Smart Watch + Sneakers
            status: 'Delivered',
            paymentMethod: 'Net Banking',
            daysAgo: 7,
          },
          {
            userIndex: 4,
            productIndices: [5, 6, 8], // Leather Backpack + Sunglasses + T-Shirt
            status: 'Delivered',
            paymentMethod: 'UPI',
            daysAgo: 6,
          },
          {
            userIndex: 5,
            productIndices: [1, 9], // Laptop + Gaming Mouse
            status: 'Delivered',
            paymentMethod: 'Card',
            daysAgo: 5,
          },
          {
            userIndex: 6,
            productIndices: [7, 0], // Smartphone + Headphones
            status: 'Shipped',
            paymentMethod: 'UPI',
            daysAgo: 3,
          },
          {
            userIndex: 7,
            productIndices: [3], // DSLR Camera
            status: 'Shipped',
            paymentMethod: 'Net Banking',
            daysAgo: 2,
          },
          {
            userIndex: 8,
            productIndices: [2, 11], // Smart Watch + Yoga Mat
            status: 'Processing',
            paymentMethod: 'UPI',
            daysAgo: 1,
          },
          {
            userIndex: 9,
            productIndices: [4, 10], // Sneakers + Water Bottle
            status: 'Processing',
            paymentMethod: 'COD',
            daysAgo: 1,
          },
          {
            userIndex: 0,
            productIndices: [0, 9], // Headphones + Gaming Mouse
            status: 'Pending',
            paymentMethod: 'COD',
            daysAgo: 0,
          },
          {
            userIndex: 3,
            productIndices: [5, 6], // Backpack + Sunglasses
            status: 'Pending',
            paymentMethod: 'UPI',
            daysAgo: 0,
          },
        ];

        for (const t of orderTemplates) {
          const u = allUsers[t.userIndex % allUsers.length];
          const items = [];
          let totalPrice = 0;

          for (const pIdx of t.productIndices) {
            const p = allProducts[pIdx % allProducts.length];
            const finalPrice = Math.round(p.price * (1 - (p.discount || 0) / 100));
            items.push({
              product: p._id,
              name: p.name,
              image: p.image,
              price: finalPrice,
              quantity: 1,
            });
            totalPrice += finalPrice;
          }

          const orderDate = new Date(Date.now() - t.daysAgo * 86400000).toISOString();
          await Order.create({
            user: u._id,
            items,
            shippingAddress: {
              fullName: u.name,
              phone: u.phone || '9876543210',
              street: u.address?.street || '10 Main Street',
              city: u.address?.city || 'Chennai',
              state: u.address?.state || 'Tamil Nadu',
              pincode: u.address?.pincode || '600001',
            },
            paymentMethod: t.paymentMethod,
            totalPrice,
            status: t.status,
            isPaid: t.status === 'Delivered' || t.status === 'Shipped' || t.paymentMethod !== 'COD',
            paidAt: t.status !== 'Pending' ? orderDate : undefined,
            isDelivered: t.status === 'Delivered',
            deliveredAt: t.status === 'Delivered' ? orderDate : undefined,
            createdAt: orderDate,
            updatedAt: orderDate,
          });
        }
        console.log(`✅ Seeded ${orderTemplates.length} realistic customer orders`);
      }
    }
  } catch (err) {
    console.error('Seed members/orders error:', err.message);
  }
}

module.exports = { sampleMembers, seedMembersAndOrders };

