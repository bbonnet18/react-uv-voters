import './App.css';
import axios from 'axios';
import config from './config';
import { Button, ButtonGroup, Col, Container, Row, Tabs, Tab, Toast, ToastContainer, Form, ToggleButton } from "react-bootstrap";
import { useState, useEffect } from 'react';
import unescape from 'validator/lib/unescape';
import Receiver from './Receiver';


function Conduit() {
    const [groups, setGroups] = useState([]);
    const [group, setGroup] = useState();
    const [topics, setTopics] = useState([]);
    const [topic, setTopic] = useState();
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showTopics, setShowTopics] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [showReceiver, setShowReceiver] = useState(false);
    const [highestReceiverId,setHighestReceiverId] = useState(0);
    const [receivers, setReceivers] = useState([]);
    const [completed, setCompleted] = useState(false);
    const [completedMessage, setCompletedMessage] = useState("");
    const [completedStatus, setCompletedStatus] = useState("success");


    const starterReceiver = {
        "firstname": "",
        "lastname": "",
        "office": "",
        "status": "",
        "website": "",
        "social": "",
        "locality": "",
    }

    const [currentReceiver, setCurrentReceiver] = useState(starterReceiver);
    const [firstName, setFirstName] = useState("");

    useEffect(() => {
        const fetchGroups = async () => {
            await getGroups();
        }
        fetchGroups();
    }, [])

    useEffect(() => {
        const retrieveTopics = async () => {
            if (group) {
                await getTopics(group.gsid);
                await getReceivers();
            }
        }
        retrieveTopics();
    }, [group])

    useEffect(() => {
        const checkComments = async () => {
            if (group && group.gsid && topic && topic.topicId) {
                let gId = group.gsid;
                let tId = topic.topicId;
                let active = false;
                await getComments(gId, tId, active);
            }

        }
        checkComments();
    }, [topic])


    // will get the list of groups
    // this is a limeapi call 
    const getGroups = async () => {
        setLoading(true);
        setTopic();
        setGroup();
        setTopics([]);
        setComments([]);
        setShowTopics(false);

        try {

            let res = await axios.get(`${config.apiBaseUrl}/limeapi/groups`, {
                withCredentials: true
            });

            if (res && res.status === 200) {
                setGroups(res.data);
            } else {
                setGroups([]);
            }
        } catch (err) {

        }

        setLoading(false);
    }

    // get receivers we can use for tagging 
    const getReceivers = async () => {
        let res = await axios.post(`${config.apiBaseUrl}/conduit/get-receivers`, {
            withCredentials: true
        });

        if (res && res.status === 200) {
            let highestId = 0
            res.data.Items.map((itm,ind)=>{
                if(itm.receiverId.S > highestId){
                    highestId = itm.receiverId.S;
                }
            });
            setHighestReceiverId(highestId);
            setReceivers(res.data.Items)
        } else {
            setReceivers([]);
        }


    }

    const createTag = (receiver, topic) => {
        if (receiver && topic) {
            let currTags = topic.tags || "";
            let tagArr = currTags.length ? currTags.split("|") : [];
            let tag = `${receiver.receiverId.S}-${receiver.lastname.S}`;
            tagArr.push(tag);
            currTags = tagArr.join("|");
            let newTopic = { ...topic };
            newTopic.tags = currTags;
            setTopic(newTopic);
        }
    }

    const removeTag = (tagName) => {
        if (topic && topic.tags) {
            let newTopic = { ...topic };
            let topicTags = topic.tags.split("|");
            topicTags = topicTags.filter((itm, ind) => {
                if (itm !== tagName) {
                    return true;
                }
                return false;
            })
            newTopic.tags = topicTags.length ? topicTags.join("|") : "";
            setTopic(newTopic);
        }
    }

    //gets the topics in a group
    const getTopics = async (groupId) => {
        let payload = { groupId: groupId }
        let res = await axios.post(`${config.apiBaseUrl}/conduit/admin-topics`, payload, {
            withCredentials: true
        });

        if (res && res.status === 200) {
            let voterTopics = res.data.Items.map((itm) => {
                let unescapedTopic = unescape(itm.topic);
                itm.topic = unescapedTopic;
                return itm;
            });
            setTopics(voterTopics);

        } else {
            setTopics([]);
        }
        setShowTopics(true);
    }

    //create a topic
    const createTopic = async (groupId, topicId, topic) => {
        let payload = {
            groupId: groupId,
            topicId: topicId,
            topic
        }
        let res = await axios.post(`${config.apiBaseUrl}/conduit/create-topic`, payload, {
            withCredentials: true
        });

        if (res && res.status === 200) {
            await getTopics(group.gsid, false);
            setCompletedStatus('success');
            setCompletedMessage(`Successfully created a topic in ${groupId}`);
            setCompleted(true);
        }
    }

    // can deactivate a group with this 
    const updateTopic = async (groupId, topicId, active, tags) => {
        let payload = {
            groupId: groupId,
            topicId: topicId,
            active: active,
            tags: tags
        }
        let res = await axios.post(`${config.apiBaseUrl}/conduit/update-topic`, payload, {
            withCredentials: true
        });
        let message = "Successfully updated topic!";
        let status = "success";
        let completed = true;
        if (res && res.status === 200) {
            await getTopics(group.gsid);
        } else {
            message = "Error updating topic!";
            status = "danger";
        }

        setCompletedStatus(status);
        setCompletedMessage(message);
        setCompleted(completed);
    }


    const getComments = async (groupId, topicId, active) => {
        let payload = {
            groupId: groupId,
            topicId: topicId,
            active: active
        }
        let res = await axios.post(`${config.apiBaseUrl}/conduit/get-comments`, payload, {
            withCredentials: true
        });

        if (res && res.status === 200) {
            let voterComments = res.data.Items.map((itm) => {
                let unescapedComment = unescape(itm.comment);
                itm.comment = unescapedComment
                return itm;
            });

            setComments(voterComments);
        } else {
            setComments([]);
        }
        setShowComments(true);
    }
    // get topics within a group 
    const updateComment = async (groupId, topicId, voterName, active, comment_status) => {
        let payload = {
            groupId: groupId,
            topicId: topicId,
            voterName: voterName,
            active: active,
            comment_status: comment_status
        }

        let res = await axios.post(`${config.apiBaseUrl}/conduit/update-comment`, payload, {
            withCredentials: true
        });

        if (res && res.status === 200) {
            console.log('completed ', res.statusText);
            setCompletedStatus("success");
            setCompletedMessage("Updated comment");
            setCompleted(true);
        } else {
            setCompletedStatus("danger");
            setCompletedMessage("Error updating comment");
            setCompleted(true);
        }
    }

    const newReceiverStatus = (status) => {
        if (status === 'success') {
            setCompletedStatus("success");
            setCompletedMessage("created receiver");
        } else {
            setCompletedStatus("danger");
            setCompletedMessage("Error creating receiver");
        }
        setCompleted(true);
    }

    const submitReceiver = async (e) => {
        const form = document.getElementById('receiverForm');
        try {

            const isValid = form.checkValidity();
            if (!isValid) {
                var formFields = form.querySelectorAll('.form-control');
                for (let i = 0; i < formFields.length; i++) {
                    let field = formFields[i];
                    console.log('val: ', field.value);
                    console.log('Name: ', field.name, " isValid: ", field.checkValidity());
                }
            }

            if (isValid) {
                form.classList.remove('.error');
                var formFields = form.querySelectorAll('.form-control');
                var partySelect = form.querySelector('#party');
                var levelSelect = form.querySelector('#level');
                var formVals = {}
                for (let i = 0; i < formFields.length; i++) {
                    if(formFields[i].value !== ""){
                        formVals[formFields[i].name] = formFields[i].value;
                    }
                }
                formVals.party = partySelect.value;
                formVals.level = levelSelect.value;
                formVals.receiverId = parseInt(highestReceiverId) + 1; 

                let res = await axios.post(`${config.apiBaseUrl}/conduit/create-receiver`, formVals, {
                    withCredentials: true
                })
                if (res && res.status === 200) {
                    newReceiverStatus("success");
                }
            } else {
                form.classList.add('.error');
                newReceiverStatus("error");
            }

        } catch (err) {
            alert('Error ', err);
        }


    }


    // need to create breadcrumbs to get back
    return (
        <Container className='conduit'>
            <h3>Conduit</h3>
            <p>Select a group and a topic to view comments and approve or reject.</p>
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
            <Row>
                <div><Button variant='primary' onClick={() => {
                    setShowReceiver(!showReceiver);
                }}>{showReceiver ? "Hide Receiver Form" : "Show Receiver Form"}</Button> <span>Highest Receiver Id: {highestReceiverId}</span></div>
            </Row>
            {showReceiver ? (<section>


                <Form id="receiverForm" >
                    <Row>
                        <Col lg={2} md={12}>
                            <Form.Label id="rFirst">First:</Form.Label>
                        </Col>
                        <Col lg={10} md={12}>
                            <Form.Control id="firstName" name="firstname" lg={6} type="text" placeholder="first name" value={firstName} onChange={(e) => {
                                setFirstName(e.target.value);
                            }} required />
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={2} md={12}>
                            <Form.Label id="rLast">Last:</Form.Label>
                        </Col>
                        <Col lg={10} md={12}>
                            <Form.Control id="lastName" name="lastname" lg={6} type="text" placeholder="last name" defaultValue={currentReceiver.lastname} required />
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={2} md={12}>
                            <Form.Label id="rLevel">Level:</Form.Label>
                        </Col>
                        <Col lg={10} md={12}>
                            <Form.Select aria-label="level" name="level" id="level" required defaultValue="local">
                                <option value="local">local</option>
                                <option value="state">state</option>
                                <option value="national">national</option>
                            </Form.Select>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={2} md={12}>
                            <Form.Label id="rLocality">Locality:</Form.Label>
                        </Col>
                        <Col lg={10} md={12}>
                            <Form.Control id="locality" name="locality" lg={6} type="text" placeholder="state abbreviation or town name" defaultValue={currentReceiver.locality} required />
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={2} md={12}>
                            <Form.Label id="rOffice">Office:</Form.Label>
                        </Col>
                        <Col lg={10} md={12}>
                            <Form.Control id="office" name="office" lg={6} type="text" placeholder="office" defaultValue={currentReceiver.office} required />
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={2} md={12}>
                            <Form.Label id="rStatus">Status:</Form.Label>
                        </Col>
                        <Col lg={10} md={12}>
                            <Form.Control id="status" name="status" lg={6} type="text" placeholder="status: incumbant | challenger" defaultValue={currentReceiver.status} required />
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={2} md={12}>
                            <Form.Label id="rParty">Party:</Form.Label>
                        </Col>
                        <Col lg={10} md={12}>
                            <Form.Select aria-label="party" name="party" id="party" required defaultValue="D">
                                <option value="D">Democrat</option>
                                <option value="R">Republican</option>
                                <option value="I">Independent</option>
                                <option value="G">Green</option>
                                <option value="L">Libertarian</option>
                            </Form.Select>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={2} md={12}>
                            <Form.Label id="rWebsite">Website:</Form.Label>
                        </Col>
                        <Col lg={10} md={12}>
                            <Form.Control id="website" name="website" lg={6} type="url" placeholder="main website" defaultValue={currentReceiver.website} />
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={2} md={12}>
                            <Form.Label id="rSocial">Social Media:</Form.Label>
                        </Col>
                        <Col lg={10} md={12}>
                            <Form.Control id="social" name="social" lg={6} type="text" placeholder="social media handles" defaultValue={currentReceiver.social} />
                        </Col>
                    </Row>
                </Form>
                <Row>
                    <Col lg={{ offset: 10, span: 2 }}>
                        <Button variant="primary" onClick={async (e) => {
                            await submitReceiver();
                        }}>Submit</Button>
                    </Col>

                </Row>
            </section>) : (<></>)}
            <Tabs onSelect={(groupId) => {
                let selectedGroup = {};
                groups.map((itm, ind) => {
                    if (itm && itm.gsid === parseInt(groupId)) {
                        selectedGroup = itm;
                    }
                })
                setTopic();
                setGroup(selectedGroup);
            }}>
                {groups.map((itm, ind) => {
                    return (<Tab eventKey={itm.gsid} title={itm.title} key={ind} >
                        <section>
                            <p>Tags:</p>
                            {receivers && receivers.length ? (<ul className='conduit-tags'>
                                {receivers.map((receiver, ind) => {
                                    return (<li key={ind}><Button onClick={(e) => {
                                        let rec = receiver;
                                        if (topic && topic.topicId) {
                                            createTag(rec, topic);
                                        }
                                    }}>{receiver.receiverId.S}-{receiver.lastname.S}</Button></li>)
                                })}
                            </ul>) : (<></>)}
                        </section>
                        <section className='conduit-section'>
                            <div><input type="text" id={`topicInput${itm.gsid}`} className='create-input' /> <Button variant='success' onClick={async (e) => {
                                // get the highest number in the topic list
                                let myId = 0;
                                // find the highest number
                                if (topics && topics.length) {

                                    topics.map((itm) => {
                                        if (itm.topicId > myId) {
                                            myId = itm.topicId;
                                        }
                                    });
                                }
                                myId = myId + 1;

                                let topicEl = document.getElementById(`topicInput${group.gsid}`);
                                let topicTxt = topicEl.value.trim();
                                if (topicTxt === "") {
                                    return;
                                }
                                // sanitize input 

                                const reg = /[a-zA-Z0-9]/ig;

                                if (reg.test(topicTxt)) {
                                    await createTopic(group.gsid, myId, topicTxt)
                                }




                            }}>Create Topic</Button></div>
                        </section>
                        <section className="conduit-section">
                            <div>
                                <h3>Topics</h3>
                                {showTopics ? (
                                    <ul>
                                        {topics.map((topic, ind) => {
                                            return (<li key={ind}>{topic.topic} | <Button variant='primary' onClick={(e) => {
                                                let myTopic = topic;
                                                setTopic(myTopic);
                                            }}>Select</Button></li>)
                                        })}
                                    </ul>
                                ) : (<></>)}

                            </div>
                            <div>
                                <h4>Topic: {topic ? (topic.topic) : ""}</h4>
                                {topic && topic.topicId ? (<><ButtonGroup>
                                    <ToggleButton className={topic.active === 'true' ? "topic-selected" : "topic-unselected"} id="activeCheckTrue" type='checkbox' variant='success' checked={topic.active === 'true'} value="true" onChange={(e) => {
                                        let aTopic = { ...topic };
                                        aTopic.active = 'true';
                                        setTopic(aTopic);
                                    }}>
                                        Active
                                    </ToggleButton>
                                    <ToggleButton className={topic.active === 'false' ? "topic-selected" : "topic-unselected"
                                    } id="activeCheckFalse" type='checkbox' variant='danger' checked={!topic.active === 'false'} value="false" onChange={(e) => {
                                        let aTopic = { ...topic };
                                        aTopic.active = 'false';
                                        setTopic(aTopic);
                                    }}>
                                        Inactive
                                    </ToggleButton>
                                </ButtonGroup>
                                    <div>  Active: {topic.active === 'true' ? "true" : "false"} | Topic ID: {topic.topicId} | <Button variant='warning' onClick={async () => {
                                        let myTopic = topic;
                                        await updateTopic(group.gsid, myTopic.topicId, myTopic.active, myTopic.tags)
                                    }}>Update</Button>
                                    </div></>) : (<></>)}
                            </div>
                            <div>Tags: {topic && topic.tags ? (topic.tags.split('|').map((itm) => {
                                return (<Button className="tag-btn" onClick={(e) => {
                                    removeTag(itm)
                                }}>{itm}</Button>)
                            })) : (<></>)} </div>

                        </section>
                        <section className='conduit-section'>
                            {group && topic && topics.length ? (
                                <div>
                                    <h4>Comments</h4>

                                    {comments && comments.length ? (
                                        <ul>
                                            {comments.map((comment, ind) => {
                                                return (<li className="conduit-comment" key={ind}><div>Comment:</div> <div>{comment.comment}</div><div className='actions'><Button variant='success' onClick={async (e) => {
                                                    let topicId = topic.topicId;
                                                    let groupId = group.gsid;
                                                    let voterName = comment.voterName;
                                                    let active = "true";
                                                    let comment_status = "approved";

                                                    await updateComment(groupId, topicId, voterName, active, comment_status);
                                                }}>Approve</Button><Button variant='danger' onClick={async (e) => {
                                                    let topicId = topic.topicId;
                                                    let groupId = group.gsid;
                                                    let voterName = comment.voterName;
                                                    let active = "false";
                                                    let comment_status = "rejected";

                                                    await updateComment(groupId, topicId, voterName, active, comment_status);
                                                }}>Reject</Button></div></li>)
                                            })}
                                        </ul>
                                    ) : (<div>No Comments Yet</div>)}
                                </div>

                            ) : (<></>)}
                        </section>

                    </Tab>)
                }
                )
                }


            </Tabs>



        </Container>

    )


}





export default Conduit; 