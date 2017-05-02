import * as React from 'react';
import * as shallowCompare from 'react-addons-shallow-compare'



export default class BaseComponent<P,S> extends React.Component<P,S> {
  shouldComponentUpdate(nextProps:P, nextState:S) {
    return shallowCompare(this, nextProps, nextState);
  }
}
