//external dependencies
import * as React from 'react';

import {Helmet} from 'react-helmet';
import {Grid,Row,Col} from 'react-bootstrap';


//import own dependencies
import {
  Svg
} from 'components'




import * as styles from './style.scss'
const icon = require('./sad.svg');
class ErrorPage extends React.PureComponent<ErrorPage.Props,any> {


  render() {
    const {message, title} = this.props;
    return (
      <Grid className={styles.container}>
        <Helmet title={title || "Not found"}/>
        <Row className={styles.iconRow}>
          <Col md={8}>
          <h2>Oops!</h2>
          <p>{message || "The page you're looking for does not exist"}</p>
          </Col>
          <Col md={4}>
            <Svg src={icon} className={styles.icon}/>

          </Col>
        </Row>
      </Grid>
    );
  }
}
module ErrorPage {
  export interface Props {
    message: string,
    title:string
  }
}
export default ErrorPage
