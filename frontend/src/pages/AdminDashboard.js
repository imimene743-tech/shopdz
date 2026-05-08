import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('products');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    // États pour le formulaire d'ajout/modification
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');


const [promotionPrice, setPromotionPrice] = useState('');






    const [stock, setStock] = useState('');
    const [category, setCategory] = useState('1');
    const [image, setImage] = useState(null);
    const [editId, setEditId] = useState(null); 

    // 1. Création de l'instance API de base
    const api = axios.create({
        baseURL: 'http://localhost:5000/api'
    });

    // 2. Intercepteur pour le token
    api.interceptors.request.use((config) => {
        const token = localStorage.getItem('shopdzToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            let response;
            if (activeTab === 'products') {
                response = await api.get('/products');
            } else if (activeTab === 'orders') {
                response = await api.get('/admin/orders');
            } else if (activeTab === 'users') {
                response = await api.get('/users');
            }
            setData(response.data);
        } catch (error) {
            console.error("Erreur lors du chargement des données", error);
            if (error.response?.status === 401 || error.response?.status === 403) {
                alert("Erreur d'autorisation. Veuillez vous reconnecter.");
            }
        } finally {
            setLoading(false);
        }
    };

    // --- LOGIQUE AJOUT / MODIFICATION ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);


formData.append('promotion_price', promotionPrice || '');




        formData.append('stock', stock);
        formData.append('category_id', category);
        if (image) formData.append('image', image);

        try {
            if (editId) {
                await api.put(`/admin/products/${editId}`, formData);
                alert("Produit mis à jour avec succès !");
            } else {
                await api.post('/admin/products', formData);
                alert("Produit ajouté avec succès !");
            }
            resetForm();
            fetchData();
        } catch (error) {
            console.error(error);
            alert("Erreur lors de l'opération");
        }
    };

    const resetForm = () => {
        setName(''); setDescription(''); setPrice('');  
        setPromotionPrice('');              setStock('');
        setImage(null); setEditId(null);
    };

    const handleEditClick = (p) => {
        setEditId(p.id);
        setName(p.name);
        setDescription(p.description);
        setPrice(p.price);


setPromotionPrice(p.promotion_price || '');





        setStock(p.stock);
        setCategory(p.category_id);
        window.scrollTo(0, 0); 
    };

    // --- LOGIQUE SUPPRESSION ---
    const handleDeleteProduct = async (id) => {
        if (window.confirm("Voulez-vous vraiment supprimer ce produit ?")) {
            try {
                await api.delete(`/admin/products/${id}`);
                setData(data.filter(p => p.id !== id));
                alert("Produit supprimé !");
            } catch (error) {
                console.error(error);
                alert("Erreur lors de la suppression");
            }
        }
    };

    // --- LOGIQUE MISE À JOUR STATUT COMMANDE (AJOUTÉ) ---
    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
            setData(data.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            alert("Statut de la commande mis à jour !");
        } catch (error) {
            console.error(error);
            alert("Erreur lors du changement de statut");
        }
    };

    return (
        <div className="admin-container">
            <aside className="admin-sidebar">
                <h2>ShopDZ Admin</h2>
                <button className={activeTab === 'products' ? 'active' : ''} onClick={() => setActiveTab('products')}>Produits</button>
                <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>Commandes</button>
                <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>Clients</button>
            </aside>

            <main className="admin-content">
                <header className="admin-header">
                    <h1>Gestion des {activeTab === 'products' ? 'Produits' : activeTab === 'orders' ? 'Commandes' : 'Clients'}</h1>
                </header>

                {activeTab === 'products' && (
                    <form className="admin-form" onSubmit={handleSubmit}>
                        <h3>{editId ? "Modifier le produit" : "Ajouter un nouveau produit"}</h3>
                        <div className="form-grid">
                            <input type="text" placeholder="Nom" value={name} onChange={(e) => setName(e.target.value)} required />
                            <input type="number" placeholder="Prix (DA)" value={price} onChange={(e) => setPrice(e.target.value)} required />



<input 
        type="number" 
        placeholder="Prix Promotionnel (DA) - Optionnel" 
        value={promotionPrice} 
        onChange={(e) => setPromotionPrice(e.target.value)} 
    />














                            <input type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)} required />
                            <select value={category} onChange={(e) => setCategory(e.target.value)}>
                                <option value="1">Chaussures</option>
                                <option value="2">Vêtements</option>
                                <option value="3">Électroménager</option>




                                <option value="4">Maison</option>
                                <option value="5">Beauté</option>
                               






                            </select>
                            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                        </div>
                        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                        <div className="form-buttons">
                            <button type="submit" className="btn-save">{editId ? "Mettre à jour" : "Ajouter"}</button>
                            {editId && <button type="button" onClick={resetForm} className="btn-cancel">Annuler</button>}
                        </div>
                    </form>
                )}

                {loading ? (
                    <div className="loader">Chargement...</div>
                ) : (
                    <div className="table-wrapper">
                        <table className="admin-table">
                            {activeTab === 'products' && (
                                <>
                                    <thead>
                                        <tr>
                                            <th>Image</th>
                                            <th>Nom</th>
                                            <th>Prix (DA)</th>
                                            <th>Stock</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map(p => (
                                            <tr key={p.id}>
                                                <td>
                                                    {p.image ? (
                                                        <img src={`http://localhost:5000/uploads/${p.image}`} alt={p.name} width="50" style={{borderRadius: '5px'}}/>
                                                    ) : (
                                                        "Pas d'image"
                                                    )}
                                                </td>
                                                <td>{p.name}</td>
                                                <td>{p.price} DA</td>
                                                <td className={p.stock < 5 ? "low-stock" : ""}>{p.stock}</td>
                                                <td>
                                                    <button className="btn-edit" onClick={() => handleEditClick(p)}>Modifier</button>
                                                    <button className="btn-delete" onClick={() => handleDeleteProduct(p.id)}>Supprimer</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </>
                            )}

                            {activeTab === 'orders' && (
                                <>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Client</th>
                                            <th>Wilaya</th>
                                            <th>Total</th>
                                            <th>Statut</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map(o => (
                                            <tr key={o.id}>
                                                <td>#{o.id}</td>
                                                <td>{o.client_name}</td>
                                                <td>{o.wilaya}</td>
                                                <td>{o.total_price} DA</td>
                                                <td>
                                                    <select 
                                                        className={`status-select ${o.status}`} 
                                                        value={o.status} 
                                                        onChange={(e) => handleStatusChange(o.id, e.target.value)}
                                                    >
                                                        <option value="en_attente">En attente</option>
                                                        <option value="confirmée">Confirmée</option>
                                                        <option value="livrée">Livrée</option>
                                                        <option value="annulée">Annulée</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </>
                            )}

                            {activeTab === 'users' && (
                                <>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Nom</th>
                                            <th>Email</th>
                                            <th>Date d'inscription</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map(u => (
                                            <tr key={u.id}>
                                                <td>{u.id}</td>
                                                <td>{u.name}</td>
                                                <td>{u.email}</td>
                                                <td>{new Date(u.created_at).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </>
                            )}
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;