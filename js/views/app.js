(function() {
  $(function() {
    var refreshScroller, scroller, socket, template_status, template_table_row, updateStatus;
    socket = io.connect('http://localhost:9000/');
    scroller = new iScroll('wrapper');
    refreshScroller = function() {
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
    $('.button').live('click', function() {
      var classes, id;
      classes = $(this).parent().parent().attr('class').split(' ');
      id = parseInt(classes[1].replace('server_', ''));
      $(this).replaceWith('<div class="loading"></div>');
      refreshScroller();
      return socket.emit('refresh_status', {
        id: id
      });
    });
    return updateStatus = function(response) {
      var el;
      el = $(".server_" + response.id);
      return el.find('.loading').replaceWith($.tmpl('status', response));
    };
  });
}).call(this);
