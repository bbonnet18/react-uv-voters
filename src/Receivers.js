import React, { useEffect, useState } from "react";
import './App.css';
import axios from 'axios';
import config from './config';
import { Button, Col, Container, Row, Toast, ToastContainer, Spinner } from "react-bootstrap";
import Receiver from "./Receiver";
import unescape from 'validator/lib/unescape';
/**
 * Receivers component
 * - fetches a list of receivers from /api/receivers
 * - allows adding a receiver (POST /api/receivers)
 * - allows deleting a receiver (DELETE /api/receivers/:id)
 *
 * Adjust endpoint paths to match your backend if needed.
 */
export default function Receivers() {

           const starterReceiver = {
            "firstname":{"S":""},
            "lastname":{"S":""},
            "office":{"S":""},
            "category":{"S":""},
            "party":{"S":""},
            "website":{"S":""},
            "social":{"S":""},
            "locality":{"S":""},
        }

 

    const [completed, setCompleted] = useState(false);
    const [completedMessage, setCompletedMessage] = useState("");
    const [completedStatus, setCompletedStatus] = useState("success");
    const [receivers, setReceivers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isNew, setIsNew] = useState(false);
    const [showReceiver,setShowReceiver] = useState(false); 
    const [currentReceiver, setCurrentReceiver] = useState(starterReceiver); 
    const [error, setError] = useState(null);

     

    useEffect(() => {
        let mounted = true;
        async function load() {
            setLoading(true);
            setError(null);
            try {
                // this is where the fetch happens
                await getReceivers();
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

    useEffect(() => {
        if(!showReceiver){
            setCurrentReceiver(starterReceiver);
        }
    }, [showReceiver]);


    // get receivers we can use for tagging 
    const getReceivers = async () => {
        let res = await axios.post(`${config.apiBaseUrl}/conduit/admin-receivers`,{}, {
            withCredentials: true
        });

        if (res && res.status === 200) {
            // let highestId = 0
            // res.data.Items.map((itm,ind)=>{
            //     if(parseInt(itm.receiverId.S) > highestId){
            //         highestId = itm.receiverId.S;
            //     }
            // });
            //setHighestReceiverId(highestId);
            setReceivers(res.data.Items)
        } else {
            setReceivers([]);
        }
    }

    // update the receiver 
    const updateReceiver = async (receiver) => {
        
        console.log('from component: ', receiver); 
        
        try{
            const receiverId = receiver.receiverId;
            const lastname = receiver.lastname;
            const firstname = receiver.firstname;
            const office = receiver.office;
            const party = receiver.party;
            const website = receiver.website || "";
            const social = receiver.social || "";
            const locality = receiver.locality || "";
            const category = receiver.category || "";
    
            const payload = {
                receiverId:receiverId,
                lastname:lastname,
                firstname:firstname,
                office:office,
                party:party,
                website:website,
                social:social,
                locality:locality,
                category:category
            }
    
            let res = await axios.post(`${config.apiBaseUrl}/conduit/update-receiver`,payload, {
                withCredentials: true
            });
            
            let message = "Updated receiver";
            let status = "success"
            if (res && res.status === 200) {
                await getReceivers();           
            } else {
                message = "Error updating receiver"
                status = "danger"
            }
            setCompletedStatus(status);
            setCompletedMessage(message);
            setCompleted(true);
        }catch(err){
        
            let message = "Error updating receiver"
            let status = "danger"
            setCompletedStatus(status);
            setCompletedMessage(message);
            setCompleted(true);
        }

    }

    // delete the receiver 
    const deleteReceiver = async (receiverId,lastname) => {
        try{

            const payload = {
                receiverId: parseInt(receiverId),
                lastname:lastname
            }

            let res = await axios.post(`${config.apiBaseUrl}/conduit/delete-receiver`,payload, {
                withCredentials: true
            });
            
            let message = "Deleted receiver";
            let status = "success"
            if (res && res.status === 200) {
               await getReceivers();           
            } else {
                message = "Error deleting receiver"
                status = "danger"
            }
            setCompletedStatus(status);
            setCompletedMessage(message);
            setCompleted(true);

        }catch(err){
            let message = "Error deleting receiver"
            let status = "danger"
            setCompletedStatus(status);
            setCompletedMessage(message);
            setCompleted(true);
        }
    }

     const submitReceiver = async (receiver) => {
        //const form = document.getElementById('receiverForm');
        try {

            // const isValid = form.checkValidity();
            // if (!isValid) {
            //     var formFields = form.querySelectorAll('.form-control');
            //     for (let i = 0; i < formFields.length; i++) {
            //         let field = formFields[i];
            //         console.log('val: ', field.value);
            //         console.log('Name: ', field.name, " isValid: ", field.checkValidity());
            //     }
            // }

            // if (isValid) {
            //     form.classList.remove('.error');
            //     var formFields = form.querySelectorAll('.form-control');
            //     var partySelect = form.querySelector('#party');
            //     var categorySelect = form.querySelector('#category');
            //     var localitySelect = form.querySelector('#locality');
            //     var formVals = {}
            //     for (let i = 0; i < formFields.length; i++) {
            //         if(formFields[i].value !== ""){
            //             formVals[formFields[i].name] = formFields[i].value;
            //         }
            //     }
            //     formVals.party = partySelect.value;
            //     formVals.category = categorySelect.value;
            //     formVals.locality = localitySelect.value;
                console.log(receiver); 

                // let res = await axios.post(`${config.apiBaseUrl}/conduit/create-receiver`, receiver, {
                //     withCredentials: true
                // })
                // let message = "Created receiver";
                // let status = "success"
                // if (res && res.status === 200) {
                //    await getReceivers();           
                // } else {
                //     message = "Error creating receiver"
                //     status = "danger"
                //     form.classList.add('.error');
                // }

                // setCompletedStatus(status);
                // setCompletedMessage(message);
                // setIsNew(false);
                // setCompleted(true);
            //}
        } catch (err) {
            alert('Error ', err);
        }

    }


    return (

        <Container>
            <h2>Receivers</h2>
            {loading ? (
                <Spinner />
            ) : (
                <>
                 <ToastContainer position='middle-center'>
                                <Toast bg={completedStatus} onClose={() => {
                                    setCompleted(false);
                                }} show={completed} delay={3000} autohide>
                                    <Toast.Header>
                                        <strong className="me-auto">Status</strong>
                                        <small>{completedStatus}</small>
                                    </Toast.Header>
                                    <Toast.Body>{completedMessage}</Toast.Body>
                                </Toast>
                            </ToastContainer>
                <div><Button onClick={()=>{
                    setIsNew(true);
                    setCurrentReceiver(starterReceiver);
                    setShowReceiver(true);
                }}>Add Receiver</Button></div>
                <ul>
                    { receivers && receivers.length ? (receivers.map((receiver,ind) => (<li key={`${receiver.lastname.S}-${ind}`}>{receiver.receiverId.S} - {receiver.lastname.S}, {receiver.firstname.S} | Locality: {receiver && receiver.locality ? receiver.locality.S : "unknown"} <Button variant="primary" onClick={async (e)=>{
                           setCurrentReceiver(receiver); 
                           setShowReceiver(true);
                    }}>Edit</Button> <Button variant="danger" onClick={async (e)=>{
                            
                        try{
                            let receiverId = receiver && receiver.receiverId && receiver.receiverId.S;
                            let lastname = receiver && receiver.lastname && receiver.lastname.S;

                            await deleteReceiver(receiverId,lastname);
                        }catch(err){

                        }

                    }}>Delete</Button></li>))):(<li><div>No receivers</div></li>)}
                </ul>
                </>
                
            )}
            {<Receiver show={showReceiver} hide={setShowReceiver} receiver={currentReceiver} updateReceiver={updateReceiver} isNew={isNew} createReceiver={submitReceiver}></Receiver>}
        </Container>
    );
}