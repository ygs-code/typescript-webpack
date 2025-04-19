import React, {createContext} from "react";
import {Children, cloneElement, memo} from "react";
export const  RoutesComponentContext = createContext("routesComponent");
// 创建 context 对象
export default (props) => {
    const {
        value: routesComponent,
        children,
        ...more
    } = props;

    return <RoutesComponentContext.Provider value={routesComponent}>
        {Children.map(children, (child) => {
            return cloneElement(child, more);
        })}
    </RoutesComponentContext.Provider>;

};


 