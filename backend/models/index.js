const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * Common Soft Delete Plugin
 */
function softDeletePlugin(schema) {
  schema.add({
    deletedAt: { type: Date, default: null },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
  });

  schema.methods.softDelete = function(deletedByUserId) {
    this.deletedAt = new Date();
    this.deletedBy = deletedByUserId;
    if (this.isActive !== undefined) this.isActive = false;
    return this.save();
  };

  schema.pre(/^find/, function() {
    if (!this.getOptions().includeDeleted) {
      this.where({ deletedAt: null });
    }
  });
}

// --- User Model ---
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'boutique', 'client'], required: true },
  firstName: { type: String, required: function() { return this.role === 'client'; } },
  lastName: { type: String, required: function() { return this.role === 'client'; } },
  phone: { type: String, trim: true },
  address: { street: String, city: String, zipCode: String, country: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

userSchema.plugin(softDeletePlugin);

// Hash password
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

// --- Category Model ---
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String, trim: true },
  type: { type: String, enum: ['boutique', 'produit'], required: true },
  icon: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

categorySchema.plugin(softDeletePlugin);
const Category = mongoose.model('Category', categorySchema);

// --- Shop Model ---
const shopSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  logo: { type: String, default: '' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  location: { floor: String, zone: String, shopNumber: String },
  contact: { phone: String, email: { type: String, lowercase: true } },
  hours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String }
  },
  status: { type: String, enum: ['pending', 'active', 'suspended', 'rejected'], default: 'pending' },
  isActive: { type: Boolean, default: true },
  statistics: {
    totalOrders: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    totalProducts: { type: Number, default: 0 }
  }
}, { timestamps: true });

shopSchema.plugin(softDeletePlugin);
const Shop = mongoose.model('Shop', shopSchema);

// --- Product Model ---
const productSchema = new mongoose.Schema({
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, min: 0 },
  discount: { type: Number, default: 0, min: 0, max: 100 },
  promoEndDate: { type: Date },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  images: [String],
  stock: {
    quantity: { type: Number, required: true, default: 0, min: 0 },
    lowStockAlert: { type: Number, default: 5 }
  },
  isPromotion: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  promotionHistory: [
    {
      discount: { type: Number, min: 0, max: 100 },
      startDate: { type: Date },
      endDate: { type: Date },
      action: { type: String, enum: ['enabled', 'disabled'], default: 'enabled' },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  priceHistory: [
    {
      oldPrice: { type: Number, min: 0 },
      newPrice: { type: Number, min: 0 },
      changedAt: { type: Date, default: Date.now }
    }
  ],
  specifications: { type: Map, of: String },
  statistics: {
    views: { type: Number, default: 0 },
    sold: { type: Number, default: 0 }
  }
}, { timestamps: true });

productSchema.index({ name: 'text', description: 'text' });
productSchema.plugin(softDeletePlugin);
const Product = mongoose.model('Product', productSchema);

// --- Order Model ---
const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true, required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    subtotal: { type: Number, required: true },
    image: String
  }],
  totalAmount: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'], default: 'pending' },
  deliveryInfo: {
    method: { type: String, enum: ['pickup', 'delivery'], default: 'pickup' },
    address: { street: String, city: String, zipCode: String, country: String },
    phone: String
  },
  paymentInfo: {
    method: { type: String, enum: ['cash', 'card', 'mobile'], default: 'cash' },
    status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    paidAt: Date
  },
  notes: String,
  shopOrders: [{
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
    status: { type: String, default: 'pending' },
    items: [{ type: mongoose.Schema.Types.ObjectId }],
    subtotal: Number
  }]
}, { timestamps: true });

// Auto-generate order number
orderSchema.pre('save', async function() {
  if (!this.orderNumber) {
    this.orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
  }
});

orderSchema.plugin(softDeletePlugin);
const Order = mongoose.model('Order', orderSchema);

// --- Cart Model ---
const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    price: { type: Number, required: true },
    addedAt: { type: Date, default: Date.now }
  }],
  totalAmount: { type: Number, default: 0 }
}, { timestamps: true });

cartSchema.methods.calculateTotal = function() {
  this.totalAmount = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  return this.totalAmount;
};

cartSchema.plugin(softDeletePlugin);
const Cart = mongoose.model('Cart', cartSchema);

// --- Notification Model ---
const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['order', 'shop', 'system', 'promotion'], required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  relatedId: mongoose.Schema.Types.ObjectId,
  relatedModel: { type: String, enum: ['Order', 'Shop', 'Product'] },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

notificationSchema.plugin(softDeletePlugin);
const Notification = mongoose.model('Notification', notificationSchema);

// --- Mall Settings Model ---
const mallSettingsSchema = new mongoose.Schema({
  name: { type: String, required: true, default: 'Centre Commercial' },
  description: String,
  address: { street: String, city: String, zipCode: String, country: String },
  contact: { phone: String, email: String, website: String },
  hours: {
    weekday: { open: String, close: String },
    weekend: { open: String, close: String }
  },
  logo: String,
  socialMedia: { facebook: String, instagram: String, twitter: String }
}, { timestamps: true });

const MallSettings = mongoose.model('MallSettings', mallSettingsSchema);

module.exports = { User, Category, Shop, Product, Order, Cart, Notification, MallSettings };
