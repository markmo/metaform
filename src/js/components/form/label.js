var React = require('react');
var d = require('../../helpers/dom');

var Label = React.createClass({

  render: function () {
    var labelGridColumns = this.props.labelGridColumns || 2;
    var controlGridColumns = 12 - labelGridColumns;
    var label = (
      <div>
        <label onClick={this.props.onClick}>{this.props.value}</label>
        {this.props.children}
      </div>
    );
    if (this.props.noContainer) {
      return label;
    }
    var control;
    if (this.props.formType === 'horizontal') {
      control = (
        <div className={'col-sm-' + controlGridColumns}>
          {label}
        </div>
      );
    } else {
      control = label;
    }
    return (
      <div className={d.classNames('form-group', this.props.className)}>
        <label htmlFor={this.props.field} className={'col-sm-' + labelGridColumns + ' control-label'}>{this.props.title}</label>
        {control}
      </div>
    );
  }
});

module.exports = Label;