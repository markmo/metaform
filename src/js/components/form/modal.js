var React = require('react');
window.$ = window.jQuery = require('jquery');
var bootstrap = require('bootstrap');
var fuelux = require('fuelux');

var Modal = React.createClass({

  componentDidMount: function () {
    $('#modal1').on('shown.bs.modal', function (evt) {
      $('.checkbox').checkbox();
    });
  },

  render: function () {
    return (
      <div id="modal1" className="modal fade" role="dialog" tabIndex="-1" aria-labelledby={this.props.title} aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 className="modal-title">{this.props.title}</h4>
            </div>
            <div className="modal-body">
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Modal;