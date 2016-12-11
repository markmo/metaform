var React = require('react');
var Modal = require('./modal');
var Form = require('./form');
window.$ = window.jQuery = require('jquery');

var ModalForm = React.createClass({

  componentDidMount: function () {
    if (this.props.autoshow) {
      $(this.getDOMNode()).modal('show');
    }
    if ($.isFunction(this.props.onHidden)) {
      $(this.getDOMNode()).on('hidden.bs.modal', function () {
        this.props.onHidden();
      }.bind(this));
    }
  },

  componentWillUnmount: function () {
    if ($.isFunction(this.props.onHidden)) {
      $(this.getDOMNode()).off('hidden.bs.modal');
    }
  },

  componentWillReceiveProps: function () {
    if (this.props.autoshow) {
      $(this.getDOMNode()).modal('show');
    }
  },

  handleSubmission: function (obj) {
    $(this.getDOMNode()).modal('hide');
    this.props.onSubmitted(obj);
  },

  render: function () {
    return(
      <Modal title={this.props.title}>
        <Form name={this.props.name} formType="vertical" value={this.props.value}
          filterParam={this.props.filterParam}
          onSubmitted={this.handleSubmission}/>
      </Modal>
    );
  }
});

module.exports = ModalForm;
