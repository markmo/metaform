var React = require('react');
window.$ = window.jQuery = require('jquery');

var Bool = React.createClass({

  componentDidMount: function () {
    $(this.refs.checkbox1.getDOMNode()).checkbox();
  },

  getValue: function () {
    return this.refs.input1.getDOMNode().checked;
  },

  render: function () {
    var checkbox = (
      <div ref="checkbox1" className="checkbox">
        <label className="checkbox-custom" data-initialize="checkbox">
          <input ref="input1" type="checkbox" name={this.props.field} id={this.props.field} defaultChecked={this.props.value} className="sr-only"/>
          <span className="checkbox-label">{this.props.title}</span>
        </label>
      </div>
    );
    if (this.props.noContainer) {
      return checkbox;
    }
    var labelGridColumns = this.props.labelGridColumns || 2;
    var controlGridColumns = 12 - labelGridColumns;
    if (this.props.formType === 'horizontal') {
      return (
        <div className="form-group">
          <div className={'col-sm-offset-' + labelGridColumns + ' col-sm-' + controlGridColumns}>
            {checkbox}
          </div>
        </div>
      );
    } else {
      return checkbox;
    }
  }
});

module.exports = Bool;