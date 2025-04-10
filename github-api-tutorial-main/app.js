// Get the GitHub username input form
const gitHubForm = document.getElementById('gitHubForm');

// Listen for submissions on GitHub username input form
gitHubForm.addEventListener('submit', (e) => {

    // Prevent default form submission action
    e.preventDefault();

    // Get the GitHub username input field on the DOM
    let usernameInput = document.getElementById('usernameInput');

    // Get the value of the GitHub username input field
    let gitHubUsername = usernameInput.value;

    // Run GitHub API function, passing in the GitHub username
    requestUserRepos(gitHubUsername)
        .then(response => response.json()) // parse response into json
        .then(data => {
            // update html with data from github
            for (let i in data) {
                // Get the ul with id of userRepos

                if (data.message === "Not Found") {
                    let ul = document.getElementById('userRepos');

                    // Create variable that will create li's to be added to ul
                    let li = document.createElement('li');

                    // Add Bootstrap list item class to each li
                    li.classList.add('list-group-item')
                    // Create the html markup for each li
                    li.innerHTML = (`
                <p><strong>No account exists with username:</strong> ${gitHubUsername}</p>`);
                    // Append each li to the ul
                    ul.appendChild(li);
                } else {

                    let ul = document.getElementById('userRepos');

                    // Create variable that will create li's to be added to ul
                    let li = document.createElement('li');

                    // Add Bootstrap list item class to each li
                    li.classList.add('list-group-item')

                    // Create the html markup for each li
                    li.innerHTML = (`
                <p><strong>Repo:</strong> ${data[i].name}</p>
                <p><strong>Description:</strong> ${data[i].description}</p>
                <p><strong>URL:</strong> <a href="${data[i].html_url}">${data[i].html_url}</a></p>
            `);

                    // Append each li to the ul
                    ul.appendChild(li);
                }
            }
        })
})

function requestUserRepos(username) {
    return Promise.resolve(fetch(`https://api.github.com/users/${username}/repos`));
}

const commitForm = document.getElementById('commitForm');

commitForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.getElementById('commitUsername').value;
    const repo = document.getElementById('commitRepo').value;

    const commitList = document.getElementById('commitList');
    commitList.innerHTML = '';

    fetch(`https://api.github.com/repos/${username}/${repo}/commits`)
        .then(res => {
            if (!res.ok) {
                throw new Error('Erro ao buscar commits');
            }
            return res.json();
        })
        .then(data => {
            if (data.length === 0) {
                commitList.innerHTML = `<li class="list-group-item">Nenhum commit encontrado.</li>`;
                return;
            }

            data.forEach(commit => {
                const li = document.createElement('li');
                li.classList.add('list-group-item');
                li.innerHTML = `
                    <p><strong>Mensagem:</strong> ${commit.commit.message}</p>
                    <p><strong>Data:</strong> ${new Date(commit.commit.author.date).toLocaleString()}</p>
                `;
                commitList.appendChild(li);
            });
        })
        .catch(error => {
            const li = document.createElement('li');
            li.classList.add('list-group-item', 'text-danger');
            li.textContent = `Erro: ${error.message}. Nome do usuário ou do repositório não encontrados.`;
            commitList.appendChild(li);
        });
});