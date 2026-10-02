import React from 'react'
import axios from '../../axios';
import { useState } from 'react';
import { useEffect } from 'react';
import './pendingRequests.css'
import { Link } from 'react-router-dom';
function PendingRequests() {
    const [pending, setPending] = useState([]);
    useEffect(() => {
        const fetchPending = async () => {
            const token = localStorage.getItem('user-token');
            const res = await axios.get('/connections/pending', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setPending(res.data.pending);
            console.log(res);
            
        }
        fetchPending();
    }, [])

    const respond = async (connectionId, action) => {
        const token = localStorage.getItem('user-token');
        await axios.post(`/connections/${connectionId}/respond`,
            { action },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        // optimistic removal, same pattern as your like button
        setPending(prev => prev.filter(p => p._id !== connectionId));
    };

    if (pending.length === 0) return null; // nothing to show, no empty clutter

    return (
        <section className="pending-requests-section">
            <h2 className="section-title">Action Needed on Your Posts</h2>
            {pending.map((req) => (
                <div className="pending-card" key={req._id}>
                    <p className="pending-text">
                        <strong>{req.requesterName}</strong>{' '}
                        {req.postType === 'offer' ? 'is interested in your offer' : 'wants to help with your request'}{' '}
                        "<Link to={`/update/${req.postId}`} state={{ data: req.postId }} className="pending-post-link">
                            {req.postTitle}
                        </Link>"
                    </p>
                    <div className="pending-actions">
                        <button className="accept-small" onClick={() => respond(req._id, 'accepted')}>Accept</button>
                        <button className="decline-small" onClick={() => respond(req._id, 'declined')}>Decline</button>
                    </div>
                </div>
            ))}
        </section>
    );

}

export default PendingRequests