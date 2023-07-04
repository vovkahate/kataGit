class View {
    constructor(){
        document.title = 'Задача 4.3.7';

        this.app = document.querySelector('.app');

        this.title = this.createElement('h1', 'title');
        this.title.textContent = 'Github repo search 4.3.7';
        
        this.searchLine = this.createElement('div', 'search-line');
        this.searchInput = this.createElement('input', 'search-input');
        this.searchCounter = this.createElement('div', 'counter');

        this.searchCounter.textContent = 'начните вводить название репозитория';
        this.searchLine.append(this.searchCounter);
        this.searchLine.append(this.searchInput);
        
        this.autocomplete = this.createElement('div', 'autocomplete');   
        this.usersWrapper = this.createElement('div', 'users-wrapper');
        this.usersList = this.createElement('ul', 'users');
        this.usersWrapper.append(this.usersList);
        this.autocomplete.append(this.usersWrapper);

        this.bookmarks = this.createElement('div', 'bookmarks');
        
        
        this.app.append(this.title);
        this.app.append(this.searchLine);
        this.app.append(this.autocomplete);
        this.app.append(this.bookmarks);
    

    }

    createElement(elementTag, elementClass){
        const element = document.createElement(elementTag);
        if (elementClass){
            element.classList.add(elementClass);
        }
        return element;
    }

    createUser(userData){
        const userElement = this.createElement('li', 'user-prev');
        userElement.textContent = `${userData.name}`;
        this.usersList.append(userElement);

        userElement.addEventListener('click', ()=> {
            this.addRepoData(userData.name , userData.owner.login, userData.stargazers_count);


        });
    }

    addRepoData(name, owner, stars){
        console.log(name, owner, stars);
        this.usersList.innerHTML = '';
        this.searchCounter.textContent = 'начните вводить название репозитория';
        this.searchInput.value = '';

        this.repo = this.createElement('div', 'repo');
        this.cross = this.createElement('div', 'cross');
        this.repolist = this.createElement('ul', 'repo-list');

        this.rname = this.createElement('li');
        this.rname.textContent =`Name: ${name}`;
        this.rowner = this.createElement('li');
        this.rowner.textContent = `Owner: ${owner}`;
        this.rstar = this.createElement('li');
        this.rstar.textContent = `Stars: ${stars}`;

        this.repolist.append(this.rname);
        this.repolist.append(this.rowner);
        this.repolist.append(this.rstar);
        this.repo.append(this.repolist);
        this.repo.append(this.cross); 

        this.cross.addEventListener('click', (e)=> {
            e.target.parentElement.remove();
        })

        this.bookmarks.append(this.repo);

        
    }

    setCounterMessage(message){
        this.searchCounter.textContent = message;
    }
}

class Search {
    constructor(view){
        this.view = view;
        this.view.searchInput.addEventListener('keyup', this.debounce(this.searchUsers.bind(this), 1500));
    }

    async searchUsers(){
        this.clearUsers();
        this.view.setCounterMessage('');

        if (this.view.searchInput.value[this.view.searchInput.value.length-1]===' '){
        this.view.setCounterMessage('название не должно начинаться с пробела');
            this.view.searchInput.value = '';
        }

        else if (this.view.searchInput.value.trim()) {
            return await fetch(`https://api.github.com/search/repositories?q=${this.view.searchInput.value.trim()}&per_page=5`)
            .then((response) => {
                if (response.ok){
                    response.json().then((data) => {
                        if (data.total_count)
                        this.view.setCounterMessage(`Найдено ${data.total_count} репозиториев`);
                        else this.view.setCounterMessage('Ничего не найдено');
                        data.items.forEach(user => this.view.createUser(user));                   
                    })
                } 
            })

        
        } else this.clearUsers();

    }
    clearUsers() {
        this.view.usersList.innerHTML = '';
        this.view.searchCounter.textContent = 'начните вводить название репозитория';
    }

    debounce (func, wait) {
        let timeout;
        return function () {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                func.apply(context, args);
            }, wait);
        }; 
    }
}




new Search(new View());