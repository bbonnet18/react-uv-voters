import './App.css';
import axios from 'axios';
import config from './config';
import { Badge, Button, ButtonGroup, Col, Container, Row, Table, Stack, Tabs, Tab, Toast, ToastContainer, Form, Spinner, ToggleButton } from "react-bootstrap";
import { useState, useEffect } from 'react';
import unescape from 'validator/lib/unescape';


function Conduit() {
    const [groups, setGroups] = useState([]);
    const [group, setGroup] = useState();
    const [topics, setTopics] = useState([]);
    const [topic, setTopic] = useState();
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sourcererLoading, setSourcererLoading] = useState(false);
    const [showTopics, setShowTopics] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [showReceiver, setShowReceiver] = useState(false);
    const [sourcererBtn, setSourcererBtn] = useState(true);
    const [receivers, setReceivers] = useState([]);
    const [completed, setCompleted] = useState(false);
    const [completedMessage, setCompletedMessage] = useState("");
    const [completedStatus, setCompletedStatus] = useState("success");
    const [sourcererPrompt, setSourcererPrompt] = useState("");
    const [sourcererText, setSourcererTxt] = useState("");

    const starterReceiver = {
        "firstname": "",
        "lastname": "",
        "office": "",
        "category": "",
        "website": "",
        "social": "",
        "locality": "",
    }


    const [currentReceiver, setCurrentReceiver] = useState(starterReceiver);
    const [firstName, setFirstName] = useState("");
    const [votes, setVotes] = useState([])


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
                await getVotes(group.gsid);
            }
        }

        // also need to retrieve the votes 
        // limeapi/list - post with groupId to get all active surveys from that group 
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
        let res = await axios.post(`${config.apiBaseUrl}/conduit/admin-receivers`, {}, {
            withCredentials: true
        });

        if (res && res.status === 200) {
            let highestId = 0
            res.data.Items.map((itm, ind) => {
                if (parseInt(itm.receiverId.S) > highestId) {
                    highestId = itm.receiverId.S;
                }
            });
            //setHighestReceiverId(highestId);
            setReceivers(res.data.Items)
        } else {
            setReceivers([]);
        }
    }

    // get list of votes within a group
    // get receivers we can use for tagging 
    const getVotes = async (groupId) => {
        let votes = await axios.post(`${config.apiBaseUrl}/limeapi/list`, { groupId: groupId }, {
            withCredentials: true
        });

        if (votes && votes.status === 200) {
            let voteList = votes.data;
            setVotes(voteList);
        } else {
            setVotes([]);
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
    const createTopic = async (groupId, topicId, topic, description) => {
        let payload = {
            groupId: groupId,
            topicId: topicId,
            topic: topic,
            description: description
        }
        let res = await axios.post(`${config.apiBaseUrl}/conduit/create-topic`, payload, {
            withCredentials: true
        });
        let message = "Successfully created topic!";
        let status = "success";
        if (res && res.status === 200) {
            await getTopics(group.gsid, false);

        } else {
            message = "Error creating topic!";
            status = "danger";
        }

        setCompletedStatus(status);
        setCompletedMessage(message);
        setCompleted(true);
    }

    // can deactivate a group with this 
    const updateTopic = async (groupId, topicId, active, tags, description) => {
        let payload = {
            groupId: groupId,
            topicId: topicId,
            active: active,
            description: description,
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

    const deleteTopic = async (groupId, topicId) => {
        let payload = {
            groupId: groupId,
            topicId: topicId
        }
        let res = await axios.post(`${config.apiBaseUrl}/conduit/delete-topic`, payload, {
            withCredentials: true
        });
        let message = "Successfully deleted topic!";
        let status = "success";
        let completed = true;
        if (res && res.status === 200) {
            setTopic();
            setComments([]);
            let m = group;
            await getTopics(m.gsid);
        } else {
            message = "Error deleting topic!";
            status = "danger";
            setComments([]);
        }
        setShowComments(true);
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
        let res = await axios.post(`${config.apiBaseUrl}/conduit/admin-comments`, payload, {
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


    const publish = async (groupId, topicId) => {
        let payload = {
            groupId: groupId,
            topicId: topicId
        }
        let res = await axios.post(`${config.apiBaseUrl}/conduit/admin-publish`, payload, {
            withCredentials: true
        });

        if (res && res.status === 200) {
            setCompletedStatus("success");
            setCompletedMessage("Successfully published topic");
            setCompleted(true);
        } else {
            setCompletedStatus("danger");
            setCompletedMessage("Error publishing topic");
            setCompleted(true);
        }
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




    // hit the sourcerer API 
    const sourcery = async (val) => {
        try {
            let payload = {
                prompt: val
            }
            // get the cookie and set the auth header
            setSourcererLoading(true);
            let res = await axios.post(`${config.apiBaseUrl}/sourcerer`, payload, {
                withCredentials: true
            });

            if (res && res.status === 200) {
                let resData = res.data;
                setSourcererTxt(resData.answer);
            } else {
                setSourcererTxt('Nothing to report');
            }

            setSourcererLoading(false);
        } catch (err) {

            setSourcererLoading(false);
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
                        <section >
                            <h3>Sourcerer AI <span className='sourcerer-toggle'><Button variant='info' onClick={() => setSourcererBtn(!sourcererBtn)}><img src={sourcererBtn ? "chevron-bar-down.svg" : "chevron-bar-up.svg"} /></Button></span></h3>
                            <div className={sourcererBtn ? 'sourcerer-container' : 'sourcerer-container hide'}>
                                {sourcererLoading ? (<Spinner></Spinner>) : (<div className='sourcerer-image'><img src="./sourcerer.jpg" /></div>)}
                                <div className='sourcerer-output'>
                                    <div className='sourcerer-main-output'>
                                        {sourcererText}
                                    </div>
                                </div>
                                <div><textarea type="text" id="sourcererInput" className='sourcerer-input' placeholder={`prompt to generate issues for the selected location: ${group && group.name ? group.name : ''}`} value={sourcererPrompt} onChange={(e) => {
                                    let val = e.currentTarget.value;
                                    setSourcererPrompt(val);
                                }}></textarea>
                                    <Button className='sourcerer-input-btn' variant='success' onClick={async () => {
                                        let prompt = sourcererPrompt;
                                        await sourcery(prompt);

                                    }}>Summon</Button>
                                </div>
                            </div>



                        </section>
                        <section className='conduit-section'>
                            <div><label htmlFor={`topicInput${itm.gsid}`}>Topic:</label><input type="text" id={`topicInput${itm.gsid}`} placeholder='Topic title' className='create-input' />
                                <div><label htmlFor={`descriptionInput${itm.gsid}`}>Description:</label><textarea type="text" id={`descriptionInput${itm.gsid}`} className='create-input' placeholder='Description'></textarea></div>
                                <Button variant='success' onClick={async (e) => {
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
                                    let descriptionEl = document.getElementById(`descriptionInput${group.gsid}`);
                                    let topicTxt = topicEl.value.trim();
                                    let descriptionTxt = descriptionEl.value.trim();
                                    if (topicTxt === "" || topicTxt.length === 0 || descriptionTxt === "" || descriptionTxt.length === 0) {
                                        return;
                                    }
                                    // sanitize input 

                                    const reg = /[a-zA-Z0-9]/ig;

                                    if (reg.test(topicTxt)) {
                                        await createTopic(group.gsid, myId, topicTxt, descriptionTxt);
                                        topicEl.value = "";
                                        descriptionEl.value = "";
                                    }

                                }} >Create Topic</Button></div>
                        </section>
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
                        <section className="conduit-section">
                            <h3>Topics</h3>
                            <Table>
                                <thead>
                                    <th>Topic</th>
                                    <th>action</th>
                                </thead>
                                <tbody>
                                    {showTopics ? (
                                        topics.map((topic, ind) => {
                                            return (<tr><td key={ind}>{topic.topic}</td><td><Button variant='primary' onClick={(e) => {
                                                let myTopic = topic;
                                                setTopic(myTopic);
                                            }}>Select</Button></td></tr>)
                                        })
                                    ) : (<tr><td>no topics</td><td>no actions</td></tr>)}
                                </tbody>

                            </Table>
                            <hr></hr>
                            <div>
                                <h4>Topic: {topic ? (topic.topic) : ""}</h4>
                                {topic && topic.topicId ? (<>
                                <div><label htmlFor={`descriptionInput${topic.topicId}`}>Description:</label><textarea type="text" id={`descriptionInput${topic.topicId}`} className='create-input' value={topic && topic.description || "" } onChange={(e)=>{
                                    let desc = e.currentTarget.value;
                                    let newTopic = {...topic};
                                    newTopic.description = desc;
                                    setTopic(newTopic);
                                }}></textarea></div>
                                <ButtonGroup>
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
                                        await updateTopic(group.gsid, myTopic.topicId, myTopic.active, myTopic.tags, myTopic.description);
                                    }}>Update</Button> | <Button onClick={async () => {
                                        await publish(group.gsid, topic.topicId);
                                    }} variant='success'>Publish</Button>
                                        | <Button onClick={async () => {
                                            await deleteTopic(group.gsid, topic.topicId);
                                        }} variant='danger'>Delete</Button>
                                    </div></>) : (<></>)}
                            </div>
                            <div>Tags: {topic && topic.tags ? (topic.tags.split('|').map((itm) => {
                                return (<Button className="tag-btn" onClick={(e) => {
                                    removeTag(itm)
                                }}>{itm}</Button>)
                            })) : (<></>)} </div>

                        </section>
                        <section className='conduit-section'>
                            <Row>
                                <Col lg={12}>
                                    <h4>Comments</h4>
                                    {group && topic && topics.length ? (
                                        <div>
                                            <Table>
                                                <thead>
                                                    <th>
                                                        Comment
                                                    </th>
                                                    <th>
                                                        Options
                                                    </th>
                                                </thead>
                                                <tbody>
                                                    {comments && comments.length ? (
                                                        comments.map((comment, ind) => {
                                                            return (<tr className="conduit-comment" key={ind}><td>Comment:{comment.comment}</td><td><Button variant='success' onClick={async (e) => {
                                                                let topicId = topic.topicId;
                                                                let groupId = group.gsid;
                                                                let voterName = comment.voterName;
                                                                let active = "true";
                                                                let comment_status = "approved";

                                                                await updateComment(groupId, topicId, voterName, active, comment_status);
                                                            }}>Approve</Button></td><td><Button variant='danger' onClick={async (e) => {
                                                                let topicId = topic.topicId;
                                                                let groupId = group.gsid;
                                                                let voterName = comment.voterName;
                                                                let active = "false";
                                                                let comment_status = "rejected";

                                                                await updateComment(groupId, topicId, voterName, active, comment_status);
                                                            }}>Reject</Button></td></tr>)
                                                        })
                                                    ) : (<tr><td>No Comments Yet</td><td>no actions</td></tr>)}
                                                </tbody>
                                            </Table>

                                        </div>

                                    ) : (<></>)}

                                </Col>
                            </Row>

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