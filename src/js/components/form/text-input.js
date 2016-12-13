var React = require('react');
var d = require('../../helpers/dom');

var TextInput = React.createClass({

  getInitialState: function () {
    return {value: this.props.value};
  },

  componentWillReceiveProps: function (nextProps) {
    this.setState({value: nextProps.value});
  },

  handleChange: function (event) {
    this.setState({value: event.target.value});
  },

  render: function () {
    if (this.props.noContainer) {
      return (
        <input className={d.classNames('form-control', this.props.className)} id={this.props.field}
               name={this.props.field} placeholder={this.props.description} value={this.state.value} onChange={this.handleChange}
               disabled={this.props.disabled}/>
      );
    }
    var textInput = (
      <input className="form-control" id={this.props.field}
             name={this.props.field} placeholder={this.props.description} value={this.state.value} onChange={this.handleChange}
             disabled={this.props.disabled}/>
    );
    var labelGridColumns = this.props.labelGridColumns || 2;
    var controlGridColumns = 12 - labelGridColumns;
    if (this.props.formType === 'horizontal') {
      return (
        <div className={d.classNames('form-group', this.props.className)}>
          <label htmlFor={this.props.field} className={'col-sm-' + labelGridColumns + ' control-label'}>{this.props.title}</label>
          <div className={'col-sm-' + controlGridColumns}>
            {textInput}
          </div>
        </div>
      );
    } else {
      return (
        <div className={d.classNames('form-group', this.props.className)}>
          <label htmlFor={this.props.field}>{this.props.title}</label>
          {textInput}
        </div>
      );
    }
  }
});

module.exports = TextInput;
