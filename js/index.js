var userId = null
var router = new Navigo(null, true)
router.on('/', showMainPage)
router.on('/newStorage', showNewStoragePage)
router.on('/newDocument', showNewDocumentPage)
router.on('/documents', showDocumentsPage)

firebase.auth().onAuthStateChanged(onAuth);
var ui = new firebaseui.auth.AuthUI(firebase.auth())
startAuth()

function startAuth(){
	ui.start(document.getElementById('auth-ui'), {
		signInOptions: [
			firebase.auth.GoogleAuthProvider.PROVIDER_ID,
			firebase.auth.EmailAuthProvider.PROVIDER_ID
		],
		signInSuccessUrl: 'http://' + location.hostname + ''
	})
}		

function onAuth (user) {
	if (user !== null) {
		userId = user.uid
		document.getElementById('login-name').innerText=user.displayName
		document.getElementById('login').setAttribute('style', 'display:none')
		document.getElementById('logout').setAttribute('style', '')
		document.getElementById('auth-ui').setAttribute('style', 'display:none')
		router.resolve()
	} else {
		userId = null
		document.getElementById('login-name').innerText=''
		document.getElementById('login').setAttribute('style', '')
		document.getElementById('logout').setAttribute('style', 'display:none')
	}
	
}

document.getElementById('login').addEventListener('click', startAuth)

document.getElementById('logout').addEventListener('click', onLogout)

function onLogout() {
	firebase.auth().signOut()
	document.getElementById('add-storage').setAttribute('style', 'display:none')
	document.getElementById('add-doc').setAttribute('style', 'display:none')
	document.getElementById('content').innerHTML = ''
	document.getElementById('auth-ui').setAttribute('style', '')
	startAuth()
}
