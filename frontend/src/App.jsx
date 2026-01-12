import React, { useState } from 'react';
import MenuManager from './components/MenuManager';
import OrderManager from './components/OrderManager';

function App() {
    const [activeTab, setActiveTab] = useState('menu');

    return (
        <div className="App">
            <header>
                <div className="container">
                    <h1>☕ Cafe Manager</h1>
                    <nav>

                        <button
                            className={activeTab === 'menu' ? 'active' : ''}
                            onClick={() => setActiveTab('menu')}
                        >
                            菜單管理 (Menu)
                        </button>
                        <button
                            className={activeTab === 'orders' ? 'active' : ''}
                            onClick={() => setActiveTab('orders')}
                        >
                            訂單管理 (Orders)
                        </button>
                    </nav>
                </div>
            </header>

            <main className="container">
                {activeTab === 'menu' ? <MenuManager /> : <OrderManager />}
            </main>
        </div>
    );
}

export default App;
