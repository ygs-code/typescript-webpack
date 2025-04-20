/*
 * @Author: your name
 * @Date: 2021-08-23 19:39:29
 * @LastEditTime: 2021-08-26 17:03:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /error-sytem/src/src/common/component/Table/index.js
 */

import './index.scss';
import type { FormProps } from 'antd';
import { SearchForm } from 'src/components/Form';
// import FormPicker from "src/components/FormPicker";
import Table from 'src/components/Table';
import React from 'react'; // , { memo, PureComponent }
import { Spin, message } from 'antd'; // , { memo, PureComponent }
import Store from '@/redux/Store.js'; // , { memo, PureComponent }
import { CheckDataType } from 'src/utils/CheckDataType';
import Tabs from 'src/components/Tabs';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
// class TablePage extends PureComponent {
//   constructor(props) {
//     super(props);
//     this.state = {
//       tableData: {
//         list: [{ title: "你好" }]
//       },
//       dataSource: []
//     };
//   }
//   // 获取默认搜索参数
//   getDefaultSearchParams = () => {
//     return {
//       // status: ""
//     };
//   };

//   // 定义搜索栏字段
//   getSearchFields = () => {
//     return [];
//   };

//   // 定义Tab字段
// getTabFilterItems = () => {
//   return [];
// };

//   // 定义表头字段
//   // getColumns = () => {
//   //   return [];
//   // };

//   /**
//    * 定义表格的数据加载功能
//    */
//   tableDataLoader = async () => {
//     return {};
//   };

//   loadTableData = async (searchParams = {}) => {
//     return await this.tableDataLoader(searchParams);
//   };

//   getDataSource = () => {
//     return [];
//   };

//   getTableProps = () => {
//     return {};
//   };

//   componentDidMount() {
//   }

//   renderSearch = (props = {}) => {
//     const { shrinkLength = 5 } = props;
//     return (
//       <SearchForm
//         // shrinkLength={2}
//         {...props}
//         shrinkLength={shrinkLength}
//         fields={this.getSearchFields()}
//         type="search"
//         onReady={(form) => {
//           this.searchForm = form;
//         }}
//       />
//     );
//   };

//   renderTable = (props = {}) => {
//     return (
//       <Table
//         columns={this.getColumns ? this.getColumns() : []}
//         dataSource={this.getDataSource()}
//         // title={() => "Header"}
//         // footer={() => "Footer"}
//         {...this.getTableProps()}
//         {...props}
//       />
//     );
//   };
//   render() {
//     return (
//       <>
//         {this.renderSearch()} {this.renderTable()}
//       </>
//     );
//   }
// }

const { dispatch, getState } = Store;
interface TablePageState {
  searchParams: Record<string, any>;
  tableData: Record<string, any>;
  selectedRows: any[];
  selectedRowKeys: React.Key[];
  loading: boolean;
  exportOpen: boolean;
  onceLoading: boolean;
}

interface TablePageProps {
  readOnly?: boolean;
  [key: string]: any;
}

interface SearchFormProps {
  shrinkLength?: number;
  getSearchButtons?: () => React.ReactNode;
  onConfirm?: (values: Record<string, any>) => void;
  onReset?: (searchParams: Record<string, any>) => void;
  fields?: any[];
  type?: string;
  onReady?: (form: any) => void;
}

interface TabsProps {
  onChange?: (value: string) => void;
  value?: string;
  items?: any[];
}

interface TableProps {
  tableProps?: Record<string, any>;
  paginationProps?: Record<string, any>;
  readOnly?: boolean;
  onSelect?: (selectedRows: any[], selectedRowKeys: React.Key[]) => void;
}

const tablePage = (
  Component: new (...args: any[]) => any
): new (...args: any[]) => any => {
  class TablePage extends Component {
    searchForm?: any;
    tabsValueKey: string;

    constructor(props: TablePageProps) {
      super(props);
      const { selectedRows = [], selectedRowKeys = [] } = this.state || {};
      this.tabsValueKey = this.tabsValueKey || 'status';
      let searchParams = {
        pageNumber: 1,
        pageSize: 10,
      };

      if (this.getTabFilterItems && this.getTabFilterItems()) {
        searchParams = {
          ...searchParams,
          [this.tabsValueKey]: '',
        };
      }

      this.state = {
        ...(this.state || {}),
        searchParams,
        tableData: {},
        selectedRows,
        selectedRowKeys,
        loading: false,
        exportOpen: false,
        onceLoading: false,
      };
    }

    getDefaultSearchParams = (): Record<string, any> => {
      return {
        [this.tabsValueKey]: '',
      };
    };

    checkTabelData = (data: Record<string, any>): string | null => {
      const mapKey = ['list', 'pageNumber', 'pageSize', 'total'];
      let index = -1;
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          index = mapKey.indexOf(key);
          if (index !== -1) {
            mapKey.splice(index, 1);
          }
        }
      }

      if (mapKey.length) {
        return `列表表格数据数据缺少${mapKey.join(',')}字段`;
      }
      return null;
    };

    checkAbstractFunction = (): string | null => {
      const checkFunction = [
        {
          name: 'tableDataLoader',
          message: 'tableDataLoader是抽象方法需要实现,请设置ajax请求列表',
        },
        {
          name: 'getColumns',
          message: 'getColumns是抽象方法需要实现,请配置表格columns',
        },
      ];

      for (const item of checkFunction) {
        const { name, message } = item;
        if (!this[name]) {
          return message;
        }
      }
      return null;
    };

    loadTableData = async (
      searchParams: Record<string, any> = {}
    ): Promise<any> => {
      this.setState({
        loading: true,
      });
      const newSearchParams = this.getSearchParams(searchParams) || {};
      let errorMessage = this.checkAbstractFunction();
      if (errorMessage) {
        console.error(errorMessage);
        return;
      }
      if (!this.tableDataLoader) {
        console.error('tableDataLoader抽象方法需要实现');
        return;
      }

      const data = await this.tableDataLoader(newSearchParams).catch(
        (err: any) => {
          console.error('err:', err);
          this.setState({
            loading: false,
          });
        }
      );
      this.setState({
        loading: false,
      });
      errorMessage = this.checkTabelData(data);
      if (errorMessage) {
        console.error(errorMessage);
        return;
      }
      this.setState({ tableData: data });
      return data;
    };

    componentDidMount(...args: any[]) {
      if (super.componentDidMount) {
        super.componentDidMount(...args);
      }

      this.setBreadcrumb();

      setTimeout(() => {
        if (!this.state.onceLoading) {
          this.setState({
            onceLoading: true,
          });
          this.loadTableData({
            pageNumber: 1,
            pageSize: 10,
          });
        }
      }, 50);
    }

    onResetForm = (): void => {
      const { resetFields = () => {} } = this.searchForm || {};
      resetFields();
      this.setState(() => ({
        searchParams: {
          pageNumber: 1,
          pageSize: 10,
        },
      }));
    };

    renderTabs = (props: TabsProps = {}): React.ReactNode => {
      const { searchParams = {} } = this.state;
      return (
        <Tabs
          onChange={(value) => {
            this.setState(
              {
                ...searchParams,
                [this.tabsValueKey]: value,
              },
              () => {
                this.loadTableData({
                  ...searchParams,
                  [this.tabsValueKey]: value,
                  pageNumber: 1,
                  pageSize: 10,
                });
              }
            );
          }}
          value={searchParams[this.tabsValueKey]}
          items={(this.getTabFilterItems && this.getTabFilterItems()) || []}
          {...props}
        />
      );
    };

    renderSearch = (props: SearchFormProps = {}): React.ReactNode => {
      const { shrinkLength } = props;
      return (
        <div className="search-box">
          <SearchForm
            {...props}
            getSearchButtons={this.getSearchButtons}
            onConfirm={(v: any) => {
              this.loadTableData({
                ...v,
                pageNumber: 1,
                pageSize: 10,
              });
            }}
            onReset={(searchParams: object = {}) => {
              this.setState({
                onceLoading: true,
              });
              this.loadTableData({
                ...searchParams,
                pageNumber: 1,
                pageSize: 10,
              });
            }}
            shrinkLength={shrinkLength}
            fields={this.getSearchFields()}
            type="search"
            onReady={(form: FormProps) => {
              this.searchForm = form;
              this.loadTableData();
            }}
          />
        </div>
      );
    };

    setBreadcrumb(breadcrumb?: any): void {
      let nextBreadcrumb =
        breadcrumb || (this?.getBreadcrumb && this?.getBreadcrumb()) || [];
      try {
        if (typeof nextBreadcrumb !== 'undefined') {
          if (CheckDataType.isString(nextBreadcrumb)) {
            nextBreadcrumb = [
              {
                title: nextBreadcrumb,
              },
            ];
          }
          dispatch.breadcrumb.setBreadcrumb(nextBreadcrumb);
        }
      } catch (error) {
        console.log(error);
      }
    }

    onSelect = (selectedRows: any[], selectedRowKeys: React.Key[]): void => {
      this.setState({
        selectedRows,
        selectedRowKeys,
      });
    };

    renderCenterButton = (props: Record<string, any> = {}): React.ReactNode => {
      const renderLeftButton =
        (this.renderLeftButton && this.renderLeftButton(props)) || null;
      const renderRightButton =
        (this.renderRightButton && this.renderRightButton(props)) || null;

      return renderLeftButton || renderRightButton ? (
        <div className="render-center-button">
          <div className="render-left-button">{renderLeftButton}</div>
          <div className="render-right-button">{renderRightButton}</div>
        </div>
      ) : null;
    };

    renderTable = (props: TableProps = {}): React.ReactNode => {
      const { tableData, loading } = this.state;
      let { tableProps = {}, paginationProps = {} } = props;
      const { readOnly } = this.props;

      tableProps = {
        ...tableProps,
        ...props,
        ...(this.getTableProps ? this.getTableProps() : {}),
      };

      const { onSelect = () => {} } = tableProps;

      return (
        <div className="table-page">
          <Spin spinning={loading}>
            <Table
              readOnly={readOnly}
              tableProps={tableProps}
              columns={this.getColumns ? this.getColumns() : []}
              data={tableData}
              paginationProps={paginationProps}
              onChange={(searchParams: Object) => {
                this.loadTableData(searchParams);
              }}
              onSelect={(
                selectedRows: Array<Object>,
                selectedRowKeys: Array<String>
              ) => {
                this.onSelect(selectedRows, selectedRowKeys as React.Key[]);
                onSelect(selectedRows, selectedRowKeys);
              }}
            />
          </Spin>
        </div>
      );
    };

    getSearchParams = (
      searchParams: Record<string, any>
    ): Record<string, any> => {
      const { getFieldsValue = () => ({}) } = this.searchForm || {};
      let newSearchParams: Record<string, any> = {};

      if (this.getDefaultSearchParams) {
        searchParams = {
          ...this.getDefaultSearchParams(),
          ...this.state.searchParams,
          ...searchParams,
        };
      }
      this.setState(() => ({
        searchParams,
      }));

      const searchFormValue = getFieldsValue();

      if (Object.keys(searchFormValue).length) {
        searchParams = {
          ...searchParams,
          ...searchFormValue,
        };
      }

      for (const key in searchParams) {
        if (searchParams.hasOwnProperty(key)) {
          if (
            searchParams[key] === null ||
            (searchParams[key] !== undefined &&
              searchParams[key].toString().trim() !== '')
          ) {
            newSearchParams[key] = searchParams[key];
          }
        }
      }

      return newSearchParams;
    };

    exportTable = async (
      searchParams: Record<string, any> = {}
    ): Promise<void> => {
      this.setState({ exportOpen: true });
    };

    render(): React.ReactNode {
      const { exportOpen } = this.state;
      return <div className="table-page-box">{super.render()}</div>;
    }
  }

  return TablePage;
};

// export default TablePage;

export { tablePage };
