var React = require('react');
var bootstrap = require('bootstrap');
var fuelux = require('fuelux');
window.$ = window.jQuery = require('jquery');

var Placard = React.createClass({

  componentDidMount: function () {
    var getValue = this.props.getValue || function () {
      return this.refs[this.props.field + '-input'].getDOMNode().value;
    }.bind(this);
    var $placard = $(this.refs[this.props.field + '-placard'].getDOMNode()).placard({
      onAccept: function () {
        if (typeof(this.props.onAccept) === 'function') {
          this.props.onAccept(getValue());
        }
        $placard.placard('hide');
      }.bind(this),
      onCancel: function () {
        if (typeof(this.props.onCancel) === 'function') {
          this.props.onCancel();
        } else {
          $placard.placard('setValue', this.oldValue);
        }
        $placard.placard('hide');
      }.bind(this)
    });
    $placard.on('shown.fu.placard', function () {
      this.oldValue = $placard.placard('getValue');
      if (typeof this.props.onClick === 'function') {
        this.props.onClick();
      }
    }.bind(this));
  },

  componentWillUnmount: function () {
    $(this.refs[this.props.field + '-placard'].getDOMNode()).off('shown.fu.placard');
  },

  render: function () {
    var labelGridColumns = this.props.labelGridColumns || 3;
    var controlGridColumns = 12 - labelGridColumns;
    return (
      <div className="form-group">
        <label className={'col-sm-' + labelGridColumns + ' control-label'} htmlFor={this.props.field}>{this.props.title}</label>
        <div className={'col-sm-' + controlGridColumns}>
          <div ref={this.props.field + '-placard'} className="placard" data-initialize="placard">
            <div className="placard-popup"></div>
            {this.props.children || (
              <input ref={this.props.field + '-input'} className="form-control placard-field glass" type="text" id={this.props.field} name={this.props.field} defaultValue={this.props.value}/>
            )}
            <div className="placard-footer">
              <a className="placard-cancel" href="#">Cancel</a>
              <button className="btn btn-primary btn-xs placard-accept" type="button">Save</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Placard;