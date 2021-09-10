import React from 'react'
import { useHistory } from "react-router-dom";
import { Redirect, Route } from "react-router-dom";

export default function RequireAuth({ component: Component, ...rest }) {
    const history = useHistory();
    if (!localStorage.getItem("authToken")){
        history.push('/login');        
    }
    
    return(
        <Route
      {...rest}
      render={(props) =>
          <Component {...props} />
      }
    />
    );
}
