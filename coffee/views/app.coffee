$ ->
	# open a new websockets connection
	socket = io.connect 'http://localhost:9000/'

	# enable fancy scrolling
	scroller = new iScroll 'wrapper'
	
	# refresh scroller
	refreshScroller = (ms, func) -> setTimeout scroller.refresh(), 0

	# row template
	template_table_row = """
		<div class="row server_${id}">
			<div class="row_cell" style="width: 99%;">
				<h3>${name}</h3>
				<div style="color: #999;">${ip}</div>
			</div>
			<div class="row_cell status">
				<div class="loading"></div>
			</div>
		</div>
	"""
	template_status = """
		<div class="button ${status}">${status}</div>
	"""
	
	# compile + cache templates
	$.template("table_row", template_table_row)
	$.template("status", template_status)

	socket.on 'server_list', (response) ->
		$('#content').append $.tmpl('table_row', response)
		refreshScroller()

	# listen for websocket responses
	socket.on 'response', (response) ->	
		# append server statuses as they come in
		updateStatus response
	
	$('.button').live 'click', ->
		# retrieve server id from parent div, this needs to be cleaned up!
		classes = $(this).parent().parent().attr('class').split ' '
		id = parseInt(classes[1].replace 'server_', '')
		
		# show loading icon
		$(this).replaceWith '<div class="loading"></div>'
		refreshScroller()
		
		# refresh server status
		socket.emit 'refresh_status', { id: id }
	
	updateStatus = (response) ->
		# replace loading icon with status
		el = $(".server_#{response.id}")
		el.find('.loading').replaceWith $.tmpl('status', response)



