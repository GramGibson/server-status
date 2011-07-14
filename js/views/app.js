(function() {
  $(function() {
    var refreshScroller, scroller, socket, template_table_row;
    socket = io.connect('http://localhost:8888/');
    scroller = new iScroll('wrapper');
    refreshScroller = function(ms, func) {
      return setTimeout(scroller.refresh(), 0);
    };
    template_table_row = "<div class=\"row\">\n	<div class=\"row_cell\" style=\"width: 90%;\">\n		<h3>${name}</h3>\n		<div style=\"color: #999;\">${ip}</div>\n	</div>\n	<div class=\"row_cell status ${status}\">${status}</div>\n</div>";
    $.template("table_row", template_table_row);
    return socket.on('response', function(response) {
      $('#content').append($.tmpl('table_row', response));
      return refreshScroller();
    });
  });
}).call(this);
