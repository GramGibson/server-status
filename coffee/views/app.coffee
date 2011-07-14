$ ->
	# open a new websockets connection
	socket = io.connect 'http://localhost:8888/'

	# enable fancy scrolling
	scroller = new iScroll 'wrapper'
	
	# refresh scroller
	refreshScroller = (ms, func) -> setTimeout scroller.refresh(), 0

	# row template
	template_table_row = """
		<div class="row">
			<div class="row_cell" style="width: 90%;">
				<h3>${name}</h3>
				<div style="color: #999;">${ip}</div>
			</div>
			<div class="row_cell status ${status}">${status}</div>
		</div>
	"""
		
	# compile + cache template
	$.template("table_row", template_table_row)

	# listen for websocket responses
	socket.on 'response', (response) ->
		# append server statuses as they come in + refresh the scroller
		$('#content').append $.tmpl('table_row', response)
		refreshScroller()