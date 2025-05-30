import './App.css';
import axios from 'axios';
import config from './config';
import { Alert, Col, Row, Form, Button, Container, Modal, Spinner, Toast, ToastContainer } from "react-bootstrap";
import { useState, useRef, useEffect, useContext } from 'react';


function Conduit(){
    const [groups,setGroups] = useState([]);
    const [group,setGroup] = useState();
    const [topics,setTopics] = useState([]);
    const [topic,setTopic] = useState();
    const [comments,setComments] = useState([]);
    const [loading,setLoading] = useState(false); 
    const [showGroups, setShowGroups] = useState(true)
    const [showTopics, setShowTopics] = useState(false);
    const [showComments,setShowComments] = useState(false);

useEffect(()=>{
    const retrieveTopics = async () => { 
        if(group){
            await getTopics(group.gsid);
        }
        console.log(group);
    }
    retrieveTopics();
},[group])


// will get the list of groups
// this is a limeapi call 
const getGroups = async()=>{
    setLoading(true);
    setTopic();
    setGroup();
    setTopics([]);
    setComments([]);
    setShowTopics(false);

    try{
        
        let res = await axios.get(`${config.apiBaseUrl}/limeapi/groups`,{
            withCredentials:true
        });

        if(res && res.status === 200){
            setGroups(res.data);
        }else{
            setGroups([]);
        }
        setShowGroups(true)
    }catch(err){

    }

    setLoading(false);

 
}

//gets the topics in a group
const getTopics = async(groupId) => {
    let payload = {groupId:groupId}
    let res = await axios.post(`${config.apiBaseUrl}/conduit/`,payload,{
        withCredentials:true
    });

    if(res && res.status === 200){
        setTopics(res.data.Items);
    }else{
        setTopics([]);
    }
    setShowTopics(true);
}

//create a topic
const createTopic = async(groupId,topicId,topic) => {
    let payload = {
        groupId:groupId,
        topicId:topicId,
        topic
    }
    let res = await axios.post(`${config.apiBaseUrl}/conduit/create-topic`,payload,{
        withCredentials:true
    });

    if(res && res.status === 200){
        await getTopics(group.gsid);
    }
}

// can deactivate a group with this 
const updateTopic = async(groupId,topicId,active)=>{
    let payload = {
        groupId:groupId,
        topicId:topicId,
        active:active
    }
    let res = await axios.post(`${config.apiBaseUrl}/conduit/update-topic`,payload,{
        withCredentials:true
    });

    if(res && res.status === 200){
       await getTopics(group.gsid);
    }
}


const getComments = async(groupId,topicId,active) => {
    let payload = {
        groupId:groupId,
        topicId:topicId,
        active:active
    }
    let res = await axios.post(`${config.apiBaseUrl}/conduit/get-comments`,payload,{
        withCredentials:true
    });

    if(res && res.status === 200){
        setComments(res.data.Items);
    }else{
        setComments([]);
    }
    setShowComments(true);
}
// get topics within a group 
const updateComment = async(groupId,topicId,voterName,active) => {

}
// need to create breadcrumbs to get back
return (
    <Container>
        <h3>Conduit</h3>
        <Button variant='primary' onClick={async (e)=>{await getGroups()}}>Reset</Button>
        <p>Select a group and a topic to view comments and approve or reject.</p>
        <section className="conduit-section">
        <div className='conduit-selection'><a onClick={(e) => setShowGroups(!showGroups)}>Show Groups</a></div>
        {showGroups ? (
            <ul>
            {groups.map((itm, ind)=>{
                return (<li key={ind} className='conduit-group'>{itm.title} | <Button variant='primary' onClick={(e)=>{
                    let group  = itm
                    setTopic();
                    setGroup(group);
                    setShowGroups(false);
                }}>Select</Button></li>)
            })}
            </ul>
        ):(<></>)}
        <div>Group: {group ? (group.name) : <></>} | Topic: {topic ? (topic.topic):""}</div>
        </section>
        <section className="conduit-section">
   
            <div>
                <h3>Topics</h3>
            <div><a onClick={(e) => setShowTopics(!showTopics)}>Show Topics</a></div>
            <div><input type="text" id="topicInput" className='create-input'/> <Button variant='success' onClick={async (e)=> {
                // get the highest number in the topic list
                let myId = 0;
                // find the highest number
                if(topics && topics.length){
                    
                    topics.map((itm)=>{
                    if(itm.topicId > myId){
                        myId = itm.topicId;
                    }
                    });
                }
                myId = myId + 1;

                let topicEl = document.getElementById('topicInput');
                let topicTxt = topicEl.value.trim();
                if(topicTxt === ""){
                    return; 
                }
                // sanitize input 
                
                const reg = /[a-zA-Z0-9]/ig; 

                if(reg.test(topicTxt)){
                    await createTopic(group.gsid, myId, topicTxt)
                }

                


            }}>Create Topic</Button></div>
            {showTopics ? (
                <ul>
                {topics.map((topic,ind)=>{
                    return (<li key={ind}>{topic.topic} | <Button variant='primary' onClick={(e)=>{
                        let myTopic  = topic;
                        setTopic(myTopic);
                        setShowTopics(false);
                    }}>Select</Button> | {topic.active === true || topic.active === "true" ? ("true") : ("false")} | {topic.topicId} | <Button variant='warning' onClick={async (itm)=>{
                        let myTopic = topic;
                        await updateTopic(group.gsid,myTopic.topicId,false)
                    }}>Deactivate</Button></li>)
                })}
            </ul>
            ):(<></>)}
            
            </div>
        
        </section>
        <section className='conduit-section'>
        {group && topic && topics.length ? (
            <div>
                <Button variant='primary' onClick={async (e)=>{
                        let gId = group.gsid;
                        let tId = topic.topicId;
                        let active = true;
                        await getComments(gId,tId,active);
                    }}>Get Comments</Button>
                <h4>Comments</h4>
                
                {comments && comments.length ? (
                    <ul>
                        {comments.map((comment,ind)=>{
                            return (<li key={ind}>Comment: {comment.comment}</li>)
                        })}
                    </ul>
                ):(<div>No Comments Yet</div>)}
            </div>

        ):(<></>)}
        </section>
    </Container>
    
)


}





export default Conduit; 