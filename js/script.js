const container = document.querySelector('.grid-list');
const title = document.querySelector('.grid-list .title');
const salvar = document.querySelector('#salvar');
const gridLine = document.querySelector('.grid-line');

const containerForm = document.querySelector('.include-user');
const formUser =  document.querySelector('#form-user');
const newUser = document.querySelector('.new-user .qtda');
const newAdmin = document.querySelector('.new-admin .qtda');

//Exemplo de teste session
const tempClient = {
    nome: 'Joao',
    sexo: 'M',
    Data: '15/10/1999',
    pais: 'brasil',
    email: 'joao@gmail.com',
    senha: '1234998908090'
}

const getSessionStorage = () => JSON.parse(sessionStorage.getItem('cadastro')) ?? [];
const setSessionStorage = (dbclient) => sessionStorage.setItem('cadastro', JSON.stringify(dbclient)); 

//CREATE - ADICIONA DADOS NO SESSIONSTORAGE
const createClient = (client) => {
    const dbClient = getSessionStorage()
    dbClient.push(client);
    setSessionStorage(dbClient);
    qtdaUsers(dbClient);
}

//UPDATE - ATUALIZA DOS DADOS NO SESSIONSTORAGE
const updateClient = (index, client) => {
    const dbClient = getSessionStorage()
    dbClient[index] = client;
    setSessionStorage(dbClient);
}

//DELETE - DELETA OS DADOS DO SESSIONSTORAGE
const deleteClient = (index) => {
    const dbClient = getSessionStorage();
    dbClient.splice(index, 1);
    setSessionStorage(dbClient);
    empty();
}

const isValidFields = () => {
    const form = formUser;
    return form.reportValidity();
}



const saveRegister = (e) => {
    e.preventDefault();

    if( isValidFields() ){
        const client = {
            name: document.querySelector('#inputNome').value,
            gender: document.querySelector('[name="gender"]:checked').value,
            date: document.querySelector('#inputBirth').value,
            country: document.querySelector('#inputCountry').value,
            email: document.querySelector('#inputEmail').value,
            password: document.querySelector('#inputPassword').value,
            photo: document.querySelector('#inputFile').value,
            url: document.querySelector('#inputFile').value,
            admin: document.querySelector('#ck').checked
        }

        //Criptografa a senha
        let senhaCriptografada = criptografarSenha(client.password);
        client.password = senhaCriptografada;

        //Admin chegado sim ou não
        client.admin == false ? client.admin = 'Não' : client.admin = 'Sim';
        
        const index = document.querySelector('#inputNome').dataset.index;

        const inputFile = document.querySelector('#inputFile');
        const imagemExibicao = document.querySelector('#imagemExibicao').src;
    
        const file = inputFile.files[0];
        debugger
        if( document.querySelector('#inputFile').value == '' && document.querySelector('#imagemExibicao').src == '' ){
            client.photo = './images/default.jpg'
        }else{
            if( file ){
                let urlImg = URL.createObjectURL(file)
                client.photo = urlImg;
                document.querySelector('#imagemExibicao').removeAttribute('src');
                document.querySelector('#imagemExibicao').classList.add('hide');
                
            }else{
                client.photo = imagemExibicao;
                document.querySelector('#imagemExibicao').removeAttribute('src');
                document.querySelector('#imagemExibicao').classList.add('hide');
               
            }
        }
        
        if( index == 'new' ){
            Swal.fire({
                title: 'Cadastro Concluído!',
                html: `O cadastro <strong><u>${client.name}</u></strong> foi adicionado com sucesso!`,
                icon: 'success',
                showCancelButton: true,
                confirmButtonColor: '#00a65a'
            }).then(() => {
                createClient(client);                 
                updateDados();
                qtdaUsers();
                title.classList.add('hide');
                validateDate();
                showRegisters();
            });
        }else{
            updateClient(index, client);
            updateDados();
            qtdaUsers();
            containerForm.classList.remove('editar');
            validateDate();
            showRegisters();
        }
        document.querySelector('#inputNome').setAttribute('data-index', 'new');
        formUser.reset();
    }    
}

salvar.addEventListener('click', saveRegister);

//MONTA O HTML COM OS DADOS PREENCHIDOS
const createRow = (client, index) => {
    const newLi = document.createElement('li');
    newLi.classList.add('line');

    newLi.innerHTML = `
        <span class="img"><img src="${client.photo}" /></span>
        <span class="name">${client.name}</span>  
        <span class="email">${client.email}</span>
        <span class="ck-admin">${client.admin}</span>
        <span class="data">${client.date.split('-').reverse().join('/')}</span>
        <span class="btns">
            <button type="button" class="btn-user btn-editar" data-id="edit-${index}">Editar</button>
            <button type="button" class="btn-user btn-excluir" data-id="del-${index}">Excluir</button>
        </span>
    `;
    gridLine.appendChild(newLi);
 
    
}

//LIMPA O HTML ANTES DE INCLUIR UMA NOVA LINHA
const clearRow = () => {
    const rows = document.querySelectorAll('.line');
    rows.forEach( row => {
        row.parentNode.removeChild(row);
    });
}

//FUNÇÃO QUE ATUALIZA A TELA DE CADASTRO
const updateDados = () => {
    const dbClient = getSessionStorage();
    clearRow();
    dbClient.forEach(createRow);
}

const editFields = (client) => {
    document.querySelector('#inputNome').value = client.name;
    client.gender == "M" ? document.querySelector('#inputGeneroM').checked = true : document.querySelector('#inputGeneroF').checked = true    
    document.querySelector('#inputBirth').value = client.date;
    document.querySelector('#inputCountry').value = client.country;
    document.querySelector('#inputEmail').value = client.email;
    document.querySelector('#inputPassword').value = client.password;
    document.querySelector('#imagemExibicao').classList.remove('hide');
    let img = client.photo;
    document.querySelector('#imagemExibicao').src = img;
    var imagemExibicao = document.getElementById('imagemExibicao');
    let newImg = imagemExibicao.src;
    client.photo = newImg;
    if( client.admin == 'on' ){
        client.admin = 'Sim'
    }
    client.admin == 'Sim' ? document.querySelector('#ck').checked = true : document.querySelector('#ck').checked = false;
    document.querySelector('#inputNome').dataset.index = client.index;
}

const editClient = (index) => {
    const dbClient = getSessionStorage()[index]
    dbClient.index = index;    
    editFields(dbClient);  
}

//EDITAR E DELETAR CADASTRO
const editDelet = (e) => {
    
    if( e.target.type == 'button' ){
        const [action, index] = e.target.dataset.id.split('-');

        if( action == 'edit' ){
            containerForm.classList.add('editar');
            editClient(index);
        }else{            
            const client = getSessionStorage()[index]
            Swal.fire({
                title: 'Excluir cadastro?',
                html: `Você excluirá o cadastro <strong><u>${client.name}</u></strong>!`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#08b3dd',
                cancelButtonColor: '#333',
                confirmButtonText: 'Sim, deletar!'
                }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        icon: 'success',
                        title: "Deletado",
                        text: 'Seu cadastro foi deletado com sucesso!'
                    }).then( () => {
                        deleteClient(index);
                        updateDados();
                        qtdaUsers();
                        empty();
                        validateDate();
                        showRegisters();
                    });  
                } 
            });
        }
    }
}

container.addEventListener('click', editDelet);

updateDados();

const empty = () =>{  
    if( gridLine.innerHTML == '' ){
        title.classList.remove('hide');
    }else{
        title.classList.add('hide');
        containerForm.classList.remove('editar');
        formUser.reset();
    }
}

empty();

const qtdaUsers = () => {

    newUser.textContent = '0';
    newAdmin.textContent = '0';

    let qtdaTotalUser = 0;
    let qtdaTotalAdmin = 0;

    if( gridLine.innerHTML != '' ){
        const listsUsers = gridLine.querySelectorAll('.line');

        listsUsers.forEach( list => {
            
            const users = list.querySelectorAll('.ck-admin');

            users.forEach( admin => {
                if( admin.textContent == 'Sim' ){
                    qtdaTotalAdmin += 1;
                    newAdmin.textContent = qtdaTotalAdmin;
                }else{
                    qtdaTotalUser += 1;
                    newUser.textContent = qtdaTotalUser;
                }
            });

        });
    }
}

qtdaUsers();

const criptografarSenha = (senha) => {
    let senhaCriptografada = btoa(senha);
    return senhaCriptografada;
}

const validateDate = () => {
    
    const lists = gridLine.querySelectorAll('li');
    const date = new Date();
    const dateActual = date.toLocaleDateString();

    const formatData = dateActual.split('/');
    const diaActual = parseInt(formatData[0]);
    const mesActual = parseInt(formatData[1]);
    const anoActual = parseInt(formatData[2]);

    lists.forEach( list => {
        const elDate = list.querySelector('.data');
        const date = elDate.textContent;

        const datePartes = date.split('/');
        const dia = parseInt(datePartes[0]);
        const mes = parseInt(datePartes[1]);
        const ano = parseInt(datePartes[2]);

        if( diaActual == dia && mesActual == mes ){
            const newSpan = document.createElement('span');
            newSpan.classList.add('aniversario');

            list.appendChild(newSpan);

            let year = anoActual - ano;

            newSpan.setAttribute('data-year', year);
            newSpan.addEventListener('click', modalAnivesariante);
        }
    })
}

const modalAnivesariante = (e) => {
    const element = e.target;
    const elName = element.parentNode;
    const idade = parseInt(element.getAttribute('data-year'));
    const name = elName.querySelector('.name').textContent;
    
    Swal.fire({
        title: 'Hoje é seu dia!!!',
        html: `Meus parabéns <strong>${name}</strong> pelos seus <strong>${idade}</strong> anos, Feliz Aniversário!!!`,
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#08b3dd'
    });
}

validateDate();


const cadastrosPorPagina = 3;
let paginaAtual = 1;

const showRegisters = () => {

    const element = gridLine.querySelectorAll('.line');
    
    for( let i = 0; i < element.length; i++ ){       
        element[i].style.display = 'none';
    }
    
    const inicio = ( paginaAtual - 1 ) * cadastrosPorPagina;
    const fim = inicio + cadastrosPorPagina;

    for( let i = inicio; i < fim && i < element.length; i++ ){
        element[i].style.display = 'flex';
    }


    actualizeRegister(element)

}

const actualizeRegister = (element) => {
    const htmlPagination = document.querySelector('.container-bullets');
    
    htmlPagination.innerHTML = '';

    const totalPage = Math.ceil(element.length / cadastrosPorPagina);

    for( let i = 1; i <= totalPage; i++ ){
        const li = document.createElement('li');
        li.classList.add('list-page');
        li.textContent = i;
        li.addEventListener('click', () => changePage(i));
        htmlPagination.appendChild(li)
    }
    
    const pagination = htmlPagination.querySelectorAll('.list-page');
}

const changePage = (pagina) => {
    paginaAtual = pagina
    showRegisters();
}

showRegisters();