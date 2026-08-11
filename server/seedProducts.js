const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/vizhop';

const products = [
  // ─── ELECTRONICS (10 items) ────────────────────────────────────────────────
  {
    name: 'Premium Noise-Cancelling Headphones',
    description: 'Experience pure audio bliss with active noise cancellation, 40-hour battery life, and plush memory foam earcups for ultimate comfort.',
    price: 12999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop',
    stock: 45,
    discount: 30, // For limited offer block
    rating: 4.8,
    reviews: 145
  },
  {
    name: 'Smart Watch Series Alpha',
    description: 'Track your health, heart rate, sleep quality, and workouts with built-in GPS and a vibrant AMOLED display. Up to 10 days of battery.',
    price: 5999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop',
    stock: 80,
    discount: 40, // For limited offer block
    rating: 4.6,
    reviews: 320
  },
  {
    name: 'Pro Streamer USB Microphone',
    description: 'Professional condenser microphone with cardioid pickup pattern. Plug-and-play for PC/Mac, perfect for podcasting, gaming, and streaming.',
    price: 3999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1590608897129-79da98d15969?w=600&auto=format&fit=crop',
    stock: 35,
    discount: 15,
    rating: 4.5,
    reviews: 98
  },
  {
    name: 'Ultra-Wide Curved Gaming Monitor 34"',
    description: 'Immerse yourself in gameplay with a 1440p curved screen, 144Hz refresh rate, and 1ms response time. HDR400 certified.',
    price: 34999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop',
    stock: 12,
    discount: 25,
    rating: 4.7,
    reviews: 67
  },
  {
    name: 'Mechanical Gaming Keyboard RGB',
    description: 'Tactile blue switches, customizeable per-key RGB backlighting, and a premium aluminum top frame. Includes detachable wrist rest.',
    price: 4999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop',
    stock: 60,
    discount: 20,
    rating: 4.4,
    reviews: 112
  },
  {
    name: 'Wireless Ergonomic Mouse Pro',
    description: 'Designed to fit your hand naturally. Connects via Bluetooth or USB dongle. Hyper-fast scroll wheel and 8000 DPI sensor.',
    price: 2499,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop',
    stock: 110,
    discount: 10,
    rating: 4.5,
    reviews: 89
  },
  {
    name: 'Portable Bluetooth Speaker 20W',
    description: 'IPX7 waterproof, deep bass, and 24 hours of playtime. Bring high-fidelity sound to the beach, pool, or backyard.',
    price: 3499,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop',
    stock: 95,
    discount: 50, // For limited offer block
    rating: 4.7,
    reviews: 410
  },
  {
    name: 'Dual Wireless Charging Pad',
    description: 'Simultaneously charge your phone and wireless earbuds. Sleek leather-accented design with 15W fast charging capacity.',
    price: 1999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=600&auto=format&fit=crop',
    stock: 150,
    discount: 35, // For limited offer block
    rating: 4.3,
    reviews: 180
  },
  {
    name: 'Ultra-Slim Power Bank 20000mAh',
    description: 'High capacity portable charger with Power Delivery 3.0. Charges laptops, tablets, and smartphones on the go.',
    price: 2199,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&auto=format&fit=crop',
    stock: 200,
    discount: 15,
    rating: 4.6,
    reviews: 512
  },
  {
    name: '4K Action Camera 20MP',
    description: 'Capture extreme sports in crystal clear detail. Features EIS stabilization, 40m waterproof case, and dual touchscreens.',
    price: 8999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?w=600&auto=format&fit=crop',
    stock: 30,
    discount: 30,
    rating: 4.5,
    reviews: 73
  },

  // ─── CLOTHING (6 items) ───────────────────────────────────────────────────
  {
    name: 'Premium Denim Jacket Classic',
    description: 'Crafted from 100% durable cotton denim with a timeless button-down front. Standard fit with button-flap chest pockets.',
    price: 2999,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop',
    stock: 65,
    discount: 20,
    rating: 4.5,
    reviews: 189
  },
  {
    name: 'Hooded Sweatshirt Casual Black',
    description: 'Ultra-soft fleece hoodie featuring kangaroo pocket and adjustable drawstring hood. Relaxed fit for daily loungewear comfort.',
    price: 1799,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&auto=format&fit=crop',
    stock: 120,
    discount: 45, // For limited offer block
    rating: 4.4,
    reviews: 240
  },
  {
    name: 'Men\'s Slim-Fit Chinos',
    description: 'Versatile stretch twill chinos for everyday smart-casual dressing. Soft cotton blend fabric ensures day-long breathable wear.',
    price: 1999,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=600&auto=format&fit=crop',
    stock: 90,
    discount: 10,
    rating: 4.2,
    reviews: 154
  },
  {
    name: 'Floral Print Summer Dress',
    description: 'Lightweight, flowy A-line dress with a beautiful vintage floral print. Features a sweetheart neckline and adjustable tie straps.',
    price: 2499,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop',
    stock: 50,
    discount: 35, // For limited offer block
    rating: 4.6,
    reviews: 95
  },
  {
    name: 'Unisex Organic Cotton T-Shirt',
    description: 'Eco-friendly basic tee made from 100% organic ring-spun cotton. Breathable, durable, and ethically manufactured.',
    price: 799,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&auto=format&fit=crop',
    stock: 300,
    discount: 15,
    rating: 4.5,
    reviews: 642
  },
  {
    name: 'Tailored Blazer Jacket Elegant',
    description: 'Add instant sophistication to any outfit. Structured fit, double-breasted button detail, and satin lining.',
    price: 4999,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&auto=format&fit=crop',
    stock: 25,
    discount: 25,
    rating: 4.7,
    reviews: 58
  },

  // ─── FOOTWEAR (6 items) ───────────────────────────────────────────────────
  {
    name: 'Active Running Shoes Lite',
    description: 'Super lightweight mesh running shoes with responsive cushioning for maximum speed and shock absorption.',
    price: 4499,
    category: 'Footwear',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop',
    stock: 75,
    discount: 30,
    rating: 4.6,
    reviews: 520
  },
  {
    name: 'Classic Leather Boots Brown',
    description: 'Handcrafted genuine leather boots with heavy-duty rubber soles. Water-resistant outer and supportive padded insoles.',
    price: 6999,
    category: 'Footwear',
    image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600&auto=format&fit=crop',
    stock: 40,
    discount: 20,
    rating: 4.8,
    reviews: 188
  },
  {
    name: 'Retro White Sneakers Unisex',
    description: 'Minimalist white leather sneakers that go with everything. Stitched details, breathable vents, and memory foam comfort.',
    price: 3299,
    category: 'Footwear',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop',
    stock: 120,
    discount: 50, // For limited offer block
    rating: 4.5,
    reviews: 310
  },
  {
    name: 'Casual Suede Loafers Slip-On',
    description: 'Effortless slip-on loafers in premium cow suede. Lightweight flexible outsole for excellent daily walking support.',
    price: 3499,
    category: 'Footwear',
    image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&auto=format&fit=crop',
    stock: 60,
    discount: 15,
    rating: 4.3,
    reviews: 79
  },
  {
    name: 'Cushioned Athletic Slides',
    description: 'Relax your feet after workouts. Contoured footbed and water-resistant synthetic strap.',
    price: 999,
    category: 'Footwear',
    image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=600&auto=format&fit=crop',
    stock: 160,
    discount: 40, // For limited offer block
    rating: 4.4,
    reviews: 142
  },
  {
    name: 'Rugged Outdoor Hiking Boots',
    description: 'Conquer the trails with confidence. Deep lug outsole, reinforced steel shank, and waterproof membrane lining.',
    price: 5499,
    category: 'Footwear',
    image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600&auto=format&fit=crop',
    stock: 35,
    discount: 20,
    rating: 4.7,
    reviews: 95
  },

  // ─── BAGS (6 items) ───────────────────────────────────────────────────────
  {
    name: 'Vintage Leather Travel Backpack',
    description: 'Premium water-resistant waxed canvas with genuine leather straps. Multi-pocket design fits up to 15.6" laptops.',
    price: 3999,
    category: 'Bags',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop',
    stock: 45,
    discount: 30,
    rating: 4.7,
    reviews: 215
  },
  {
    name: 'Canvas Weekender Duffle Bag',
    description: 'Spacious main compartment with a separate shoe pocket. Sturdy leather top handles and adjustable shoulder strap.',
    price: 2499,
    category: 'Bags',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop',
    stock: 70,
    discount: 50, // For limited offer block
    rating: 4.6,
    reviews: 177
  },
  {
    name: 'Sleek Laptop Briefcase Thin',
    description: 'Minimalist professional briefcase with shock-absorbing foam padding. Spill-resistant fabric and heavy-duty metal zippers.',
    price: 1999,
    category: 'Bags',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop',
    stock: 85,
    discount: 25,
    rating: 4.4,
    reviews: 130
  },
  {
    name: 'Minimalist Chest Crossbody Bag',
    description: 'Compact chest bag for essentials. Anti-theft hidden pockets, USB charging interface extension, and durable strap.',
    price: 1299,
    category: 'Bags',
    image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600&auto=format&fit=crop',
    stock: 140,
    discount: 40, // For limited offer block
    rating: 4.5,
    reviews: 289
  },
  {
    name: 'Women\'s Leather Tote Bag Handbag',
    description: 'Timeless shoulder tote crafted in saffiano leather. Generous interior space with middle zipper divider compartment.',
    price: 3499,
    category: 'Bags',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop',
    stock: 30,
    discount: 15,
    rating: 4.7,
    reviews: 84
  },
  {
    name: 'Hard Shell Carry-On Suitcase',
    description: 'Ultra-lightweight polycarbonate hard shell. Features 360-degree silent spinner wheels and TSA-approved lock.',
    price: 5999,
    category: 'Bags',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop',
    stock: 25,
    discount: 30,
    rating: 4.8,
    reviews: 64
  },

  // ─── ACCESSORIES (6 items) ────────────────────────────────────────────────
  {
    name: 'Polarized Aviator Sunglasses',
    description: 'Classic aviator design featuring lightweight metal frames and polarized UV400 protection lenses to reduce glare.',
    price: 1499,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop',
    stock: 110,
    discount: 60, // For limited offer block
    rating: 4.4,
    reviews: 405
  },
  {
    name: 'Minimalist Carbon Fiber Wallet',
    description: 'RFID blocking slim credit card holder. Can hold up to 12 cards and features an integrated cash money clip.',
    price: 999,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop',
    stock: 180,
    discount: 30,
    rating: 4.5,
    reviews: 231
  },
  {
    name: 'Genuine Leather Belt Black',
    description: 'Made from 100% full-grain leather with a sleek brushed metal buckle. Suitable for both formal and casual attire.',
    price: 799,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1624222247344-550fb8ecfbd4?w=600&auto=format&fit=crop',
    stock: 250,
    discount: 20,
    rating: 4.3,
    reviews: 184
  },
  {
    name: 'Premium Wool Beanie Hat Winter',
    description: 'Super warm and stretchable rib-knit wool blend beanie. Classic cuff design keeps ears fully covered and cozy.',
    price: 599,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600&auto=format&fit=crop',
    stock: 130,
    discount: 50, // For limited offer block
    rating: 4.6,
    reviews: 92
  },
  {
    name: 'Silk Necktie Set with Cufflinks',
    description: 'Includes a luxurious pure silk jacquard weave necktie, matching pocket square handkerchief, and silver cufflinks.',
    price: 1299,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop',
    stock: 50,
    discount: 25,
    rating: 4.5,
    reviews: 62
  },
  {
    name: 'Compact Key Organizer Holder',
    description: 'Keep your keys silent and neat in a leather sheath. Accommodates up to 8 standard household keys.',
    price: 699,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&auto=format&fit=crop',
    stock: 190,
    discount: 40,
    rating: 4.2,
    reviews: 145
  },

  // ─── SPORTS (5 items) ─────────────────────────────────────────────────────
  {
    name: 'Eco-Friendly Yoga Mat 6mm',
    description: 'High-density TPE yoga mat with dual non-slip textures. Lightweight, soft cushioning, and includes carry strap.',
    price: 1199,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop',
    stock: 80,
    discount: 25,
    rating: 4.6,
    reviews: 210
  },
  {
    name: 'Adjustable Dumbbells Set 20kg',
    description: 'Heavy duty steel weights with customizable selector plates. Durable rubber grip handles prevent slippage.',
    price: 4999,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1586401100295-7a8096fd231a?w=600&auto=format&fit=crop',
    stock: 20,
    discount: 30,
    rating: 4.8,
    reviews: 143
  },
  {
    name: 'Resistance Loop Bands Pack',
    description: 'Set of 5 premium natural latex exercise loops with color-coded resistance levels from extra-light to extra-heavy.',
    price: 499,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop',
    stock: 220,
    discount: 50, // For limited offer block
    rating: 4.5,
    reviews: 670
  },
  {
    name: 'Stainless Steel Insulated Bottle',
    description: 'Keep your energy drinks ice cold for 24h or hot for 12h. Double walled insulation with dustproof leakproof spout lid.',
    price: 899,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop',
    stock: 140,
    discount: 15,
    rating: 4.6,
    reviews: 304
  },
  {
    name: 'Smart Skipping Rope Digital Counter',
    description: 'Features a built-in LCD screen to count jumps, calories burned, and workout duration. Adjustable rope lengths.',
    price: 799,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop',
    stock: 100,
    discount: 35, // For limited offer block
    rating: 4.4,
    reviews: 125
  },

  // ─── HOME (5 items) ───────────────────────────────────────────────────────
  {
    name: 'Dimmable LED Desk Lamp USB',
    description: 'Eye-caring reading light featuring 5 brightness levels, 3 color temperatures, auto-off timer, and USB output port.',
    price: 1599,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop',
    stock: 60,
    discount: 30,
    rating: 4.6,
    reviews: 147
  },
  {
    name: 'Handcrafted Ceramic Mug Set (4pcs)',
    description: 'Set of 4 rustic stone-washed organic clay coffee mugs. Unique glaze finishes, microwave and dishwasher safe.',
    price: 1299,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop',
    stock: 45,
    discount: 20,
    rating: 4.7,
    reviews: 86
  },
  {
    name: 'Scented Soy Wax Candles Trio',
    description: 'Set of 3 therapy soy wax candles in lavender, vanilla, and eucalyptus scents. Clean burn for up to 45 hours.',
    price: 899,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&auto=format&fit=crop',
    stock: 110,
    discount: 50, // For limited offer block
    rating: 4.5,
    reviews: 139
  },
  {
    name: 'Ultra-Soft Throw Blanket Fleece',
    description: 'Snuggle up in this extremely plush double-sided flannel sherpa blanket. Anti-static and fade resistant.',
    price: 1499,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?w=600&auto=format&fit=crop',
    stock: 90,
    discount: 25,
    rating: 4.8,
    reviews: 310
  },
  {
    name: 'Minimalist Wooden Wall Clock 12"',
    description: 'Sleek silent non-ticking quartz wall clock. Premium wooden dial face plate and modern black metal tick pointers.',
    price: 1899,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop',
    stock: 40,
    discount: 40, // For limited offer block
    rating: 4.4,
    reviews: 73
  },

  // ─── BEAUTY (4 items) ─────────────────────────────────────────────────────
  {
    name: 'Hydrating Facial Cleanser Gel',
    description: 'Gentle soap-free foaming gel cleanser with hyaluronic acid and ceramides. Cleanses deeply without stripping skin.',
    price: 699,
    category: 'Beauty',
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&auto=format&fit=crop',
    stock: 150,
    discount: 15,
    rating: 4.6,
    reviews: 580
  },
  {
    name: 'Pro Ionic Hair Dryer 2200W',
    description: 'Blow-dry hair fast with salon quality. Features negative ions, 3 heat and 2 speed settings, and cool shot button.',
    price: 2499,
    category: 'Beauty',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop',
    stock: 55,
    discount: 30,
    rating: 4.5,
    reviews: 167
  },
  {
    name: 'Pure Organic Essential Oils Kit',
    description: 'Set of 6 aromatherapy essential oils including Lavender, Tea Tree, Eucalyptus, Lemongrass, Sweet Orange, and Peppermint.',
    price: 999,
    category: 'Beauty',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&auto=format&fit=crop',
    stock: 120,
    discount: 50, // For limited offer block
    rating: 4.7,
    reviews: 430
  },
  {
    name: 'Vitamin C Face Brightening Serum',
    description: 'Infused with active vitamin C, ferulic acid, and vitamin E. Fades dark spots and boosts collagen production.',
    price: 899,
    category: 'Beauty',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop',
    stock: 90,
    discount: 20,
    rating: 4.4,
    reviews: 290
  },

  // ─── BOOKS (4 items) ──────────────────────────────────────────────────────
  {
    name: 'The Edge of Tomorrow Sci-Fi',
    description: 'An epic space odyssey exploring the frontiers of human evolution, interstellar exploration, and mysterious alien technologies.',
    price: 499,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop',
    stock: 100,
    discount: 10,
    rating: 4.7,
    reviews: 88
  },
  {
    name: 'Atomic Habits Best Seller',
    description: 'Learn how tiny changes in your behavior can lead to remarkable results. The definitive guide to breaking bad habits.',
    price: 599,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop',
    stock: 150,
    discount: 25,
    rating: 4.9,
    reviews: 1450
  },
  {
    name: 'JS Programming Masterclass',
    description: 'Master JavaScript from basic variable declarations to advanced topics like event loops, prototypes, and asynchronous execution.',
    price: 1199,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&auto=format&fit=crop',
    stock: 60,
    discount: 40, // For limited offer block
    rating: 4.8,
    reviews: 95
  },
  {
    name: 'Culinary Art: Global Recipes',
    description: 'Discover over 200 gourmet recipes from around the world. Fully illustrated with stunning photos and step-by-step techniques.',
    price: 1499,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=600&auto=format&fit=crop',
    stock: 45,
    discount: 20,
    rating: 4.6,
    reviews: 110
  },

  // ─── OTHER (3 items) ──────────────────────────────────────────────────────
  {
    name: 'Windproof Automatic Umbrella',
    description: 'Reinforced 10-rib structure with automatic open and close buttons. Teflon coated water-repelling travel canopy.',
    price: 799,
    category: 'Other',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop',
    stock: 110,
    discount: 30,
    rating: 4.5,
    reviews: 215
  },
  {
    name: 'Memory Foam Travel Pillow',
    description: 'Ergonomic U-shape neck pillow for flights, cars, or trains. Breathable magnetic therapy cloth outer sleeve cover.',
    price: 999,
    category: 'Other',
    image: 'https://images.unsplash.com/photo-1522441815192-d9f04eb0615c?w=600&auto=format&fit=crop',
    stock: 80,
    discount: 45, // For limited offer block
    rating: 4.3,
    reviews: 178
  },
  {
    name: 'Compact Multitool Pocket Knife',
    description: '15-in-1 heavy duty stainless steel utility tool. Includes pliers, knife, screwdriver, bottle opener, and wire cutter.',
    price: 1299,
    category: 'Other',
    image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&auto=format&fit=crop',
    stock: 65,
    discount: 20,
    rating: 4.6,
    reviews: 104
  },

  // ─── GROCERIES & GOURMET (5 items) ─────────────────────────────────────────
  {
    name: 'Organic Arabica Coffee Beans',
    description: 'Whole bean medium roast coffee with notes of chocolate and caramel. Ethically sourced and freshly roasted.',
    price: 899,
    category: 'Groceries',
    image: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=600&auto=format&fit=crop',
    stock: 200,
    discount: 10,
    rating: 4.8,
    reviews: 450
  },
  {
    name: 'Premium Match Green Tea Powder',
    description: 'Ceremonial grade matcha from Kyoto, Japan. Vibrant green color, smooth flavor, perfect for lattes or traditional tea.',
    price: 1499,
    category: 'Groceries',
    image: 'https://images.unsplash.com/photo-1582793988951-9aed5509eb97?w=600&auto=format&fit=crop',
    stock: 120,
    discount: 15,
    rating: 4.9,
    reviews: 320
  },
  {
    name: 'Artisan Dark Chocolate Truffles',
    description: 'Box of 12 handcrafted vegan dark chocolate truffles with diverse fillings like raspberry, sea salt caramel, and espresso.',
    price: 1299,
    category: 'Groceries',
    image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=600&auto=format&fit=crop',
    stock: 80,
    discount: 5,
    rating: 4.7,
    reviews: 190
  },
  {
    name: 'Raw Manuka Honey MGO 400+',
    description: '100% pure New Zealand Manuka honey. Renowned for its natural antibacterial properties and rich earthy flavor.',
    price: 2999,
    category: 'Groceries',
    image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600&auto=format&fit=crop',
    stock: 60,
    discount: 20,
    rating: 4.9,
    reviews: 415
  },
  {
    name: 'Himalayan Pink Salt Grinder',
    description: 'Coarse crystal pink salt rich in trace minerals. Comes in a refillable glass grinder bottle.',
    price: 499,
    category: 'Groceries',
    image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=600&auto=format&fit=crop',
    stock: 300,
    discount: 0,
    rating: 4.6,
    reviews: 125
  },

  // ─── PET SUPPLIES (5 items) ────────────────────────────────────────────────
  {
    name: 'Orthopedic Dog Bed with Memory Foam',
    description: 'Premium pet bed providing ultimate support for joints. Features a washable, water-resistant removable cover.',
    price: 3499,
    category: 'Pet Supplies',
    image: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=600&auto=format&fit=crop',
    stock: 45,
    discount: 25,
    rating: 4.8,
    reviews: 280
  },
  {
    name: 'Interactive Laser Cat Toy',
    description: 'Automatic rotating laser pointer to keep your feline friends entertained for hours. USB rechargeable.',
    price: 1299,
    category: 'Pet Supplies',
    image: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?w=600&auto=format&fit=crop',
    stock: 150,
    discount: 10,
    rating: 4.5,
    reviews: 340
  },
  {
    name: 'Grain-Free Premium Salmon Dog Food',
    description: '15kg bag of highly digestible dog food made with real salmon. Promotes a healthy coat and immune system.',
    price: 4599,
    category: 'Pet Supplies',
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&auto=format&fit=crop',
    stock: 90,
    discount: 15,
    rating: 4.7,
    reviews: 512
  },
  {
    name: 'Retractable Heavy Duty Dog Leash',
    description: '5-meter strong nylon tape leash for dogs up to 50kg. Anti-slip handle and quick lock/unlock button.',
    price: 899,
    category: 'Pet Supplies',
    image: 'https://images.unsplash.com/photo-1601758003122-53c40e686a19?w=600&auto=format&fit=crop',
    stock: 200,
    discount: 20,
    rating: 4.6,
    reviews: 185
  },
  {
    name: 'Self-Cleaning Cat Litter Box',
    description: 'Smart litter box with odor control and automatic scooping. Connects to your phone for health monitoring.',
    price: 14999,
    category: 'Pet Supplies',
    image: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=600&auto=format&fit=crop',
    stock: 20,
    discount: 30,
    rating: 4.9,
    reviews: 142
  },

  // ─── TOYS & GAMES (5 items) ────────────────────────────────────────────────
  {
    name: 'Classic Wooden Chess Set',
    description: 'Handcrafted magnetic wooden chess board with intricately carved pieces. Folds for easy storage and travel.',
    price: 1999,
    category: 'Toys',
    image: 'https://images.unsplash.com/photo-1580541832626-2a7131ee809f?w=600&auto=format&fit=crop',
    stock: 75,
    discount: 10,
    rating: 4.8,
    reviews: 210
  },
  {
    name: '1000-Piece Landscape Jigsaw Puzzle',
    description: 'Beautiful high-definition print of a serene mountain landscape. Precision-cut pieces ensure a tight interlocking fit.',
    price: 799,
    category: 'Toys',
    image: 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=600&auto=format&fit=crop',
    stock: 120,
    discount: 15,
    rating: 4.7,
    reviews: 305
  },
  {
    name: 'Educational Building Blocks Set',
    description: '500 colorful interlocking plastic blocks to inspire creativity and spatial reasoning in children aged 4+.',
    price: 1499,
    category: 'Toys',
    image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&auto=format&fit=crop',
    stock: 180,
    discount: 25,
    rating: 4.6,
    reviews: 420
  },
  {
    name: 'Remote Control Off-Road Truck',
    description: '1:16 scale 4WD RC car capable of tackling rough terrain. Reaches speeds up to 25 km/h. Includes 2 batteries.',
    price: 2499,
    category: 'Toys',
    image: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=600&auto=format&fit=crop',
    stock: 60,
    discount: 20,
    rating: 4.5,
    reviews: 175
  },
  {
    name: 'Family Board Game: Strategic Conquest',
    description: 'Lead your civilization to victory in this award-winning strategy board game. For 2-4 players, ages 10+.',
    price: 2999,
    category: 'Toys',
    image: 'https://images.unsplash.com/photo-1611891487122-207579d67d98?w=600&auto=format&fit=crop',
    stock: 90,
    discount: 30,
    rating: 4.9,
    reviews: 540
  },

  // ─── AUTOMOTIVE (5 items) ──────────────────────────────────────────────────
  {
    name: 'Portable Car Jump Starter 1500A',
    description: 'Jump start your dead car battery up to 20 times on a single charge. Also acts as a power bank and LED flashlight.',
    price: 4999,
    category: 'Automotive',
    image: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=600&auto=format&fit=crop',
    stock: 40,
    discount: 15,
    rating: 4.8,
    reviews: 312
  },
  {
    name: 'High-Definition Dual Dash Cam',
    description: 'Front and rear 1080P recording with G-sensor loop recording, night vision, and a 170-degree wide angle lens.',
    price: 3499,
    category: 'Automotive',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&auto=format&fit=crop',
    stock: 85,
    discount: 25,
    rating: 4.6,
    reviews: 295
  },
  {
    name: 'Memory Foam Car Neck Pillow',
    description: 'Ergonomic headrest cushion that provides comfortable neck and shoulder support for long drives.',
    price: 899,
    category: 'Automotive',
    image: 'https://images.unsplash.com/photo-1625895197185-efcec01cffe0?w=600&auto=format&fit=crop',
    stock: 150,
    discount: 10,
    rating: 4.4,
    reviews: 145
  },
  {
    name: 'Digital Tire Pressure Inflator',
    description: '12V portable air compressor pump with auto shut-off and digital display. Quickly inflates car, bike, and sports balls.',
    price: 2199,
    category: 'Automotive',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&auto=format&fit=crop',
    stock: 110,
    discount: 20,
    rating: 4.7,
    reviews: 420
  },
  {
    name: 'Premium Microfiber Car Wash Towels (6-Pack)',
    description: 'Ultra-absorbent, scratch-free, and lint-free cleaning cloths. Perfect for washing, drying, and detailing vehicles.',
    price: 699,
    category: 'Automotive',
    image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=600&auto=format&fit=crop',
    stock: 300,
    discount: 5,
    rating: 4.9,
    reviews: 860
  }
];

const seedProducts = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB for seeding');

    // Remove existing products
    await Product.deleteMany({});
    console.log('🧹 Cleared all existing products');

    // Insert 75 new products
    const seeded = await Product.insertMany(products);
    console.log(`🎉 Successfully seeded ${seeded.length} products!`);

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedProducts();
