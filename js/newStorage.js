function showNewStoragePage() {
	document.getElementById('content').innerHTML = ''
	document.getElementById('message').innerText =''
	document.getElementById('loader').setAttribute('style','display: block'	)
	
	document.getElementById('add-storage').setAttribute('style', 'display:none')
	document.getElementById('add-doc').setAttribute('style', 'display:none')
	
	var returnButton=document.createElement('button')
	returnButton.innerText = 'Вернуться к документам'
	returnButton.id='returnButton'
	returnButton.addEventListener('click', function() {
		router.navigate('/documents')
	})
	document.getElementById('content').appendChild(returnButton)
	
	var addStorageButton=document.createElement('button')
	addStorageButton.innerText = 'Добавить место хранения'
	addStorageButton.addEventListener('click', onStorageAdd)
	document.getElementById('content').appendChild(addStorageButton)
	
	var storageList = document.createElement('div')
	storageList.setAttribute('id', 'storages-list')
	document.getElementById('content').appendChild(storageList)
	
	firebase.database().ref(
		'users/' + userId + '/storages'
	).on('value', onStorageLoad)
}

function onStorageAdd() {
	var newStorage=firebase.database().ref('users/' + userId + '/storages').push()
	var key=newStorage.key
	createStorageInForm(key, {title:''})	
}

function onStorageLoad(snapshot) {
	var storages=snapshot.val()
	document.getElementById('storages-list').innerHTML = ''
	document.getElementById('loader').setAttribute(
		'style',
		'display:none'
	)
	snapshot.forEach(function (snapshot) {
		var storage = snapshot.val()
		var key = snapshot.key
		createStorageInForm(key, storage)
	})
}

function createStorageInForm(key,storage) {
	var storageClone=document.importNode (
		document.getElementById('storage-template').content,
		true
	)
	storageClone.children[0].setAttribute('id',key)
	storageClone.querySelector('.storage-title').value = storage.title
	storageClone.querySelector('.storage-save').addEventListener(
		'click',
		function() {
			document.getElementById('message').innerText =''
			firebase.database().ref ('users/'+userId+'/storages/'+key).update({
				title: document.querySelector('#'+key+' .storage-title').value
			})
			document.getElementById('loader').setAttribute(
			'style',
			'display: block'
			)
			onSaveComplete()
		}
	)
	storageClone.querySelector('.storage-delete').addEventListener(
		'click',
		function() {
			firebase.database().ref ('users/'+userId+'/storages/'+key).remove()
		}
	)
	document.getElementById('storages-list').appendChild(storageClone)
	
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
