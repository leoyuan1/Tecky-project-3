

const logInFormElm = document.querySelector('.login-btn')
const logOutElm = document.querySelector('#logout-btn')
const carouselLoginElm = document.querySelector('.carousel-loginBtn')

logInFormElm.addEventListener('click', () => {
    login()
})

if (carouselLoginElm) {
    carouselLoginElm.addEventListener('click', () => {
        login()
    })
}
async function showUserNav() {
    let res = await fetch('/session')
    let result = await res.json()
    if (result.message === 'isUser') {
        document.getElementById("user-panel").style.display = "none";
        document.getElementById("dropdown").style.display = "inline-block";
        document.getElementById('dropdown-toggle').innerHTML = `Welcome ${result.user.username}！`;
    } else if (result.message === 'no session data') {
        return
    }
}
async function login() {
    let result;
    await Swal.fire({
        title: 'Login Form',
        html: `<input type="text" id="email" class="swal2-input" placeholder="Email address" value="123@gmail.com">
            <input type="password" id="password" class="swal2-input" placeholder="Password" value="123">
            `,
        footer: `<a href="/connect/google" class="btn btn-success">Sign in With Google</a>
                <div type="button" class="btn signup-btn" onclick='signup()'>Sign Up Here</div>
            `,
        confirmButtonText: 'Sign in',
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: async () => {
            const email = Swal.getPopup().querySelector('#email').value
            const password = Swal.getPopup().querySelector('#password').value
            if (!email || !password) {
                Swal.showValidationMessage(`Please enter email and password`)
                return
            }
            result = { userEmail: email, password: password }
            let res = await fetch('/login', {
                method: 'post',
                body: JSON.stringify(result),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            let data = await res.json()
            if (data.message === "email not register") {
                await Swal.fire(`
                    email: ${result.userEmail}
                    未註冊
                    `.trim())
            } else if (data.message === "Invalid password") {
                await Swal.fire(`
                    password 錯誤
                    `.trim())
            } else if (data.message === "correct") {
                await Swal.fire(`
                    登入成功
                    `.trim())
                showUserNav()
            }
        }
    })
}

function init() {
    showUserNav()
}
init()

document.querySelector('.logout').addEventListener('click', async () => {
    let res = await fetch('/logout')
    let data = await res.json()
    if (data.message == 'logout') {
        // location.reload('/')
        window.location.href = '/';
    }
})