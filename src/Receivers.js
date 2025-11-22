import React, { useEffect, useState } from "react";

/**
 * Receivers component
 * - fetches a list of receivers from /api/receivers
 * - allows adding a receiver (POST /api/receivers)
 * - allows deleting a receiver (DELETE /api/receivers/:id)
 *
 * Adjust endpoint paths to match your backend if needed.
 */
export default function Receivers() {
    const [receivers, setReceivers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;
        async function load() {
            //setLoading(true);
            setError(null);
            try {
                // this is where the fetch happens
                //
            } catch (err) {
                if (mounted) setError(err.message || "Unknown error");
            } finally {
                if (mounted) setLoading(false);
            }
        }
        load();
        return () => {
            mounted = false;
        };
    }, []);


    return (
        <div className="receivers">
            <h2>Receivers</h2>
            {loading ? (
                <div>Loading receivers…</div>
            ) : (
                <></>
            )}
        </div>
    );
}