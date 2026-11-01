const mongoose = require('mongoose');
const { store, generateId } = require('../db/store');

const isMongoActive = () => mongoose.connection.readyState === 1;

function createModelAdapter(type, MongooseModel) {
  const collectionName = store.getCollectionName(type);

  return {
    async countDocuments(filter = {}) {
      if (isMongoActive()) {
        return MongooseModel.countDocuments(filter);
      }
      const list = store.data[collectionName] || [];
      return list.filter((item) => store.matches(item, filter)).length;
    },

    find(filter = {}) {
      if (isMongoActive()) {
        return MongooseModel.find(filter);
      }
      const list = (store.data[collectionName] || []).filter((item) => store.matches(item, filter));
      return store.createQuery(type, list);
    },

    findOne(filter = {}) {
      if (isMongoActive()) {
        return MongooseModel.findOne(filter);
      }
      const list = store.data[collectionName] || [];
      const item = list.find((d) => store.matches(d, filter));
      const wrapped = store.wrap(type, item);

      // Support chained populate if called
      return {
        populate(path, fields) {
          if (!wrapped) return Promise.resolve(null);
          const populated = store.populateDoc(type, wrapped, path, fields);
          return Promise.resolve(store.wrap(type, populated));
        },
        select(fields) {
          if (!wrapped) return Promise.resolve(null);
          if (typeof fields === 'string') {
            fields.split(' ').forEach((f) => {
              if (f.startsWith('-')) delete wrapped[f.slice(1)];
            });
          }
          return Promise.resolve(wrapped);
        },
        then(resolve, reject) {
          try {
            resolve(wrapped);
          } catch (e) {
            reject(e);
          }
        },
      };
    },

    findById(id) {
      if (isMongoActive()) {
        return MongooseModel.findById(id);
      }
      const targetId = id?._id ? id._id.toString() : id?.toString();
      const list = store.data[collectionName] || [];
      const item = list.find((d) => d._id === targetId);
      const wrapped = store.wrap(type, item);

      return {
        populate(path, fields) {
          if (!wrapped) return Promise.resolve(null);
          const populated = store.populateDoc(type, wrapped, path, fields);
          return Promise.resolve(store.wrap(type, populated));
        },
        select(fields) {
          if (!wrapped) return Promise.resolve(null);
          if (typeof fields === 'string') {
            fields.split(' ').forEach((f) => {
              if (f.startsWith('-')) delete wrapped[f.slice(1)];
            });
          }
          return Promise.resolve(wrapped);
        },
        then(resolve, reject) {
          try {
            resolve(wrapped);
          } catch (e) {
            reject(e);
          }
        },
      };
    },

    async create(data) {
      if (isMongoActive()) {
        return MongooseModel.create(data);
      }
      const item = {
        ...data,
        _id: data._id ? data._id.toString() : generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      store.data[collectionName].push(item);
      store.save();
      return store.wrap(type, item);
    },

    async insertMany(items) {
      if (isMongoActive()) {
        return MongooseModel.insertMany(items);
      }
      const now = new Date().toISOString();
      const created = items.map((data) => ({
        ...data,
        _id: data._id ? data._id.toString() : generateId(),
        createdAt: now,
        updatedAt: now,
      }));
      store.data[collectionName].push(...created);
      store.save();
      return created.map((it) => store.wrap(type, it));
    },

    async findByIdAndDelete(id) {
      if (isMongoActive()) {
        return MongooseModel.findByIdAndDelete(id);
      }
      const targetId = id?._id ? id._id.toString() : id?.toString();
      const idx = store.data[collectionName].findIndex((d) => d._id === targetId);
      if (idx >= 0) {
        const deleted = store.data[collectionName].splice(idx, 1)[0];
        store.save();
        return store.wrap(type, deleted);
      }
      return null;
    },

    async findOneAndUpdate(filter, update) {
      if (isMongoActive()) {
        return MongooseModel.findOneAndUpdate(filter, update);
      }
      const idx = store.data[collectionName].findIndex((d) => store.matches(d, filter));
      if (idx >= 0) {
        let item = store.data[collectionName][idx];
        if (update && typeof update === 'object') {
          if (update.$set) {
            Object.assign(item, update.$set);
          } else {
            Object.assign(item, update);
          }
        }
        item.updatedAt = new Date().toISOString();
        store.save();
        return store.wrap(type, item);
      }
      return null;
    },

    async aggregate(pipeline) {
      if (isMongoActive()) {
        return MongooseModel.aggregate(pipeline);
      }
      // Specific aggregations used in admin dashboard:
      // 1. Total revenue: [{ $group: { _id: null, total: { $sum: '$totalPrice' } } }]
      const isRevenue = pipeline.some((p) => p.$group && p.$group.total);
      if (isRevenue) {
        const total = (store.data.orders || []).reduce((sum, o) => sum + (o.totalPrice || 0), 0);
        return [{ _id: null, total }];
      }

      // 2. Top products sold
      const isTopProducts = pipeline.some((p) => p.$unwind && p.$unwind === '$items');
      if (isTopProducts) {
        const productSales = {};
        (store.data.orders || []).forEach((order) => {
          (order.items || []).forEach((item) => {
            const pid = item.product?._id ? item.product._id.toString() : item.product?.toString();
            if (pid) {
              productSales[pid] = (productSales[pid] || 0) + (item.quantity || 1);
            }
          });
        });

        const sorted = Object.entries(productSales)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([pid, totalSold]) => {
            const product = store.data.products.find((p) => p._id === pid);
            return {
              _id: pid,
              totalSold,
              product: product ? store.wrap('Product', product) : null,
            };
          })
          .filter((item) => item.product);

        return sorted;
      }

      return [];
    },
  };
}

module.exports = { createModelAdapter, isMongoActive };

