function showMainPage() {
	document.getElementById('content').innerHTML = ''
	
	var mainClone=document.importNode (
		document.getElementById('main-template').content,
		true
	)
	mainClone.querySelector('.show-documents').addEventListener('click',
	function () {
		router.navigate('/documents')
	}
	)
	document.getElementById('content').appendChild(mainClone)
}