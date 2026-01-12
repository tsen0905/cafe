import React, { useState, useEffect } from 'react';
import api from '../api';

export default function OrderManager() {
    const [orders, setOrders] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [error, setError] = useState(null);

    // New Order State
    const [customerName, setCustomerName] = useState('');
    const [note, setNote] = useState('');
    const [basket, setBasket] = useState([]); // Array of {menuItemId, name, price, qty}

    useEffect(() => {
        fetchOrders();
        fetchMenu();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/api/orders');
            if (res.success) setOrders(res.data);
        } catch (err) {
            setError(err.message);
        }
    };

    const fetchMenu = async () => {
        try {
            const res = await api.get('/api/menu-items');
            if (res.success) setMenuItems(res.data.filter(i => i.isAvailable));
        } catch (err) {
            setError(err.message);
        }
    };

    const addToBasket = (item) => {
        setBasket(prev => {
            const existing = prev.find(p => p.menuItemId === item._id);
            if (existing) {
                return prev.map(p => p.menuItemId === item._id ? { ...p, qty: p.qty + 1 } : p);
            }
            return [...prev, { menuItemId: item._id, name: item.name, price: item.price, qty: 1 }];
        });
    };

    const removeFromBasket = (id) => {
        setBasket(prev => prev.filter(p => p.menuItemId !== id));
    };

    const submitOrder = async (e) => {
        e.preventDefault();
        if (basket.length === 0) {
            setError('購物車是空的');
            return;
        }
        setError(null);
        try {
            await api.post('/api/orders', {
                customerName,
                items: basket,
                note
            });
            setCustomerName('');
            setNote('');
            setBasket([]);
            fetchOrders();
        } catch (err) {
            setError(err.message);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/api/orders/${id}`, { status });
            fetchOrders();
        } catch (err) {
            setError(err.message);
        }
    };

    const deleteOrder = async (id) => {
        if (!window.confirm('確定要刪除這筆訂單嗎？')) return;
        try {
            await api.delete(`/api/orders/${id}`);
            fetchOrders();
        } catch (err) {
            setError(err.message);
        }
    };

    const basketTotal = basket.reduce((sum, item) => sum + (item.price * item.qty), 0);

    return (
        <div>
            <h2>訂單管理</h2>
            {error && <div className="error-msg">{error}</div>}

            {/* Create Order Section */}
            <div className="card">
                <h3>新增訂單</h3>
                <form onSubmit={submitOrder}>
                    <div className="form-group">
                        <label>顧客姓名</label>
                        <input value={customerName} onChange={e => setCustomerName(e.target.value)} required />
                    </div>

                    <div className="form-group">
                        <label>點選品項加入</label>
                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                            {menuItems.map(item => (
                                <button key={item._id} type="button" className="btn" onClick={() => addToBasket(item)}>
                                    {item.name} (${item.price})
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>購物車</label>
                        <ul>
                            {basket.map(item => (
                                <li key={item.menuItemId}>
                                    {item.name} x {item.qty} = ${item.price * item.qty}
                                    <button type="button" onClick={() => removeFromBasket(item.menuItemId)} style={{ marginLeft: '10px', color: 'red' }}>x</button>
                                </li>
                            ))}
                        </ul>
                        <strong>總計: ${basketTotal}</strong>
                    </div>

                    <div className="form-group">
                        <label>備註</label>
                        <textarea value={note} onChange={e => setNote(e.target.value)} />
                    </div>

                    <button type="submit" className="btn btn-success">建立訂單</button>
                </form>
            </div>

            {/* Order List Section */}
            <div className="card">
                <h3>交易紀錄</h3>
                <div style={{ overflowX: 'auto' }}>
                    <table>
                        <thead>
                            <tr>
                                <th>時間</th>
                                <th>顧客</th>
                                <th>總額</th>
                                <th>備註</th>
                                <th>狀態</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order._id}>
                                    <td>{new Date(order.createdAt).toLocaleTimeString()}</td>
                                    <td>{order.customerName}</td>
                                    <td>${order.total}</td>
                                    <td style={{ whiteSpace: 'pre-wrap' }}>{order.note || '-'}</td>
                                    <td>
                                        <select
                                            value={order.status}
                                            onChange={(e) => updateStatus(order._id, e.target.value)}
                                            style={{
                                                background: order.status === 'done' ? '#d4edda' : order.status === 'cancelled' ? '#f8d7da' : '#fff'
                                            }}
                                        >
                                            <option value="pending">待處理 (Pending)</option>
                                            <option value="making">製作中 (Making)</option>
                                            <option value="done">完成 (Done)</option>
                                            <option value="cancelled">已取消 (Cancelled)</option>
                                        </select>
                                    </td>
                                    <td>
                                        <button className="btn btn-danger" onClick={() => deleteOrder(order._id)}>刪除</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
