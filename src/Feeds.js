import axios from 'axios';
import config from './config';
import { Button, ButtonGroup, Col, Container, Row, Tabs, Tab, Toast, ToastContainer, Form, ToggleButton } from "react-bootstrap";
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
            setFeeds(feedList);
        } else {
            setFeeds([]);
        }
    }

    const createFeed = async (topic) => {
        let payload = {
            groupId: group.gsid,
            topicId: topic.topicId
        };
        let res = await axios.post(`${config.apiBaseUrl}/feeds`, payload, {
            withCredentials: true
        });

        if (res && res.status === 200) {
            setFeeds([...feeds, res.data]);
        }
    }

    return (
        <div style={{ display: 'flex', gap: '2rem', padding: '2rem' }}>


            {/* Feeds Section */}
          

            {/* Topics and Votes Section */}
            <Container>
                  <Row>
                   {groups ? (<ul>{groups.map((group) => (<Button onClick={() => setGroup(group)} key={group.gsid}>{group.name}</Button> ))}</ul>) : (<></>)}
                Current Group: {group ? group.name : 'None'}
                <h2>Feeds</h2>
                <ul>
                    {feeds && feeds.length > 0 ? (feeds.map((feed) => (<li key={feed.feedId}>{feed.title} - Active: {feed.active} - Tags: {feed.tags}</li>))) : (<li>No feeds</li>)}

                </ul>
                
            </Row>
                <Row>
                    <Col xs={6}>
                        <h2>Topics</h2>
                        <div>Selected Topic: {topic ? topic.topic : 'None'}</div>
                        {topic ? (<Button variant="success" onClick={() => createFeed(topic)}>Create Feed</Button>) : (<></>)}
                        <ul>
                            {topics && topics.length > 0 ? (topics.map((topic) => (<li key={topic.topicId}>{topic.topic} - ID: {topic.topicId} <Button onClick={() => setTopic(topic)}>Select</Button></li>))) : (<li>No topics</li>)}
                        </ul>
                    </Col>
                    <Col xs={6}>
                        <h2>Votes</h2>
                        <ul>
                            {votes && votes.length > 0 ? (votes.map((vote) => (<li key={vote.sid}> - ID: {vote.sid} - {vote.surveyls_title} {topic ? (<Button variant="success" onClick={() => setVote(vote)}>Link</Button>) : (<></>)}</li>))) : (<li>No votes</li>)}
                        </ul>
                    </Col>
                </Row>
            </Container>
                
    
        </div>
    );
}

export default Feeds;