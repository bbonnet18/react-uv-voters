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
    const [showTopics, setShowTopics] = useState(false);

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

    try{
        
        let res = await axios.get(`${config.apiBaseUrl}/limeapi/groups`,{
            withCredentials:true
        });

        if(res && res.status === 200){
            setGroups(res.data);
        }else{
            setGroups([]);
        }
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
}

//create a topic
const creatTopic = async(groupId,topicId,topic) => {

}

// can deactivate a group with this 
const updateTopic = async(groupId,topicId,active)=>{

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
        <div>Group: {group ? (group.name) : <></>} | Topic: {topic ? (topic.topic):""}</div>
        <ul>
        {groups.map((itm)=>{
            return (<li className='conduit-group'>{itm.title} | <Button variant='primary' onClick={(e)=>{
                let group  = itm
                setTopic();
                setGroup(group)
            }}>Select</Button></li>)
        })}
        </ul>

        {topics && topics.length ? (
            <div>
                <h3>Topics</h3>
            <div><a onClick={(e) => setShowTopics(!showTopics)}>Show Topics</a></div>
            <div><input type="text" className='create-input'/> <Button variant='success' onClick={async (e)=> {
                // let payload = {
                //     groupId:group.gsid,
                //     topicId:3,

                // }


            }}>Create Topic</Button></div>
            {showTopics ? (
                <ul>
                {topics.map((topic)=>{
                    return (<li>{topic.topic} | <Button variant='primary' onClick={(e)=>{
                        let myTopic  = topic;
                        setTopic(myTopic);
                    }}>Select</Button></li>)
                })}
            </ul>
            ):(<></>)}
            
            </div>
        ):(<></>)}
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
                        {comments.map((comment)=>{
                            return (<li>Comment: {comment.comment}</li>)
                        })}
                    </ul>
                ):(<div>No Comments Yet</div>)}
            </div>

        ):(<></>)}
    </Container>
    
)


}





export default Conduit; 