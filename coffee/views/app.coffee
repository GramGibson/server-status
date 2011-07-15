$ ->
	# open a new websockets connection
	socket = io.connect 'http://localhost:8888/'

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
	
	updateStatus = (response) ->
		# replace loading icon with status
		el = $(".server_#{response.id}")
		el.find('.loading').replaceWith $.tmpl('status', response)



