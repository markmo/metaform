var React = require('react');
var d = require('../../helpers/dom');

var ReadonlyText = React.createClass({

  render: function () {
    if (this.props.noContainer) {
      return (
        <div className={d.classNames('readonly-text', this.props.className)}>{this.props.value}</div>
      );
    }
    var text = (
      <div className="readonly-text">{this.props.value}</div>
    );
    var labelGridColumns = this.props.labelGridColumns || 2;
    var controlGridColumns = 12 - labelGridColumns;
    if (this.props.formType === 'horizontal') {
      return (
        <div className={d.classNames('form-group', this.props.className)}>
          <label htmlFor={this.props.field} className={'col-sm-' + labelGridColumns + ' control-label'}>{this.props.title}</label>
          <div className={'col-sm-' + controlGridColumns}>
            {text}
          </div>
        </div>
      );
    } else {
      return (
        <div className={d.classNames('form-group', this.props.className)}>
          <label htmlFor={this.props.field}>{this.props.title}</label>
          {text}
        </div>
      );
    }
  }
});

module.exports = ReadonlyText;