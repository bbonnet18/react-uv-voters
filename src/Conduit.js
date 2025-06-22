import './App.css';
import axios from 'axios';
import config from './config';
import { Alert, Col, Row, Form, Button, ButtonGroup, Container, Modal, Spinner, Tabs, Tab, Toast, ToastContainer, ToggleButton } from "react-bootstrap";
import { useState, useRef, useEffect, useContext } from 'react';
import unescape from 'validator/lib/unescape';


function Conduit() {
    const [groups, setGroups] = useState([]);
    const [group, setGroup] = useState();
    const [topics, setTopics] = useState([]);
    const [topic, setTopic] = useState();
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showTopics, setShowTopics] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [receivers, setReceivers] = useState([]);
    const [completed, setCompleted] = useState(false);
    const [completedMessage, setCompletedMessage] = useState("");
    const [completedStatus, setCompletedStatus] = useState("success");


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
            setReceivers(res.data.Items)
        } else {
            setReceivers([]);
        }


    }

    const createTag = (receiver, topic) => {
        if (receiver && topic) {
            let currTags = topic.tags || "";
            let tagArr = currTags.length ? currTags.split("|") : [];
            let tag = receiver.lastname.S;
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
        let res = await axios.post(`${config.apiBaseUrl}/conduit/`, payload, {
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
            await getTopics(group.gsid);
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
    // need to create breadcrumbs to get back
    return (
        <Container>
            <h3>Conduit</h3>
            <p>Select a group and a topic to view comments and approve or reject.</p>
            <section className="conduit-section">
                <Tabs onSelect={(groupId) => {
                    let selectedGroup = {};
                    groups.map((itm,ind)=>{
                        if(itm && itm.gsid === parseInt(groupId)){
                            selectedGroup = itm;
                        }
                    })
                    setTopic();
                    setGroup(selectedGroup);
                }}>
                    {groups.map((itm, ind) => {
                        return (<Tab eventKey={itm.gsid} title={itm.title} key={ind} >
                            {itm.title}
                        </Tab>)
                    }
                    )
                    }


                </Tabs>




                <div><h3>Group: {group ? (group.name) : <></>}</h3>
                    <div><h4>Topic: {topic ? (topic.topic) : ""}</h4></div>
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
            <section className="conduit-section">

                <div>
                    <h3>Topics</h3>
                    <div><a onClick={(e) => setShowTopics(!showTopics)}>Show Topics</a></div>
                    <div><input type="text" id="topicInput" className='create-input' /> <Button variant='success' onClick={async (e) => {
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

                        let topicEl = document.getElementById('topicInput');
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

            </section>
            <section className='conduit-section'>
                {group && topic && topics.length ? (
                    <div>
                        <Button variant='primary' onClick={async (e) => {
                            let gId = group.gsid;
                            let tId = topic.topicId;
                            let active = false;
                            await getComments(gId, tId, active);
                        }}>Get Comments</Button>
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
            {receivers && receivers.length ? (<ul>
                {receivers.map((receiver, ind) => {
                    return (<li key={ind}><Button onClick={(e) => {
                        let rec = receiver;
                        if (topic && topic.topicId) {
                            createTag(rec, topic);
                        }
                    }}>{receiver.lastname.S}</Button></li>)
                })}
            </ul>) : (<></>)}
            <section>

            </section>
        </Container>

    )


}





export default Conduit; 