const mongoose = require('mongoose');
const Product = require('./models/Product');

mongoose.connect('mongodb://localhost:27017/shophoria', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

const products = [
  // Smartphones
  { name: "iPhone 14", description: "Experience cutting-edge technology with the iPhone 14 – stunning visuals, lightning-fast performance, and a camera that captures every moment perfectly.", price: 999.99, category: "Smartphones", images: ["https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-14-1.jpg"], stock: 10 },
  { name: "Samsung Galaxy S23", description: "Unleash your potential with the Galaxy S23 – sleek design, powerful processing, and a camera that turns every shot into a masterpiece.", price: 799.99, category: "Smartphones", images: ["https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s23-5g-1.jpg"], stock: 15 },
  { name: "Google Pixel 7", description: "Capture life’s best moments with the Pixel 7 – smart, stylish, and packed with Google’s innovative tech for an unmatched experience.", price: 599.99, category: "Smartphones", images: ["https://fdn2.gsmarena.com/vv/pics/google/google-pixel-7-1.jpg"], stock: 20 },
  
  // Laptops
  { name: "MacBook Pro 14-inch", description: "Power through your workday with the MacBook Pro – a sleek powerhouse with unrivaled speed, vibrant display, and all-day battery life.", price: 1999.99, category: "Laptops", images: ["https://images.apple.com/v/macbook-pro-14-and-16-b/images/overview/hero/hero_14__d0odc4j79wgi_large.jpg"], stock: 8 },
  { name: "Dell XPS 13", description: "Elevate your productivity with the Dell XPS 13 – compact, lightweight, and loaded with premium features for work or play.", price: 1299.99, category: "Laptops", images: ["https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-13-9310/media-gallery/xps-13-9310-tmlp-silver-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=536&qlt=100,1&resMode=sharp2&size=536,402&chrss=full"], stock: 12 },
  { name: "HP Spectre x360", description: "Transform your creativity with the HP Spectre x360 – a stunning convertible laptop with a brilliant display and versatile design.", price: 1499.99, category: "Laptops", images: ["https://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c07960966.png"], stock: 10 },
  
  // Sneakers
  { name: "Nike Air Max 270", description: "Step up your style with the Nike Air Max 270 – bold, comfy, and featuring iconic cushioning for all-day wear.", price: 150.00, category: "Sneakers", images: ["https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/5e8a7e1e-1b1c-4e1e-8e1e-1b1c4e1e8e1e/air-max-270-mens-shoes-KkLcGR.png"], stock: 25 },
  { name: "Adidas Ultraboost", description: "Run the streets in the Adidas Ultraboost – plush comfort meets responsive energy for a standout stride every time.", price: 180.00, category: "Sneakers", images: ["https://assets.adidas.com/images/w_600,f_auto,q_auto/1b1c4e1e8e1e-1b1c-4e1e-8e1e-1b1c4e1e8e1e/ultraboost-22-shoes.jpg"], stock: 30 },
  { name: "Puma RS-X", description: "Make a statement with the Puma RS-X – retro vibes, modern comfort, and a chunky sole that turns heads.", price: 120.00, category: "Sneakers", images: ["https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/393772/01/sv01/fnd/IND/fmt/png/RS-X-Reinvention-Sneakers"], stock: 20 },
  
  // Headphones
  { name: "AirPods Pro", description: "Immerse yourself in sound with AirPods Pro – noise-canceling brilliance and crystal-clear audio in a tiny package.", price: 249.99, category: "Headphones", images: ["https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MWP22?wid=572&hei=572&fmt=jpeg&qlt=95&.v=1591634795000"], stock: 15 },
  { name: "Sony WH-1000XM5", description: "Escape into music with the Sony WH-1000XM5 – top-tier noise cancellation and rich, detailed sound for audiophiles.", price: 399.99, category: "Headphones", images: ["https://www.sony.com/image/5d8a1b1b1b1c4e1e8e1e1b1c4e1e8e1e?fmt=png-alpha&wid=720"], stock: 10 },
  { name: "Bose QuietComfort 45", description: "Find your peace with Bose QuietComfort 45 – superior noise cancellation and plush comfort for endless listening.", price: 329.99, category: "Headphones", images: ["https://assets.bose.com/content/dam/Bose_DAM/Web/consumer_electronics/global/products/headphones/quietcomfort_45/product_silo_images/QC45_Black_EC_01.png"], stock: 12 },
  
  // Home Appliances
  { name: "Instant Pot Duo", description: "Cook smarter with the Instant Pot Duo – whip up delicious meals effortlessly with this versatile kitchen must-have.", price: 89.99, category: "Home Appliances", images: ["https://instantpot.com/wp-content/uploads/2021/06/Duo-6qt-Front-View.png"], stock: 50 },
  { name: "Dyson V11 Vacuum", description: "Clean like a pro with the Dyson V11 – cordless power and precision to keep your home spotless with ease.", price: 599.99, category: "Home Appliances", images: ["https://media.dyson.com/medias/?context=bWFzdGVyfGltYWdlc3w0MjY5NnxpbWFnZS9wbmd8aW1hZ2VzL2g5MC9oM2IvOTI5NDY5MjQ5NzU4Mi5wbmd8NzY5YzY5YzY5YzY5YzY5YzY5YzY5YzY5YzY5YzY5YzY5YzY5YzY5YzY5YzY5YzY5"], stock: 5 },
  { name: "Nespresso Vertuo", description: "Brew barista-quality coffee at home with the Nespresso Vertuo – sleek, simple, and oh-so-satisfying.", price: 199.99, category: "Home Appliances", images: ["https://www.nespresso.com/ecom/medias/sys_master/public/10386893004830/M-0172-2000x2000.png"], stock: 20 },
  
  // Clothing
  { name: "Levi's 501 Jeans", description: "Rock timeless style with Levi’s 501 Jeans – durable, comfortable, and perfect for any occasion.", price: 69.99, category: "Clothing", images: ["https://lsco.scene7.com/is/image/lsco/00501-3268-front-pdp?fmt=jpeg&qlt=70,1&op_sharpen=0&resMode=sharp2&op_usm=0.8,1,10,0&fit=crop,0&wid=750&hei=1000"], stock: 40 },
  { name: "Uniqlo Ultra Light Down Jacket", description: "Stay warm and stylish with the Uniqlo Ultra Light Down Jacket – packable perfection for chilly days.", price: 79.99, category: "Clothing", images: ["https://image.uniqlo.com/UQ/ST3/WesternCommon/imagesgoods/441433/item/goods_09_441433.jpg"], stock: 30 },
  { name: "H&M Graphic T-Shirt", description: "Keep it casual with the H&M Graphic T-Shirt – soft cotton and cool designs for everyday flair.", price: 19.99, category: "Clothing", images: ["https://lp2.hm.com/hmgoepprod?set=source[/c8/5e/c85e8e1b1c4e1e8e1e1b1c4e1e8e1e.jpg],origin[dam],category[],type[DESCRIPTIVESTILLLIFE],res[m],hmver[2]&call=url[file:/product/main]"], stock: 50 },
  
  // Books (New Category)
  { name: "The Great Gatsby", description: "Dive into the Roaring Twenties with The Great Gatsby – a captivating tale of love, luxury, and longing.", price: 12.99, category: "Books", images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/The_Great_Gatsby_Cover_1925_Retouched.jpg/220px-The_Great_Gatsby_Cover_1925_Retouched.jpg"], stock: 100 },
  { name: "To Kill a Mockingbird", description: "Explore justice and humanity with To Kill a Mockingbird – a timeless story that resonates with every generation.", price: 14.99, category: "Books", images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/To_Kill_a_Mockingbird_%28first_edition_cover%29.jpg/220px-To_Kill_a_Mockingbird_%28first_edition_cover%29.jpg"], stock: 80 },
  { name: "1984", description: "Enter a chilling world with 1984 – Orwell’s gripping vision of surveillance, power, and resistance.", price: 11.99, category: "Books", images: ["https://upload.wikimedia.org/wikipedia/en/5/5d/1984_first_edition_cover.jpg"], stock: 90 }
];

const seedDB = async () => {
  try {
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log('Database seeded with products!');
  } catch (err) {
    console.log('Error seeding database:', err);
  } finally {
    mongoose.connection.close();
  }
};

seedDB();