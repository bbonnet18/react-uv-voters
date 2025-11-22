import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppWrapper from './AppWrapper';
import { createBrowserRouter, RouterProvider, Route, createRoutesFromElements } from "react-router-dom";
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginComp from "./LoginComp";
import Manage from "./Manage";
import NewVoterForm from "./NewVoterForm";
import Conduit from './Conduit';
import Feeds from './Feeds';
import Recevers from './Receivers';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<AppWrapper />}>
      <Route path={'/'} element={<LoginComp  />} />
      <Route path={'/home'} element={<Manage />} />
      <Route path={'/visual'} element={<NewVoterForm />} />
      <Route path={'/conduit'} element={<Conduit />} />
      <Route path={'/feeds'} element={<Feeds />} />
      <Route path={'/receivers'} element={<Recevers />} />
    </Route>
  )
)


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
