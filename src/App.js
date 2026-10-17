import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE = 'http://localhost:3000/api';

function App() {
  const [activeTab, setActiveTab] = useState('printers');
  const [printers, setPrinters] = useState([]);
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);

  // Form states
  const [newPrinter, setNewPrinter] = useState({ name: '', ip_address: '', port: 9100 });
  const [newCategory, setNewCategory] = useState({ name: '', printer_id: '' });
  const [newItem, setNewItem] = useState({ name: '', price: '', category_id: '' });

  useEffect(() => {
    fetchPrinters();
    fetchCategories();
    fetchMenu();
  }, []);

  const fetchPrinters = async () => {
    try {
      const res = await axios.get(`${API_BASE}/printers`);
      setPrinters(res.data);
    } catch (err) {
      console.error('Error fetching printers:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE}/categories`);
      setCategories(res.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchMenu = async () => {
    try {
      const res = await axios.get(`${API_BASE}/menu`);
      setMenuItems(res.data);
    } catch (err) {
      console.error('Error fetching menu:', err);
    }
  };

  const handleAddPrinter = async (e) => {
    e.preventDefault();
    if (!newPrinter.name || !newPrinter.ip_address) return;
    try {
      await axios.post(`${API_BASE}/printers`, newPrinter);
      setNewPrinter({ name: '', ip_address: '', port: 9100 });
      fetchPrinters();
    } catch (err) {
      alert('Failed to add printer');
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.name || !newCategory.printer_id) return;
    try {
      await axios.post(`${API_BASE}/categories`, newCategory);
      setNewCategory({ name: '', printer_id: '' });
      fetchCategories();
    } catch (err) {
      alert('Failed to add category');
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price || !newItem.category_id) return;
    try {
      await axios.post(`${API_BASE}/menu`, newItem);
      setNewItem({ name: '', price: '', category_id: '' });
      fetchMenu();
    } catch (err) {
      alert('Failed to add menu item');
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) return;
    try {
      await axios.delete(`${API_BASE}/menu/${id}`);
      fetchMenu();
    } catch (err) {
      alert('Failed to delete item');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Deleting this category will also remove its associated menu items. Continue?')) return;
    try {
      await axios.delete(`${API_BASE}/categories/${id}`);
      fetchCategories();
      fetchMenu();
    } catch (err) {
      alert('Failed to delete category');
    }
  };

  return (
    <>
      <div className="mobile-block-screen">
        <h1>Desktop Access Only</h1>
        <p>The POS Admin Dashboard is restricted to desktop viewports.</p>
      </div>

      <div className="desktop-only-container">
        <div className="dashboard-layout">
          <aside className="sidebar">
            <h2>POS Admin Dashboard</h2>
            <div 
              className={`nav-item ${activeTab === 'printers' ? 'active' : ''}`}
              onClick={() => setActiveTab('printers')}
            >
              Printer Setup
            </div>
            <div 
              className={`nav-item ${activeTab === 'menu' ? 'active' : ''}`}
              onClick={() => setActiveTab('menu')}
            >
              Menu & Categories
            </div>
          </aside>

          <main className="main-content">
            {activeTab === 'printers' && (
              <div>
                <h2>Thermal Printers Management</h2>
                <div className="card">
                  <h3>Add New Station Printer</h3>
                  <form onSubmit={handleAddPrinter}>
                    <div style={{ display: 'flex', gap: '15px' }}>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label>Printer Name</label>
                        <input 
                          type="text" 
                          value={newPrinter.name}
                          onChange={(e) => setNewPrinter({ ...newPrinter, name: e.target.value })}
                        />
                      </div>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label>Static IP Address</label>
                        <input 
                          type="text" 
                          value={newPrinter.ip_address}
                          onChange={(e) => setNewPrinter({ ...newPrinter, ip_address: e.target.value })}
                        />
                      </div>
                      <div className="form-group" style={{ width: '100px' }}>
                        <label>Port</label>
                        <input 
                          type="number" 
                          value={newPrinter.port}
                          onChange={(e) => setNewPrinter({ ...newPrinter, port: parseInt(e.target.value) })}
                        />
                      </div>
                    </div>
                    <button type="submit" className="btn">Add Printer</button>
                  </form>
                </div>

                <div className="card">
                  <h3>Active Station Printers</h3>
                  <table>
                    <thead>
                      <tr><th>ID</th><th>Name</th><th>IP Address</th><th>Port</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {printers.map((printer) => (
                        <tr key={printer.id}>
                          <td>{printer.id}</td>
                          <td><strong>{printer.name}</strong></td>
                          <td>{printer.ip_address}</td>
                          <td>{printer.port}</td>
                          <td><span style={{ color: 'green', fontWeight: 'bold' }}>● Active</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'menu' && (
              <div>
                <h2>Menu & Category Management</h2>

                {/* Add Category Card */}
                <div className="card">
                  <h3>Create Category & Assign Printer</h3>
                  <form onSubmit={handleAddCategory}>
                    <div style={{ display: 'flex', gap: '15px' }}>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label>Category Name</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Appetizers"
                          value={newCategory.name}
                          onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                        />
                      </div>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label>Target Station Printer</label>
                        <select 
                          value={newCategory.printer_id}
                          onChange={(e) => setNewCategory({ ...newCategory, printer_id: e.target.value })}
                        >
                          <option value="">Select Printer Target</option>
                          {printers.map(p => (
                            <option key={p.id} value={p.id}>{p.name} ({p.ip_address})</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <button type="submit" className="btn">Add Category</button>
                  </form>
                </div>

                {/* Add Menu Item Card */}
                <div className="card">
                  <h3>Add Menu Item</h3>
                  <form onSubmit={handleAddItem}>
                    <div style={{ display: 'flex', gap: '15px' }}>
                      <div className="form-group" style={{ flex: 2 }}>
                        <label>Item Name</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Garlic Bread"
                          value={newItem.name}
                          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        />
                      </div>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label>Price ($)</label>
                        <input 
                          type="number" 
                          step="0.01"
                          placeholder="8.50"
                          value={newItem.price}
                          onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                        />
                      </div>
                      <div className="form-group" style={{ flex: 2 }}>
                        <label>Category</label>
                        <select 
                          value={newItem.category_id}
                          onChange={(e) => setNewItem({ ...newItem, category_id: e.target.value })}
                        >
                          <option value="">Select Category</option>
                          {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name} → [{c.printer_name}]</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <button type="submit" className="btn">Add Item to Menu</button>
                  </form>
                </div>

                {/* Active Categories List */}
                <div className="card">
                  <h3>Active Categories</h3>
                  <table>
                    <thead>
                      <tr><th>Category ID</th><th>Name</th><th>Routed Printer</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {categories.map((cat) => (
                        <tr key={cat.id}>
                          <td>{cat.id}</td>
                          <td><strong>{cat.name}</strong></td>
                          <td><span style={{ color: '#2563eb', fontWeight: '600' }}>{cat.printer_name || 'Unassigned'}</span></td>
                          <td>
                            <button 
                              onClick={() => handleDeleteCategory(cat.id)} 
                              style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                            >
                              Delete Category
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Current Live Menu Items */}
                <div className="card">
                  <h3>Current Menu Items</h3>
                  <table>
                    <thead>
                      <tr><th>Item ID</th><th>Name</th><th>Price</th><th>Category</th><th>Routed Printer</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {menuItems.map((item) => (
                        <tr key={item.item_id}>
                          <td>{item.item_id}</td>
                          <td><strong>{item.item_name}</strong></td>
                          <td>${parseFloat(item.price).toFixed(2)}</td>
                          <td>{item.category_name}</td>
                          <td><span style={{ color: '#2563eb', fontWeight: '600' }}>{item.printer_name || 'Unassigned'}</span></td>
                          <td>
                            <button 
                              onClick={() => handleDeleteItem(item.item_id)} 
                              style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                            >
                              Delete Item
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

export default App;