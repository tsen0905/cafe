import React, { useState, useEffect } from 'react';
import api from '../api';

export default function MenuManager() {
    const [items, setItems] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        category: 'coffee',
        price: '',
        description: '',
        isAvailable: true
    });

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get('/api/menu-items');
            if (res.success) {
                setItems(res.data);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            if (editingItem) {
                await api.put(`/api/menu-items/${editingItem._id}`, formData);
            } else {
                await api.post('/api/menu-items', formData);
            }
            // Reset
            setFormData({ name: '', category: 'coffee', price: '', description: '', isAvailable: true });
            setEditingItem(null);
            fetchItems();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            name: item.name,
            category: item.category,
            price: item.price,
            description: item.description || '',
            isAvailable: item.isAvailable
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('確定要刪除這個品項嗎？')) return;
        try {
            await api.delete(`/api/menu-items/${id}`);
            fetchItems();
        } catch (err) {
            setError(err.message);
        }
    };

    const cancelEdit = () => {
        setEditingItem(null);
        setFormData({ name: '', category: 'coffee', price: '', description: '', isAvailable: true });
    };

    return (
        <div>
            <h2>菜單管理</h2>
            {error && <div className="error-msg">{error}</div>}

            <div className="card">
                <h3>{editingItem ? '編輯品項' : '新增品項'}</h3>
                <form onSubmit={handleSubmit}>
                    <div className="grid">
                        <div className="form-group">
                            <label>名稱</label>
                            <input name="name" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>類別</label>
                            <select name="category" value={formData.category} onChange={handleChange}>
                                <option value="coffee">咖啡 (Coffee)</option>
                                <option value="tea">茶 (Tea)</option>
                                <option value="dessert">甜點 (Dessert)</option>
                                <option value="other">其他 (Other)</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>價格</label>
                            <input type="number" name="price" value={formData.price} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>描述</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>
                            <input type="checkbox" name="isAvailable" checked={formData.isAvailable} onChange={handleChange} />
                            供應中 (Available)
                        </label>
                    </div>
                    <button type="submit" className="btn">{editingItem ? '更新' : '新增'}</button>
                    {editingItem && <button type="button" className="btn btn-danger" onClick={cancelEdit} style={{ marginLeft: '10px' }}>取消</button>}
                </form>
            </div>

            <div className="card">
                <h3>品項列表</h3>
                {loading ? <p>載入中...</p> : (
                    <table>
                        <thead>
                            <tr>
                                <th>名稱</th>
                                <th>類別</th>
                                <th>價格</th>
                                <th>狀態</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(item => (
                                <tr key={item._id}>
                                    <td>{item.name}</td>
                                    <td>{item.category}</td>
                                    <td>${item.price}</td>
                                    <td>{item.isAvailable ? '供應中' : '售完'}</td>
                                    <td>
                                        <button className="btn" onClick={() => handleEdit(item)} style={{ marginRight: '5px' }}>編輯</button>
                                        <button className="btn btn-danger" onClick={() => handleDelete(item._id)}>刪除</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
