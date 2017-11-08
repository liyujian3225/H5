/**
 * Created by Brian on 27/03/2017.
 */
import React from 'react';
import {Footer, FooterText, FooterLink} from 'react-weui';

class AppFooter extends React.Component {
    render() {
        return <Footer className='app-footer'>
            <FooterText>COPYRIGHT© 2017，All Rights Reserved</FooterText>
            <FooterLink href='http://www.miitbeian.gov.cn/' target='_blank'>粤ICP备17032712号-1</FooterLink>
        </Footer>
    }
}

export default AppFooter;
