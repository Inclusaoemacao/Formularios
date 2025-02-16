/*Número do seu pedido no nosso site*/
$('#n_pedido').mask('0000');

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

function updateProgressBar(progress) {
    var progressBar = document.getElementById("progress-bar");

    if (progressBar) {
        progressBar.style.width = progress + "%";
    } else {
        console.error("Elemento 'progress-bar' não encontrado!");
    }
}

/*
$('#confirmation-button3').on('click', function () {
    $('#confirmation-popup2').hide(); // Esconde o popup de confirmação
    location.reload(); // Recarrega a página
    window.open("https://inclusaoemacao.github.io/Formularios/index", "_blank"); // Abre em nova aba
});
*/

// Garante que o código será executado após o carregamento do DOM
$(document).ready(function () {

    document.getElementById("myForm").addEventListener("submit", function (event) {
        event.preventDefault();
        console.log("🚀 Formulário enviado, aguardando anexo...");
        document.getElementById("confirmation-popup").style.display = "block";
    });

    document.getElementById("sendFile").addEventListener("click", function () {
        console.log("📂 Botão de envio de arquivo clicado...");

        // ✅ Exibir tela de carregamento antes de enviar
        document.getElementById("loading-overlay").style.display = "block";

        const scriptURL = "https://script.google.com/macros/s/AKfycbzSEeuqqtfLrscsoXOHPtR5jyDRJ9kFCi2FKUyn9LNonOixz8Z1TUx890qAOPmjLSMs/exec"; // Substitua pelo seu ID correto
        const formData = new FormData();

        formData.append("n_pedido", document.getElementById("n_pedido").value);
        formData.append("email", document.getElementById("email").value);
        formData.append("numCIDs", document.getElementById("numCIDs").value);
        formData.append("nome", document.getElementById("nome").value);
        formData.append("termo", document.getElementById("termo").checked ? "Aceito" : "Não Aceito");

        const fileInput = document.getElementById("file");

        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            console.log("📌 Convertendo arquivo para Base64...");
            const reader = new FileReader();

            // document.getElementById("loading-overlay").style.display = "block";

            reader.onloadstart = function () {
                updateProgressBar(10); // Começa o progresso
            };

            reader.onprogress = function (event) {
                if (event.lengthComputable) {
                    const percentLoaded = Math.round((event.loaded / event.total) * 40); // Carrega até 40%
                    updateProgressBar(percentLoaded);
                }
            };

            reader.onloadstart = function () {
                updateProgressBar(30); // Começa o progresso
            };

            reader.readAsDataURL(file);

            reader.onload = function () {
                console.log("✅ Conversão Base64 concluída!");
                const base64String = reader.result.split(',')[1]; // Remove cabeçalho do Base64
                console.log("📄 Base64 do arquivo:", base64String.substring(0, 100) + "..."); // Exibe apenas os primeiros 100 caracteres
                console.log("📎 Nome do arquivo:", file.name);
                console.log("📝 Tipo do arquivo:", file.type);

                formData.append("pdfFile", base64String);
                formData.append("fileName", file.name);
                formData.append("mimeType", file.type);

                updateProgressBar(50); // Conversão para Base64 concluída

                enviarDados(scriptURL, formData);
            };

            reader.onloadend = function () {
                updateProgressBar(60); // Carregamento finalizado
            };

            reader.onerror = function () {
                console.error("❌ Erro ao ler o arquivo.");
                alert("❌ Erro ao ler o arquivo.");
                document.getElementById("loading-overlay").style.display = "none";
            };
        } else {
            alert("Por favor, selecione um arquivo PDF!");
            return;
        }
    });

    function enviarDados(scriptURL, formData) {
        console.log("🚀 Enviando requisição para o Apps Script...");
        updateProgressBar(70); // Iniciando o envio

        fetch(scriptURL, {
            method: "POST",
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                console.log("✅ Resposta do servidor recebida:", data);
                updateProgressBar(80); // Resposta recebida

                // ✅ Ocultar tela de carregamento
                document.getElementById("loading-overlay").style.display = "none";

                if (data.status === "success") {
                    console.log("🎉 Formulário e arquivo enviados com sucesso!");
                    // ✅ Esconder a primeira popup e mostrar a segunda
                    updateProgressBar(100); // Sucesso total
                    document.getElementById("confirmation-popup").style.display = "none";
                    // ✅ Exibir tela de carregamento antes de enviar
                    document.getElementById("confirmation-popup2").style.display = "block";

                } else {
                    alert("⚠ Erro ao enviar os dados: " + data.message);
                }
            })
            .catch(error => {
                console.error("❌ Erro ao enviar os dados:", error);
                alert("❌ Erro ao enviar os dados.");
                // ✅ Ocultar tela de carregamento em caso de erro
                document.getElementById("loading-overlay").style.display = "none";
            });
    }
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
