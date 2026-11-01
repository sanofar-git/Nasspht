const bcrypt = require('bcryptjs');

const sampleMembers = [
  { name: 'Priya Sharma', email: 'priya.sharma@gmail.com', phone: '9840123456', address: { street: '42 MG Road', city: 'Bengaluru', state: 'Karnataka', pincode: '560001' }, isAdmin: false },
  { name: 'Rahul Verma', email: 'rahul.verma@gmail.com', phone: '9876543210', address: { street: '15 Anna Nagar 2nd Ave', city: 'Chennai', state: 'Tamil Nadu', pincode: '600040' }, isAdmin: false },
  { name: 'Ananya Iyer', email: 'ananya.iyer@gmail.com', phone: '9811223344', address: { street: '78 Bandra West', city: 'Mumbai', state: 'Maharashtra', pincode: '400050' }, isAdmin: false },
  { name: 'Karthik Rajan', email: 'karthik.rajan@gmail.com', phone: '9765432109', address: { street: '12 T Nagar Main St', city: 'Chennai', state: 'Tamil Nadu', pincode: '600017' }, isAdmin: false },
  { name: 'Sneha Patel', email: 'sneha.patel@gmail.com', phone: '9822334455', address: { street: '204 SG Highway', city: 'Ahmedabad', state: 'Gujarat', pincode: '380015' }, isAdmin: false },
  { name: 'Mohammed Faizal', email: 'mohammed.faizal@gmail.com', phone: '9944556677', address: { street: '89 Commercial Street', city: 'Bengaluru', state: 'Karnataka', pincode: '560042' }, isAdmin: false },
  { name: 'Divya Krishnan', email: 'divya.krishnan@gmail.com', phone: '9888776655', address: { street: '54 RS Puram', city: 'Coimbatore', state: 'Tamil Nadu', pincode: '641002' }, isAdmin: false },
  { name: 'Arjun Nair', email: 'arjun.nair@gmail.com', phone: '9744112233', address: { street: '17 Panampilly Nagar', city: 'Kochi', state: 'Kerala', pincode: '682036' }, isAdmin: false },
  { name: 'Pooja Hegde', email: 'pooja.hegde@gmail.com', phone: '9855667788', address: { street: '33 Jubilee Hills', city: 'Hyderabad', state: 'Telangana', pincode: '500033' }, isAdmin: false },
  { name: 'Vikram Sundaram', email: 'vikram.sundaram@gmail.com', phone: '9819283746', address: { street: '9 Connaught Place', city: 'New Delhi', state: 'Delhi', pincode: '110001' }, isAdmin: false },
  { name: 'Rajesh Kumar', email: 'rajesh.kumar@gmail.com', phone: '9820192837', address: { street: '102 Velachery Main Rd', city: 'Chennai', state: 'Tamil Nadu', pincode: '600042' }, isAdmin: false },
  { name: 'Meera Nambiar', email: 'meera.nambiar@gmail.com', phone: '9845123987', address: { street: '28 Indiranagar 100ft Rd', city: 'Bengaluru', state: 'Karnataka', pincode: '560038' }, isAdmin: false },
  { name: 'Sanjay Gupta', email: 'sanjay.gupta@gmail.com', phone: '9810293847', address: { street: '45 Park Street', city: 'Kolkata', state: 'West Bengal', pincode: '700016' }, isAdmin: false },
  { name: 'Kavitha Raman', email: 'kavitha.raman@gmail.com', phone: '9833445566', address: { street: '61 Besant Nagar', city: 'Chennai', state: 'Tamil Nadu', pincode: '600090' }, isAdmin: false },
  { name: 'Deepak Joshi', email: 'deepak.joshi@gmail.com', phone: '9871234560', address: { street: '19 FC Road', city: 'Pune', state: 'Maharashtra', pincode: '411004' }, isAdmin: false },
  { name: 'Shalini Menon', email: 'shalini.menon@gmail.com', phone: '9847120934', address: { street: '83 Marine Drive', city: 'Kochi', state: 'Kerala', pincode: '682011' }, isAdmin: false },
  { name: 'Harish Reddy', email: 'harish.reddy@gmail.com', phone: '9988771122', address: { street: '12 Banjara Hills Rd 10', city: 'Hyderabad', state: 'Telangana', pincode: '500034' }, isAdmin: false },
  { name: 'Swati Deshmukh', email: 'swati.deshmukh@gmail.com', phone: '9890123456', address: { street: '7 Aundh Road', city: 'Pune', state: 'Maharashtra', pincode: '411007' }, isAdmin: false },
  { name: 'Naveen Prakash', email: 'naveen.prakash@gmail.com', phone: '9844001122', address: { street: '91 Koramangala 4th Block', city: 'Bengaluru', state: 'Karnataka', pincode: '560034' }, isAdmin: false },
  { name: 'Aishwarya Rao', email: 'aishwarya.rao@gmail.com', phone: '9821345678', address: { street: '30 Jayanagar 4th Block', city: 'Bengaluru', state: 'Karnataka', pincode: '560011' }, isAdmin: false },
];

async function seedMembersAndOrders(User, Product, Order, forceRefresh = false) {
  try {
    const userCount = await User.countDocuments({ isAdmin: false });
    if (userCount < 20 || forceRefresh) {
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
      console.log('✅ Seeded 20 verified customer members');
    }

    const orderCount = await Order.countDocuments();
    if (orderCount < 30 || forceRefresh) {
      const allUsers = await User.find({ isAdmin: false });
      const allProducts = await Product.find();

      if (allUsers.length > 0 && allProducts.length > 0) {
        const orderTemplates = [
          // Delivered high-value orders
          { userIndex: 0, productIndices: [1], status: 'Delivered', paymentMethod: 'Card', daysAgo: 30 },
          { userIndex: 1, productIndices: [7], status: 'Delivered', paymentMethod: 'UPI', daysAgo: 29 },
          { userIndex: 2, productIndices: [3, 0], status: 'Delivered', paymentMethod: 'Card', daysAgo: 28 },
          { userIndex: 3, productIndices: [2, 4], status: 'Delivered', paymentMethod: 'Net Banking', daysAgo: 27 },
          { userIndex: 4, productIndices: [5, 6, 8], status: 'Delivered', paymentMethod: 'UPI', daysAgo: 26 },
          { userIndex: 5, productIndices: [1, 9], status: 'Delivered', paymentMethod: 'Card', daysAgo: 25 },
          { userIndex: 6, productIndices: [7, 0], status: 'Delivered', paymentMethod: 'UPI', daysAgo: 24 },
          { userIndex: 7, productIndices: [3], status: 'Delivered', paymentMethod: 'Net Banking', daysAgo: 23 },
          { userIndex: 8, productIndices: [1], status: 'Delivered', paymentMethod: 'Card', daysAgo: 22 },
          { userIndex: 9, productIndices: [7, 2], status: 'Delivered', paymentMethod: 'UPI', daysAgo: 21 },
          { userIndex: 10, productIndices: [1, 3], status: 'Delivered', paymentMethod: 'Card', daysAgo: 20 },
          { userIndex: 11, productIndices: [7, 4], status: 'Delivered', paymentMethod: 'UPI', daysAgo: 19 },
          { userIndex: 12, productIndices: [3, 0, 9], status: 'Delivered', paymentMethod: 'Net Banking', daysAgo: 18 },
          { userIndex: 13, productIndices: [1], status: 'Delivered', paymentMethod: 'Card', daysAgo: 17 },
          { userIndex: 14, productIndices: [7, 5], status: 'Delivered', paymentMethod: 'UPI', daysAgo: 16 },
          { userIndex: 15, productIndices: [2, 4, 11], status: 'Delivered', paymentMethod: 'Card', daysAgo: 15 },
          { userIndex: 16, productIndices: [3, 1], status: 'Delivered', paymentMethod: 'Net Banking', daysAgo: 14 },
          { userIndex: 17, productIndices: [7, 0], status: 'Delivered', paymentMethod: 'UPI', daysAgo: 13 },
          { userIndex: 18, productIndices: [1, 2], status: 'Delivered', paymentMethod: 'Card', daysAgo: 12 },
          { userIndex: 19, productIndices: [3, 6], status: 'Delivered', paymentMethod: 'UPI', daysAgo: 11 },

          // Confirmed orders
          { userIndex: 0, productIndices: [1, 7], status: 'Confirmed', paymentMethod: 'Card', daysAgo: 10 },
          { userIndex: 1, productIndices: [3], status: 'Confirmed', paymentMethod: 'UPI', daysAgo: 9 },
          { userIndex: 2, productIndices: [2, 4], status: 'Confirmed', paymentMethod: 'Net Banking', daysAgo: 8 },
          { userIndex: 3, productIndices: [7, 0], status: 'Confirmed', paymentMethod: 'UPI', daysAgo: 7 },
          { userIndex: 4, productIndices: [1], status: 'Confirmed', paymentMethod: 'Card', daysAgo: 6 },
          { userIndex: 5, productIndices: [3, 9], status: 'Confirmed', paymentMethod: 'Net Banking', daysAgo: 5 },

          // Shipped orders
          { userIndex: 6, productIndices: [7, 2], status: 'Shipped', paymentMethod: 'UPI', daysAgo: 4 },
          { userIndex: 7, productIndices: [1], status: 'Shipped', paymentMethod: 'Card', daysAgo: 4 },
          { userIndex: 8, productIndices: [3, 5], status: 'Shipped', paymentMethod: 'Net Banking', daysAgo: 3 },
          { userIndex: 9, productIndices: [4, 6, 8], status: 'Shipped', paymentMethod: 'UPI', daysAgo: 3 },

          // Processing orders
          { userIndex: 10, productIndices: [2, 11], status: 'Processing', paymentMethod: 'UPI', daysAgo: 2 },
          { userIndex: 11, productIndices: [4, 10], status: 'Processing', paymentMethod: 'COD', daysAgo: 2 },
          { userIndex: 12, productIndices: [1], status: 'Processing', paymentMethod: 'Card', daysAgo: 1 },
          { userIndex: 13, productIndices: [7, 0], status: 'Processing', paymentMethod: 'UPI', daysAgo: 1 },

          // Pending orders
          { userIndex: 14, productIndices: [3, 2], status: 'Pending', paymentMethod: 'COD', daysAgo: 0 },
          { userIndex: 15, productIndices: [0, 4, 11], status: 'Pending', paymentMethod: 'COD', daysAgo: 0 },
          { userIndex: 16, productIndices: [5, 6, 8], status: 'Pending', paymentMethod: 'COD', daysAgo: 0 },
        ];

        // Reset orders if refreshing
        if (forceRefresh) {
          const { store } = require('./db/store');
          store.data.orders = [];
          store.save();
        }

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
            isPaid: t.status === 'Delivered' || t.status === 'Shipped' || t.status === 'Confirmed' || t.paymentMethod !== 'COD',
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
