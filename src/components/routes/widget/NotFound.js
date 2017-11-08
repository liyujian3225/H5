/**
 * Created by Brian on 3/04/2017.
 */
import React from 'react';
import { browserHistory } from 'react-router';

class NotFound extends React.Component {
    constructor(props) {
        super(props);
        browserHistory.push('/');
    }

    render() {
        return null;
    }
}

export default NotFound;
