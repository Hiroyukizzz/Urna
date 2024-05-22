/* Variáveis de controle de interface */
let seuVotoPara = document.querySelector('.info-voto-titulo span'); // Elemento que exibe "Seu voto para"
let cargo = document.querySelector('.info-voto-cargo'); // Elemento que exibe o cargo (presidente, prefeito, etc)
let descricao = document.querySelector('.info-voto-detalhes'); // Elemento que exibe a descrição do candidato (nome, partido, etc)
let aviso = document.querySelector('.instrucoes'); // Elemento que exibe instruções ou avisos
let lateral = document.querySelector('.info-imagem'); // Elemento que exibe imagens do candidato
let numeros = document.querySelector('.info-voto-numeros'); // Elemento que exibe os números digitados

/* Variáveis de controle de ambiente */
let etapaAtual = 0; // Índice da etapa atual
let numero = ''; // Armazena o número digitado
let votoBranco = false; // Indica se o voto é em branco
let votos = []; // Lista para armazenar os votos

function comecarEtapa() {
    let etapa = etapas[etapaAtual]; // Seleciona a etapa atual
    let numeroHtml = '';
    numero = ''; // Reseta o número digitado
    votoBranco = false; // Reseta o voto em branco

    // Cria os campos para os dígitos dos números
    for (let i = 0; i < etapa.numeros; i++) {
        if (i === 0) {
            numeroHtml += '<div class="numero pisca"></div>'; // Primeiro campo piscando
        } else {
            numeroHtml += '<div class="numero"></div>'; // Outros campos
        }
    }

    seuVotoPara.style.display = 'none'; // Esconde "Seu voto para"
    cargo.innerHTML = etapa.titulo; // Exibe o título do cargo
    descricao.innerHTML = ''; // Limpa a descrição
    aviso.style.display = 'none'; // Esconde avisos
    lateral.innerHTML = ''; // Limpa imagens
    numeros.innerHTML = numeroHtml; // Exibe os campos dos números
}

/* Funções */
function atualizaInterface() {
    let etapa = etapas[etapaAtual]; // Seleciona a etapa atual
    let candidato = etapa.candidatos.filter((item) => item.numero === numero); // Encontra o candidato pelo número

    // Exibe no console o candidato encontrado (apenas para depuração)
    console.log("Candidato: ", candidato);

    if (candidato.length > 0) {
        candidato = candidato[0]; // Seleciona o primeiro candidato encontrado
        seuVotoPara.style.display = 'block'; // Exibe "Seu voto para"
        aviso.style.display = 'block'; // Exibe o aviso
        descricao.innerHTML = `Nome: ${candidato.nome}<br/>Partido: ${candidato.partido}`; // Exibe detalhes do candidato

        // Cria o HTML para exibir as fotos do candidato
        let fotosHtml = '';
        for (let i in candidato.fotos) {
            if (candidato.fotos[i].small) {
                fotosHtml += `<div class="info-imagem small"><img src="images/${candidato.fotos[i].url}" alt=""/>${candidato.fotos[i].legenda}</div>`;
            } else {
                fotosHtml += `<div class="info-imagem"><img src="images/${candidato.fotos[i].url}" alt=""/>${candidato.fotos[i].legenda}</div>`;
            }
        }

        lateral.innerHTML = fotosHtml; // Exibe as fotos do candidato
    } else {
        seuVotoPara.style.display = 'block'; // Exibe "Seu voto para"
        aviso.style.display = 'block'; // Exibe o aviso
        descricao.innerHTML = '<div class="aviso--grande pisca">VOTO NULO</div>'; // Exibe aviso de voto nulo
    }
}

function clicou(n) {
    let somNumeros = new Audio()
    somNumeros.src = "/audio/audio.mp3"
somNumeros.play();

    let elNumero = document.querySelector('.numero.pisca'); // Seleciona o campo que está piscando
    if (elNumero !== null) {
        elNumero.innerHTML = n; // Preenche o campo com o número clicado
        numero += n; // Adiciona o número à variável global

        elNumero.classList.remove('pisca'); // Remove o pisca do campo atual
        if (elNumero.nextElementSibling !== null) {
            elNumero.nextElementSibling.classList.add('pisca'); // Faz o próximo campo piscar
        } else {
            atualizaInterface(); // Atualiza a interface se não houver próximo campo
        }
    }
}

function branco() {
    if (numero === '') { // Verifica se nenhum número foi digitado
        votoBranco = true; // Define o voto como em branco
        seuVotoPara.style.display = 'block'; // Exibe "Seu voto para"
        aviso.style.display = 'block'; // Exibe aviso de voto em branco
        descricao.innerHTML = '<div class="aviso--grande pisca">VOTO EM BRANCO</div>'; // Exibe mensagem de voto em branco
        numeros.innerHTML = ''; // Limpa os campos de números
        lateral.innerHTML = ''; // Limpa as imagens
    } else {
        alert("Para votar em BRANCO, não pode digitar nenhum número"); // Alerta se números já foram digitados
    }
}

function corrige() {
    comecarEtapa(); // Reinicia a etapa atual
}

function confirma() {
    let etapa = etapas[etapaAtual]; // Seleciona a etapa atual
    let votoConfirmado = false; // Inicializa a variável de confirmação do voto

    if (votoBranco) { // Verifica se o voto é em branco
        votoConfirmado = true; // Confirma o voto
        votos.push({ etapa: etapa.titulo, voto: 'branco' }); // Adiciona o voto em branco à lista de votos
        console.log("Confirmando como BRANCO..."); // Log de confirmação
    } else if (numero.length === etapa.numeros) { // Verifica se o número digitado tem a quantidade correta de dígitos
        votoConfirmado = true; // Confirma o voto
        votos.push({ etapa: etapa.titulo, voto: numero }); // Adiciona o voto à lista de votos
        console.log("Confirmando como " + numero); // Log de confirmação
    }

    if (votoConfirmado) { // Se o voto foi confirmado
        etapaAtual++; // Avança para a próxima etapa
        if (etapas[etapaAtual] !== undefined) {
            comecarEtapa(); // Inicia a próxima etapa
        } else {
            document.querySelector('.tela').innerHTML = '<div class="aviso--gigante pisca">FIM.</div>'; // Exibe mensagem de fim
            console.log(votos); // Log da lista de votos
        }
    }
}

comecarEtapa(); // Inicia a primeira etapa