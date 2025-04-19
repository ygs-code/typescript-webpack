
import {withRouter} from "src/router/react-lazy-router-dom";
import hoistStatics from "hoist-non-react-statics";
import React, {
    Children,
    isValidElement,
    cloneElement
} from "react";


export default withRouter((props) => {
    const {
        href,
        to,
        children,
        history
        : {
            push
        },
        className,
        style = {}
    } = props;
    return <a href={to || href}
        style={{style}}
        className={className}
        onClick={(e) => {
            push(to || href);
            e.preventDefault();
        }}
        {
        ...props
        }
    >
        {Children.map(children, (child) => {
            return child;
        })}
    </a>;

});