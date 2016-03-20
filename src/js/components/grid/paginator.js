var React = require('react');
window.$ = window.jQuery = require('jquery');

var Paginator = React.createClass({

  getInitialState: function () {
    return {pageSize: this.props.pageSize};
  },

  componentWillReceiveProps: function (nextProps) {
    this.setState({pageSize: nextProps.pageSize});
  },

  handleChange: function (ev) {
    this.setState({pageSize: ev.target.value});
  },

  componentDidMount: function () {
    $(this.refs.pageSizeSelector.getDOMNode()).on('changed.fu.combobox', function (ev, opt) {
      this.props.onPageSizeChange(opt.value || opt.text);
    }.bind(this));
  },

  first: function (event) {
    event.preventDefault();
    this.props.onPageChange('first');
  },

  previous: function (event) {
    event.preventDefault();
    this.props.onPageChange('prev');
  },

  next: function (event) {
    event.preventDefault();
    this.props.onPageChange('next');
  },

  last: function (event) {
    event.preventDefault();
    this.props.onPageChange('last');
  },

  render: function () {
    var firstClassNames = 'first';
    var prevClassNames = 'prev';
    var lastClassNames = 'last';
    var nextClassNames = 'next';
    var page = this.props.page;
    var pageSize = this.props.pageSize;
    var totalEntries = this.props.totalEntries;
    var totalPages = parseInt(totalEntries / pageSize, 10) || 1;
    var isFirst, isLast = false;
    if (totalPages * pageSize < totalEntries) {
      totalPages += 1;
    }
    if (page === 1) {
      isFirst = true;
      firstClassNames += ' disabled';
      prevClassNames += ' disabled';
    }
    if (page === totalPages) {
      isLast = true;
      lastClassNames += ' disabled';
      nextClassNames += ' disabled';
    }
    var start = (page - 1) * pageSize + 1;
    var end = start + Math.min(pageSize, totalEntries) - 1;

    return (
      <ul className="pagination pagination-small">
        <li className={firstClassNames}>
          {isFirst ? <a href="#">First</a> : <a href="#" onClick={this.first}>First</a>}
        </li>
        <li className={prevClassNames}>
          {isFirst ? <a href="#">&laquo; Previous</a> : <a href="#" onClick={this.previous}>&laquo; Previous</a>}
        </li>
        <li className="current">
          <div className="page-size-selector">
            <span>{start} to {end} of {this.props.totalEntries} | items/page:</span>
            <div className="input-group input-append dropdown combobox" data-initialize="combobox" ref="pageSizeSelector">
              <input type="text" className="form-control" value={this.state.pageSize} onChange={this.handleChange}/>
              <div className="input-group-btn">
                <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown"><span className="caret"></span></button>
                <ul className="dropdown-menu dropdown-menu-right">
                  <li data-value="10"><a href="#">10</a></li>
                  <li data-value="50"><a href="#">50</a></li>
                  <li data-value="100"><a href="#">100</a></li>
                  <li data-value="500"><a href="#">500</a></li>
                </ul>
              </div>
            </div>
          </div>
        </li>
        <li className={nextClassNames}>
          {isLast ? <a href="#">Next &raquo;</a> : <a href="#" onClick={this.next}>Next &raquo;</a>}
        </li>
        <li className={lastClassNames}>
          {isLast ? <a href="#">Last</a> : <a href="#" onClick={this.last}>Last</a>}
        </li>
      </ul>
    );
  }
});

module.exports = Paginator;