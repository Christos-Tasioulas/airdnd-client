import React from 'react';
import { Link } from 'react-router-dom';

export default function NavbarButton(props) {
  return (
    <li className={props.className} onClick={props.toggle}>
      <Link to={props.path}>{props.name}</Link>
    </li>
  );
}
