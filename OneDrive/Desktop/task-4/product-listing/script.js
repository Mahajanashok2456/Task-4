// ShopHub Product Catalog - Main JavaScript File

class ShopHub {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.wishlist = [];
        this.currentPage = 1;
        this.productsPerPage = 12;
        this.currentView = 'grid';
        
        this.filters = {
            category: 'all',
            priceRange: 'all',
            minRating: 0,
            search: ''
        };
        
        this.sortBy = 'default';
        
        this.init();
    }

    init() {
        this.loadWishlist();
        this.loadTheme();
        this.loadProducts();
        this.setupEventListeners();
        this.renderProducts();
        this.updateWishlistCount();
    }

    // LocalStorage Operations
    saveWishlist() {
        localStorage.setItem('shophub_wishlist', JSON.stringify(this.wishlist));
    }

    loadWishlist() {
        const savedWishlist = localStorage.getItem('shophub_wishlist');
        if (savedWishlist) {
            this.wishlist = JSON.parse(savedWishlist);
        }
    }

    // Theme Management
    loadTheme() {
        const savedTheme = localStorage.getItem('shophub_theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('shophub_theme', newTheme);
        this.updateThemeIcon(newTheme);
    }

    updateThemeIcon(theme) {
        const themeIcon = document.querySelector('#themeToggle i');
        if (themeIcon) {
            themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    // Product Data
    loadProducts() {
        // Sample product data - in a real app, this would come from an API
        this.products = [
            {
                id: 1,
                name: "Wireless Bluetooth Headphones",
                category: "electronics",
                price: 89.99,
                originalPrice: 129.99,
                rating: 4.5,
                reviewCount: 1247,
                image: "https://via.placeholder.com/300x300/3b82f6/ffffff?text=Headphones",
                description: "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
                badge: "sale",
                inStock: true
            },
            {
                id: 2,
                name: "Smart Fitness Watch",
                category: "electronics",
                price: 199.99,
                originalPrice: null,
                rating: 4.8,
                reviewCount: 892,
                image: "https://via.placeholder.com/300x300/10b981/ffffff?text=Smart+Watch",
                description: "Advanced fitness tracking with heart rate monitor and GPS capabilities.",
                badge: "new",
                inStock: true
            },
            {
                id: 3,
                name: "Organic Cotton T-Shirt",
                category: "clothing",
                price: 24.99,
                originalPrice: 34.99,
                rating: 4.2,
                reviewCount: 456,
                image: "https://via.placeholder.com/300x300/f59e0b/ffffff?text=T-Shirt",
                description: "Comfortable organic cotton t-shirt available in multiple colors.",
                badge: "sale",
                inStock: true
            },
            {
                id: 4,
                name: "Yoga Mat Premium",
                category: "sports",
                price: 49.99,
                originalPrice: null,
                rating: 4.6,
                reviewCount: 234,
                image: "https://via.placeholder.com/300x300/8b5cf6/ffffff?text=Yoga+Mat",
                description: "Non-slip yoga mat with carrying strap and alignment lines.",
                badge: null,
                inStock: true
            },
            {
                id: 5,
                name: "Coffee Maker Deluxe",
                category: "home",
                price: 149.99,
                originalPrice: 199.99,
                rating: 4.4,
                reviewCount: 678,
                image: "https://via.placeholder.com/300x300/ef4444/ffffff?text=Coffee+Maker",
                description: "Programmable coffee maker with thermal carafe and built-in grinder.",
                badge: "sale",
                inStock: true
            },
            {
                id: 6,
                name: "Wireless Gaming Mouse",
                category: "electronics",
                price: 79.99,
                originalPrice: null,
                rating: 4.7,
                reviewCount: 345,
                image: "https://via.placeholder.com/300x300/06b6d4/ffffff?text=Gaming+Mouse",
                description: "High-precision wireless gaming mouse with customizable RGB lighting.",
                badge: null,
                inStock: true
            },
            {
                id: 7,
                name: "Running Shoes Pro",
                category: "sports",
                price: 129.99,
                originalPrice: 159.99,
                rating: 4.3,
                reviewCount: 567,
                image: "https://via.placeholder.com/300x300/84cc16/ffffff?text=Running+Shoes",
                description: "Lightweight running shoes with superior cushioning and breathability.",
                badge: "sale",
                inStock: true
            },
            {
                id: 8,
                name: "Skincare Set Complete",
                category: "beauty",
                price: 89.99,
                originalPrice: 119.99,
                rating: 4.6,
                reviewCount: 234,
                image: "https://via.placeholder.com/300x300/ec4899/ffffff?text=Skincare+Set",
                description: "Complete skincare routine with cleanser, toner, and moisturizer.",
                badge: "sale",
                inStock: true
            },
            {
                id: 9,
                name: "Wireless Earbuds",
                category: "electronics",
                price: 159.99,
                originalPrice: null,
                rating: 4.9,
                reviewCount: 1234,
                image: "https://via.placeholder.com/300x300/6366f1/ffffff?text=Wireless+Earbuds",
                description: "True wireless earbuds with active noise cancellation and wireless charging.",
                badge: "new",
                inStock: true
            },
            {
                id: 10,
                name: "Denim Jacket Classic",
                category: "clothing",
                price: 89.99,
                originalPrice: null,
                rating: 4.1,
                reviewCount: 189,
                image: "https://via.placeholder.com/300x300/78716c/ffffff?text=Denim+Jacket",
                description: "Classic denim jacket with comfortable fit and durable construction.",
                badge: null,
                inStock: true
            },
            {
                id: 11,
                name: "Garden Tool Set",
                category: "home",
                price: 69.99,
                originalPrice: 89.99,
                rating: 4.5,
                reviewCount: 156,
                image: "https://via.placeholder.com/300x300/16a34a/ffffff?text=Garden+Tools",
                description: "Complete garden tool set with ergonomic handles and rust-resistant coating.",
                badge: "sale",
                inStock: true
            },
            {
                id: 12,
                name: "Programming Book Bundle",
                category: "books",
                price: 49.99,
                originalPrice: 79.99,
                rating: 4.8,
                reviewCount: 89,
                image: "https://via.placeholder.com/300x300/ea580c/ffffff?text=Programming+Books",
                description: "Bundle of 3 programming books covering JavaScript, Python, and React.",
                badge: "sale",
                inStock: true
            }
        ];

        this.filteredProducts = [...this.products];
    }

    // Filtering and Sorting
    applyFilters() {
        let filtered = [...this.products];

        // Search filter
        if (this.filters.search) {
            const searchTerm = this.filters.search.toLowerCase();
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm) ||
                product.category.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm)
            );
        }

        // Category filter
        if (this.filters.category !== 'all') {
            filtered = filtered.filter(product => product.category === this.filters.category);
        }

        // Price range filter
        if (this.filters.priceRange !== 'all') {
            const [min, max] = this.parsePriceRange(this.filters.priceRange);
            filtered = filtered.filter(product => {
                if (max === null) {
                    return product.price >= min;
                }
                return product.price >= min && product.price <= max;
            });
        }

        // Rating filter
        if (this.filters.minRating > 0) {
            filtered = filtered.filter(product => product.rating >= this.filters.minRating);
        }

        this.filteredProducts = filtered;
        this.currentPage = 1;
        this.sortProducts();
        this.renderProducts();
        this.updateActiveFilters();
    }

    parsePriceRange(range) {
        switch (range) {
            case '0-50':
                return [0, 50];
            case '50-100':
                return [50, 100];
            case '100-200':
                return [100, 200];
            case '200-500':
                return [200, 500];
            case '500+':
                return [500, null];
            default:
                return [0, null];
        }
    }

    sortProducts() {
        switch (this.sortBy) {
            case 'price-low':
                this.filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                this.filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                this.filteredProducts.sort((a, b) => b.rating - a.rating);
                break;
            case 'name':
                this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'newest':
                this.filteredProducts.sort((a, b) => b.id - a.id);
                break;
            default:
                // Keep original order
                break;
        }
    }

    // Rendering
    renderProducts() {
        const container = document.getElementById('productsContainer');
        const loadingState = document.getElementById('loadingState');
        const emptyState = document.getElementById('emptyState');
        const loadMoreContainer = document.getElementById('loadMoreContainer');

        // Hide loading state
        if (loadingState) {
            loadingState.style.display = 'none';
        }

        // Calculate pagination
        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        const productsToShow = this.filteredProducts.slice(startIndex, endIndex);

        // Update results count
        const resultsCount = document.getElementById('resultsCount');
        if (resultsCount) {
            resultsCount.textContent = this.filteredProducts.length;
        }

        // Show/hide empty state
        if (this.filteredProducts.length === 0) {
            container.innerHTML = '';
            if (emptyState) {
                emptyState.style.display = 'block';
            }
            if (loadMoreContainer) {
                loadMoreContainer.style.display = 'none';
            }
            return;
        }

        if (emptyState) {
            emptyState.style.display = 'none';
        }

        // Clear container if it's the first page
        if (this.currentPage === 1) {
            container.innerHTML = '';
        }

        // Render products
        productsToShow.forEach(product => {
            const productElement = this.createProductElement(product);
            container.appendChild(productElement);
        });

        // Show/hide load more button
        if (loadMoreContainer) {
            loadMoreContainer.style.display = endIndex < this.filteredProducts.length ? 'block' : 'none';
        }
    }

    createProductElement(product) {
        const template = document.getElementById('productTemplate');
        const productElement = template.content.cloneNode(true);
        const productCard = productElement.querySelector('.product-card');

        // Set product data
        productCard.setAttribute('data-id', product.id);

        // Set image
        const img = productCard.querySelector('.product-img');
        img.src = product.image;
        img.alt = product.name;

        // Set content
        const category = productCard.querySelector('.product-category');
        const title = productCard.querySelector('.product-title');
        const rating = productCard.querySelector('.product-rating');
        const price = productCard.querySelector('.product-price');

        category.textContent = product.category;
        title.textContent = product.name;

        // Set rating
        const stars = rating.querySelector('.stars');
        stars.innerHTML = this.generateStars(product.rating);
        rating.querySelector('.rating-count').textContent = `(${product.reviewCount})`;

        // Set price
        const currentPrice = price.querySelector('.current-price');
        const originalPrice = price.querySelector('.original-price');
        
        currentPrice.textContent = `$${product.price.toFixed(2)}`;
        if (product.originalPrice) {
            originalPrice.textContent = `$${product.originalPrice.toFixed(2)}`;
            originalPrice.style.display = 'inline';
        } else {
            originalPrice.style.display = 'none';
        }

        // Set badge
        const badge = productCard.querySelector('.product-badge');
        if (product.badge) {
            badge.textContent = product.badge;
            badge.classList.add(product.badge);
            badge.style.display = 'block';
        } else {
            badge.style.display = 'none';
        }

        // Set wishlist state
        const wishlistBtn = productCard.querySelector('.wishlist-toggle');
        if (this.wishlist.includes(product.id)) {
            wishlistBtn.classList.add('active');
        }

        // Add event listeners
        this.addProductEventListeners(productCard, product);

        return productElement;
    }

    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let starsHTML = '';

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                starsHTML += '<i class="fas fa-star star"></i>';
            } else if (i === fullStars && hasHalfStar) {
                starsHTML += '<i class="fas fa-star-half-alt star"></i>';
            } else {
                starsHTML += '<i class="fas fa-star star empty"></i>';
            }
        }

        return starsHTML;
    }

    addProductEventListeners(productCard, product) {
        const wishlistBtn = productCard.querySelector('.wishlist-toggle');
        const quickViewBtn = productCard.querySelector('.quick-view-btn');
        const addToCartBtn = productCard.querySelector('.add-to-cart-btn');

        wishlistBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleWishlist(product.id);
        });

        quickViewBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.openQuickView(product);
        });

        addToCartBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.addToCart(product);
        });
    }

    // Wishlist Operations
    toggleWishlist(productId) {
        const index = this.wishlist.indexOf(productId);
        if (index > -1) {
            this.wishlist.splice(index, 1);
            this.showToast('Removed from wishlist', 'success');
        } else {
            this.wishlist.push(productId);
            this.showToast('Added to wishlist', 'success');
        }

        this.saveWishlist();
        this.updateWishlistCount();
        this.updateWishlistButtons();
    }

    updateWishlistCount() {
        const countElement = document.getElementById('wishlistCount');
        if (countElement) {
            countElement.textContent = this.wishlist.length;
        }
    }

    updateWishlistButtons() {
        const wishlistButtons = document.querySelectorAll('.wishlist-toggle');
        wishlistButtons.forEach(btn => {
            const productCard = btn.closest('.product-card');
            const productId = parseInt(productCard.getAttribute('data-id'));
            
            if (this.wishlist.includes(productId)) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // View Management
    setView(view) {
        this.currentView = view;
        const container = document.getElementById('productsContainer');
        const gridBtn = document.getElementById('gridView');
        const listBtn = document.getElementById('listView');

        container.className = `products-container ${view}-view`;

        if (gridBtn && listBtn) {
            gridBtn.classList.toggle('active', view === 'grid');
            listBtn.classList.toggle('active', view === 'list');
        }
    }

    // Modal Operations
    openQuickView(product) {
        const modal = document.getElementById('quickViewModal');
        const image = document.getElementById('modalProductImage');
        const category = document.getElementById('modalProductCategory');
        const title = document.getElementById('modalProductTitle');
        const rating = document.getElementById('modalProductRating');
        const price = document.getElementById('modalProductPrice');
        const description = document.getElementById('modalProductDescription');

        image.src = product.image;
        image.alt = product.name;
        category.textContent = product.category;
        title.textContent = product.name;
        description.textContent = product.description;

        // Set rating
        const stars = rating.querySelector('.stars');
        stars.innerHTML = this.generateStars(product.rating);
        rating.querySelector('.rating-count').textContent = `(${product.reviewCount} reviews)`;

        // Set price
        const currentPrice = price.querySelector('.current-price');
        const originalPrice = price.querySelector('.original-price');
        
        currentPrice.textContent = `$${product.price.toFixed(2)}`;
        if (product.originalPrice) {
            originalPrice.textContent = `$${product.originalPrice.toFixed(2)}`;
            originalPrice.style.display = 'inline';
        } else {
            originalPrice.style.display = 'none';
        }

        // Set wishlist state
        const wishlistBtn = modal.querySelector('.wishlist-toggle');
        if (this.wishlist.includes(product.id)) {
            wishlistBtn.innerHTML = '<i class="fas fa-heart"></i> Remove from Wishlist';
            wishlistBtn.classList.add('active');
        } else {
            wishlistBtn.innerHTML = '<i class="fas fa-heart"></i> Add to Wishlist';
            wishlistBtn.classList.remove('active');
        }

        // Add event listeners
        const addToCartBtn = modal.querySelector('.add-to-cart-btn');
        const wishlistToggle = modal.querySelector('.wishlist-toggle');

        addToCartBtn.onclick = () => {
            this.addToCart(product);
            this.closeQuickView();
        };

        wishlistToggle.onclick = () => {
            this.toggleWishlist(product.id);
            this.updateWishlistButtons();
        };

        modal.style.display = 'flex';
    }

    closeQuickView() {
        const modal = document.getElementById('quickViewModal');
        modal.style.display = 'none';
    }

    openWishlist() {
        const modal = document.getElementById('wishlistModal');
        const wishlistItems = document.getElementById('wishlistItems');
        const emptyWishlist = document.getElementById('emptyWishlist');

        if (this.wishlist.length === 0) {
            wishlistItems.style.display = 'none';
            emptyWishlist.style.display = 'block';
        } else {
            wishlistItems.style.display = 'block';
            emptyWishlist.style.display = 'none';
            this.renderWishlistItems(wishlistItems);
        }

        modal.style.display = 'flex';
    }

    closeWishlist() {
        const modal = document.getElementById('wishlistModal');
        modal.style.display = 'none';
    }

    renderWishlistItems(container) {
        container.innerHTML = '';
        
        this.wishlist.forEach(productId => {
            const product = this.products.find(p => p.id === productId);
            if (product) {
                const item = document.createElement('div');
                item.className = 'wishlist-item';
                item.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <div class="wishlist-item-info">
                        <div class="wishlist-item-title">${product.name}</div>
                        <div class="wishlist-item-price">$${product.price.toFixed(2)}</div>
                    </div>
                    <button class="remove-wishlist" onclick="shopHub.removeFromWishlist(${product.id})">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                container.appendChild(item);
            }
        });
    }

    removeFromWishlist(productId) {
        this.toggleWishlist(productId);
        this.openWishlist(); // Refresh the modal
    }

    // Utility Functions
    updateActiveFilters() {
        const activeFiltersContainer = document.getElementById('activeFilters');
        const activeFilters = [];

        if (this.filters.category !== 'all') {
            activeFilters.push({
                type: 'category',
                label: `Category: ${this.filters.category}`,
                value: this.filters.category
            });
        }

        if (this.filters.priceRange !== 'all') {
            activeFilters.push({
                type: 'priceRange',
                label: `Price: ${this.filters.priceRange}`,
                value: this.filters.priceRange
            });
        }

        if (this.filters.minRating > 0) {
            activeFilters.push({
                type: 'minRating',
                label: `Rating: ${this.filters.minRating}+ stars`,
                value: this.filters.minRating
            });
        }

        if (this.filters.search) {
            activeFilters.push({
                type: 'search',
                label: `Search: "${this.filters.search}"`,
                value: this.filters.search
            });
        }

        activeFiltersContainer.innerHTML = '';
        activeFilters.forEach(filter => {
            const filterElement = document.createElement('div');
            filterElement.className = 'active-filter';
            filterElement.innerHTML = `
                ${filter.label}
                <button class="remove-filter" onclick="shopHub.removeFilter('${filter.type}')">
                    <i class="fas fa-times"></i>
                </button>
            `;
            activeFiltersContainer.appendChild(filterElement);
        });
    }

    removeFilter(type) {
        switch (type) {
            case 'category':
                this.filters.category = 'all';
                document.getElementById('categoryFilter').value = 'all';
                break;
            case 'priceRange':
                this.filters.priceRange = 'all';
                document.getElementById('priceFilter').value = 'all';
                break;
            case 'minRating':
                this.filters.minRating = 0;
                document.getElementById('ratingFilter').value = '0';
                break;
            case 'search':
                this.filters.search = '';
                document.getElementById('searchInput').value = '';
                break;
        }
        this.applyFilters();
    }

    clearAllFilters() {
        this.filters = {
            category: 'all',
            priceRange: 'all',
            minRating: 0,
            search: ''
        };

        document.getElementById('categoryFilter').value = 'all';
        document.getElementById('priceFilter').value = 'all';
        document.getElementById('ratingFilter').value = '0';
        document.getElementById('searchInput').value = '';
        document.getElementById('sortSelect').value = 'default';

        this.sortBy = 'default';
        this.applyFilters();
    }

    loadMoreProducts() {
        this.currentPage++;
        this.renderProducts();
    }

    addToCart(product) {
        // In a real app, this would add to cart
        this.showToast(`${product.name} added to cart!`, 'success');
    }

    showToast(message, type = 'success') {
        const toastContainer = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? 'fa-check-circle' : 
                    type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';

        toast.innerHTML = `
            <i class="fas ${icon}"></i>
            <div class="toast-content">
                <div class="toast-title">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        toastContainer.appendChild(toast);

        // Auto remove after 3 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 3000);

        // Close button functionality
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            toast.remove();
        });
    }

    // Event Listeners Setup
    setupEventListeners() {
        // Search
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', (e) => {
            this.filters.search = e.target.value;
            this.applyFilters();
        });

        // Filters
        const categoryFilter = document.getElementById('categoryFilter');
        const priceFilter = document.getElementById('priceFilter');
        const ratingFilter = document.getElementById('ratingFilter');

        categoryFilter.addEventListener('change', (e) => {
            this.filters.category = e.target.value;
            this.applyFilters();
        });

        priceFilter.addEventListener('change', (e) => {
            this.filters.priceRange = e.target.value;
            this.applyFilters();
        });

        ratingFilter.addEventListener('change', (e) => {
            this.filters.minRating = parseFloat(e.target.value);
            this.applyFilters();
        });

        // Sorting
        const sortSelect = document.getElementById('sortSelect');
        sortSelect.addEventListener('change', (e) => {
            this.sortBy = e.target.value;
            this.sortProducts();
            this.renderProducts();
        });

        // View toggle
        const gridViewBtn = document.getElementById('gridView');
        const listViewBtn = document.getElementById('listView');

        gridViewBtn.addEventListener('click', () => this.setView('grid'));
        listViewBtn.addEventListener('click', () => this.setView('list'));

        // Clear filters
        const clearFiltersBtn = document.getElementById('clearFilters');
        clearFiltersBtn.addEventListener('click', () => this.clearAllFilters());

        // Reset filters
        const resetFiltersBtn = document.getElementById('resetFilters');
        if (resetFiltersBtn) {
            resetFiltersBtn.addEventListener('click', () => this.clearAllFilters());
        }

        // Load more
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => this.loadMoreProducts());
        }

        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        themeToggle.addEventListener('click', () => this.toggleTheme());

        // Wishlist button
        const wishlistBtn = document.getElementById('wishlistBtn');
        wishlistBtn.addEventListener('click', () => this.openWishlist());

        // Modal close buttons
        const closeQuickView = document.getElementById('closeQuickView');
        const closeWishlist = document.getElementById('closeWishlist');

        closeQuickView.addEventListener('click', () => this.closeQuickView());
        closeWishlist.addEventListener('click', () => this.closeWishlist());

        // Close modals when clicking outside
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Escape to close modals
            if (e.key === 'Escape') {
                const quickViewModal = document.getElementById('quickViewModal');
                const wishlistModal = document.getElementById('wishlistModal');
                
                if (quickViewModal.style.display === 'flex') {
                    this.closeQuickView();
                }
                if (wishlistModal.style.display === 'flex') {
                    this.closeWishlist();
                }
            }
        });
    }
}

// Initialize the app when DOM is loaded
let shopHub;
document.addEventListener('DOMContentLoaded', () => {
    shopHub = new ShopHub();
}); 