//external dependencies
//import own dependencies
import * as React from 'react';
// 
import * as getClassName from 'classnames'
// import {FieldProp} from 'redux-form';

export interface IHamburgerBtnProps{
  className?: string,
  title?:string,
  onClick?:React.MouseEventHandler<any>,
  active?: boolean
}
import * as styles from './style.scss';

const HamburgerBtn:React.StatelessComponent<IHamburgerBtnProps> = (props:IHamburgerBtnProps) => {
  const {className, title, onClick} = props;


  const classNames: {[className:string]: boolean} = {
    [styles.burger]: true,
    'navbar-toggle': true
  }
  return (

    <button onClick={onClick} type="button" className={getClassName(classNames, className)}>
        {title && <span className="sr-only">{title}</span>}
        <span className="icon-bar"></span>
        <span className="icon-bar"></span>
        <span className="icon-bar"></span>
    </button>
  );
};


export default HamburgerBtn;
