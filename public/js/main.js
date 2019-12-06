'use strict';
// All main app functionality (profile, votes, posts, post commenting, post voting)

// Static elements
const ul = document.querySelector('.main ul');
const main = document.getElementsByClassName("main")[0];

// Displays all posts that are found from the database, ordered by recent date as default
const getPosts = async (url, route) => {
    try {
        // Fetch
        const response = await fetch (url + route );
        const result = await response.json();
        console.log(result);
        main.innerHTML = "<ul></ul>";
        const posts = document.querySelector(".main ul");
        ul.innerHTML = "";
        // Html for main
        result.forEach(it => {
            posts.innerHTML +=
            `
            <li>
                <div>
                    <div id="thumbNail" onclick="getPost(${it.post_id})">
                        <img id="thumbNailImg" src="${url + "/thumbnails/" + it.post_file}">
                    </div>
                    <div id="postProfile" onclick="showProfile(${it.user_id})">
                        <img src="${url + "/" + it.user_picture}" class="profPic">
                        <div id="postDesc">
                            <h3 id="titleSize">${it.post_title}</h3>
                            <p id="userNameSize">by ${it.user_name}</p>
                        </div>
                    </div>
                    <p id="thumbNailVotes"><img src="img/icons/thumb_up.png" onclick="vote(${it.post_id}, 1)" width="26px" height="26px">${it.count_vote} UPvotes </p>
                    <p><img src="img/icons/comment.png" width="26px" height="26px">${it.count_comments} comments</p>  
                 </div>
            </li>
            `;
        });
    } catch (e) {
        console.log(e);
    }
};

// Gets all posts every time index is loaded
getPosts(url, "/post/search/new");

// Displays single post using the post id as a parameter
const getPost = async (id) => {
    try {
        // Fetch
        const response = await fetch (url + "/post/" + id);
        const result = await response.json();
        console.log(result);
        const postId = id;
        ul.innerHTML = "";
        // Html for single post view with the post comments
        main.innerHTML =
            `
            <div id="postContent">
                <img src="${url + "/" + result.post[0].user_picture}" class="profPic">
                <p>by ${result.post[0].user_name}</p>
                <h2>${result.post[0].post_title}</h2>
                    <div id="postPic">
                        <img src="${url + "/" + result.post[0].post_file}" width="100%">
                    </div>
                <p><strong>${result.post[0].post_text}</strong></p>
                <div id="postVotes">
                    <img src="img/icons/thumb_up.png" onclick="vote(${result.post[0].post_id}, 0);" <p>${result.post[0].count_vote}</p>
                    <img src="img/icons/comment.png"<p>${result.post[0].count_comments}</p>
                </div>
            
            <div id="postNoComments">
                <h1>Comments</h1>
                <form id="comment-form" enctype="multipart/form-data">
                    <input type="text" name="comment"required>
                    <input type="hidden" name="post_id" value="${postId}">
                    <input type="submit" value="Comment">
                </form>
            <ul id="comments">
                <!-- js creates all content here -->
            </ul>
            </div>
            </div>
            `;
        const commentUl = document.getElementById("comments");
        // All comments for the post
        result.commets.forEach(it => {
            commentUl.innerHTML +=
            `
            <li>
                <div>
                    <img src="${url + "/" + it.user_picture}" class="profPic" <p>${it.comment_text}</p>
                </div>
            </li>
            `;
        });

        // Commenting on a post

        const commentForm = document.getElementById("comment-form");
        // Submit listener
        commentForm.addEventListener("submit", async (evt) => {
           evt.preventDefault();
           try {
               // Check that the user is logged in
               if (sessionStorage.getItem('token') != null) {
                   // Form data
                   const data = serializeJson(commentForm);
                   // Fetch options including user token
                   const options = {
                       method: 'POST',
                       headers: {
                           'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                           'Content-Type': 'application/json'
                       },
                       body: JSON.stringify(data),
                   };
                   // Fetch
                   const response = await fetch (url + "/post/comment", options);
                   const result = await response.json();
                   console.log(result);
                   getPost(postId, 0);

               } else {
                // Error pop up if user isn't logged in
                errorModel();
               }
           } catch (e) {
               console.log(e);
           }
        });
    } catch (e) {
        console.log(e);
    }
};
// Gets the users voted posts
const getVotes = async () => {
    // Check that the user is logged in
    if (sessionStorage.getItem('token') != null) {
        try {
            // Fetch options including user token
            const options = {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                }
            };
            // Fetch
            const response = await fetch(url + "/post/liked", options);
            const result = await response.json();
            console.log(result);
            main.innerHTML =
                `
            <h1 id="voteHeader">Your votes</h1>
            <ul>
            
            </ul>
            `;
            // Html for votes
            const ul = document.querySelector(".main ul");
            result.forEach(it => {
                ul.innerHTML +=
                    `
            <li id="voteStyle">
                <div>
                    <img src="${url + "/" + it.post_file}" class="profPic" onclick="getPost(${it.post_id})">
                    <h3 id="yourVotesText">${it.post_title}</h3>
                    <img id="voteThumb" src="img/icons/thumb_up.png">
                </div>
            </li>
            `;
            });

        } catch (e) {
            console.log(e);
        }
    } else {
        // Error pop up if user isn't logged in
        errorModel();
    }
};

// Gets the user profile
const getProfile = async () => {
    // Check that the user is logged in
    if (sessionStorage.getItem('token') != null) {
        try {
            // Fetch options including user token
            const options = {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                }
            };
            // Fetch
            const response = await fetch(url + "/user/profile", options);
            const result = await response.json();
            console.log(result);
            // Html when users bio is empty
            if (`${result.user_bio}` === "null") {
                main.innerHTML =
                `
                <div id="profileContent">
                    <h1>${result.user_firstname}'s profile</h1>
                    <h3>@${result.user_name}</h3>
                    <h4>${result.user_firstname} ${result.user_lastname}</h4>
                    <img src="${url + "/" + result.user_picture}" width="20%" height="auto">
                    <h3>Bio</h3>
                    <i>Your bio is empty : (</i>
                    <input type="button" value="Edit profile" onclick="editProfile()">
                </div>
            `;
            // Html when the users bio isn't empty
            } else {
                main.innerHTML =
                `
               <div id="profileContent">
                    <h1>${result.user_firstname}'s profile</h1>
                    <div id="profileInfo">
                    <img src="${url + "/" + result.user_picture}" width="20%" height="auto">
                    <h3>@${result.user_name}</h3>
                    <h4>${result.user_firstname} ${result.user_lastname}</h4>
                    </div>
                    <div id="profileBio">
                    <h3>Bio</h3>
                    <i>${result.user_bio}</i>
                    </div>
                    <input type="button" value="Edit profile" onclick="editProfile()">
                </div>
            `;
            }
        } catch (e) {
            console.log(e);
        }
    } else {
        // Error pop up if user isn't logged in
        errorModel();
    }
};

// Adding votes to a post
const vote = async (id, status) => {
    // Check that the user is logged in
    if (sessionStorage.getItem('token') != null) {
        try {
            // Fetch options including user token and post id
            const options = {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({post_id: id}),
            };
            // Fetch
            const response = await fetch (url + "/post/vote", options);
            const result = await response.json();
            console.log(result);
            /* Vote status logic
               0, single post view
               1, main post view
            */
            if (status === 0) {
                // Reloads single post view
                getPost(id);
            } else if (status === 1) {
                // Reloads all posts view
                getPosts(url, "/post/search/new");
            }
        } catch (e) {
            console.log(e);
        }
    } else {
        // Error pop up if user isn't logged in
        errorModel();
    }
};













