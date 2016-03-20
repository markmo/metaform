var React = require('react');
window.$ = window.jQuery = require('jquery');

var ConfirmButton = React.createClass({

  componentDidMount: function () {
    var self = this;
    $('[data-toggle="popover"]').popover()
        .on('shown.bs.popover', function () {
          $('.btn-cancel').click(self.cancel);
          $('.btn-ok').click(self.ok);
        })
        .on('hidden.bs.popover', function () {
          $('.btn-cancel').off();
          $('.btn-ok').off();
        });
  },

  componentWillUnmount: function () {
    $('[data-toggle="popover"]').popover('destroy');
  },

  cancel: function () {
    $('[data-toggle="popover"]').popover('hide');
  },

  ok: function () {
    if (typeof(this.props.onAccept) === 'function') {
      this.props.onAccept();
    }
    $('[data-toggle="popover"]').popover('hide');
  },

  render: function () {
    var markup = (
      <div className="confirm-popup">
        <p>This action cannot be undone.</p>
        <div className="text-center">
          <div className="btn-group" role="group" aria-label="...">
            <button type="button" className="btn btn-default btn-sm btn-cancel">
              <span className="fa fa-times-circle"></span>
              Cancel
            </button>
            <button type="button" className="btn btn-primary btn-sm btn-ok">
              <span className="fa fa-check-circle-o"></span>
              OK
            </button>
          </div>
        </div>
      </div>
    );
    return (
      <button type="button" className="btn btn-danger" data-toggle="popover"
              title="Please confirm" data-placement="left" data-container="body"
              data-content={React.renderToString(markup)} data-html={true}>{this.props.title}</button>
    );
  }
});

module.exports = ConfirmButton;