(function() {
  $(function() {
    var refreshScroller, scroller, socket, template_status, template_table_row, updateStatus;
    socket = io.connect('http://localhost:8888/');
    scroller = new iScroll('wrapper');
    refreshScroller = function(ms, func) {
      return setTimeout(scroller.refresh(), 0);
    };
    template_table_row = "<div class=\"row server_${id}\">\n	<div class=\"row_cell\" style=\"width: 99%;\">\n		<h3>${name}</h3>\n		<div style=\"color: #999;\">${ip}</div>\n	</div>\n	<div class=\"row_cell status\">\n		<div class=\"loading\"></div>\n	</div>\n</div>";
    template_status = "<div class=\"button ${status}\">${status}</div>";
    $.template("table_row", template_table_row);
    $.template("status", template_status);
    socket.on('server_list', function(response) {
      $('#content').append($.tmpl('table_row', response));
      return refreshScroller();
    });
    socket.on('response', function(response) {
      return updateStatus(response);
    });
    return updateStatus = function(response) {
      var el;
      el = $(".server_" + response.id);
      return el.find('.loading').replaceWith($.tmpl('status', response));
    };
  });
}).call(this);
