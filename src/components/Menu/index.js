
import {matchPath} from "@/router/react-lazy-router-dom/matchPath.js";
import routesComponent from "@/router/routesComponent.js";
import config from "./config";
import {mapTree, findTreePath} from "@/utils";
import {useTranslation, withTranslation} from 'react-i18next';

import {
  Menu
} from "antd";
import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";
export default memo((props) => {
  const {
    match: {path, params: {id} = {}} = {},
    routePaths = {},
    pushRoute,
    location,
  } = props;

const {t, i18n} = useTranslation();

  const [selectedKeys, setSelectedKeys] = useState("-1");
  const [openKeys, setOpenKeys] = useState([]);
  const goTo = useCallback((url) => {
    pushRoute({
      url
    });
  }, []);

  const getItems = useCallback((menuData, index = null) => {
    return menuData.map((item, _index) => {
      const menuKey = index === null ? _index : `${index}_${_index}`;
      const {title, iconComponent = null, children = [], url} = item;
      // 获取组件的配置
      let {exact, path, strict, sensitive} =
        routesComponent.find((_item) => {
          return _item.path === item.url;
        }) || {};

      return {
        exact,
        path,
        strict,
        sensitive,
        url,
        label: title,
        key: `${menuKey}`,
        icon: iconComponent,
        children: children.length ? getItems(children, menuKey) : null
      };
    });
  }, []);
  
  const menuData = useMemo(() => {
    return getItems(config(routePaths, t));
  }, [routePaths, i18n.language]);

  const findMenuSelectedKey = useCallback((data, callback = () => { }) => {
    for (let item of data) {
      const {exact, path, url, strict, sensitive, children = []} = item;
      let menu = matchPath(location.pathname, {
        path: path || url,
        exact: exact,
        strict: strict,
        sensitive: sensitive
      });
      if (menu) {
        callback({
          ...menu,
          ...item
        });
      } else if (children && children.length) {
        findMenuSelectedKey(children, callback);
      }
    }
  }, [
    
    menuData, location.pathname

  ]);

  useEffect(() => {
    findMenuSelectedKey(menuData, (data) => {
      const {key} = data;
      setSelectedKeys(key);
      let paths = findTreePath({
        treeData: menuData,
        value: key,
        valueKey: 'key'
      });
      setOpenKeys(paths.map(item => item.key));
    });
  }, [  menuData, location.pathname ]);
  return (
    <Menu
      // theme="dark"
      mode="inline"
      selectedKeys={[selectedKeys]}
      openKeys={openKeys}
      onOpenChange={(keyPath) => {
        setOpenKeys(keyPath);
      }}
      onSelect={(value) => {
        const {
          key: selectedKeys,
          keyPath,
          item: {props: {url} = {}} = {}
        } = value;
        setSelectedKeys(selectedKeys);
        setOpenKeys(keyPath);
        goTo(url);
      }}
      items={
        mapTree(menuData, (item) => {
          return {
            ...item,
            exact: undefined
          };
        },)
      }
      defaultSelectedKeys={[selectedKeys]}></Menu>
  );
});
