/*Número do seu pedido no nosso site*/
$('#n_pedido').mask('0000');
/*Data*/
$('#data').mask('00/00/0000');

$(document).ready(function () {
  $('#nome').on('blur', function () {
    // Captura o valor atual do campo de entrada
    let inputValue = $(this).val();

    // Função para capitalizar corretamente palavras com acento
    let capitalizeWord = (word) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    };

    // Aplica a capitalização em cada palavra, incluindo letras acentuadas
    let capitalizedValue = inputValue.replace(/\b[^\s]+\b/g, function (word) {
      return capitalizeWord(word);
    });

    // Define o valor capitalizado no campo de entrada
    $(this).val(capitalizedValue);
  });
});

/*Email*/
$(document).ready(function () {
  $('#email').on('blur', function () {
    var email = $(this).val();

    // Verifica se o email já contém "@gmail.com" e adiciona se não tiver
    if (email.indexOf('@gmail.com') === -1) {
      $(this).val('');
      document.getElementById('resultado').innerText = "Este NÃO é um email do Gmail.";
    } else {
      document.getElementById('resultado').innerText = "";
    }
  });
  $('#email').mask("A", {
    translation: {
      "A": { pattern: /[\w@\-.+]/, recursive: true }
    }
  });
});

// Função para aplicar a máscara condicionalmente com base no tipo (Celular ou Fixo)
function applyPhoneMask(input, isCelular) {
  let phone = input.value.replace(/\D/g, ""); // Remove todos os caracteres não numéricos

  // Define o limite de dígitos para celular e fixo
  const maxDigits = isCelular ? 11 : 10;
  phone = phone.slice(0, maxDigits);

  // Aplica a máscara
  if (phone.length > 2) {
    phone = `(${phone.slice(0, 2)}) ${phone.slice(2)}`;
  }

  // Aplica o hífen apenas quando apropriado
  if (isCelular && phone.length > 9) {
    phone = `${phone.slice(0, 10)}-${phone.slice(10)}`;
  } else if (!isCelular && phone.length > 8) {
    phone = `${phone.slice(0, 9)}-${phone.slice(9)}`;
  }

  input.value = phone;

  // Adiciona um evento para permitir a remoção do '-'
  $(input).off('keydown').on('keydown', function (e) {
    // Permite a remoção do caractere '-' se o usuário pressionar a tecla Backspace ou Delete
    if (e.key === 'Backspace' || e.key === 'Delete') {
      const cursorPosition = this.selectionStart;
      const currentValue = this.value;

      // Se o caractere anterior ao cursor é '-', move o cursor um para a esquerda
      if (currentValue[cursorPosition - 1] === '-') {
        e.preventDefault(); // Previne o comportamento padrão de apagar
        this.value = currentValue.slice(0, cursorPosition - 1) + currentValue.slice(cursorPosition);
        this.setSelectionRange(cursorPosition - 1, cursorPosition - 1); // Move o cursor para a posição correta
      }
    }
  });
}

// Função para adicionar automaticamente o "9" após o DDD para celulares, apenas se faltando 1 dígito
function addNineIfNecessary(input) {
  let phone = input.value.replace(/\D/g, ""); // Remove todos os caracteres não numéricos

  if (phone.length === 10) { // Insere o "9" após o DDD para celular
    phone = phone.slice(0, 2) + "9" + phone.slice(2);
  }

  input.value = `(${phone.slice(0, 2)}) ${phone.slice(2, 7)}-${phone.slice(7)}`;
}

// Função para aplicar máscara e placeholder ao alternar entre celular e fixo
function updatePhoneMaskAndPlaceholder(input, contatoName) {
  const isCelular = $('input[name="' + contatoName + '"]:checked').val() === 'Celular';

  // Limpa o campo ao trocar entre celular e fixo
  input.value = "";

  // Remove eventos anteriores para evitar conflitos
  $(input).off('input blur keydown');

  // Aplicação de eventos conforme o tipo de número
  if (isCelular) {
    $(input).on('input', function () {
      applyPhoneMask(this, true); // Formatação para celular
    }).on('blur', function () {
      addNineIfNecessary(this); // Adiciona o "9" após o DDD, se necessário, ao perder o foco
    });
    $(input).attr('placeholder', '(00) 90000-0000'); // Placeholder para celular
  } else {
    $(input).on('input', function () {
      applyPhoneMask(this, false); // Formatação para fixo
    });
    $(input).attr('placeholder', '(00) 0000-0000'); // Placeholder para fixo
  }

  // Adiciona o evento de remoção do '-'
  $(input).on('keydown', function (e) {
    if (e.key === 'Backspace' || e.key === 'Delete') {
      const cursorPosition = this.selectionStart;
      const currentValue = this.value;

      // Se o caractere anterior ao cursor é '-', move o cursor um para a esquerda
      if (currentValue[cursorPosition - 1] === '-') {
        e.preventDefault(); // Previne o comportamento padrão de apagar
        this.value = currentValue.slice(0, cursorPosition - 1) + currentValue.slice(cursorPosition);
        this.setSelectionRange(cursorPosition - 1, cursorPosition - 1); // Move o cursor para a posição correta
      }
    }
  });
}

// Função para monitorar a mudança do radio button e ajustar máscara e placeholder
function handleRadioChange(contatoName, input) {
  $('input[name="' + contatoName + '"]').on('change', function () {
    updatePhoneMaskAndPlaceholder(input, contatoName); // Atualiza máscara ao trocar entre Celular e Fixo
  });

  // Aplica a máscara ao carregar a página
  updatePhoneMaskAndPlaceholder(input, contatoName);
}

$(document).ready(function () {
  handleRadioChange('contato1', '#emerg1'); // Contato 1
  handleRadioChange('contato2', '#emerg2'); // Contato 2

  // Muda para celular automaticamente se mais de 10 caracteres forem inseridos no campo fixo
  $('#emerg1, #emerg2').on('input', function () {
    const inputValue = $(this).val();

    if (inputValue.length > 14 && inputValue.startsWith('(') && inputValue.includes(')')) {
      const contatoName = $(this).is('#emerg1') ? 'contato1' : 'contato2';
      $('input[name="' + contatoName + '"][value="Celular"]').prop('checked', true);
      updatePhoneMaskAndPlaceholder(this, contatoName);
    }
  });
});

// Lógica para adicionar campos de CIDs dinamicamente
$('#numCIDs').on('change', function () {
  const numCIDs = $(this).val();
  $('#cidInputs').empty(); // Limpa entradas anteriores
  for (let i = 1; i <= numCIDs; i++) {
    $('#cidInputs').append(`<div class="mb-3"><label for="cid${i}">CID ${i}</label><input type="text" class="form-control cid-input" placeholder="CID ${i}" id="cid${i}" required></div>`);
  }
  $('.cid-input').each(function () {
    applyCIDMask(this);
  });
});

function applyCIDMask(input) {
  $(input).on('input', function () {
    let value = $(this).val().toUpperCase();
    let maskedValue = value;
    // Remove qualquer prefixo existente para evitar duplicação
    if (maskedValue.startsWith("CID10: ")) {
      maskedValue = maskedValue.replace("CID10: ", "");
    } else if (maskedValue.startsWith("CID11: ")) {
      maskedValue = maskedValue.replace("CID11: ", "");
    }
    // Aplica a máscara de acordo com o padrão
    if (/^[A-Z][0-9]{0,2}$/.test(maskedValue)) {
      maskedValue = maskedValue;
    } else if (/^[A-Z][0-9]{2}\.?[0-9]?$/.test(maskedValue)) {
      maskedValue = maskedValue.replace(/^([A-Z][0-9]{2})([0-9])$/, '$1.$2');
    } else if (/^[0-9][A-Z][0-9]{2}$/.test(maskedValue)) {
      maskedValue = maskedValue;
    } else if (/^[0-9][A-Z][0-9]{2}\.?[A-Z0-9]?$/.test(maskedValue)) {
      maskedValue = maskedValue.replace(/^([0-9][A-Z][0-9]{2})([A-Z0-9])$/, '$1.$2');
    } else {
      maskedValue = maskedValue.substring(0, 5);
    }
    // Adiciona o prefixo correto baseado no primeiro caractere
    if (/^[A-Z]/.test(maskedValue)) {
      maskedValue = "CID10: " + maskedValue;
    } else if (/^[0-9]/.test(maskedValue)) {
      maskedValue = "CID11: " + maskedValue;
    }
    $(this).val(maskedValue);
  });
}

const scriptURL = 'https://script.google.com/macros/s/AKfycbz-v56FoX_vV2CGbI7ql9yXndBimtxLF8IiNDWKskJ_EiEhXn1Kgwi1EDX4XxiSZo_Z/exec'; // Substitua pela URL da sua Web App do Apps Script

document.getElementById("myForm").addEventListener("submit", function (event) {
  event.preventDefault(); // Impede o envio padrão do formulário

  // Mostra o overlay de carregamento
  document.getElementById("loading-overlay").style.display = "block";

  // Inicializa a barra de progresso
  let progress = 0;
  const progressBar = document.getElementById("progress-bar");
  progressBar.style.width = progress + "%";

  // Função para atualizar a barra de progresso
  function updateProgressBar(newProgress) {
    progress = Math.min(newProgress, 100); // Garante que o progresso não exceda 100
    progressBar.style.width = progress + "%";
  }

  // Coleta os dados do formulário
  updateProgressBar(10); // Atualiza o progresso para 10%

  const formData = {
    n_pedido: document.getElementById("n_pedido").value,
    cor: document.querySelector('input[name="cor"]:checked').value,
    simbolo: document.querySelector('input[name="simbolo"]:checked').value,
    email: document.getElementById("email").value,
    nome: document.getElementById("nome").value,
    data: document.getElementById("data").value,
    contato1: document.getElementById("emerg1").value,
    contato2: document.getElementById("emerg2").value,
    numCIDs: document.getElementById("numCIDs").value,
    termo: document.getElementById("termo").checked ? "Declaro que Li e Aceito o Termo." : ""
  };

  updateProgressBar(20); // Atualiza o progresso para 20%

  // Coleta os CIDs dinâmicos
  const cids = [];
  for (let i = 1; i <= formData.numCIDs; i++) {
    const cidValue = document.getElementById("cid" + i)?.value;
    if (cidValue) {
      cids.push(cidValue);
    }
  }

  updateProgressBar(30); // Atualiza o progresso para 30%

  // Monta o corpo da requisição
  const requestData = {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ formData, cids })
  };

  updateProgressBar(40); // Atualiza o progresso para 40%

  // Simula progresso da barra de carregamento
  // updateProgressBar(20); // Inicia o progresso

  // Envia a requisição para o Google Apps Script
  fetch(scriptURL, requestData)
    .then(() => {
      updateProgressBar(100); // Finaliza o progresso
      setTimeout(() => {
        document.getElementById("loading-overlay").style.display = "none";
        document.getElementById("confirmation-popup").style.display = "block";
        document.getElementById("confirmation-message").innerHTML = "Muito obrigado! Seu formulário foi enviado com sucesso.";
      }, 500); // Delay antes de esconder o overlay para mostrar a barra completa
    })
    .catch(error => {
      updateProgressBar(0); // Reseta a barra em caso de erro
      document.getElementById("loading-overlay").style.display = "none";
      document.getElementById("confirmation-popup").style.display = "block";
      document.getElementById("confirmation-message").innerHTML = "Erro ao enviar os dados.";
      console.error("Erro:", error);
    });
});

function redirecionarGmail() {
  // Tenta abrir o aplicativo Gmail (se o usuário o tiver instalado)
  const gmailAppURL = "googlemail://";
  const gmailWebURL = "https://mail.google.com/";

  // Verifica se o usuário está no mobile (para tentar abrir o app)
  if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
    window.location.href = gmailAppURL; // Tenta abrir o app Gmail
    setTimeout(function () {
      // Caso não tenha o app instalado, redireciona para o site
      window.location.href = gmailWebURL;
    }, 500);
  } else {
    // Se o usuário estiver no desktop, abre o Gmail no navegador
    window.location.href = gmailWebURL;
  }
}

// darkmode.js
// Função para alternar o tema
function toggleTheme() {
  const body = document.body;
  const theme = body.classList.contains('dark-mode') ? 'light-mode' : 'dark-mode';
  body.classList.toggle('dark-mode');
  body.classList.toggle('light-mode');

  // Salvar a preferência do usuário
  localStorage.setItem('theme', theme);
}

// Verificar a preferência do usuário ao carregar a página
$(document).ready(function () {
  const theme = localStorage.getItem('theme');
  if (theme === 'dark-mode') {
    document.body.classList.add('dark-mode');
    document.body.classList.remove('light-mode');
  } else {
    document.body.classList.add('light-mode');
    document.body.classList.remove('dark-mode');
  }
});

