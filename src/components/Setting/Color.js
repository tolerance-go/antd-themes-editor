import React, { PureComponent } from "react";
import { Button, Popover } from "antd";
import { ChromePicker } from "react-color";
import lodash from "lodash";

class ColorPicker extends React.Component {
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

  handleChange = event => {
    const { onChange } = this.props;
    const {
      rgb: { r, g, b, a }
    } = event;
    this.setState({
      tempValue: `rgba(${r},${g},${b},${a})`
    });
  };

  convertColor = color => {
    if (color.startsWith("rgb")) {
      const [r, g, b, a] = color.match(/rgba\((.*)\)/)[1].split(",");
      return { r, g, b, a };
    }
    return color;
  };

  switchPopover = () => {
    this.setState({
      popoverVisible: !this.state.popoverVisible
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

  handleTempCancel = () => {
    this.setState({
      popoverVisible: false,
      tempValue: undefined
    });
  };

  render() {
    console.log("render color");
    const { value } = this.props;
    const { popoverVisible, tempValue } = this.state;
    return (
      <Popover
        visible={popoverVisible}
        title={
          <ChromePicker
            color={this.convertColor(tempValue || value)}
            onChangeComplete={this.handleChange}
          />
        }
        content={
          <Button.Group>
            <Button type="primary" onClick={this.handleTempComfirm}>
              确定
            </Button>
            <Button onClick={this.handleTempCancel}>取消</Button>
          </Button.Group>
        }
      >
        <Button
          style={{ background: value, width: 30 }}
          size="small"
          onClick={this.switchPopover}
        />
      </Popover>
    );
  }
}

export default ColorPicker;
