import React, { useEffect, useState, useMemo } from 'react';
import { dataService } from '../services/api';

const Dashboard = () => {
    const [incidents, setIncidents] = useState([]);
    const [risks, setRisks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('incidents');
    const [userData, setUserData] = useState(null);

    // Search and Filter State
    const [searchTerm, setSearchTerm] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('All');

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        try {
            if (typeof dateStr === 'string' && dateStr.includes('/Date')) {
                const ts = parseInt(dateStr.match(/\d+/)?.[0]);
                return ts ? new Date(ts).toLocaleDateString() : 'N/A';
            }
            const date = new Date(dateStr);
            return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString();
        } catch (e) { return 'N/A'; }
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        setUserData(user);

        const fetchData = async () => {
            try {
                const [pInc, pRisk] = await Promise.allSettled([
                    dataService.getIncidents('AT01'),
                    dataService.getRisks()
                ]);
                if (pInc.status === 'fulfilled') setIncidents(pInc.value);
                if (pRisk.status === 'fulfilled') setRisks(pRisk.value);
            } catch (e) {
                console.error('Data fetch error', e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Filtered Data Logic
    const filteredData = useMemo(() => {
        const currentList = activeTab === 'incidents' ? incidents : risks;
        return currentList.filter(item => {
            const desc = (item.IncidentDescription || item.RiskDescription || '').toLowerCase();
            const id = (item.IncidentId || item.RiskId || '').toLowerCase();
            const matchesSearch = desc.includes(searchTerm.toLowerCase()) || id.includes(searchTerm.toLowerCase());

            const priority = item.IncidentPriority || item.RiskSeverity || '';
            const matchesPriority = priorityFilter === 'All' || priority === priorityFilter;

            return matchesSearch && matchesPriority;
        });
    }, [activeTab, incidents, risks, searchTerm, priorityFilter]);

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/';
    };

    const getStatusClass = (status) => {
        const s = status?.toLowerCase();
        if (s === 'high' || s === 'open') return 'status-high';
        if (s === 'medium' || s === 'in progress') return 'status-medium';
        if (s === 'low' || s === 'closed') return 'status-low';
        return '';
    };

    return (
        <div>
            <nav className="navbar">
                <div className="nav-brand">EHSM Secure</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#64748b' }}>Operator</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: '800' }}>{userData?.EmpId}</div>
                    </div>
                    <button onClick={handleLogout} className="btn btn-danger">System Exit</button>
                </div>
            </nav>

            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', margin: 0, color: 'white' }}>Safety Dashboard</h1>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontWeight: '600' }}>Real-time industrial telemetry from Plant AT01</p>
                    </div>
                    <div className="tabs">
                        <div
                            className={`tab ${activeTab === 'incidents' ? 'active' : ''}`}
                            onClick={() => { setActiveTab('incidents'); setPriorityFilter('All'); }}
                        >
                            Incidents
                        </div>
                        <div
                            className={`tab ${activeTab === 'risks' ? 'active' : ''}`}
                            onClick={() => { setActiveTab('risks'); setPriorityFilter('All'); }}
                        >
                            Risks
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div className="card" style={{ flex: 1, margin: 0, padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1', fontSize: '1.5rem' }}>📊</div>
                        <div>
                            <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Incidents</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{incidents.length}</div>
                        </div>
                    </div>
                    <div className="card" style={{ flex: 1, margin: 0, padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#fff1f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ec4899', fontSize: '1.5rem' }}>🛡️</div>
                        <div>
                            <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Risks</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{risks.length}</div>
                        </div>
                    </div>
                </div>

                <div className="card">
                    {/* Search and Filters */}
                    <div className="control-bar">
                        <input
                            type="text"
                            className="search-input"
                            placeholder={`Search by ${activeTab === 'incidents' ? 'Incident' : 'Risk'} ID or Description...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <select
                            className="filter-select"
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                        >
                            <option value="All">All Priorities</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                    </div>

                    {loading ? (
                        <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
                            <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid #f1f5f9', borderTopColor: '#6366f1', borderRadius: '50%', margin: '0 auto 1rem' }}></div>
                            <p>Synchronizing with S/4HANA...</p>
                        </div>
                    ) : (
                        <div>
                            <table className="modern-table">
                                <thead>
                                    {activeTab === 'incidents' ? (
                                        <tr>
                                            <th>Identifier</th>
                                            <th>Description</th>
                                            <th>Category</th>
                                            <th>Priority</th>
                                            <th>Status</th>
                                            <th>Logged Date</th>
                                        </tr>
                                    ) : (
                                        <tr>
                                            <th>Identifier</th>
                                            <th>Description</th>
                                            <th>Category</th>
                                            <th>Severity</th>
                                            <th>Likelihood</th>
                                            <th>Mitigation Measures</th>
                                            <th>Sync Date</th>
                                        </tr>
                                    )}
                                </thead>
                                <tbody>
                                    {filteredData.map((item) => (
                                        <tr key={item.IncidentId || item.RiskId}>
                                            <td style={{ fontWeight: '800', color: '#6366f1' }}>#{item.IncidentId || item.RiskId}</td>
                                            <td style={{ fontWeight: '600' }}>{item.IncidentDescription || item.RiskDescription}</td>
                                            <td>
                                                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#94a3b8', background: '#f8fafc', padding: '0.3rem 0.6rem', borderRadius: '8px' }}>
                                                    {item.IncidentCategory || item.RiskCategory}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`status-pill ${getStatusClass(item.IncidentPriority || item.RiskSeverity)}`}>
                                                    {item.IncidentPriority || item.RiskSeverity}
                                                </span>
                                            </td>
                                            {activeTab === 'incidents' ? (
                                                <td>
                                                    <span className={`status-pill ${getStatusClass(item.IncidentStatus)}`}>
                                                        {item.IncidentStatus}
                                                    </span>
                                                </td>
                                            ) : (
                                                <>
                                                    <td style={{ fontWeight: '600', color: '#64748b' }}>{item.Likelihood}</td>
                                                    <td style={{ maxWidth: '250px', fontSize: '0.85rem', color: '#475569' }}>{item.MitigationMeasures}</td>
                                                </>
                                            )}
                                            <td style={{ color: '#94a3b8', fontWeight: '600', fontSize: '0.85rem' }}>
                                                {formatDate(item.IncidentDate || item.CreatedAt)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {filteredData.length === 0 && (
                                <div style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>
                                    <p>No matching records identified in the current telemetry.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
