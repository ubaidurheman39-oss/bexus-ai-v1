/**
 * Bexus AppForge — Master Template Suite for Domain-Specific Web Applications
 * Self-contained, publication-ready, interactive single-file HTML apps with:
 * - Tailwind CSS + Modern Google Fonts + Chart.js + LocalStorage
 * - Complete real-world functionality, zero empty stubs
 */

export function generateFoodDeliveryAppHtml(appTitle: string): string {
  return `<!DOCTYPE html>
<html lang="en" class="h-full">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${appTitle} — Gourmet Food & Express Delivery</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: #0b0d14; }
    ::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.15); border-radius: 9999px; }
    ::-webkit-scrollbar-thumb:hover { background: #f97316; }
  </style>
</head>
<body class="bg-[#090b10] text-zinc-100 h-full flex flex-col overflow-hidden selection:bg-orange-500 selection:text-black">
  <!-- Top Navigation -->
  <header class="border-b border-white/10 bg-[#0e111a]/95 backdrop-blur-md px-4 sm:px-6 py-3 flex items-center justify-between flex-shrink-0 z-30">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-600 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-orange-500/25">
        🍔
      </div>
      <div>
        <div class="flex items-center gap-2">
          <h1 class="font-extrabold text-sm sm:text-base text-white tracking-tight">${appTitle}</h1>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">Express 25m</span>
        </div>
        <div class="flex items-center gap-2 text-[11px] text-zinc-400">
          <span>📍 Delivering to: <strong class="text-zinc-200">Downtown Suite 402</strong></span>
          <span>•</span>
          <span class="text-emerald-400 font-semibold">● Open Now</span>
        </div>
      </div>
    </div>

    <!-- Search & Cart Action -->
    <div class="flex items-center gap-3">
      <div class="relative hidden sm:block">
        <input
          id="searchInput"
          type="text"
          placeholder="Search burger, sushi, pizza..."
          oninput="handleSearch(this.value)"
          class="w-56 px-3 py-1.5 pl-8 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
        />
        <span class="absolute left-2.5 top-2 text-xs text-zinc-500">🔍</span>
      </div>

      <button onclick="toggleCart()" class="relative px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-orange-600/30 transition-all cursor-pointer">
        <span>🛒</span>
        <span>Cart</span>
        <span id="cartBadge" class="w-5 h-5 rounded-full bg-white text-orange-600 font-extrabold text-[10px] flex items-center justify-center shadow-sm">0</span>
      </button>
    </div>
  </header>

  <!-- Categories Bar -->
  <nav class="border-b border-white/10 bg-[#0b0e16] px-4 sm:px-6 py-2 flex items-center gap-2 overflow-x-auto flex-shrink-0 scrollbar-none">
    <button onclick="filterCategory('all')" class="cat-pill active px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all bg-orange-500 text-white shadow-md shadow-orange-500/25 whitespace-nowrap cursor-pointer">
      🌟 All Dishes
    </button>
    <button onclick="filterCategory('burgers')" class="cat-pill px-3.5 py-1.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-all whitespace-nowrap cursor-pointer">
      🍔 Gourmet Burgers
    </button>
    <button onclick="filterCategory('pizza')" class="cat-pill px-3.5 py-1.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-all whitespace-nowrap cursor-pointer">
      🍕 Wood-Fired Pizza
    </button>
    <button onclick="filterCategory('asian')" class="cat-pill px-3.5 py-1.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-all whitespace-nowrap cursor-pointer">
      🍣 Sushi & Asian Wok
    </button>
    <button onclick="filterCategory('healthy')" class="cat-pill px-3.5 py-1.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-all whitespace-nowrap cursor-pointer">
      🥗 Organic Bowls
    </button>
    <button onclick="filterCategory('desserts')" class="cat-pill px-3.5 py-1.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-all whitespace-nowrap cursor-pointer">
      🍰 Sweets & Desserts
    </button>
  </nav>

  <!-- Main Content Layout with Sidebar Cart -->
  <div class="flex-1 flex overflow-hidden relative">
    <!-- Menu Grid -->
    <main class="flex-1 p-4 sm:p-6 overflow-y-auto">
      <!-- Promo Banner -->
      <div class="mb-6 p-4 rounded-2xl bg-gradient-to-r from-orange-950/50 via-amber-950/30 to-zinc-900 border border-orange-500/30 flex items-center justify-between">
        <div>
          <span class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400">Limited Promo</span>
          <h2 class="text-base sm:text-lg font-black text-white mt-1">Get 20% Off Your First Order with Code: <span class="text-orange-400 font-mono">BEXUS20</span></h2>
          <p class="text-xs text-zinc-400">Free priority express delivery for orders above $30</p>
        </div>
        <button onclick="applyPromo('BEXUS20')" class="px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-extrabold text-xs transition-colors cursor-pointer shrink-0">
          Apply Coupon
        </button>
      </div>

      <!-- Food Items Grid -->
      <div id="foodGrid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <!-- Injected via JavaScript -->
      </div>
    </main>

    <!-- Slide-in Cart Drawer -->
    <aside id="cartDrawer" class="hidden w-80 sm:w-96 border-l border-white/10 bg-[#0d1018] flex flex-col justify-between flex-shrink-0 z-20 shadow-2xl transition-all">
      <div class="p-4 border-b border-white/10 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-lg">🛒</span>
          <h3 class="font-extrabold text-sm text-white">Your Order Details</h3>
        </div>
        <button onclick="toggleCart()" class="text-zinc-400 hover:text-white p-1 rounded-lg text-sm cursor-pointer">✕</button>
      </div>

      <!-- Cart Items List -->
      <div id="cartItemsList" class="flex-1 overflow-y-auto p-4 space-y-3">
        <!-- Injected items -->
      </div>

      <!-- Cart Summary & Checkout -->
      <div class="p-4 border-t border-white/10 bg-zinc-900/60 space-y-3">
        <div class="space-y-1.5 text-xs text-zinc-400">
          <div class="flex justify-between"><span>Subtotal:</span><span id="subtotalText" class="text-white font-mono">$0.00</span></div>
          <div class="flex justify-between"><span>Delivery Fee:</span><span id="deliveryText" class="text-emerald-400 font-mono">$2.99</span></div>
          <div class="flex justify-between"><span>Discount:</span><span id="discountText" class="text-orange-400 font-mono">-$0.00</span></div>
          <div class="flex justify-between pt-1.5 border-t border-white/10 text-sm font-bold text-white">
            <span>Total Payable:</span><span id="totalText" class="text-orange-400 font-mono">$0.00</span>
          </div>
        </div>

        <button onclick="openCheckoutModal()" id="checkoutBtn" disabled class="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 disabled:opacity-40 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-600/30 transition-all cursor-pointer">
          <span>Complete Order & Track Delivery</span>
          <span>➔</span>
        </button>
      </div>
    </aside>
  </div>

  <!-- Delivery Tracking Live Modal -->
  <div id="trackingModal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
    <div class="w-full max-w-md bg-[#0f121d] border border-white/10 rounded-2xl p-5 space-y-4 shadow-2xl">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
          <h3 class="font-extrabold text-sm text-white">Live Courier Tracking</h3>
        </div>
        <button onclick="closeTrackingModal()" class="text-zinc-400 hover:text-white text-xs cursor-pointer">✕ Close</button>
      </div>

      <!-- Map & Courier Status -->
      <div class="p-4 rounded-xl bg-zinc-900 border border-white/10 space-y-3">
        <div class="flex items-center justify-between text-xs">
          <span class="text-zinc-400">Estimated Arrival:</span>
          <span class="font-bold text-orange-400 font-mono text-sm" id="etaTime">18 mins</span>
        </div>

        <!-- Progress Steps -->
        <div class="space-y-2 pt-2">
          <div class="flex items-center gap-3 text-xs text-emerald-400">
            <span>✓</span><span>Order Received & Paid</span>
          </div>
          <div class="flex items-center gap-3 text-xs text-emerald-400">
            <span>✓</span><span>Chef Preparing Fresh Gourmet Dish</span>
          </div>
          <div class="flex items-center gap-3 text-xs text-orange-400 font-bold animate-pulse">
            <span>🛵</span><span>Courier (Tariq M.) En Route with Order</span>
          </div>
          <div class="flex items-center gap-3 text-xs text-zinc-600">
            <span>○</span><span>Delivered to Suite 402</span>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between text-xs text-zinc-400 pt-1">
        <span>Courier Contact: +1 (555) 234-8921</span>
        <button onclick="closeTrackingModal()" class="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold cursor-pointer">Done</button>
      </div>
    </div>
  </div>

  <script>
    const MENU_ITEMS = [
      { id: 1, name: 'Truffle Angus Smash Burger', category: 'burgers', price: 14.99, rating: 4.9, time: '15-20 min', cal: '680 kcal', desc: 'Double dry-aged Angus patty, black truffle aioli, aged cheddar on brioche.', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop' },
      { id: 2, name: 'Smoked Jalapeno Bacon Burger', category: 'burgers', price: 13.49, rating: 4.8, time: '15-20 min', cal: '720 kcal', desc: 'Crispy maple bacon, smoked gouda, house chipotle cream, pickles.', img: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500&auto=format&fit=crop' },
      { id: 3, name: 'Neapolitan Margherita Pizza', category: 'pizza', price: 16.50, rating: 4.9, time: '20-25 min', cal: '840 kcal', desc: 'San Marzano tomatoes, fresh buffalo mozzarella, fragrant sweet basil.', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop' },
      { id: 4, name: 'Diavola Spicy Pepperoni', category: 'pizza', price: 18.00, rating: 4.8, time: '20-25 min', cal: '920 kcal', desc: 'Spicy Calabrian salami, red chili honey drizzle, roasted garlic oil.', img: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=500&auto=format&fit=crop' },
      { id: 5, name: 'Salmon Teriyaki & Sesame Bowl', category: 'asian', price: 17.25, rating: 4.9, time: '15-20 min', cal: '540 kcal', desc: 'Wild glazed salmon, edamame, jasmine rice, pickled ginger, wakame.', img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop' },
      { id: 6, name: 'Dragon Roll & Spicy Tuna', category: 'asian', price: 19.50, rating: 5.0, time: '20-30 min', cal: '480 kcal', desc: 'Tempura prawn, avocado, bluefin spicy tuna, eel glaze reduction.', img: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&auto=format&fit=crop' },
      { id: 7, name: 'Avocado Green Goddess Bowl', category: 'healthy', price: 12.99, rating: 4.7, time: '10-15 min', cal: '410 kcal', desc: 'Organic quinoa, massaged kale, roasted chickpeas, tahini drizzle.', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop' },
      { id: 8, name: 'Belgian Lava Chocolate Fondant', category: 'desserts', price: 8.50, rating: 4.9, time: '10 min', cal: '390 kcal', desc: 'Warm molten 70% dark chocolate center with vanilla Madagascar bean gelato.', img: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop' }
    ];

    let cart = JSON.parse(localStorage.getItem('bexus_food_cart') || '[]');
    let currentFilter = 'all';
    let discountRate = 0;

    function renderMenu() {
      const grid = document.getElementById('foodGrid');
      const filtered = currentFilter === 'all' ? MENU_ITEMS : MENU_ITEMS.filter(i => i.category === currentFilter);
      
      grid.innerHTML = filtered.map(item => \`
        <div class="bg-[#11141f] border border-white/10 rounded-2xl overflow-hidden hover:border-orange-500/40 transition-all flex flex-col justify-between group shadow-md">
          <div class="relative h-44 overflow-hidden">
            <img src="\${item.img}" alt="\${item.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            <span class="absolute top-3 right-3 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-amber-300 text-[11px] font-bold">
              ★ \${item.rating}
            </span>
            <span class="absolute bottom-3 left-3 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-zinc-300 text-[10px] font-semibold">
              ⏱ \${item.time}
            </span>
          </div>

          <div class="p-4 flex-1 flex flex-col justify-between space-y-3">
            <div>
              <div class="flex items-center justify-between">
                <h3 class="font-extrabold text-sm text-white group-hover:text-orange-400 transition-colors">\${item.name}</h3>
                <span class="font-bold text-orange-400 font-mono text-sm">$\${item.price.toFixed(2)}</span>
              </div>
              <p class="text-xs text-zinc-400 line-clamp-2 mt-1">\${item.desc}</p>
            </div>

            <div class="flex items-center justify-between pt-2 border-t border-white/5">
              <span class="text-[10px] text-zinc-500 font-mono">\${item.cal}</span>
              <button onclick="addToCart(\${item.id})" class="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-orange-600/30 transition-all cursor-pointer">
                <span>+</span><span>Add to Cart</span>
              </button>
            </div>
          </div>
        </div>
      \`).join('');
    }

    function addToCart(itemId) {
      const item = MENU_ITEMS.find(i => i.id === itemId);
      if (!item) return;
      const existing = cart.find(c => c.id === itemId);
      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({ ...item, qty: 1 });
      }
      saveCart();
      updateCartUI();
      // Auto open drawer on desktop
      const drawer = document.getElementById('cartDrawer');
      if (drawer.classList.contains('hidden')) {
        drawer.classList.remove('hidden');
      }
    }

    function updateQty(itemId, delta) {
      const existing = cart.find(c => c.id === itemId);
      if (!existing) return;
      existing.qty += delta;
      if (existing.qty <= 0) {
        cart = cart.filter(c => c.id !== itemId);
      }
      saveCart();
      updateCartUI();
    }

    function saveCart() {
      localStorage.setItem('bexus_food_cart', JSON.stringify(cart));
    }

    function updateCartUI() {
      const list = document.getElementById('cartItemsList');
      const badge = document.getElementById('cartBadge');
      const checkoutBtn = document.getElementById('checkoutBtn');
      const totalItems = cart.reduce((acc, c) => acc + c.qty, 0);
      badge.innerText = totalItems;

      if (cart.length === 0) {
        list.innerHTML = \`
          <div class="h-40 flex flex-col items-center justify-center text-center text-zinc-500 space-y-1">
            <span class="text-3xl">🧺</span>
            <p class="text-xs">Your cart is currently empty.</p>
            <span class="text-[10px] text-zinc-600">Pick dishes from the left to start!</span>
          </div>
        \`;
        checkoutBtn.disabled = true;
        document.getElementById('subtotalText').innerText = '$0.00';
        document.getElementById('discountText').innerText = '-$0.00';
        document.getElementById('totalText').innerText = '$0.00';
        return;
      }

      checkoutBtn.disabled = false;
      list.innerHTML = cart.map(item => \`
        <div class="p-2.5 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-between gap-2">
          <div class="min-w-0 flex-1">
            <div class="text-xs font-bold text-white truncate">\${item.name}</div>
            <div class="text-[11px] text-orange-400 font-mono">$\${(item.price * item.qty).toFixed(2)}</div>
          </div>
          <div class="flex items-center gap-2 bg-black/40 px-2 py-1 rounded-lg border border-white/5">
            <button onclick="updateQty(\${item.id}, -1)" class="text-zinc-400 hover:text-white text-xs font-bold px-1 cursor-pointer">-</button>
            <span class="text-xs font-bold text-white font-mono">\${item.qty}</span>
            <button onclick="updateQty(\${item.id}, 1)" class="text-zinc-400 hover:text-white text-xs font-bold px-1 cursor-pointer">+</button>
          </div>
        </div>
      \`).join('');

      const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
      const discount = subtotal * discountRate;
      const delivery = subtotal > 30 ? 0.00 : 2.99;
      const total = Math.max(0, subtotal - discount + delivery);

      document.getElementById('subtotalText').innerText = '$' + subtotal.toFixed(2);
      document.getElementById('deliveryText').innerText = delivery === 0 ? 'FREE' : '$' + delivery.toFixed(2);
      document.getElementById('discountText').innerText = '-$' + discount.toFixed(2);
      document.getElementById('totalText').innerText = '$' + total.toFixed(2);
    }

    function toggleCart() {
      const drawer = document.getElementById('cartDrawer');
      drawer.classList.toggle('hidden');
    }

    function filterCategory(cat) {
      currentFilter = cat;
      document.querySelectorAll('.cat-pill').forEach(btn => {
        btn.classList.remove('bg-orange-500', 'text-white');
        btn.classList.add('text-zinc-400');
      });
      event.target.classList.add('bg-orange-500', 'text-white');
      event.target.classList.remove('text-zinc-400');
      renderMenu();
    }

    function handleSearch(query) {
      const q = query.toLowerCase();
      const grid = document.getElementById('foodGrid');
      const filtered = MENU_ITEMS.filter(item => 
        item.name.toLowerCase().includes(q) || 
        item.desc.toLowerCase().includes(q) || 
        item.category.toLowerCase().includes(q)
      );
      grid.innerHTML = filtered.map(item => \`
        <div class="bg-[#11141f] border border-white/10 rounded-2xl overflow-hidden p-4">
          <h3 class="font-bold text-white">\${item.name}</h3>
          <p class="text-xs text-zinc-400">\${item.desc}</p>
          <div class="mt-2 flex justify-between items-center">
            <span class="text-orange-400 font-bold font-mono">$\${item.price.toFixed(2)}</span>
            <button onclick="addToCart(\${item.id})" class="px-2.5 py-1 rounded bg-orange-600 text-xs font-bold text-white">Add</button>
          </div>
        </div>
      \`).join('');
    }

    function applyPromo(code) {
      if (code === 'BEXUS20') {
        discountRate = 0.20;
        updateCartUI();
        alert('🎉 Promo Code BEXUS20 Applied: 20% Discount Activated!');
      }
    }

    function openCheckoutModal() {
      document.getElementById('trackingModal').classList.remove('hidden');
    }

    function closeTrackingModal() {
      document.getElementById('trackingModal').classList.add('hidden');
    }

    renderMenu();
    updateCartUI();
  </script>
</body>
</html>`;
}

export function generateFitnessTrackerHtml(appTitle: string): string {
  return `<!DOCTYPE html>
<html lang="en" class="h-full">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${appTitle} — Pro Fitness & Calorie Studio</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    .mono { font-family: 'JetBrains Mono', monospace; }
  </style>
</head>
<body class="bg-[#080b11] text-zinc-100 h-full flex flex-col overflow-hidden selection:bg-emerald-500 selection:text-black">
  <!-- Top Navigation Bar -->
  <header class="border-b border-white/10 bg-[#0e121b] px-4 sm:px-6 py-3 flex items-center justify-between flex-shrink-0 z-30">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-400 via-teal-500 to-cyan-500 flex items-center justify-center font-black text-black text-lg shadow-lg shadow-emerald-500/25">
        ⚡
      </div>
      <div>
        <div class="flex items-center gap-2">
          <h1 class="font-extrabold text-sm sm:text-base text-white tracking-tight">${appTitle}</h1>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Daily Goal Active</span>
        </div>
        <div class="text-[11px] text-zinc-400">
          <span>Streak: <strong class="text-amber-400">🔥 14 Days</strong></span>
          <span> • </span>
          <span>Target: <strong class="text-zinc-200">2,400 kcal</strong></span>
        </div>
      </div>
    </div>

    <!-- Quick Stats & Date -->
    <div class="flex items-center gap-2">
      <button onclick="resetDay()" class="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white text-xs font-semibold cursor-pointer">
        Reset Day
      </button>
      <button onclick="openWorkoutModal()" class="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer">
        <span>+</span><span>Log Workout</span>
      </button>
    </div>
  </header>

  <!-- Main Body Grid -->
  <div class="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
    <!-- Top 4 Metric Rings -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
      <!-- Calories -->
      <div class="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 flex flex-col justify-between space-y-2">
        <div class="flex items-center justify-between text-xs text-zinc-400">
          <span class="font-bold">Active Calories</span>
          <span class="text-emerald-400 font-bold">78%</span>
        </div>
        <div>
          <div class="text-2xl font-black text-white mono" id="calText">1,840</div>
          <div class="text-[11px] text-zinc-500">Goal: 2,400 kcal</div>
        </div>
        <div class="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
          <div id="calBar" class="bg-gradient-to-r from-emerald-400 to-teal-400 h-full rounded-full" style="width: 78%"></div>
        </div>
      </div>

      <!-- Water Intake -->
      <div class="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 flex flex-col justify-between space-y-2">
        <div class="flex items-center justify-between text-xs text-zinc-400">
          <span class="font-bold">Hydration (H2O)</span>
          <span class="text-cyan-400 font-bold" id="waterPct">80%</span>
        </div>
        <div>
          <div class="text-2xl font-black text-cyan-400 mono" id="waterText">2,000 ml</div>
          <div class="text-[11px] text-zinc-500">Goal: 2,500 ml</div>
        </div>
        <div class="flex items-center gap-1.5 pt-1">
          <button onclick="addWater(250)" class="flex-1 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-300 text-xs font-bold cursor-pointer">+250ml</button>
          <button onclick="addWater(500)" class="flex-1 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-300 text-xs font-bold cursor-pointer">+500ml</button>
        </div>
      </div>

      <!-- Active Minutes -->
      <div class="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 flex flex-col justify-between space-y-2">
        <div class="flex items-center justify-between text-xs text-zinc-400">
          <span class="font-bold">Active Time</span>
          <span class="text-amber-400 font-bold">52 min</span>
        </div>
        <div>
          <div class="text-2xl font-black text-white mono" id="minutesText">52 <span class="text-sm font-normal text-zinc-400">mins</span></div>
          <div class="text-[11px] text-zinc-500">Goal: 60 mins</div>
        </div>
        <div class="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
          <div class="bg-amber-400 h-full rounded-full" style="width: 86%"></div>
        </div>
      </div>

      <!-- Heart Rate & Cardio -->
      <div class="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 flex flex-col justify-between space-y-2">
        <div class="flex items-center justify-between text-xs text-zinc-400">
          <span class="font-bold">Avg Heart Rate</span>
          <span class="text-rose-400 font-bold">Resting 62</span>
        </div>
        <div>
          <div class="text-2xl font-black text-rose-400 mono">124 <span class="text-sm font-normal text-zinc-400">BPM</span></div>
          <div class="text-[11px] text-zinc-500">Zone 2 Aerobic</div>
        </div>
        <div class="text-xs text-zinc-400 flex items-center gap-1">
          <span class="text-rose-500 animate-pulse">❤️</span> Peak: 168 BPM
        </div>
      </div>
    </div>

    <!-- Middle Section: Chart & Macronutrients -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Weekly Burn Chart -->
      <div class="lg:col-span-2 p-5 rounded-2xl bg-zinc-900/60 border border-white/10 space-y-3">
        <div class="flex items-center justify-between">
          <h3 class="font-extrabold text-sm text-white flex items-center gap-2">
            <span>📈</span><span>Weekly Calorie Burn & Activity Velocity</span>
          </h3>
          <span class="text-xs font-mono text-emerald-400">Avg 2,180 kcal/day</span>
        </div>
        <div class="h-56">
          <canvas id="burnChart"></canvas>
        </div>
      </div>

      <!-- Macro Breakdown Donut -->
      <div class="p-5 rounded-2xl bg-zinc-900/60 border border-white/10 space-y-3 flex flex-col justify-between">
        <div class="flex items-center justify-between">
          <h3 class="font-extrabold text-sm text-white">Daily Macros</h3>
          <span class="text-xs text-zinc-400">140g P / 210g C / 55g F</span>
        </div>
        <div class="h-44 flex items-center justify-center">
          <canvas id="macroChart"></canvas>
        </div>
        <div class="grid grid-cols-3 gap-2 text-center text-xs">
          <div class="p-2 rounded-xl bg-zinc-800/60"><div class="font-bold text-emerald-400">140g</div><div class="text-[10px] text-zinc-400">Protein</div></div>
          <div class="p-2 rounded-xl bg-zinc-800/60"><div class="font-bold text-amber-400">210g</div><div class="text-[10px] text-zinc-400">Carbs</div></div>
          <div class="p-2 rounded-xl bg-zinc-800/60"><div class="font-bold text-rose-400">55g</div><div class="text-[10px] text-zinc-400">Fats</div></div>
        </div>
      </div>
    </div>

    <!-- Workouts List -->
    <div class="p-5 rounded-2xl bg-zinc-900/60 border border-white/10 space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="font-extrabold text-sm text-white flex items-center gap-2">
          <span>🏋️</span><span>Today's Logged Workouts & Sets</span>
        </h3>
        <span class="text-xs text-zinc-400">Auto-saved to Vault</span>
      </div>

      <div id="workoutList" class="grid grid-cols-1 md:grid-cols-3 gap-3">
        <!-- Injected via JavaScript -->
      </div>
    </div>
  </div>

  <!-- Workout Logger Modal -->
  <div id="workoutModal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
    <div class="w-full max-w-md bg-[#0f131f] border border-white/10 rounded-2xl p-5 space-y-4 shadow-2xl">
      <div class="flex items-center justify-between">
        <h3 class="font-extrabold text-sm text-white">Log Exercise Routine</h3>
        <button onclick="closeWorkoutModal()" class="text-zinc-400 hover:text-white text-xs cursor-pointer">✕</button>
      </div>

      <div class="space-y-3">
        <div>
          <label class="text-xs text-zinc-400">Exercise Name</label>
          <input id="exName" type="text" placeholder="e.g. Barbell Deadlift, 5km Run, HIIT" class="w-full mt-1 p-2.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white" />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="text-xs text-zinc-400">Duration (Minutes)</label>
            <input id="exMin" type="number" value="30" class="w-full mt-1 p-2.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white" />
          </div>
          <div>
            <label class="text-xs text-zinc-400">Calories Burned</label>
            <input id="exCal" type="number" value="280" class="w-full mt-1 p-2.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white" />
          </div>
        </div>
      </div>

      <div class="flex justify-end gap-2 pt-2">
        <button onclick="closeWorkoutModal()" class="px-3 py-2 rounded-xl bg-zinc-800 text-xs text-zinc-300">Cancel</button>
        <button onclick="saveWorkout()" class="px-4 py-2 rounded-xl bg-emerald-500 text-xs font-bold text-black hover:bg-emerald-400">Save to Log</button>
      </div>
    </div>
  </div>

  <script>
    let waterMl = parseInt(localStorage.getItem('bexus_fit_water') || '2000');
    let totalCals = parseInt(localStorage.getItem('bexus_fit_cals') || '1840');
    let workouts = JSON.parse(localStorage.getItem('bexus_fit_workouts') || JSON.stringify([
      { name: 'Barbell Squat & Leg Day', min: 45, cal: 380, icon: '🏋️' },
      { name: '5km Morning Hill Run', min: 28, cal: 310, icon: '🏃' },
      { name: 'Core HIIT & Plank Holds', min: 15, cal: 140, icon: '⚡' }
    ]));

    function renderWorkouts() {
      const list = document.getElementById('workoutList');
      list.innerHTML = workouts.map(w => \`
        <div class="p-3.5 rounded-xl bg-zinc-950 border border-white/5 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="text-xl">\${w.icon || '💪'}</span>
            <div>
              <div class="font-bold text-xs text-white">\${w.name}</div>
              <div class="text-[10px] text-zinc-500">\${w.min} mins • \${w.cal} kcal</div>
            </div>
          </div>
          <span class="text-xs font-mono text-emerald-400 font-bold">+\${w.cal}</span>
        </div>
      \`).join('');
    }

    function addWater(amount) {
      waterMl += amount;
      localStorage.setItem('bexus_fit_water', waterMl.toString());
      document.getElementById('waterText').innerText = waterMl + ' ml';
      const pct = Math.min(100, Math.round((waterMl / 2500) * 100));
      document.getElementById('waterPct').innerText = pct + '%';
    }

    function openWorkoutModal() {
      document.getElementById('workoutModal').classList.remove('hidden');
    }
    function closeWorkoutModal() {
      document.getElementById('workoutModal').classList.add('hidden');
    }

    function saveWorkout() {
      const name = document.getElementById('exName').value || 'Custom Training';
      const min = parseInt(document.getElementById('exMin').value) || 20;
      const cal = parseInt(document.getElementById('exCal').value) || 150;

      workouts.unshift({ name, min, cal, icon: '🔥' });
      totalCals += cal;
      localStorage.setItem('bexus_fit_workouts', JSON.stringify(workouts));
      localStorage.setItem('bexus_fit_cals', totalCals.toString());
      document.getElementById('calText').innerText = totalCals;
      renderWorkouts();
      closeWorkoutModal();
    }

    function resetDay() {
      waterMl = 0;
      totalCals = 0;
      localStorage.setItem('bexus_fit_water', '0');
      localStorage.setItem('bexus_fit_cals', '0');
      document.getElementById('waterText').innerText = '0 ml';
      document.getElementById('calText').innerText = '0';
      document.getElementById('waterPct').innerText = '0%';
    }

    // Initialize Chart.js Weekly Burn
    new Chart(document.getElementById('burnChart'), {
      type: 'bar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Calories Burned (kcal)',
          data: [2100, 2450, 1980, 2600, 2320, 2850, 1840],
          backgroundColor: '#10b981',
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#71717a' } },
          y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#71717a' } }
        }
      }
    });

    // Initialize Macro Donut
    new Chart(document.getElementById('macroChart'), {
      type: 'doughnut',
      data: {
        labels: ['Protein', 'Carbs', 'Fats'],
        datasets: [{
          data: [140, 210, 55],
          backgroundColor: ['#34d399', '#f59e0b', '#f43f5e'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        cutout: '72%'
      }
    });

    renderWorkouts();
  </script>
</body>
</html>`;
}

export function generateCryptoTradingHtml(appTitle: string): string {
  return `<!DOCTYPE html>
<html lang="en" class="h-full">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${appTitle} — Autonomous Digital Assets Exchange</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    .mono { font-family: 'JetBrains Mono', monospace; }
  </style>
</head>
<body class="bg-[#06080e] text-zinc-100 h-full flex flex-col overflow-hidden selection:bg-emerald-500 selection:text-black">
  <!-- Top Navigation Header -->
  <header class="border-b border-white/10 bg-[#0a0e17] px-4 sm:px-6 py-2.5 flex items-center justify-between flex-shrink-0 z-30">
    <div class="flex items-center gap-3">
      <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 via-orange-500 to-emerald-500 flex items-center justify-center font-black text-black text-sm shadow-lg shadow-amber-500/25">
        ₿
      </div>
      <div>
        <div class="flex items-center gap-2">
          <h1 class="font-extrabold text-sm sm:text-base text-white tracking-tight">${appTitle}</h1>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Live Market</span>
        </div>
        <div class="flex items-center gap-2 text-[11px] text-zinc-400">
          <span>BTC/USD: <strong class="text-emerald-400 mono" id="headerBtcPrice">$94,820.50</strong></span>
          <span>•</span>
          <span class="text-emerald-400 font-bold">+4.82% 24h</span>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <div class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/10 text-xs">
        <span class="text-zinc-400">Cash Balance:</span>
        <span class="text-white font-mono font-bold" id="cashBalance">$25,000.00</span>
      </div>
      <button onclick="resetBalance()" class="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white text-xs cursor-pointer">
        Reset
      </button>
    </div>
  </header>

  <!-- Market Grid Layout -->
  <div class="flex-1 grid grid-cols-1 lg:grid-cols-4 overflow-hidden">
    <!-- Left 3 Columns: Chart & Buy/Sell -->
    <div class="lg:col-span-3 flex flex-col border-r border-white/10 overflow-y-auto">
      <!-- Chart Header -->
      <div class="p-4 border-b border-white/10 bg-[#080b12] flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="text-2xl font-black text-white mono" id="activePrice">$94,820.50</span>
          <span class="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold">+$4,210.00 (Today)</span>
        </div>
        <div class="flex gap-1 bg-zinc-900 p-1 rounded-xl border border-white/10 text-xs">
          <button class="px-2.5 py-1 rounded-lg bg-emerald-500 text-black font-bold">1H</button>
          <button class="px-2.5 py-1 rounded-lg text-zinc-400 hover:text-white">24H</button>
          <button class="px-2.5 py-1 rounded-lg text-zinc-400 hover:text-white">7D</button>
          <button class="px-2.5 py-1 rounded-lg text-zinc-400 hover:text-white">1M</button>
        </div>
      </div>

      <!-- Real-Time Chart -->
      <div class="h-64 sm:h-80 p-4 bg-[#070a10]">
        <canvas id="cryptoChart"></canvas>
      </div>

      <!-- Trading Form Section -->
      <div class="p-4 sm:p-6 border-t border-white/10 bg-[#0b0f19] space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="font-extrabold text-sm text-white">Instant Order Execution</h3>
          <div class="flex gap-1 bg-zinc-900 p-1 rounded-xl border border-white/10 text-xs">
            <button onclick="setTradeType('buy')" id="buyTab" class="px-4 py-1.5 rounded-lg bg-emerald-500 text-black font-bold cursor-pointer">BUY</button>
            <button onclick="setTradeType('sell')" id="sellTab" class="px-4 py-1.5 rounded-lg text-zinc-400 hover:text-white cursor-pointer">SELL</button>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label class="text-[11px] text-zinc-400">Order Type</label>
            <div class="mt-1 p-2.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white font-semibold">Market Order (Instant)</div>
          </div>
          <div>
            <label class="text-[11px] text-zinc-400">Amount (USD)</label>
            <input id="tradeAmount" type="number" value="1000" oninput="calculateTokens(this.value)" class="w-full mt-1 p-2.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white font-mono" />
          </div>
          <div>
            <label class="text-[11px] text-zinc-400">Estimated BTC</label>
            <div id="estTokens" class="mt-1 p-2.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-emerald-400 font-mono font-bold">0.010546 BTC</div>
          </div>
        </div>

        <button onclick="executeTrade()" id="execBtn" class="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold text-xs tracking-wider uppercase shadow-lg shadow-emerald-500/25 transition-all cursor-pointer">
          Execute Instant Buy Order
        </button>
      </div>

      <!-- Recent Executed Orders -->
      <div class="p-4 border-t border-white/10 bg-[#080b12]">
        <h4 class="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Order History</h4>
        <div id="orderHistory" class="space-y-1.5 text-xs">
          <!-- Injected via JS -->
        </div>
      </div>
    </div>

    <!-- Right Column: Live Orderbook & Portfolio -->
    <aside class="p-4 bg-[#090d16] flex flex-col justify-between overflow-y-auto space-y-4">
      <!-- Portfolio Card -->
      <div class="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 space-y-2">
        <span class="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Your Holdings</span>
        <div class="flex justify-between items-center">
          <span class="text-xs text-zinc-300">Bitcoin (BTC):</span>
          <span id="btcHoldings" class="text-xs text-emerald-400 font-mono font-bold">0.450000 BTC</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-xs text-zinc-300">Value (USD):</span>
          <span id="btcValue" class="text-xs text-white font-mono font-bold">$42,669.22</span>
        </div>
      </div>

      <!-- Live Orderbook -->
      <div class="space-y-2 flex-1">
        <div class="flex items-center justify-between text-xs text-zinc-400 font-bold uppercase tracking-wider">
          <span>Live Order Book</span>
          <span class="text-zinc-500 text-[10px]">Real-Time Flow</span>
        </div>

        <div class="space-y-1 font-mono text-[11px]" id="orderBookAsks">
          <!-- Red Asks -->
        </div>

        <div class="py-1.5 text-center text-xs font-bold text-white bg-zinc-900/80 rounded-lg border border-white/5" id="midPrice">
          $94,820.50
        </div>

        <div class="space-y-1 font-mono text-[11px]" id="orderBookBids">
          <!-- Green Bids -->
        </div>
      </div>
    </aside>
  </div>

  <script>
    let btcPrice = 94820.50;
    let cash = parseFloat(localStorage.getItem('bexus_crypto_cash') || '25000.00');
    let btcHolding = parseFloat(localStorage.getItem('bexus_crypto_btc') || '0.450000');
    let tradeMode = 'buy';
    let history = JSON.parse(localStorage.getItem('bexus_crypto_history') || '[]');

    let chartData = [93100, 93450, 93200, 93800, 94100, 94050, 94400, 94650, 94820];
    let chartLabels = ['10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45', '12:00'];

    const ctx = document.getElementById('cryptoChart');
    const myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: chartLabels,
        datasets: [{
          data: chartData,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.08)',
          fill: true,
          tension: 0.3,
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: '#10b981'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#71717a' } },
          y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#71717a' } }
        }
      }
    });

    // Simulating Live Fluctuation
    setInterval(() => {
      const delta = (Math.random() - 0.49) * 45;
      btcPrice = Math.max(90000, btcPrice + delta);
      document.getElementById('headerBtcPrice').innerText = '$' + btcPrice.toFixed(2);
      document.getElementById('activePrice').innerText = '$' + btcPrice.toFixed(2);
      document.getElementById('midPrice').innerText = '$' + btcPrice.toFixed(2);
      updateOrderbook();
      updatePortfolio();
    }, 1500);

    function setTradeType(type) {
      tradeMode = type;
      const buyTab = document.getElementById('buyTab');
      const sellTab = document.getElementById('sellTab');
      const execBtn = document.getElementById('execBtn');

      if (type === 'buy') {
        buyTab.className = 'px-4 py-1.5 rounded-lg bg-emerald-500 text-black font-bold cursor-pointer';
        sellTab.className = 'px-4 py-1.5 rounded-lg text-zinc-400 hover:text-white cursor-pointer';
        execBtn.className = 'w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-black font-extrabold text-xs uppercase cursor-pointer';
        execBtn.innerText = 'Execute Instant Buy Order';
      } else {
        sellTab.className = 'px-4 py-1.5 rounded-lg bg-rose-600 text-white font-bold cursor-pointer';
        buyTab.className = 'px-4 py-1.5 rounded-lg text-zinc-400 hover:text-white cursor-pointer';
        execBtn.className = 'w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 text-white font-extrabold text-xs uppercase cursor-pointer';
        execBtn.innerText = 'Execute Instant Sell Order';
      }
    }

    function calculateTokens(usd) {
      const val = parseFloat(usd) || 0;
      const btc = val / btcPrice;
      document.getElementById('estTokens').innerText = btc.toFixed(6) + ' BTC';
    }

    function executeTrade() {
      const amt = parseFloat(document.getElementById('tradeAmount').value) || 0;
      if (amt <= 0) return;

      const tokens = amt / btcPrice;
      if (tradeMode === 'buy') {
        if (amt > cash) {
          alert('Insufficient USD balance!');
          return;
        }
        cash -= amt;
        btcHolding += tokens;
        history.unshift({ type: 'BUY', amt: amt.toFixed(2), tokens: tokens.toFixed(6), price: btcPrice.toFixed(2), time: new Date().toLocaleTimeString() });
      } else {
        if (tokens > btcHolding) {
          alert('Insufficient BTC holding!');
          return;
        }
        btcHolding -= tokens;
        cash += amt;
        history.unshift({ type: 'SELL', amt: amt.toFixed(2), tokens: tokens.toFixed(6), price: btcPrice.toFixed(2), time: new Date().toLocaleTimeString() });
      }

      localStorage.setItem('bexus_crypto_cash', cash.toString());
      localStorage.setItem('bexus_crypto_btc', btcHolding.toString());
      localStorage.setItem('bexus_crypto_history', JSON.stringify(history));
      updatePortfolio();
      renderHistory();
    }

    function updatePortfolio() {
      document.getElementById('cashBalance').innerText = '$' + cash.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      document.getElementById('btcHoldings').innerText = btcHolding.toFixed(6) + ' BTC';
      document.getElementById('btcValue').innerText = '$' + (btcHolding * btcPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function updateOrderbook() {
      const asks = document.getElementById('orderBookAsks');
      const bids = document.getElementById('orderBookBids');
      asks.innerHTML = [3, 2, 1].map(i => \`
        <div class="flex justify-between text-rose-400">
          <span>$\${(btcPrice + (i * 12.5)).toFixed(2)}</span>
          <span class="text-zinc-500">\${(0.12 * i).toFixed(3)}</span>
        </div>
      \`).join('');

      bids.innerHTML = [1, 2, 3].map(i => \`
        <div class="flex justify-between text-emerald-400">
          <span>$\${(btcPrice - (i * 12.5)).toFixed(2)}</span>
          <span class="text-zinc-500">\${(0.15 * i).toFixed(3)}</span>
        </div>
      \`).join('');
    }

    function renderHistory() {
      const list = document.getElementById('orderHistory');
      if (history.length === 0) {
        list.innerHTML = '<div class="text-zinc-500 text-[11px]">No orders executed yet.</div>';
        return;
      }
      list.innerHTML = history.slice(0, 4).map(h => \`
        <div class="flex justify-between p-1.5 rounded bg-zinc-900/60 border border-white/5">
          <span class="\${h.type === 'BUY' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}">\${h.type} \${h.tokens} BTC</span>
          <span class="text-zinc-400">$\${h.amt}</span>
          <span class="text-zinc-600">\${h.time}</span>
        </div>
      \`).join('');
    }

    function resetBalance() {
      cash = 25000.00;
      btcHolding = 0.450000;
      history = [];
      localStorage.setItem('bexus_crypto_cash', '25000');
      localStorage.setItem('bexus_crypto_btc', '0.45');
      localStorage.setItem('bexus_crypto_history', '[]');
      updatePortfolio();
      renderHistory();
    }

    updatePortfolio();
    updateOrderbook();
    renderHistory();
  </script>
</body>
</html>`;
}

export function generateKanbanSprintBoardHtml(appTitle: string): string {
  return `<!DOCTYPE html>
<html lang="en" class="h-full">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${appTitle} — Sprint Workspace</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    .mono { font-family: 'JetBrains Mono', monospace; }
  </style>
</head>
<body class="bg-[#080911] text-zinc-100 h-full flex flex-col overflow-hidden selection:bg-indigo-500 selection:text-white">
  <!-- Top Navigation Header -->
  <header class="border-b border-white/10 bg-[#0d0f1c] px-4 sm:px-6 py-3 flex items-center justify-between flex-shrink-0 z-30">
    <div class="flex items-center gap-3">
      <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center font-black text-white text-sm shadow-lg shadow-indigo-500/25">
        ▦
      </div>
      <div>
        <div class="flex items-center gap-2">
          <h1 class="font-extrabold text-sm sm:text-base text-white tracking-tight">${appTitle}</h1>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">Sprint 26</span>
        </div>
        <div class="text-[11px] text-zinc-400">
          <span>Sprint Goal: <strong class="text-zinc-200">Ship v4.5 Core Architecture</strong></span>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-2">
      <button onclick="openNewTaskModal()" class="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 cursor-pointer">
        <span>+</span><span>New Issue</span>
      </button>
    </div>
  </header>

  <!-- Board Columns -->
  <div class="flex-1 p-4 sm:p-6 overflow-x-auto">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 min-w-[850px] h-full">
      <!-- Backlog -->
      <div class="flex flex-col bg-[#0f1122]/70 border border-white/10 rounded-2xl p-3.5 space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-zinc-500"></span>
            <h3 class="font-bold text-xs text-white uppercase tracking-wider">Backlog</h3>
          </div>
          <span id="count-backlog" class="text-xs px-2 py-0.5 rounded bg-white/5 font-mono text-zinc-400">0</span>
        </div>
        <div id="col-backlog" class="flex-1 overflow-y-auto space-y-2.5 pr-1"></div>
      </div>

      <!-- In Progress -->
      <div class="flex flex-col bg-[#0f1122]/70 border border-white/10 rounded-2xl p-3.5 space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
            <h3 class="font-bold text-xs text-white uppercase tracking-wider">In Progress</h3>
          </div>
          <span id="count-progress" class="text-xs px-2 py-0.5 rounded bg-white/5 font-mono text-amber-400">0</span>
        </div>
        <div id="col-progress" class="flex-1 overflow-y-auto space-y-2.5 pr-1"></div>
      </div>

      <!-- Code Review -->
      <div class="flex flex-col bg-[#0f1122]/70 border border-white/10 rounded-2xl p-3.5 space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            <h3 class="font-bold text-xs text-white uppercase tracking-wider">Code Review</h3>
          </div>
          <span id="count-review" class="text-xs px-2 py-0.5 rounded bg-white/5 font-mono text-cyan-400">0</span>
        </div>
        <div id="col-review" class="flex-1 overflow-y-auto space-y-2.5 pr-1"></div>
      </div>

      <!-- Done -->
      <div class="flex flex-col bg-[#0f1122]/70 border border-white/10 rounded-2xl p-3.5 space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <h3 class="font-bold text-xs text-white uppercase tracking-wider">Completed</h3>
          </div>
          <span id="count-done" class="text-xs px-2 py-0.5 rounded bg-white/5 font-mono text-emerald-400">0</span>
        </div>
        <div id="col-done" class="flex-1 overflow-y-auto space-y-2.5 pr-1"></div>
      </div>
    </div>
  </div>

  <!-- Create Issue Modal -->
  <div id="taskModal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
    <div class="w-full max-w-md bg-[#111427] border border-white/10 rounded-2xl p-5 space-y-4 shadow-2xl">
      <div class="flex items-center justify-between">
        <h3 class="font-extrabold text-sm text-white">Create Sprint Issue</h3>
        <button onclick="closeTaskModal()" class="text-zinc-400 hover:text-white text-xs cursor-pointer">✕</button>
      </div>

      <div class="space-y-3">
        <div>
          <label class="text-xs text-zinc-400">Issue Title</label>
          <input id="taskTitle" type="text" placeholder="e.g. Implement WebSocket Real-time Sync" class="w-full mt-1 p-2.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white" />
        </div>
        <div>
          <label class="text-xs text-zinc-400">Description</label>
          <textarea id="taskDesc" rows="3" placeholder="Technical specifications or acceptance criteria..." class="w-full mt-1 p-2.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white resize-none"></textarea>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="text-xs text-zinc-400">Priority</label>
            <select id="taskPriority" class="w-full mt-1 p-2.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white">
              <option value="CRITICAL">🔴 Critical</option>
              <option value="HIGH">🟠 High</option>
              <option value="MEDIUM" selected>🟡 Medium</option>
              <option value="LOW">🔵 Low</option>
            </select>
          </div>
          <div>
            <label class="text-xs text-zinc-400">Assignee</label>
            <input id="taskAssignee" type="text" value="Alex R." class="w-full mt-1 p-2.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white" />
          </div>
        </div>
      </div>

      <div class="flex justify-end gap-2 pt-2">
        <button onclick="closeTaskModal()" class="px-3 py-2 rounded-xl bg-zinc-800 text-xs text-zinc-300">Cancel</button>
        <button onclick="saveTask()" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white">Add Issue</button>
      </div>
    </div>
  </div>

  <script>
    let tasks = JSON.parse(localStorage.getItem('bexus_kanban_tasks') || JSON.stringify([
      { id: 1, title: 'Upgrade Core Neural Synthesis Engine', desc: 'Deploy multi-model fallback hierarchy and latency metrics', col: 'progress', priority: 'CRITICAL', assignee: 'Dev Lead' },
      { id: 2, title: 'Design High-Fidelity Audio Studio', desc: 'Implement animated waveform and MP3 download for video editors', col: 'review', priority: 'HIGH', assignee: 'Sara M.' },
      { id: 3, title: 'Real-time WebSocket Pipeline', desc: 'Stream token response chunks directly to client terminal', col: 'backlog', priority: 'MEDIUM', assignee: 'Alex R.' },
      { id: 4, title: 'Instant Document Summarizer v4', desc: 'Add SWOT and executive KPI analytics matrix', col: 'done', priority: 'HIGH', assignee: 'Dev Lead' }
    ]));

    function renderBoard() {
      const cols = ['backlog', 'progress', 'review', 'done'];
      cols.forEach(c => {
        const container = document.getElementById('col-' + c);
        const colTasks = tasks.filter(t => t.col === c);
        document.getElementById('count-' + c).innerText = colTasks.length;

        container.innerHTML = colTasks.map(t => \`
          <div class="p-3.5 rounded-xl bg-[#141830] border border-white/10 space-y-2.5 hover:border-indigo-500/40 transition-all shadow-md group">
            <div class="flex items-center justify-between">
              <span class="text-[9px] px-1.5 py-0.5 rounded font-bold \${
                t.priority === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                t.priority === 'HIGH' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' :
                t.priority === 'MEDIUM' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                'bg-blue-500/20 text-blue-300'
              }">\${t.priority}</span>
              <button onclick="deleteTask(\${t.id})" class="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-rose-400 text-xs transition-opacity cursor-pointer">✕</button>
            </div>

            <h4 class="text-xs font-bold text-white">\${t.title}</h4>
            <p class="text-[11px] text-zinc-400 line-clamp-2">\${t.desc}</p>

            <div class="flex items-center justify-between pt-2 border-t border-white/5 text-[11px]">
              <span class="text-zinc-400">👤 \${t.assignee}</span>
              <div class="flex items-center gap-1">
                \${c !== 'backlog' ? \`<button onclick="moveTask(\${t.id}, -1)" class="p-1 text-zinc-400 hover:text-white rounded hover:bg-white/5 cursor-pointer">◀</button>\` : ''}
                \${c !== 'done' ? \`<button onclick="moveTask(\${t.id}, 1)" class="p-1 text-indigo-400 hover:text-indigo-200 rounded hover:bg-white/5 cursor-pointer">▶</button>\` : ''}
              </div>
            </div>
          </div>
        \`).join('');
      });
    }

    function moveTask(id, dir) {
      const task = tasks.find(t => t.id === id);
      if (!task) return;
      const cols = ['backlog', 'progress', 'review', 'done'];
      const curIdx = cols.indexOf(task.col);
      const newIdx = curIdx + dir;
      if (newIdx >= 0 && newIdx < cols.length) {
        task.col = cols[newIdx];
        saveTasks();
        renderBoard();
      }
    }

    function deleteTask(id) {
      tasks = tasks.filter(t => t.id !== id);
      saveTasks();
      renderBoard();
    }

    function openNewTaskModal() {
      document.getElementById('taskModal').classList.remove('hidden');
    }
    function closeTaskModal() {
      document.getElementById('taskModal').classList.add('hidden');
    }

    function saveTask() {
      const title = document.getElementById('taskTitle').value.trim();
      const desc = document.getElementById('taskDesc').value.trim();
      const priority = document.getElementById('taskPriority').value;
      const assignee = document.getElementById('taskAssignee').value.trim() || 'Team';

      if (!title) return;
      tasks.unshift({ id: Date.now(), title, desc, priority, assignee, col: 'backlog' });
      saveTasks();
      renderBoard();
      closeTaskModal();
    }

    function saveTasks() {
      localStorage.setItem('bexus_kanban_tasks', JSON.stringify(tasks));
    }

    renderBoard();
  </script>
</body>
</html>`;
}

export function generateCarRentalAppHtml(appTitle: string): string {
  return `<!DOCTYPE html>
<html lang="en" class="h-full">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${appTitle} — Luxury & Performance Fleet</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    .font-display { font-family: 'Space Grotesk', sans-serif; }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.3); border-radius: 9999px; }
  </style>
</head>
<body class="bg-[#07090e] text-zinc-100 h-full flex flex-col overflow-hidden selection:bg-blue-600 selection:text-white">
  <!-- Header -->
  <header class="border-b border-white/10 bg-[#0c0f17]/90 backdrop-blur-xl px-4 sm:px-6 py-3 flex items-center justify-between flex-shrink-0 z-30">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 text-lg font-black">
        🏎️
      </div>
      <div>
        <div class="flex items-center gap-2">
          <h1 class="font-extrabold text-sm sm:text-base text-white tracking-tight">${appTitle}</h1>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">Verified Fleet</span>
        </div>
        <p class="text-[11px] text-zinc-400">Premium Exotic, SUV & Electric Vehicle Rentals</p>
      </div>
    </div>
    <div class="flex items-center gap-3">
      <button onclick="openBookingsModal()" class="relative px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold flex items-center gap-2 border border-white/10 transition-all cursor-pointer">
        <span>📋 My Bookings</span>
        <span id="bookingCountBadge" class="w-4 h-4 rounded-full bg-blue-500 text-white font-bold text-[9px] flex items-center justify-center">0</span>
      </button>
      <button onclick="filterFleet('all')" class="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/30 cursor-pointer">
        Explore Fleet
      </button>
    </div>
  </header>

  <!-- Filter Bar -->
  <nav class="border-b border-white/10 bg-[#090b12] px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 overflow-x-auto flex-shrink-0">
    <div class="flex items-center gap-2">
      <button onclick="filterFleet('all')" class="fleet-pill active px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all bg-blue-600 text-white shadow-md shadow-blue-500/25 whitespace-nowrap cursor-pointer">All Vehicles (8)</button>
      <button onclick="filterFleet('exotic')" class="fleet-pill px-3.5 py-1.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-all whitespace-nowrap cursor-pointer">Supercars</button>
      <button onclick="filterFleet('suv')" class="fleet-pill px-3.5 py-1.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-all whitespace-nowrap cursor-pointer">Luxury SUVs</button>
      <button onclick="filterFleet('electric')" class="fleet-pill px-3.5 py-1.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-all whitespace-nowrap cursor-pointer">Electric EV</button>
      <button onclick="filterFleet('sedan')" class="fleet-pill px-3.5 py-1.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-all whitespace-nowrap cursor-pointer">Executive Sedans</button>
    </div>
    <div class="relative w-48 hidden md:block">
      <input type="text" id="fleetSearch" oninput="searchFleet(this.value)" placeholder="Search Porsche, Urus, Tesla..." class="w-full px-3 py-1.5 pl-8 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500" />
      <span class="absolute left-2.5 top-1.5 text-xs text-zinc-500">🔍</span>
    </div>
  </nav>

  <!-- Main Grid -->
  <main class="flex-1 overflow-y-auto p-4 sm:p-6">
    <div id="fleetGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-7xl mx-auto">
      <!-- Injected via JS -->
    </div>
  </main>

  <!-- Rent / Booking Modal -->
  <div id="rentalModal" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm hidden flex items-center justify-center p-4">
    <div class="bg-[#10131e] border border-blue-500/30 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
      <div class="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <h3 id="modalCarTitle" class="text-base font-bold text-white">Reserve Vehicle</h3>
          <p id="modalCarRate" class="text-xs text-blue-400 font-mono font-semibold">$350 / day</p>
        </div>
        <button onclick="closeRentalModal()" class="text-zinc-400 hover:text-white p-1 cursor-pointer">✕</button>
      </div>

      <form id="bookingForm" onsubmit="handleConfirmBooking(event)" class="space-y-3">
        <div>
          <label class="block text-[11px] font-semibold text-zinc-300 mb-1">Full Name</label>
          <input type="text" id="custName" required placeholder="Alexander Vance" class="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white focus:outline-none focus:border-blue-500" />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-[11px] font-semibold text-zinc-300 mb-1">Pickup Date</label>
            <input type="date" id="custDate" required class="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label class="block text-[11px] font-semibold text-zinc-300 mb-1">Rental Days</label>
            <select id="custDays" onchange="calcTotal()" class="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white focus:outline-none focus:border-blue-500">
              <option value="1">1 Day</option>
              <option value="3" selected>3 Days</option>
              <option value="7">7 Days (10% Off)</option>
              <option value="14">14 Days (15% Off)</option>
            </select>
          </div>
        </div>
        <div class="p-3 rounded-2xl bg-blue-950/40 border border-blue-500/20 flex items-center justify-between">
          <span class="text-xs text-zinc-300">Estimated Total:</span>
          <span id="modalTotalPrice" class="text-base font-extrabold text-blue-400 font-mono">$1,050</span>
        </div>
        <button type="submit" class="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs transition-all shadow-lg shadow-blue-500/30 cursor-pointer">
          Confirm Instant Reservation ⚡
        </button>
      </form>
    </div>
  </div>

  <!-- Bookings List Modal -->
  <div id="bookingsListModal" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm hidden flex items-center justify-center p-4">
    <div class="bg-[#10131e] border border-white/10 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
      <div class="flex items-center justify-between border-b border-white/10 pb-3">
        <h3 class="text-base font-bold text-white">Active Reservations</h3>
        <button onclick="closeBookingsModal()" class="text-zinc-400 hover:text-white p-1 cursor-pointer">✕</button>
      </div>
      <div id="bookingsListContainer" class="max-h-72 overflow-y-auto space-y-2">
        <!-- Rendered via JS -->
      </div>
    </div>
  </div>

  <script>
    const fleet = [
      { id: 'c1', name: 'Porsche 911 GT3 RS', category: 'exotic', hp: '518 HP', speed: '3.0s 0-60', rate: 650, img: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&auto=format&fit=crop&q=80', badge: 'Popular' },
      { id: 'c2', name: 'Lamborghini Urus Performante', category: 'suv', hp: '657 HP', speed: '3.1s 0-60', rate: 750, img: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=800&auto=format&fit=crop&q=80', badge: 'Top Rated' },
      { id: 'c3', name: 'Ferrari F8 Tributo Spider', category: 'exotic', hp: '710 HP', speed: '2.9s 0-60', rate: 950, img: 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=800&auto=format&fit=crop&q=80', badge: 'Exotic' },
      { id: 'c4', name: 'Mercedes-AMG G63 Mansory', category: 'suv', hp: '577 HP', speed: '4.5s 0-60', rate: 580, img: 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?w=800&auto=format&fit=crop&q=80', badge: 'VIP Choice' },
      { id: 'c5', name: 'Tesla Model S Plaid', category: 'electric', hp: '1,020 HP', speed: '1.99s 0-60', rate: 420, img: 'https://images.unsplash.com/photo-1536700503339-1e4b06520771?w=800&auto=format&fit=crop&q=80', badge: 'Zero Emission' },
      { id: 'c6', name: 'Porsche Taycan Turbo S', category: 'electric', hp: '750 HP', speed: '2.6s 0-60', rate: 490, img: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&auto=format&fit=crop&q=80', badge: 'Electric' },
      { id: 'c7', name: 'Rolls-Royce Ghost Series II', category: 'sedan', hp: '563 HP', speed: '4.6s 0-60', rate: 1200, img: 'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?w=800&auto=format&fit=crop&q=80', badge: 'Chauffeur' },
      { id: 'c8', name: 'BMW M8 Competition Gran Coupe', category: 'sedan', hp: '617 HP', speed: '3.0s 0-60', rate: 390, img: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop&q=80', badge: 'Sport' }
    ];

    let currentCategory = 'all';
    let searchQuery = '';
    let selectedCar = null;
    let reservations = JSON.parse(localStorage.getItem('bexus_car_reservations') || '[]');

    function renderFleet() {
      const grid = document.getElementById('fleetGrid');
      const filtered = fleet.filter(c => {
        const matchCat = currentCategory === 'all' || c.category === currentCategory;
        const matchSearch = !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCat && matchSearch;
      });

      grid.innerHTML = filtered.map(c => \`
        <div class="rounded-3xl bg-[#0f121d] border border-white/10 overflow-hidden hover:border-blue-500/50 transition-all group flex flex-col justify-between shadow-xl">
          <div class="relative h-48 overflow-hidden bg-black/40">
            <img src="\${c.img}" alt="\${c.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div class="absolute inset-0 bg-gradient-to-t from-[#0f121d] via-transparent to-transparent"></div>
            <span class="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-blue-600/90 text-white backdrop-blur-md shadow-md">\${c.badge}</span>
          </div>
          <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
            <div>
              <h3 class="text-sm sm:text-base font-extrabold text-white tracking-tight">\${c.name}</h3>
              <div class="flex items-center gap-3 mt-2 text-xs text-zinc-400">
                <span class="flex items-center gap-1 font-mono">⚡ \${c.hp}</span>
                <span>•</span>
                <span class="flex items-center gap-1 font-mono">⏱️ \${c.speed}</span>
              </div>
            </div>
            <div class="pt-3 border-t border-white/5 flex items-center justify-between">
              <div>
                <span class="text-xs text-zinc-400">Daily rate</span>
                <p class="text-base font-black text-blue-400 font-mono">$\${c.rate} <span class="text-[10px] text-zinc-400 font-normal">/ day</span></p>
              </div>
              <button onclick="openRentalModal('\${c.id}')" class="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/30 cursor-pointer">
                Reserve ➔
              </button>
            </div>
          </div>
        </div>
      \`).join('');

      document.getElementById('bookingCountBadge').innerText = reservations.length;
    }

    function filterFleet(cat) {
      currentCategory = cat;
      document.querySelectorAll('.fleet-pill').forEach(btn => {
        btn.classList.toggle('active', btn.innerText.toLowerCase().includes(cat) || (cat === 'all' && btn.innerText.includes('All')));
        btn.classList.toggle('bg-blue-600', btn.classList.contains('active'));
        btn.classList.toggle('text-white', btn.classList.contains('active'));
      });
      renderFleet();
    }

    function searchFleet(q) {
      searchQuery = q;
      renderFleet();
    }

    function openRentalModal(carId) {
      selectedCar = fleet.find(c => c.id === carId);
      if (!selectedCar) return;
      document.getElementById('modalCarTitle').innerText = selectedCar.name;
      document.getElementById('modalCarRate').innerText = '$' + selectedCar.rate + ' / day';
      calcTotal();
      document.getElementById('rentalModal').classList.remove('hidden');
    }

    function closeRentalModal() {
      document.getElementById('rentalModal').classList.add('hidden');
    }

    function calcTotal() {
      if (!selectedCar) return;
      const days = parseInt(document.getElementById('custDays').value || '1', 10);
      let disc = 1;
      if (days >= 14) disc = 0.85;
      else if (days >= 7) disc = 0.9;
      const total = Math.round(selectedCar.rate * days * disc);
      document.getElementById('modalTotalPrice').innerText = '$' + total.toLocaleString();
    }

    function handleConfirmBooking(e) {
      e.preventDefault();
      if (!selectedCar) return;
      const name = document.getElementById('custName').value;
      const date = document.getElementById('custDate').value;
      const days = parseInt(document.getElementById('custDays').value, 10);
      const total = document.getElementById('modalTotalPrice').innerText;

      const newBooking = {
        id: 'bk_' + Date.now(),
        carName: selectedCar.name,
        name,
        date,
        days,
        total,
        createdAt: new Date().toLocaleDateString()
      };

      reservations.unshift(newBooking);
      localStorage.setItem('bexus_car_reservations', JSON.stringify(reservations));
      closeRentalModal();
      renderFleet();
      showToast('🎉 Reservation Confirmed for ' + selectedCar.name + '! Pick up on ' + date + '.');
    }

    function showToast(msg) {
      const container = document.getElementById('toastBox');
      if (!container) return;
      const t = document.createElement('div');
      t.className = 'px-4 py-3 rounded-2xl bg-zinc-900/95 border border-blue-500/40 shadow-2xl backdrop-blur-xl text-xs font-semibold text-white flex items-center gap-2 transform translate-y-3 opacity-0 transition-all duration-300 pointer-events-auto';
      t.innerHTML = '<span>⚡</span><span>' + msg + '</span>';
      container.appendChild(t);
      setTimeout(() => t.classList.remove('translate-y-3', 'opacity-0'), 10);
      setTimeout(() => {
        t.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => t.remove(), 300);
      }, 3500);
    }

    function openBookingsModal() {
      const container = document.getElementById('bookingsListContainer');
      if (reservations.length === 0) {
        container.innerHTML = '<p class="text-xs text-zinc-400 py-6 text-center">No active vehicle reservations yet. Choose any car to reserve!</p>';
      } else {
        container.innerHTML = reservations.map((b, idx) => \`
          <div class="p-3.5 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-between">
            <div>
              <h4 class="text-xs font-bold text-white">\${b.carName}</h4>
              <p class="text-[11px] text-zinc-400">Driver: \${b.name} • Date: \${b.date} (\${b.days} days)</p>
            </div>
            <div class="text-right">
              <span class="text-xs font-mono font-bold text-blue-400">\${b.total}</span>
              <button onclick="cancelBooking(\${idx})" class="block text-[10px] text-rose-400 hover:underline mt-0.5">Cancel</button>
            </div>
          </div>
        \`).join('');
      }
      document.getElementById('bookingsListModal').classList.remove('hidden');
    }

    function cancelBooking(idx) {
      reservations.splice(idx, 1);
      localStorage.setItem('bexus_car_reservations', JSON.stringify(reservations));
      openBookingsModal();
      renderFleet();
    }

    function closeBookingsModal() {
      document.getElementById('bookingsListModal').classList.add('hidden');
    }

    // Set today as min date
    const todayStr = new Date().toISOString().split('T')[0];
    document.getElementById('custDate').min = todayStr;
    document.getElementById('custDate').value = todayStr;

    renderFleet();
  </script>
  <div id="toastBox" class="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none"></div>
</body>
</html>`;
}

export function generateHealthcareClinicAppHtml(appTitle: string): string {
  return `<!DOCTYPE html>
<html lang="en" class="h-full">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${appTitle} — Premier Medical Care & Specialist Clinic</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.3); border-radius: 9999px; }
  </style>
</head>
<body class="bg-[#060a09] text-zinc-100 h-full flex flex-col overflow-hidden selection:bg-emerald-500 selection:text-black">
  <!-- Top Navigation -->
  <header class="border-b border-white/10 bg-[#0a110e]/95 backdrop-blur-xl px-4 sm:px-6 py-3 flex items-center justify-between flex-shrink-0 z-30">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-emerald-500/25">
        🩺
      </div>
      <div>
        <div class="flex items-center gap-2">
          <h1 class="font-extrabold text-sm sm:text-base text-white tracking-tight">${appTitle}</h1>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">JCI Accredited</span>
        </div>
        <p class="text-[11px] text-zinc-400">Emergency Hotline: <span class="text-emerald-400 font-mono font-semibold">+1 (800) 456-HEALTH</span> • 24/7 Virtual Consultation</p>
      </div>
    </div>
    <div class="flex items-center gap-3">
      <button onclick="openAppointmentsModal()" class="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold flex items-center gap-2 border border-white/10 transition-all cursor-pointer">
        <span>📅 My Appointments</span>
        <span id="apptCountBadge" class="w-4 h-4 rounded-full bg-emerald-500 text-black font-extrabold text-[9px] flex items-center justify-center">0</span>
      </button>
      <button onclick="openQuickBooking()" class="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black text-xs font-extrabold transition-all shadow-lg shadow-emerald-500/30 cursor-pointer">
        Book Appointment ✦
      </button>
    </div>
  </header>

  <!-- Department Tabs -->
  <nav class="border-b border-white/10 bg-[#080d0b] px-4 sm:px-6 py-2.5 flex items-center gap-2 overflow-x-auto flex-shrink-0">
    <button onclick="filterDept('all')" class="dept-pill active px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all bg-emerald-500 text-black shadow-md shadow-emerald-500/25 whitespace-nowrap cursor-pointer">All Specialists</button>
    <button onclick="filterDept('cardio')" class="dept-pill px-3.5 py-1.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-all whitespace-nowrap cursor-pointer">❤️ Cardiology</button>
    <button onclick="filterDept('neuro')" class="dept-pill px-3.5 py-1.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-all whitespace-nowrap cursor-pointer">🧠 Neurology</button>
    <button onclick="filterDept('ortho')" class="dept-pill px-3.5 py-1.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-all whitespace-nowrap cursor-pointer">🦴 Orthopedics</button>
    <button onclick="filterDept('pediatrics')" class="dept-pill px-3.5 py-1.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-all whitespace-nowrap cursor-pointer">👶 Pediatrics</button>
    <button onclick="filterDept('dental')" class="dept-pill px-3.5 py-1.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-all whitespace-nowrap cursor-pointer">🦷 Dental Care</button>
  </nav>

  <!-- Doctors Directory -->
  <main class="flex-1 overflow-y-auto p-4 sm:p-6">
    <div id="doctorsGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-7xl mx-auto">
      <!-- Rendered via JS -->
    </div>
  </main>

  <!-- Booking Modal -->
  <div id="apptModal" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm hidden flex items-center justify-center p-4">
    <div class="bg-[#0d1512] border border-emerald-500/30 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
      <div class="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <h3 id="modalDoctorName" class="text-base font-bold text-white">Book Appointment</h3>
          <p id="modalDoctorSpecialty" class="text-xs text-emerald-400">Chief Consultant</p>
        </div>
        <button onclick="closeApptModal()" class="text-zinc-400 hover:text-white p-1 cursor-pointer">✕</button>
      </div>

      <form onsubmit="handleConfirmAppt(event)" class="space-y-3">
        <div>
          <label class="block text-[11px] font-semibold text-zinc-300 mb-1">Patient Full Name</label>
          <input type="text" id="patientName" required placeholder="Sarah Jenkins" class="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500" />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-[11px] font-semibold text-zinc-300 mb-1">Date</label>
            <input type="date" id="apptDate" required class="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500" />
          </div>
          <div>
            <label class="block text-[11px] font-semibold text-zinc-300 mb-1">Time Slot</label>
            <select id="apptSlot" class="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500">
              <option>09:30 AM (Available)</option>
              <option>11:00 AM (Available)</option>
              <option>02:30 PM (Available)</option>
              <option>04:00 PM (Available)</option>
            </select>
          </div>
        </div>
        <div>
          <label class="block text-[11px] font-semibold text-zinc-300 mb-1">Symptoms / Reason for Visit</label>
          <textarea id="patientNotes" rows="2" placeholder="Routine checkup, consultation, or follow-up..." class="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500"></textarea>
        </div>
        <button type="submit" class="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold text-xs transition-all shadow-lg shadow-emerald-500/30 cursor-pointer">
          Confirm Appointment 📅
        </button>
      </form>
    </div>
  </div>

  <!-- Appointments List Modal -->
  <div id="appointmentsListModal" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm hidden flex items-center justify-center p-4">
    <div class="bg-[#0d1512] border border-white/10 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
      <div class="flex items-center justify-between border-b border-white/10 pb-3">
        <h3 class="text-base font-bold text-white">Your Scheduled Consultations</h3>
        <button onclick="closeAppointmentsModal()" class="text-zinc-400 hover:text-white p-1 cursor-pointer">✕</button>
      </div>
      <div id="apptsListContainer" class="max-h-72 overflow-y-auto space-y-2">
        <!-- Rendered via JS -->
      </div>
    </div>
  </div>

  <script>
    const doctors = [
      { id: 'd1', name: 'Dr. Evelyn Sterling, MD', dept: 'cardio', title: 'Senior Interventional Cardiologist', exp: '16 yrs exp', rating: '4.9 ★ (210 reviews)', fee: '$180', img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&auto=format&fit=crop&q=80', badge: 'Chief of Cardiology' },
      { id: 'd2', name: 'Dr. Marcus Chen, PhD', dept: 'neuro', title: 'Consultant Neurosurgeon & Spine Specialist', exp: '14 yrs exp', rating: '5.0 ★ (340 reviews)', fee: '$220', img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&auto=format&fit=crop&q=80', badge: 'Brain & Spine' },
      { id: 'd3', name: 'Dr. Sarah Al-Mansoor, MD', dept: 'pediatrics', title: 'Pediatric Care & Child Specialist', exp: '11 yrs exp', rating: '4.9 ★ (190 reviews)', fee: '$140', img: 'https://images.unsplash.com/photo-1594824813626-d668270b240e?w=800&auto=format&fit=crop&q=80', badge: 'Child Wellness' },
      { id: 'd4', name: 'Dr. Liam O’Connor, DO', dept: 'ortho', title: 'Orthopedic Surgeon & Sports Medicine', exp: '13 yrs exp', rating: '4.8 ★ (175 reviews)', fee: '$190', img: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=800&auto=format&fit=crop&q=80', badge: 'Sports Medicine' },
      { id: 'd5', name: 'Dr. Maya Patel, DDS', dept: 'dental', title: 'Cosmetic & Implant Dental Surgeon', exp: '9 yrs exp', rating: '4.9 ★ (260 reviews)', fee: '$120', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80', badge: 'Aesthetic Dental' },
      { id: 'd6', name: 'Dr. Julian Thorne, MD', dept: 'cardio', title: 'Heart Rhythm & Vascular Consultant', exp: '18 yrs exp', rating: '5.0 ★ (412 reviews)', fee: '$210', img: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&auto=format&fit=crop&q=80', badge: 'Electrophysiology' }
    ];

    let currentDept = 'all';
    let selectedDoctor = null;
    let appointments = JSON.parse(localStorage.getItem('bexus_clinic_appointments') || '[]');

    function renderDoctors() {
      const grid = document.getElementById('doctorsGrid');
      const filtered = doctors.filter(d => currentDept === 'all' || d.dept === currentDept);

      grid.innerHTML = filtered.map(d => \`
        <div class="rounded-3xl bg-[#0c1310] border border-white/10 overflow-hidden hover:border-emerald-500/50 transition-all p-5 flex flex-col justify-between shadow-xl space-y-4">
          <div class="flex items-start gap-4">
            <img src="\${d.img}" alt="\${d.name}" class="w-16 h-16 rounded-2xl object-cover border border-white/10 shrink-0" />
            <div class="flex-1 min-w-0">
              <span class="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 mb-1">\${d.badge}</span>
              <h3 class="text-sm sm:text-base font-extrabold text-white truncate">\${d.name}</h3>
              <p class="text-xs text-zinc-400 mt-0.5 truncate">\${d.title}</p>
              <div class="flex items-center gap-2 mt-2 text-[11px] text-zinc-400">
                <span>\${d.rating}</span>
                <span>•</span>
                <span>\${d.exp}</span>
              </div>
            </div>
          </div>
          <div class="pt-3 border-t border-white/5 flex items-center justify-between">
            <div>
              <span class="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Consultation</span>
              <p class="text-base font-extrabold text-emerald-400 font-mono">\${d.fee}</p>
            </div>
            <button onclick="openBookingFor('\${d.id}')" class="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold transition-all shadow-md shadow-emerald-500/20 cursor-pointer">
              Book Slot ➔
            </button>
          </div>
        </div>
      \`).join('');

      document.getElementById('apptCountBadge').innerText = appointments.length;
    }

    function filterDept(dept) {
      currentDept = dept;
      document.querySelectorAll('.dept-pill').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('onclick').includes(dept));
        btn.classList.toggle('bg-emerald-500', btn.classList.contains('active'));
        btn.classList.toggle('text-black', btn.classList.contains('active'));
      });
      renderDoctors();
    }

    function openBookingFor(docId) {
      selectedDoctor = doctors.find(d => d.id === docId);
      if (!selectedDoctor) return;
      document.getElementById('modalDoctorName').innerText = selectedDoctor.name;
      document.getElementById('modalDoctorSpecialty').innerText = selectedDoctor.title + ' • ' + selectedDoctor.fee;
      document.getElementById('apptModal').classList.remove('hidden');
    }

    function openQuickBooking() {
      openBookingFor(doctors[0].id);
    }

    function closeApptModal() {
      document.getElementById('apptModal').classList.add('hidden');
    }

    function handleConfirmAppt(e) {
      e.preventDefault();
      if (!selectedDoctor) return;
      const patient = document.getElementById('patientName').value;
      const date = document.getElementById('apptDate').value;
      const slot = document.getElementById('apptSlot').value;
      const notes = document.getElementById('patientNotes').value;

      const newAppt = {
        id: 'apt_' + Date.now(),
        doctor: selectedDoctor.name,
        specialty: selectedDoctor.title,
        patient,
        date,
        slot,
        notes,
        createdAt: new Date().toLocaleDateString()
      };

      appointments.unshift(newAppt);
      localStorage.setItem('bexus_clinic_appointments', JSON.stringify(appointments));
      closeApptModal();
      renderDoctors();
      alert('✅ Appointment confirmed with ' + selectedDoctor.name + ' for ' + date + ' at ' + slot + '!');
    }

    function openAppointmentsModal() {
      const container = document.getElementById('apptsListContainer');
      if (appointments.length === 0) {
        container.innerHTML = '<p class="text-xs text-zinc-400 py-6 text-center">No appointments booked yet. Choose a doctor to schedule a visit!</p>';
      } else {
        container.innerHTML = appointments.map((a, idx) => \`
          <div class="p-3.5 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-between">
            <div>
              <h4 class="text-xs font-bold text-white">\${a.doctor}</h4>
              <p class="text-[11px] text-zinc-400">Patient: \${a.patient} • \${a.date} (\${a.slot})</p>
            </div>
            <button onclick="cancelAppt(\${idx})" class="text-[10px] text-rose-400 hover:underline">Cancel</button>
          </div>
        \`).join('');
      }
      document.getElementById('appointmentsListModal').classList.remove('hidden');
    }

    function cancelAppt(idx) {
      appointments.splice(idx, 1);
      localStorage.setItem('bexus_clinic_appointments', JSON.stringify(appointments));
      openAppointmentsModal();
      renderDoctors();
    }

    function closeAppointmentsModal() {
      document.getElementById('appointmentsListModal').classList.add('hidden');
    }

    const todayStr = new Date().toISOString().split('T')[0];
    document.getElementById('apptDate').min = todayStr;
    document.getElementById('apptDate').value = todayStr;

    renderDoctors();
  </script>
</body>
</html>`;
}

export function generateRealEstateAppHtml(appTitle: string): string {
  return `<!DOCTYPE html>
<html lang="en" class="h-full">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${appTitle} — Luxury Real Estate & Estates</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,800;1,600&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    .font-serif { font-family: 'Playfair Display', serif; }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-thumb { background: rgba(234, 179, 8, 0.3); border-radius: 9999px; }
  </style>
</head>
<body class="bg-[#09090b] text-zinc-100 h-full flex flex-col overflow-hidden selection:bg-amber-500 selection:text-black">
  <!-- Top Navigation -->
  <header class="border-b border-white/10 bg-[#0e0e12]/95 backdrop-blur-xl px-4 sm:px-6 py-3 flex items-center justify-between flex-shrink-0 z-30">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-yellow-500 to-amber-700 flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-amber-500/25">
        🏛️
      </div>
      <div>
        <div class="flex items-center gap-2">
          <h1 class="font-serif font-bold text-sm sm:text-base text-white tracking-tight">${appTitle}</h1>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">Exclusive Estates</span>
        </div>
        <p class="text-[11px] text-zinc-400">Curated Architectural Residences, Penthouses & Villas</p>
      </div>
    </div>
    <div class="flex items-center gap-3">
      <button onclick="openSavedProperties()" class="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold flex items-center gap-2 border border-white/10 transition-all cursor-pointer">
        <span>❤️ Saved Homes</span>
        <span id="savedCountBadge" class="w-4 h-4 rounded-full bg-amber-500 text-black font-extrabold text-[9px] flex items-center justify-center">0</span>
      </button>
    </div>
  </header>

  <!-- Filter Bar -->
  <nav class="border-b border-white/10 bg-[#0c0c10] px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 overflow-x-auto flex-shrink-0">
    <div class="flex items-center gap-2">
      <button onclick="filterEstate('all')" class="estate-pill active px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all bg-amber-500 text-black shadow-md shadow-amber-500/25 whitespace-nowrap cursor-pointer">All Residences (6)</button>
      <button onclick="filterEstate('villa')" class="estate-pill px-3.5 py-1.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-all whitespace-nowrap cursor-pointer">Waterfront Villas</button>
      <button onclick="filterEstate('penthouse')" class="estate-pill px-3.5 py-1.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-all whitespace-nowrap cursor-pointer">Sky Penthouses</button>
      <button onclick="filterEstate('modern')" class="estate-pill px-3.5 py-1.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-all whitespace-nowrap cursor-pointer">Architectural Mansions</button>
    </div>
    <div class="relative w-48 hidden md:block">
      <input type="text" id="estateSearch" oninput="searchEstate(this.value)" placeholder="Search Beverly Hills, Miami..." class="w-full px-3 py-1.5 pl-8 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500" />
      <span class="absolute left-2.5 top-1.5 text-xs text-zinc-500">🔍</span>
    </div>
  </nav>

  <!-- Properties Grid -->
  <main class="flex-1 overflow-y-auto p-4 sm:p-6">
    <div id="estatesGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
      <!-- Injected via JS -->
    </div>
  </main>

  <!-- Tour Schedule Modal -->
  <div id="tourModal" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm hidden flex items-center justify-center p-4">
    <div class="bg-[#121217] border border-amber-500/30 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
      <div class="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <h3 id="modalEstateTitle" class="font-serif text-base font-bold text-white">Schedule Private Viewing</h3>
          <p id="modalEstatePrice" class="text-xs text-amber-400 font-mono font-semibold">$8,900,000</p>
        </div>
        <button onclick="closeTourModal()" class="text-zinc-400 hover:text-white p-1 cursor-pointer">✕</button>
      </div>

      <form onsubmit="handleConfirmTour(event)" class="space-y-3">
        <div>
          <label class="block text-[11px] font-semibold text-zinc-300 mb-1">Your Full Name</label>
          <input type="text" id="tourName" required placeholder="Lord Julian Sterling" class="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500" />
        </div>
        <div>
          <label class="block text-[11px] font-semibold text-zinc-300 mb-1">Phone / WhatsApp</label>
          <input type="tel" id="tourPhone" required placeholder="+1 (555) 019-2834" class="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500" />
        </div>
        <div>
          <label class="block text-[11px] font-semibold text-zinc-300 mb-1">Requested Tour Date</label>
          <input type="date" id="tourDate" required class="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500" />
        </div>
        <button type="submit" class="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-extrabold text-xs transition-all shadow-lg shadow-amber-500/30 cursor-pointer">
          Confirm Private VIP Tour 🥂
        </button>
      </form>
    </div>
  </div>

  <script>
    const estates = [
      { id: 'p1', title: 'The Bel-Air Glass Pavilion', type: 'modern', location: 'Bel Air, Los Angeles, CA', beds: 6, baths: 8, sqft: '9,400 sq ft', price: '$14,500,000', img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop&q=80', badge: 'Trophy Estate' },
      { id: 'p2', title: 'Villa Del Mar Oceanfront', type: 'villa', location: 'Star Island, Miami Beach, FL', beds: 5, baths: 7, sqft: '7,800 sq ft', price: '$22,000,000', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80', badge: 'Private Dock' },
      { id: 'p3', title: 'One57 Sky Penthouse duplex', type: 'penthouse', location: 'Billionaires Row, New York, NY', beds: 4, baths: 5, sqft: '6,200 sq ft', price: '$18,900,000', img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80', badge: '360° Skyline' },
      { id: 'p4', title: 'Aspen Ridge Alpine Chalet', type: 'modern', location: 'Red Mountain, Aspen, CO', beds: 7, baths: 9, sqft: '11,200 sq ft', price: '$16,200,000', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80', badge: 'Ski-in Ski-out' },
      { id: 'p5', title: 'Palazzo Vista Mare', type: 'villa', location: 'Capri, Amalfi Coast, Italy', beds: 5, baths: 6, sqft: '8,500 sq ft', price: '€19,500,000', img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80', badge: 'Mediterranean' },
      { id: 'p6', title: 'Tribeca Cast-Iron Loft', type: 'penthouse', location: 'Tribeca, New York, NY', beds: 3, baths: 4, sqft: '4,800 sq ft', price: '$9,800,000', img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=80', badge: 'Historic Loft' }
    ];

    let currentFilter = 'all';
    let selectedEstate = null;
    let savedEstates = JSON.parse(localStorage.getItem('bexus_saved_estates') || '[]');

    function renderEstates() {
      const grid = document.getElementById('estatesGrid');
      const filtered = estates.filter(e => currentFilter === 'all' || e.type === currentFilter);

      grid.innerHTML = filtered.map(e => {
        const isSaved = savedEstates.includes(e.id);
        return \`
          <div class="rounded-3xl bg-[#121218] border border-white/10 overflow-hidden hover:border-amber-500/50 transition-all flex flex-col justify-between shadow-2xl group">
            <div class="relative h-60 overflow-hidden">
              <img src="\${e.img}" alt="\${e.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div class="absolute inset-0 bg-gradient-to-t from-[#121218] via-transparent to-transparent"></div>
              <span class="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-black/60 text-amber-300 backdrop-blur-md border border-amber-500/30">\${e.badge}</span>
              <button onclick="toggleSave('\${e.id}')" class="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-xs transition-colors \${isSaved ? 'text-amber-400' : 'text-zinc-400 hover:text-white'}">
                \${isSaved ? '❤️' : '🤍'}
              </button>
            </div>
            <div class="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 class="font-serif text-base font-extrabold text-white">\${e.title}</h3>
                <p class="text-xs text-zinc-400 mt-1">📍 \${e.location}</p>
                <div class="flex items-center gap-3 mt-3 text-xs text-zinc-400">
                  <span>🛏️ \${e.beds} Beds</span>
                  <span>•</span>
                  <span>🛁 \${e.baths} Baths</span>
                  <span>•</span>
                  <span>📐 \${e.sqft}</span>
                </div>
              </div>
              <div class="pt-3 border-t border-white/5 flex items-center justify-between">
                <div>
                  <span class="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Offering Price</span>
                  <p class="text-base font-extrabold text-amber-400 font-mono">\${e.price}</p>
                </div>
                <button onclick="openTour('\${e.id}')" class="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-extrabold transition-all shadow-md shadow-amber-500/20 cursor-pointer">
                  Schedule Tour ➔
                </button>
              </div>
            </div>
          </div>
        \`;
      }).join('');

      document.getElementById('savedCountBadge').innerText = savedEstates.length;
    }

    function filterEstate(type) {
      currentFilter = type;
      document.querySelectorAll('.estate-pill').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('onclick').includes(type));
        btn.classList.toggle('bg-amber-500', btn.classList.contains('active'));
        btn.classList.toggle('text-black', btn.classList.contains('active'));
      });
      renderEstates();
    }

    function toggleSave(id) {
      if (savedEstates.includes(id)) {
        savedEstates = savedEstates.filter(x => x !== id);
      } else {
        savedEstates.push(id);
      }
      localStorage.setItem('bexus_saved_estates', JSON.stringify(savedEstates));
      renderEstates();
    }

    function openSavedProperties() {
      if (savedEstates.length === 0) {
        alert('You have not saved any residences yet. Click the heart icon on any estate to bookmark it!');
      } else {
        alert('You have ' + savedEstates.length + ' luxury residences saved in your portfolio.');
      }
    }

    function openTour(id) {
      selectedEstate = estates.find(e => e.id === id);
      if (!selectedEstate) return;
      document.getElementById('modalEstateTitle').innerText = selectedEstate.title;
      document.getElementById('modalEstatePrice').innerText = selectedEstate.price + ' • ' + selectedEstate.location;
      document.getElementById('tourModal').classList.remove('hidden');
    }

    function closeTourModal() {
      document.getElementById('tourModal').classList.add('hidden');
    }

    function handleConfirmTour(e) {
      e.preventDefault();
      const name = document.getElementById('tourName').value;
      const phone = document.getElementById('tourPhone').value;
      const date = document.getElementById('tourDate').value;
      closeTourModal();
      alert('🥂 VIP Private Viewing Confirmed for ' + selectedEstate.title + '! Our senior estate broker will contact ' + name + ' at ' + phone + ' to arrange transport on ' + date + '.');
    }

    renderEstates();
  </script>
</body>
</html>`;
}


