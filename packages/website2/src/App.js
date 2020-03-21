import React, { useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Drawer, Tag } from 'antd';
import ProTable, {
  // TableDropdown,
  IntlProvider,
  enUSIntl,
} from '@ant-design/pro-table';
import { request as gqlRequest } from 'graphql-request';

// import logo from './logo.svg';

import 'antd/dist/antd.css';
import './App.css';

const columns = [
  {
    title: 'index',
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 72,
  },
  {
    title: 'Titel',
    dataIndex: 'title',
    copyable: true,
    ellipsis: true,
    // width: 200,
    // hideInSearch: true,
  },
  {
    title: 'Status',
    dataIndex: 'state',
    initialValue: 'all',
    valueEnum: {
      all: {
        text: 'ALL',
        status: 'Default',
      },
      open: {
        text: 'Error',
        status: 'Error',
      },
      closed: {
        text: 'Success',
        status: 'Success',
      },
    },
  },
  {
    title: 'Labels',
    dataIndex: 'labels',
    width: 80,
    render: (_, row) =>
      row.labels.map(({ name, id, color }) => (
        <Tag
          color={`#${color}`}
          key={id}
          style={{
            margin: 4,
          }}
        >
          {name}
        </Tag>
      )),
  },
  {
    title: 'Erstellt',
    key: 'since',
    dataIndex: 'created_at',
    valueType: 'dateTime',
  },
  // {
  //   title: 'option',
  //   valueType: 'option',
  //   dataIndex: 'id',
  //   render: (text, row, _, action) => [
  //     <a href={row.html_url} target="_blank" rel="noopener noreferrer">
  //       show
  //     </a>,
  //     <TableDropdown
  //       onSelect={() => action.reload()}
  //       menus={[
  //         {
  //           key: 'copy',
  //           name: 'copy',
  //         },
  //         {
  //           key: 'delete',
  //           name: 'delete',
  //         },
  //       ]}
  //     />,
  //   ],
  // },
];

function App() {
  const actionRef = useRef();
  const [visible, setVisible] = useState(false);
  return (
    <div className="App">
      <Drawer onClose={() => setVisible(false)} visible={visible}>
        <Button
          style={{
            margin: 8,
          }}
          onClick={() => {
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }}
        >
          reload
        </Button>
        <Button
          onClick={() => {
            if (actionRef.current) {
              actionRef.current.reset();
            }
          }}
        >
          reset
        </Button>
      </Drawer>
      <IntlProvider value={enUSIntl}>
        <ProTable
          columns={columns}
          actionRef={actionRef}
          request={async (params = {}) => {
            const query = `
              {
                projects {
                  id
                  title
                  description
                  url
                  created_at
                }
                projectsAggregate: projects_aggregate {
                  aggregate {
                    count
                  }
                }
              }
            `;
            const { projects, projectsAggregate } = await gqlRequest(
              'http://95.217.162.167:8080/v1/graphql',
              query,
            );
            // console.log('data', data2);
            return {
              data: projects.map(project => ({
                id: project.id,
                title: project.title,
                labels: project.labels || [],
                status: project.status || 'not set',
                created_at: project.created_at,
              })),
              page: params.current,
              success: true,
              total: projectsAggregate.aggregate.count,
            };
          }}
          rowKey="id"
          pagination={{
            showSizeChanger: true,
          }}
          dateFormatter="string"
          headerTitle="Basic Table"
          toolBarRender={() => [
            <Button key="3" type="primary" onClick={() => setVisible(true)}>
              <PlusOutlined />
              New
            </Button>,
          ]}
        />
      </IntlProvider>
    </div>
  );
}

export default App;
