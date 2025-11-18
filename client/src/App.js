
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [user, setUser] = useState(null);
  const [sortBy, setSortBy] = useState('featured');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock product data
  const products = [
    { id: 1, name: 'Summer Dress', price: 59.99, originalPrice: 79.99, category: 'female', image: 'https://via.placeholder.com/300x400?text=Summer+Dress', isSale: true, isFeatured: true },
    { id: 2, name: 'Casual Shirt', price: 39.99, category: 'male', image: 'https://via.placeholder.com/300x400?text=Casual+Shirt', isSale: false, isFeatured: true },
    { id: 3, name: 'Designer Jeans', price: 89.99, originalPrice: 119.99, category: 'unisex', image: 'https://via.placeholder.com/300x400?text=Designer+Jeans', isSale: true, isFeatured: false },
    { id: 4, name: 'Evening Gown', price: 149.99, category: 'female', image: 'https://via.placeholder.com/300x400?text=Evening+Gown', isSale: false, isFeatured: true },
    { id: 5, name: 'Formal Suit', price: 199.99, category: 'male', image: 'https://via.placeholder.com/300x400?text=Formal+Suit', isSale: true, isFeatured: false },
    { id: 6, name: 'Casual Sneakers', price: 79.99, category: 'unisex', image: 'https://via.placeholder.com/300x400?text=Casual+Sneakers', isSale: false, isFeatured: true },
  ];

  const bannerImages = [
    'https://via.placeholder.com/1200x400?text=Fashion+Sale+50%25+Off',
    'https://via.placeholder.com/1200x400?text=New+Collection+2024',
    'https://via.placeholder.com/1200x400?text=Free+Shipping+on+Orders+Over+$100',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [bannerImages.length]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:3001/api/current_user', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(response => {
        setUser(response.data);
      }).catch(() => {
        localStorage.removeItem('token');
      });
    }
  }, []);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const addToWishlist = (product) => {
    if (!wishlist.find(item => item.id === product.id)) {
      setWishlist([...wishlist, product]);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setCart([]);
    setWishlist([]);
  };

  const filteredProducts = products.filter(product => {
    if (selectedCategory === 'all') return true;
    return product.category === selectedCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const featuredProducts = products.filter(p => p.isFeatured);
  const saleProducts = products.filter(p => p.isSale);
  const maleProducts = products.filter(p => p.category === 'male');
  const femaleProducts = products.filter(p => p.category === 'female');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="        git remote set-url origin https://github.com/himankkaushik/E-commerce.git        git remote set-url origin https://github.com/himankkaushik/E-commerce.git        git remote set-url origin https://github.com/himankkaushik/E-commerce.gitmax-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-violet-700">Beauty Zone</h1>
              <nav className="hidden md:flex space-x-6">
                <Link to="/" className="text-gray-700 hover:text-violet-600">Home</Link>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="text-gray-700 hover:text-violet-600 bg-transparent border-none"
                >
                  <option value="all">All Categories</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="unisex">Unisex</option>
                </select>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-gray-700 bg-transparent border border-gray-300 rounded px-2 py-1"
              >
                <option value="featured">Sort by: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name</option>
              </select>
              <button className="text-gray-700 hover:text-violet-600 relative">
                <span className="material-icons">shopping_cart</span>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-violet-600 text-white rounded-full text-xs px-1">
                    {cart.length}
                  </span>
                )}
              </button>
              <button className="text-gray-700 hover:text-violet-600 relative">
                <span className="material-icons">favorite</span>
                {wishlist.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs px-1">
                    {wishlist.length}
                  </span>
                )}
              </button>
              {user ? (
                <div className="flex items-center space-x-2">
                  <span className="text-gray-700">Hello, {user.name}</span>
                  <button onClick={logout} className="text-gray-700 hover:text-violet-600">Logout</button>
                </div>
              ) : (
                <div className="space-x-2">
                  <Link to="/login" className="text-gray-700 hover:text-violet-600">Login</Link>
                  <Link to="/signup" className="px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-700">Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Sliding Banner */}
      <div className="relative overflow-hidden">
        <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {bannerImages.map((image, index) => (
            <img key={index} src={image} alt={`Banner ${index + 1}`} className="w-full h-64 object-cover flex-shrink-0" />
          ))}
        </div>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {bannerImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full ${currentSlide === index ? 'bg-white' : 'bg-white/50'}`}
            />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Products */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={addToCart} onAddToWishlist={addToWishlist} />
            ))}
          </div>
        </section>

        {/* Sale Products */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Sale Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {saleProducts.map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={addToCart} onAddToWishlist={addToWishlist} />
            ))}
          </div>
        </section>

        {/* Only for You */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Only for You</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.slice(0, 4).map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={addToCart} onAddToWishlist={addToWishlist} />
            ))}
          </div>
        </section>

        {/* Male Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">For Him</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {maleProducts.map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={addToCart} onAddToWishlist={addToWishlist} />
            ))}
          </div>
        </section>

        {/* Female Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">For Her</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {femaleProducts.map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={addToCart} onAddToWishlist={addToWishlist} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function ProductCard({ product, onAddToCart, onAddToWishlist }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xl font-bold text-violet-600">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through ml-2">${product.originalPrice}</span>
            )}
          </div>
          {product.isSale && <span className="bg-red-500 text-white px-2 py-1 rounded text-xs">Sale</span>}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onAddToCart(product)}
            className="flex-1 bg-violet-600 text-white py-2 rounded hover:bg-violet-700 transition"
          >
            Add to Cart
          </button>
          <button
            onClick={() => onAddToWishlist(product)}
            className="p-2 border border-gray-300 rounded hover:bg-gray-100 transition"
          >
            <span className="material-icons text-gray-600">favorite_border</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-violet-50">
      <h2 className="text-3xl font-bold text-violet-700 mb-6">Login to Beauty Zone</h2>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-violet-700 mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-violet-400"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-violet-700 mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-violet-400"
            required
          />
        </div>
        <button type="submit" className="w-full bg-violet-600 text-white py-2 rounded hover:bg-violet-700 transition">Login</button>
        <div className="mt-4 text-center">
          <Link to="/signup" className="text-violet-600 hover:underline">Don't have an account? Sign Up</Link>
        </div>
      </form>
    </div>
  );
}

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/auth/signup', { name, email, password });
      localStorage.setItem('token', response.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-violet-50">
      <h2 className="text-3xl font-bold text-violet-700 mb-6">Sign Up for Beauty Zone</h2>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-violet-700 mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-violet-400"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-violet-700 mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-violet-400"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-violet-700 mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-violet-400"
            required
          />
        </div>
        <button type="submit" className="w-full bg-violet-600 text-white py-2 rounded hover:bg-violet-700 transition">Sign Up</button>
        <div className="mt-4 text-center">
          <Link to="/login" className="text-violet-600 hover:underline">Already have an account? Login</Link>
        </div>
      </form>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
