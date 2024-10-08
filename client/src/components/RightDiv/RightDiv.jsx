import React, { useState } from "react";
import './RightDiv.css'
import { UilHome, UilBell, UilCommentAlt,  UilSetting } from '@iconscout/react-unicons';
import TrendCard from "../TrendCard/TrendCard";
import SharePop from "../SharePop/SharePop"
import { Link } from "react-router-dom";

const RightDiv = () =>{
    const [seen, setSeen] = useState(false);

    const toggleshare = () => {
      setSeen(!seen);
    };
  
    return(
        <div className="RightDiv">
            <div className="navIcon">

            <Link to= '../home'><UilHome color="orange" title="Home" /></Link>
            
            <UilBell title="Notifications" />
            <UilCommentAlt  title="Comment" />
            <UilSetting  title="Settings" />
            </div>

            <TrendCard/>

            <button onClick={toggleshare} className="button fs-shareButton">
                Share
            </button>
            <div className="popUp">
    {seen && <SharePop toggle={toggleshare} />}
    </div>
        </div>
    )
}

export default RightDiv;