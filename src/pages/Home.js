import FileManager from '../components/FileManager';
import Register from '../components/Register';

import React from 'react'

const Home = ({ history }) => {    
    return (
        <div>
            <FileManager />
            <Register />
        </div>
    )
}

export default Home;