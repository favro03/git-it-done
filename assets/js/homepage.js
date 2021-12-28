var getUsersRepos = function() {
    fetch("https://api.github.com/users/octocat/repos");
};

getUsersRepos();