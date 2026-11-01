const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

const generateId = () => crypto.randomBytes(12).toString('hex');

const initialData = {
  users: [],
  products: [],
  carts: [],
  orders: [],
};

class JsonStore {
  constructor() {
    this.data = initialData;
    this.init();
  }

  init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf8');
        this.data = JSON.parse(raw);
        if (!this.data.users) this.data.users = [];
        if (!this.data.products) this.data.products = [];
        if (!this.data.carts) this.data.carts = [];
        if (!this.data.orders) this.data.orders = [];
      } else {
        this.save();
      }
    } catch (err) {
      console.error('Error loading JSON store:', err.message);
      this.data = { users: [], products: [], carts: [], orders: [] };
    }
  }

  save() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      console.error('Error saving JSON store:', err.message);
    }
  }

  // --- Document Wrapping ---
  wrap(type, item) {
    if (!item) return null;
    const self = this;

    const doc = { ...item };

    // Common properties
    doc._id = item._id ? item._id.toString() : generateId();

    // Virtual getters
    if (type === 'Product') {
      Object.defineProperty(doc, 'finalPrice', {
        get() {
          const discount = this.discount || 0;
          return parseFloat((this.price * (1 - discount / 100)).toFixed(2));
        },
        enumerable: true,
      });
    }

    if (type === 'Cart') {
      Object.defineProperty(doc, 'totalPrice', {
        get() {
          return (this.items || []).reduce((tot, it) => tot + (it.price || 0) * (it.quantity || 1), 0);
        },
        enumerable: true,
      });
      Object.defineProperty(doc, 'totalItems', {
        get() {
          return (this.items || []).reduce((cnt, it) => cnt + (it.quantity || 0), 0);
        },
        enumerable: true,
      });
    }

    doc.save = async function () {
      const collection = self.data[self.getCollectionName(type)];
      const idx = collection.findIndex((d) => d._id === this._id);
      this.updatedAt = new Date().toISOString();
      if (idx >= 0) {
        collection[idx] = { ...this };
      } else {
        collection.push({ ...this });
      }
      self.save();
      return self.wrap(type, collection[idx >= 0 ? idx : collection.length - 1]);
    };

    doc.toObject = function () {
      return { ...this };
    };
    doc.toJSON = function () {
      return { ...this };
    };

    return doc;
  }

  getCollectionName(type) {
    switch (type) {
      case 'User': return 'users';
      case 'Product': return 'products';
      case 'Cart': return 'carts';
      case 'Order': return 'orders';
      default: return 'data';
    }
  }

  // --- Matching ---
  matches(item, filter) {
    if (!filter || Object.keys(filter).length === 0) return true;

    for (const [key, value] of Object.entries(filter)) {
      if (key === '_id') {
        const targetId = value?._id ? value._id.toString() : value?.toString();
        if (item._id !== targetId) return false;
        continue;
      }

      if (key === 'user') {
        const targetUser = value?._id ? value._id.toString() : value?.toString();
        const itemUser = item.user?._id ? item.user._id.toString() : item.user?.toString();
        if (itemUser !== targetUser) return false;
        continue;
      }

      if (value && typeof value === 'object' && !Array.isArray(value)) {
        if (value.$regex) {
          const re = new RegExp(value.$regex, value.$options || '');
          if (!re.test(item[key] || '')) return false;
        }
        if (value.$gte !== undefined && (item[key] < value.$gte)) return false;
        if (value.$lte !== undefined && (item[key] > value.$lte)) return false;
        if (value.$gt !== undefined && (item[key] <= value.$gt)) return false;
        if (value.$lt !== undefined && (item[key] >= value.$lt)) return false;
      } else {
        if (item[key] !== value) return false;
      }
    }
    return true;
  }

  // --- Query Builder ---
  createQuery(type, list) {
    const self = this;
    let items = [...list];
    let selectedExclude = [];

    const queryPromise = {
      sort(sortOpt) {
        if (sortOpt && typeof sortOpt === 'object') {
          const [field, dir] = Object.entries(sortOpt)[0] || [];
          if (field) {
            items.sort((a, b) => {
              if (field === 'createdAt') {
                return dir === -1
                  ? new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
                  : new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
              }
              if (dir === -1) return (b[field] || 0) > (a[field] || 0) ? 1 : -1;
              return (a[field] || 0) > (b[field] || 0) ? 1 : -1;
            });
          }
        }
        return this;
      },
      skip(count) {
        items = items.slice(count);
        return this;
      },
      limit(count) {
        if (count > 0) items = items.slice(0, count);
        return this;
      },
      select(fields) {
        if (typeof fields === 'string') {
          fields.split(' ').forEach((f) => {
            if (f.startsWith('-')) selectedExclude.push(f.slice(1));
          });
        }
        return this;
      },
      populate(path, selectFields) {
        items = items.map((item) => self.populateDoc(type, item, path, selectFields));
        return this;
      },
      then(resolve, reject) {
        try {
          const wrapped = items.map((it) => {
            const w = self.wrap(type, it);
            selectedExclude.forEach((ex) => delete w[ex]);
            return w;
          });
          resolve(wrapped);
        } catch (e) {
          reject(e);
        }
      },
    };

    return queryPromise;
  }

  populateDoc(type, doc, path, selectFields) {
    const clone = { ...doc };

    if (path === 'user') {
      const user = this.data.users.find((u) => u._id === (clone.user?._id || clone.user?.toString()));
      if (user) {
        const uDoc = { _id: user._id, name: user.name, email: user.email };
        clone.user = uDoc;
      }
    }

    if (path === 'items.product') {
      if (Array.isArray(clone.items)) {
        clone.items = clone.items.map((item) => {
          const pid = item.product?._id ? item.product._id.toString() : item.product?.toString();
          const prod = this.data.products.find((p) => p._id === pid);
          if (prod) {
            const wrappedProd = this.wrap('Product', prod);
            return { ...item, product: wrappedProd };
          }
          return item;
        });
      }
    }

    return clone;
  }
}

const store = new JsonStore();
module.exports = { store, generateId };

