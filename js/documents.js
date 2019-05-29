function showDocumentsPage() {
	document.getElementById('content').innerHTML = ''
	document.getElementById('message').innerText =''
	document.getElementById('loader').setAttribute('style','display: block')
	
	document.getElementById('add-storage').setAttribute('style','display:block')
	document.getElementById('add-doc').setAttribute('style','display:block')
	document.getElementById('add-storage').addEventListener('click',goToNewStoragePage)
	
	function goToNewStoragePage() {
		router.navigate('/newStorage')
	}
	document.getElementById('add-doc').addEventListener('click',goToNewDocumentPage)
	
	function goToNewDocumentPage() {
		router.navigate('/newDocument')
	}
	
	var documentsList = document.createElement('div')
	documentsList.setAttribute('id', 'documents-list')
	document.getElementById('content').appendChild(documentsList)
	
	firebase.database().ref(
		'users/' + userId + '/documents'
	).once('value', onDocumentsLoad)
}

function onDocumentsLoad (snapshot) {
	var documents = snapshot.val()
	document.getElementById('documents-list').innerHTML = ''
	document.getElementById('loader').setAttribute('style','display:none')
	
	snapshot.forEach(function (snapshot) {
		var doc = snapshot.val()
		var key = snapshot.key
		createDocumentInForm(key, doc)
	})
}

function createDocumentInForm (key, doc) {
	firebase.database().ref('users/'+userId+'/storages/').once('value', function storagesOptionsLoad(snapshot){
		var documentClone=document.importNode (
			document.getElementById('newDocument-template').content,
			true
		)
	documentClone.children[0].setAttribute('id',key)
	documentClone.querySelector('.document-title').value = doc.title
	documentClone.querySelector('.document-date').value = doc.date
	
	documentClone.querySelector('.document-save').addEventListener(
		'click',
		function() {
			var storageSelectEl=document.querySelector('.document-storage')
			var storage=storageSelectEl.options[storageSelectEl.selectedIndex].value
			firebase.database().ref ('users/'+userId+'/documents/'+key).update({
				title: document.querySelector('#'+key+' .document-title').value,
				date: document.querySelector('#'+key+' .document-date').value,
				storage: document.querySelector('#'+key+' .document-storage').value
			})
			
			document.getElementById('loader').setAttribute('style','display: block'	)
			onSaveComplete()
		}
	)	
		
	documentClone.querySelector('.document-delete').addEventListener(
		'click',
		function() {
			firebase.database().ref ('users/'+userId+'/documents/'+key).remove()
			showDocumentsPage()
		}
	)
		snapshot.forEach(function(storage){
		var optionEl=document.createElement('option')
		optionEl.setAttribute('value',storage.key)
		optionEl.innerText=storage.val().title
		if (storage.key==doc.storage){
			optionEl.setAttribute('selected','selected')
		} 
		documentClone.querySelector('.document-storage').appendChild(optionEl)
	})
	document.getElementById('content').appendChild(documentClone)
	})
}

function onSaveComplete(err) {
	if (err) {
		document.getElementById('message').innerText = 'Ошибка при сохранении'
	} else {
		document.getElementById('message').innerText = 'Изменения сохранены!'
	}
	document.getElementById('loader').setAttribute(
		'style',
		'display:none'
	)
}
