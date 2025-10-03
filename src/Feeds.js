import axios from 'axios';
import config from './config';
import { Badge, Button, Col, Container, Row, Stack, Table,Toast, ToastContainer } from "react-bootstrap";
import { useState, useEffect } from 'react';
import unescape from 'validator/lib/unescape';

function Feeds() {

    const [loading, setLoading] = useState(false);
    const [groups, setGroups] = useState([]);
    const [group, setGroup] = useState();
    const [topics, setTopics] = useState([]);
    const [topic, setTopic] = useState();
    const [votes, setVotes] = useState([]);
    const [vote, setVote] = useState();
    const [feeds, setFeeds] = useState([]);
    const [completed, setCompleted] = useState(false);
    const [completedMessage, setCompletedMessage] = useState("");
    const [completedStatus, setCompletedStatus] = useState("success");


    useEffect(() => {
        const fetchGroups = async () => {
            await getGroups();
        }
        fetchGroups();
    }, []);

    useEffect(() => {
        setTopic();
        setVote();
        setVotes([]);
        setFeeds([]);
        const fetchData = async () => {
            if (!group || !group.gsid) return;
            await getTopics(group.gsid);
            await getVotes(group.gsid);
            await getFeeds(group.gsid);
        }
        fetchData();
    }, [group]);

    useEffect(() => {
        setVote();
    }, [topic]);

    // will get the list of groups
    // this is a limeapi call 
    const getGroups = async () => {
        setLoading(true);
        setTopic();
        setGroup();
        setTopics([]);

        try {

            let res = await axios.get(`${config.apiBaseUrl}/limeapi/groups`, {
                withCredentials: true
            });

            if (res && res.status === 200) {
                setGroups(res.data);
                setGroup(res.data[0]);
            } else {
                setGroups([]);
            }
        } catch (err) {
            console.error(err);
        }

        setLoading(false);
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

    // get feeds
    const getFeeds = async (groupId) => {
        let feeds = await axios.post(`${config.apiBaseUrl}/feeds`, { groupId: groupId }, {
            withCredentials: true
        });

        if (feeds && feeds.status === 200) {
            let feedList = feeds.data.feeds;
            let newFeeds = feedList.map((feed) => {
                return {
                    ...feed,
                    title: unescape(feed.title)
                };
            });
            setFeeds(newFeeds);
        } else {
            setFeeds([]);
        }
    }

    const createFeed = async (topic) => {
        let payload = {
            groupId: group.gsid.toString(),
            topicId: topic.topicId.toString(),
            title: topic.topic,
            discussionKey: topic.discussionKey || "",
            surveyId: vote && vote.sid ? vote.sid.toString() : "",
            tags: topic.tags || ""
        };
        try{
            let res = await axios.post(`${config.apiBaseUrl}/feeds/create-feed`, payload, {
            withCredentials: true
            });
        
            let message = "successfully created feed!";
            let status = "success";
            if (res && res.status === 200) {
                await getFeeds(group.gsid);
            }else{
                message = "Error creating feed!";
                status = "danger";
            }
            setCompletedStatus(status);
            setCompletedMessage(message);
            setCompleted(true);
        }catch(err){
            setCompletedStatus("danger");
            setCompletedMessage("Error creating feed, may be a duplicate");
            setCompleted(true);
        }
        
    }

    const updateFeed = async (feed) => {
        let payload = {...feed};
        let res = await axios.post(`${config.apiBaseUrl}/feeds/update-feed`, payload, {
            withCredentials: true
        });
        let message = "successfully updated feed!";
        let status = "success";
        if (res && res.status === 200) {
            await getFeeds(group.gsid);
        }else{
            message = "Error updating feed!";
            status = "danger";
        }
        setCompletedStatus(status);
        setCompletedMessage(message);
        setCompleted(true);
    }

    const deleteFeed = async (feed) => {
        if(!group || !feed){
            return; 
        }
        let payload = { groupId: group.gsid.toString(), topicId: feed.topicId.toString() };
        let res = await axios.post(`${config.apiBaseUrl}/feeds/delete-feed`, payload, {
            withCredentials: true
        });
        let message = "successfully deleted feed!";
        let status = "success";
        if (res && res.status === 200) {
            await getFeeds(group.gsid);
        }else{
            message = "Error deleting feed!";
            status = "danger";
        }
        setCompletedStatus(status);
        setCompletedMessage(message);
        setCompleted(true);
    }

    const publishFeed = async (feed) => {
        if(!group || !feed){
            return; 
        }
        let payload = { groupId: group.gsid.toString(), topicId: feed.topicId.toString() };
        let res = await axios.post(`${config.apiBaseUrl}/feeds/publish-feed`, payload, {
            withCredentials: true
        });
        
        let message = "successfully created feed!";
        let status = "success";
        if (res && res.status === 200) {
            await getFeeds(group.gsid);
        }else{
            message = "Error publishing feed!";
            status = "danger";
        }
        setCompletedStatus(status);
        setCompletedMessage(message);
        setCompleted(true);
    }

    const buildTags = (tags) => {
        if(!tags){
            return (tags);
        }


        let newTags = tags.split('|');// get the array
        let newTagEl = "";
        if(newTags && newTags.length){
            let tagItms = newTags.map((tag)=>{
                return (<Badge pill bg="primary">{tag}</Badge>)
            });
            newTagEl = (tagItms);
        }
        let tagStack = (<Stack direction='horizontal' gap={2}>{newTagEl}</Stack>)
        return (tagStack);
    }

    return (
        <div style={{ display: 'flex', gap: '2rem', padding: '2rem' }}>
            <Container>
                <h3>Feeds</h3>
                <p>Select a topic and optionally select a vote to create a feed</p>
                  <Row>
                   {groups ? (<ul>{groups.map((group) => (<Button onClick={() => setGroup(group)} key={group.gsid}>{group.name}</Button> ))}</ul>) : (<></>)}
                Current Group: {group ? group.name : 'None'}
                </Row>
                <Row>
                    <Col xs={6}>
                        <h2>Topics</h2>
                        <div><strong>Selected Topic:</strong> {topic ? topic.topic : 'None'}</div>
                        <div><strong>Active: </strong> {topic && topic.active === "true"  ? "true" : "false"}</div>
                        {topic ? (<Button variant="success" onClick={() => createFeed(topic)}>Create Feed</Button>) : (<></>)}
                    </Col>
                    <Col xs={6}>
                        <h2>Votes</h2>
                        <div><strong>Selected Vote:</strong> {vote ? vote.surveyls_title : 'None'}</div>
                        <div><strong>Active: </strong> {vote && vote.active === "Y"  ? "true" : "false"}</div>
                    </Col>
                    <Col xs={6}>
                        <Table>
                            <thead>
                                <th>Topic</th>
                                <th>Select</th>
                            </thead>
                            <tbody>
                            {topics && topics.length > 0 ? (topics.map((topic) => ( <tr><td key={topic.topicId}>{topic.topic} - ID: {topic.topicId}</td> <td><Button onClick={() => setTopic(topic)}>Select</Button></td>
                            </tr>))) : (<tr><td>no topic</td><td> - </td></tr>)}
                         
                            
                            </tbody>
                        </Table>
                       
                    </Col>
                    <Col xs={6}>
                        <Table>
                            <thead>
                                <th>Vote</th>
                                <th>Select</th>
                            </thead>
                            <tbody>
                                {votes && votes.length > 0 ? (votes.map((vote) => (<tr key={vote.sid}><td>  - ID: {vote.sid} - {vote.surveyls_title}</td><td>{topic ? (<Button variant="success" onClick={() => setVote(vote)}>Link</Button>):(<span>no topic</span>)}</td></tr>))) : (<tr><td> not vote</td><td> - </td></tr>)}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
                <Row>
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
                </Row>
                <Row>
                   {<Col xs={6}>
                       <h2>Feeds</h2>
                        <Table>
                            <thead>
                                <th>Feed</th>
                                <th>Select</th>
                            </thead>
                            <tbody>
                            {feeds && feeds.length > 0 ? (feeds.map((feed) => (<tr key={feed.feedId}><td>Title: {feed.title} <br />Tags: {buildTags(feed.tags)}</td><td><Button className='mb-1'  variant={feed.active === "true" ? "danger" : "success"} onClick={async () => {
                               try{
                                   let newFeed = {...feed};
                                   newFeed.active = newFeed.active === "true" ? "false" : "true";
                                   await updateFeed(newFeed);// toggle the feed active status
                               }catch(err){
                                   console.error("Error updating feed:", err);
                                   alert("Error updating feed");
                               }
                           }}>{feed.active === "true" ? "Deactivate" : "Activate"}</Button><Button className='mb-1' variant="danger" onClick={async () => {
                               await deleteFeed(feed);
                           }}>Delete</Button>{feed.active === "true" ? (<Button variant="warning" onClick={async ()=>{
                                let newFeed = {...feed};
                                await publishFeed(newFeed); 
                           }}>Publish</Button>) : ("")}</td></tr>))) : (<tr><td>No feeds</td><td> - </td></tr>)}
                            </tbody>
                       </Table>
                   </Col>}
                </Row>
            </Container>
                
    
        </div>
    );
}

export default Feeds;