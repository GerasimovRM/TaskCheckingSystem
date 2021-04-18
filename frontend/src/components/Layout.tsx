import React from 'react';
import { Layout, PageHeader, Button, Col, Row, Menu } from 'antd';

export default function AppLayout() {
  return (
    <div>
      <PageHeader
        title="Name"
        extra={[<Button key="3">3</Button>, <Button key="2">2</Button>]}
      />
      <Row gutter={2}>
        <Col>
          <Menu mode="inline">
            <Menu.SubMenu key="s1" title="Курсы">
              <Menu.ItemGroup key="g1" title="Курсы">
                <Menu.Item key="1">Option 1</Menu.Item>
              </Menu.ItemGroup>
            </Menu.SubMenu>
          </Menu>
        </Col>
        <Col>2</Col>
      </Row>
    </div>
  );
}
