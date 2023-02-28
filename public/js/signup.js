async function signup() {
    let result;
    await Swal.fire({
        title: 'Sign-up Form',
        html: `<form id="form"><input type="text" id="email" class="swal2-input" name="email" placeholder="Email address" value="123@gmail.com">
        <input type="password" id="password" class="swal2-input" name="password" placeholder="Password" value="123">
        <input type="username" id="username" class="swal2-input" name="username" placeholder="Username" value="123">
        <input type="file" name="image" value="hi" id="image"/>
        </form>
        `,
        confirmButtonText: 'Sign up',
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: async () => {
            const email = Swal.getPopup().querySelector('#email').value
            const password = Swal.getPopup().querySelector('#password').value
            const username = Swal.getPopup().querySelector('#username').value
            if (!email || !password || !username) {
                Swal.showValidationMessage(`Please enter email, password and username`)
            }
            let emailResult = (validateEmail(email))
            if (emailResult === false) {
                Swal.showValidationMessage(`Invalid email`)
                return
            }

            const formData = Swal.getPopup().querySelector('#form')
            if (email && password && username) {
                console.log(formData);
                result = new FormData(formData)
                console.log(result);
                let res = await fetch('/signup', {
                    method: 'POST',
                    body: result
                })
                let data = await res.json()
                if (data.message === 'OK') {
                    showUserNav()
                    Swal.fire(`
                            email: ${email}
                            註冊成功
                            `.trim())
                } else if (data.message === 'email registered') {
                    Swal.fire(`
                    email: ${email}
                    已被註冊
                    `.trim())
                } else if (data.message === 'username registered') {
                    Swal.fire(`
                    username: ${username}
                    已被註冊
                    `.trim())
                }
            }
        }
    })
}

function validateEmail(email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return true
    }
    return false
}