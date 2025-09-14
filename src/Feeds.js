import axios from 'axios';
import config from './config';
import { Button, ButtonGroup, Col, Container, Row, Tabs, Tab, Toast, ToastContainer, Form, ToggleButton } from "react-bootstrap";
import { useState, useEffect } from 'react';
import unescape from 'validator/lib/unescape';

function Feeds() {

    
    return (
        <div style={{ display: 'flex', gap: '2rem', padding: '2rem' }}>
            {/* Feeds Section */}
            <section>
                <h2>Feeds</h2>
                <ul>
                  
                </ul>
            </section>

            {/* Topics and Votes Section */}
            <section>
                <h2>Topics</h2>
                <ul>
                    
                </ul>
            </section>
        </div>
    );
}

export default Feeds;