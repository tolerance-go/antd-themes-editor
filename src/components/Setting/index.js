import React, { PureComponent } from "react";
import ReactDOM from "react-dom";
import {
  Drawer,
  Form,
  Button,
  Col,
  Row,
  Input,
  Select,
  DatePicker,
  message,
  Affix
} from "antd";
import { connect } from "dva";
import lodash from "lodash";
import Color from "./Color";
import CompleteInput from "./CompleteInput";
import "./index.less";

const { Option } = Select;

@connect(state => {
  return {
    ...state.setting
  };
})
@Form.create({
  onValuesChange(props, field) {
    console.log(field);
    props.dispatch({
      type: "setting/changeTheme",
      payload: field
    });
  }
})
class Setting extends PureComponent {
  state = {
    visible: false,
    loading: false
  };

  componentDidMount = () => {
    this.props.dispatch({
      type: "setting/changeTheme"
    });
  };

  showDrawer = () => {
    this.setState({
      visible: true
    });
  };

  onClose = () => {
    this.setState({
      visible: false
    });
  };

  handleSave = () => {
    this.setState({
      loading: true
    });
    this.props
      .dispatch({
        type: "setting/saveThemeVars"
      })
      .then(success => {
        this.setState({
          loading: false
        });
        if (success) {
          return message.success("save localStorage success!");
        }
        return message.error("save error, try again!");
      })
      .catch(() => {
        this.setState({
          loading: false
        });
      });
  };

  render() {
    const formItemLayout = {
      labelCol: { span: 19 },
      wrapperCol: { span: 5 }
    };
    const { modifiedThemeVars, themeVars } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { loading, visible } = this.state;

    const adjustableThemeVars = {
      ...themeVars,
      ...modifiedThemeVars
    };

    const actionBarHeight = 50;

    return (
      <div>
        <Button
          style={{
            position: "fixed",
            top: 300,
            right: 0,
            zIndex: 9999,
            visibility: !visible ? "visible" : "hidden"
          }}
          type="primary"
          icon="tool"
          onClick={this.showDrawer}
        />

        <Drawer
          width={920}
          placement="right"
          onClose={this.onClose}
          maskClosable={false}
          visible={this.state.visible}
        >
          <div style={{ marginBottom: actionBarHeight }}>
            <Form id="setting" layout="horizontal" hideRequiredMark>
              {lodash
                .chunk(Object.keys(adjustableThemeVars), 3)
                .map((chunks, index) => {
                  return (
                    <Row key={index} gutter={16}>
                      {chunks.map((varName, iindex) => {
                        const value = adjustableThemeVars[varName];
                        return (
                          <Col key={iindex} span={24 / 3}>
                            <Form.Item {...formItemLayout} label={varName}>
                              {getFieldDecorator(varName, {
                                initialValue: value
                              })(
                                value.endsWith("px") ? (
                                  <CompleteInput />
                                ) : (
                                  <Color />
                                )
                              )}
                            </Form.Item>
                          </Col>
                        );
                      })}
                    </Row>
                  );
                })}
            </Form>
          </div>

          <div
            style={{
              position: "absolute",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              bottom: 0,
              width: "100%",
              borderTop: "1px solid #e8e8e8",
              padding: "0px 16px",
              left: 0,
              background: "#fff",
              borderRadius: "0 0 4px 4px",
              height: actionBarHeight
            }}
          >
            <Button
              style={{
                marginRight: 8
              }}
              onClick={this.onClose}
            >
              canel
            </Button>
            <Button loading={loading} onClick={this.handleSave} type="primary">
              save
            </Button>
          </div>
        </Drawer>
      </div>
    );
  }
}

export default Setting;
