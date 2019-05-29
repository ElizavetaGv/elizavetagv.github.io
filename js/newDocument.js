function showNewDocumentPage() {
	document.getElementById('content').innerHTML = ''
	document.getElementById('message').innerText =''
	
	document.getElementById('add-storage').setAttribute('style', 'display:none')
	document.getElementById('add-doc').setAttribute('style', 'display:none')
	
	var newDocument=firebase.database().ref('users/' + userId + '/documents').push()
	var key=newDocument.key
	createNewDocumentInForm(key, {title:'',date:moment().format('YYYY-MM-DD'),storage:''})
}

function createNewDocumentInForm(key,newDocument) {
	firebase.database().ref('users/'+userId+'/storages/').once('value', function storagesOptionsLoad(snapshot){
		var documentClone=document.importNode (
		document.getElementById('newDocument-template').content,
		true
	)
	documentClone.querySelector('.document-save').setAttribute('style', 'display:none')
	documentClone.querySelector('.document-delete').setAttribute('style', 'display:none')
	documentClone.querySelector('.document-add').setAttribute('style', 'display:block')
	documentClone.children[0].setAttribute('id',key)
	documentClone.querySelector('.document-title').value = newDocument.title
	documentClone.querySelector('.document-date').value = newDocument.date
	
	documentClone.querySelector('.document-add').addEventListener(
		'click',
		function() {
			var storageSelectEl=document.querySelector('.document-storage')
			var storage=storageSelectEl.options[storageSelectEl.selectedIndex].value
			firebase.database().ref('users/'+userId+'/documents/'+key).update({
				title:document.querySelector('#'+key+' .document-title').value,
				date:document.querySelector('#'+key+' .document-date').value,
				storage:storage
			})
			
			router.navigate('/documents')
		}
	)
		
	snapshot.forEach(function(storage){
		var optionEl=document.createElement('option')
		optionEl.setAttribute('value',storage.key)
		optionEl.innerText=storage.val().title
		if (storage.key==newDocument.storage){
			optionEl.setAttribute('selected','selected')
		} 
		documentClone.querySelector('.document-storage').appendChild(optionEl)
	})
	document.getElementById('content').appendChild(documentClone)
	})
}
