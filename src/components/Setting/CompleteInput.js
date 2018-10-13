import React, { PureComponent } from "react";
import { Input, Popover, Button } from "antd";
import lodash from "lodash";

const noop = () => {};

class CompleteInput extends React.Component {
  state = {
    popoverVisible: false,
    tempValue: undefined
  };

  shouldComponentUpdate = (nextProps, nextState) => {
    return (
      this.props.value !== nextProps.value ||
      !lodash.isEqual(nextState, this.state)
    );
  };

  handleTempValueChange = event => {
    this.setState({
      tempValue: event.target.value
    });
  };

  handleTempComfirm = () => {
    const { tempValue } = this.state;
    if (tempValue) {
      this.setState(
        {
          popoverVisible: false,
          tempValue: undefined
        },
        () => this.props?.onChange(tempValue)
      );
    }
  };

  switchPopover = () => {
    this.setState({
      popoverVisible: !this.state.popoverVisible
    });
  };

  handleTempCancel = () => {
    this.setState({
      popoverVisible: false,
      tempValue: undefined
    });
  };

  render() {
    console.log("render input");
    const { popoverVisible, tempValue } = this.state;
    const { value, onChange } = this.props;
    return (
      <Popover
        visible={popoverVisible}
        content={
          <Input.Group compact>
            <Input
              value={tempValue || value}
              onChange={this.handleTempValueChange}
            />
            <Button type="primary" onClick={this.handleTempComfirm}>
              确定
            </Button>
            <Button onClick={this.handleTempCancel}>取消</Button>
          </Input.Group>
        }
      >
        <Input value={value} onChange={noop} onFocus={this.switchPopover} />
      </Popover>
    );
  }
}

export default CompleteInput;
