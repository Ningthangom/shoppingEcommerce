
    // using helmet, all th e tags will be add 

    import React from 'react';
    import {Helmet} from 'react-helmet';
    
    // prop {title} is a way of passing data from component to component
    // Metadata tab is used in Home component
const  Metadata = ({title})=>  {
        return (
            <Helmet >
                <title>{`${title}-Edirect`}</title>
            </Helmet>
        )
    }
    
    export default Metadata
    