'use strict';
// All static element functionality (footer, aside, header) and pop up windows

// Url for fetching
const url = "https://localhost:8000";

// Static elements
const model = document.getElementById("popUp");
const aside = document.getElementsByClassName("sidebar")[0];
const header = document.getElementsByClassName("header")[0];
const footer = document.getElementsByClassName("footer")[0];

// Creates html for the pop up windows in the header
const createHeader = async () => {
    document.getElementById("login").addEventListener("click", () => {
        model.innerHTML =
            `
         <div class="modelContent">
            <form id="login-form" enctype="multipart/form-data">
                <h1>Existing user</h1>
                <span class="close">&times</span>
                <h3>Email</h3>
                <input type="email" name="username" required>
                <h3>Password</h3>
                <input type="password" name="password" id="passwordText" required>
                <input type="checkbox" onclick="showPassword()">Show password
                <input type="submit" value="Login" name="login">
                <p id="register"><strong>Not registered? Register here</strong></p>
            </form>
        </div>     
        `;
        model.style.display = "block";

        const loginForm = document.getElementById("login-form");
        // Submit listener for the form
        loginForm.addEventListener("submit", async (evt) => {
            evt.preventDefault();
            // Serialize data from the form
            try {
                const data = serializeJson(loginForm);
                const options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                };
                // Fetch
                const response = await fetch(url + '/auth/login', options);
                const result = await response.json();
                // Login fail
                if (!result.user) {
                    alert("Wrong username or password. Try again");
                // Login successful
                } else {
                    sessionStorage.setItem('token', result.token);
                    model.style.display = "none";
                    location.reload();
                }
            } catch (e) {
                console.log(e);
            }
        });
        close();
        // Html for the register form
        document.getElementById("register").addEventListener("click", () => {
            model.innerHTML =
                `
           <div class="modelContent">
                <form id="register-form" enctype="multipart/form-data">
                    <h1>New user</h1>
                    <span class="close">&times</span>
                    <h3>First name</h3>
                    <input type="text" name="firstname" required>
                    <h3>Last name</h3>
                    <input type="text" name="lastname" placeholder="optional" >
                    <h3>Email</h3>
                    <input type="email" name="email" required>
                    <h3>Username</h3>
                    <input type="text" name="username" required>
                    <h3>Password</h3>
                    <input type="password" name="password" id="passwordText" required>
                    <input type="checkbox" onclick="showPassword()">Show password
                    <h3>Profile picture</h3>
                    <input type="file" name="profile" required>
                    <input type="submit" value="Register" name="submit">
                </form>
            </div>
           `;
            const registerForm = document.getElementById("register-form");
            // Submit listener for the form
            registerForm.addEventListener("submit", async (evt) => {
                evt.preventDefault();
                // Serialize data from the form
                try {
                    const data = new FormData(registerForm);
                    const options = {
                        method: 'POST',
                        body: data,
                    };
                    // Fetch
                    const response = await fetch(url + "/auth/register", options);
                    model.style.display = "none";

                } catch (e) {
                    console.log(e);
                }
            });
            close();
        });
    });
};

// Logs the user out by removing token from the session storage
const logOut = async () => {
    // Gets the user token
    try {
        const options = {
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
            }
        };
        // Fetch
        const response = await fetch (url + "/auth/logout", options);
        const result = await response.json();
        // Removes token from the user
        sessionStorage.removeItem("token");
        // Redirects to the index view
        window.location.replace("index.html")
    } catch (e) {
        console.log(e);
    }
};

// Checks if the app user is logged in or not and creates corresponding html to the header
const checkToken = async () => {
    // Check that the user is logged in
    if (sessionStorage.getItem('token') != null) {
        try {
            // User token
            const options = {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                }
            };
            // Fetch
            const response = await fetch (url + "/user/profile", options);
            const result = await response.json();
            // Html when the user is logged in
            header.innerHTML =
                `
                <div>
                    <a id="logo" href="index.html"> <img src="img/logo.png" alt="Gizmo logo"> </a>
                </div>
                <div id="loginProfile">
                    <a id="picAndName" onclick="getProfile()">
                    <img src="${url + "/thumbnails/" + result.user_picture}" class="profPic" alt="user profile pic">
                    <h3>${result.user_name}</h3>
                    </a>
                    <img id="logOut" src="img/icons/logout.png" alt="Logout icon" onclick="logOut()">
                </div>
                `;
        } catch (e) {
            console.log(e);
        }
    } else {
        // Html when the user isn't logged in
        header.innerHTML =
            `
            <div>
                <a id="logo" href="index.html"><img src="img/logo.png" alt="Gizmo logo"></a>
            </div>
            <div id="login">
                <a id="loginImg"><img src="img/icons/profile.png" alt="login/register picture">Login/Register</a>
            </div>
        `;
        // Creates the popup functionality
        createHeader();
    }
};
// Checks user token
checkToken();

// Html for the pop up window displaying specific user with the id parameter
const showProfile = async (id) => {
    try {
        // Fetch
        const response = await fetch (url + "/user/" + id);
        const result = await response.json();
        // Html when the users bio is empty
        if (`${result.user_bio}` === "null") {
            model.innerHTML =
            `
            <div class="modelContent">
                <h1>${result.user_name}'s profile</h1>
                <span class="close">&times</span>
                <h3>@${result.user_name}</h3>
                <img src="${url + "/" + result.user_picture}">
                <div id="bioTextSmall">
                <h3>Bio</h3>
                <i>This bio is empty : (</i>
                </div>
            </div>
        `;
        } else {
        // Html when the users bio isn't empty
        model.innerHTML =
        `
        <div class="modelContent">
            <h1>${result.user_name}'s profile</h1>
            <span class="close">&times</span>
            <h3>@${result.user_name}</h3>
            <img src="${url + "/" + result.user_picture}">
            <div id="bioTextSmall">
            <h3>Bio</h3>
            <i>${result.user_bio}</i>
            </div>
        </div>
        `;
        }
        model.style.display = "block";
        close();
    } catch (e) {
        console.log(e);
    }
};

// Footer element html
footer.innerHTML =
    `
    <div id="names">
        <a>Developed by Niko Holopainen, Jalmari Espo, Enar Mariinsky</a>
    </div>
    <div id="footerLinks">
        <ul class="footerIcons">
            <li>
                <a href="https://github.com/Nikojoel/Gizmo"><img src="img/icons/github_logo.png" alt="GitHub"></a>
            </li>
            <li>
                <a href="https://nodejs.org/en/"><img src="img/icons/nodejs_logo.png" alt="Node-js"></a>
            </li>
            <li>
                <a href="https://httpd.apache.org/"><img src="img/icons/apache_logo.png" alt="Apache"></a>
            </li>
        </ul>
    </div>
    `;

// Aside element html
aside.innerHTML =
    `
    <div id="newPostBar">
        <p id="newPost"><img src="img/icons/new_post.png">New post</p>
    </div>
    <ul id="stickyList">
        <li id="search">
            <img src="img/icons/search.png">
            <form id="search-form" name="search" enctype="multipart/form-data">
                <input id="searchText" type="text" placeholder="Search..." required>
            </form>
        </li>
        <li id="home">
            <a href="index.html"><img src="img/icons/home.png"><h3>Home</h3></a>
        </li>
        <li id="profile">
            <a onclick="getProfile()" "><img src="img/icons/profile.png"><h3>Profile</h3></a>
        </li>
        <li id="votes">
            <a onclick="getVotes()"><img src="img/icons/votes.png"><h3>Votes</h3></a>
        </li>
        <li id="sort" onclick="showDropDown()">
            <a><img src="img/icons/sort.png"><h3>Sort</h3></a>
            <div class="hidden" id="dropDownContent">
                <a onclick="getMostVoted()">Most voted</a>
                <a onclick="getTrending()">Trending</a>
                <a onclick="getNew()">New</a>
          </div>
        </li>
    </ul>
    `;

const searchForm = document.getElementById("search-form");

// Submit listener for the post search
searchForm.addEventListener("submit",(evt) => {
    evt.preventDefault();
    const data = document.getElementById("searchText").value;
    getSearch(data);
});

// Listener for the new post element
document.getElementById("newPostBar").addEventListener("click", () => {
    // Check that the user is logged in
    if (sessionStorage.getItem('token') != null) {
        // Html for when the user is logged in
        model.innerHTML =
        `
        <div class="modelContent">
            <form id="post-form" enctype="multipart/form-data">
                <h1>New post</h1>
                <span class="close">&times</span>
                <h3>Title</h3>
                <input type="text" name="post_title" required>
                <h3>Text</h3>
                <input type="text" name="post_text" required>
                <h3>Picture</h3>
                <input type="file" name="post_file" required>
                <input type="submit" value="Post" id="postButton">
            </form>
        </div>
        `;
        const postForm = document.getElementById("post-form");
        // Submit listener for the form
        postForm.addEventListener("submit", async (evt) => {
            evt.preventDefault();
            try {
                // Form data
                const data = new FormData(postForm);
                const options = {
                    method: 'POST',
                    body: data,
                    headers: {
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                    }
                };
                // Fetch
                const response = await fetch (url + "/post", options);
                location.reload();
            } catch (e) {
                console.log(e);
                alert("Oops, something went wrong. Please try again");
            }
        });
    // Html for when the user isn't logged in
    } else {
        errorModel();
    }
    model.style.display = "block";
    close();
});

// Used for closing the pop up windows
function close() {
    document.getElementsByClassName("close")[0].addEventListener("click", () => {
        model.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === model) {
            model.style.display = "none";
        }
    });
}

// Html for editing user profile
function editProfile () {
    model.innerHTML =
        `
        <div class="modelContent">
            <form id="edit-form" enctype="multipart/form-data">
                <h1>Edit profile</h1>
                <span class="close">&times</span>
                <h3>Bio</h3>
                <input type="text" name="bio" required>
                <h3>Username</h3>
                <input type="text" name="username" required>
                <h3>Picture</h3>
                <input type="file" name="profile" required>
                <input type="submit" name="submit" value="Save">
            </form>
        </div>
        `;
    const editForm = document.getElementById("edit-form");

    // Submit listener
    editForm.addEventListener("submit", async (evt) => {
        evt.preventDefault();
        try {
            // Form data
            const data = new FormData(editForm);
            const options = {
                method: 'PUT',
                body: data,
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                }
            };
        // Fetch
        const response = await fetch (url + "/auth/update", options);
        location.reload();
        } catch (e) {
            console.log(e);
        }
    });
    model.style.display = "block";
    close();
}

// Used for a checkbox that displays password as normal text
function showPassword() {
    const pwText = document.getElementById("passwordText");
    if (pwText.type === "password") {
        pwText.type = "text";
    } else {
        pwText.type = "password";
    }
}

// Sort menu
function showDropDown() {
    document.getElementById("dropDownContent").classList.toggle("hidden");
}

// Displays error pop up when user is not authorized
function errorModel() {
    model.innerHTML =
    `
    <div class="modelContent">
        <span class="close">&times</span>
        <div class="errorPic">
            <img src="img/icons/down_face.png">
            <h3>Please login to use this feature</h3>
        </div>
    </div>
    `;
    model.style.display = "block";
    close();
}

// Displays trending posts (ordered by recent date and most voted)
function getTrending() {
    getPosts(url, "/post/search/trending");
}

// Displays new posts (ordered by recent date)
function getNew() {
    getPosts(url, "/post/search/new");
}

// Displays most voted posts (ordered by vote amount)
function getMostVoted() {
    getPosts(url, "/post/search/top");
}

// Displays posts that include any search data
function getSearch(searchData) {
    getPosts(url, "/post/search/" + searchData);
}