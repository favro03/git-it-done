var issueContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning");
var repoNameEl = document.querySelector("#repo-name");


var getRepoName = function() {
    // grab repo name from url query string
    var queryString = document.location.search;
    var repoName = queryString.split("=")[1];

    if(repoName){
        //display repo name on the page
        repoNameEl.textContent = repoName;
        getRepoIssues(repoName);
    }
    else{
        //if no repo was given, redirect to the homepage
        document.location.replace("./index.html");
    }
};

var getRepoIssues = function(repo) {
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?directions=asc";
    fetch(apiUrl).then(function(response){
        //request was sucessful
        if(response.ok){
            response.json().then(function(data){
                displayIssues(data);

                //check if api has paginated issues
                if(response.headers.get("Link")){
                    displayWarning(repo);
                }
            });
        }
        else{
            document.location.replace("./index.html");
        }
    });
};

var displayIssues = function(issues) {
    if(issues.length === 0){
        issueContainerEl.textContent = "This repo has no open issues!";
        return;
    }
    for(var i = 0; i < issues.length; i++){
        //create a link element to take users to the issue on github
        var issuesEl = document.createElement("a");
        issuesEl.classList = "list-item flex-row justify-space-between align-center";
        issuesEl.setAttribute("href", issues[i].html_url);
        issuesEl.setAttribute("target", "_blank");

        //create span to hold issues title
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;
        
        //append to container
        issuesEl.appendChild(titleEl);

        //create a type element
        var typeEl = document.createElement("span");

        //check if issue is an actual issue or a pull request
        if(issues[i].pull_request){
            typeEl.textContent = "(Pull request)";
        }
        else {
            typeEl.textContent = "(Issue)";
        }
        //apend to container
        issuesEl.appendChild(typeEl);

        issueContainerEl.appendChild(issuesEl);
    }
};

var displayWarning = function(repo){
    //add text to warning container
    limitWarningEl.textContent = "To see more than 30 issues, visit ";
    var linkEl = document.createElement("a");
    linkEl.textContent = "See More Issues on GitHub.com";
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    linkEl.setAttribute("target", "_blank");

    //append to warning container
    limitWarningEl.appendChild(linkEl);
};
getRepoName();
//getRepoIssues();