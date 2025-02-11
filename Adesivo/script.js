  /*Número do seu pedido no nosso site*/
  $('#n_pedido').mask('0000');

  $(document).ready(function() {
    $('#nome').on('blur', function() {
      // Captura o valor atual do campo de entrada
      let inputValue = $(this).val();

      // Transforma a primeira letra de cada palavra em maiúscula e as demais letras em minúsculas
      let capitalizedValue = inputValue.replace(/\b\w+\b/g, function(word) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      });

      // Define o valor capitalizado no campo de entrada
      $(this).val(capitalizedValue);
    });
  });

  /*Email*/
  $(document).ready(function(){
    $('#email').on('blur', function(){
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


  $('#confirmation-button3').on('click', function() {
      $('#confirmation-popup2').hide(); // Esconde o popup de confirmação
      location.reload(); // Recarrega a página
      window.open("https://inclusaoemacao.github.io/Formularios/index", "_blank"); // Abre em nova aba
    });








document.getElementById("myForm").addEventListener("submit", function(event) {
    event.preventDefault();
    console.log("🚀 Formulário enviado, aguardando anexo...");
    document.getElementById("confirmation-popup").style.display = "block";
});

document.getElementById("sendFile").addEventListener("click", function() {
    console.log("📂 Botão de envio de arquivo clicado...");
    
    // ✅ Exibir tela de carregamento antes de enviar
    document.getElementById("loading-overlay").style.display = "block";

    const scriptURL = "https://script.google.com/macros/s/AKfycbx-MUrkKCfECipU22w7DhO2K0TeY1cE6StXRYGbGNcaxNRqP9GO-_o2A9KK41LdyG1QsA/exec"; // Substitua pelo seu ID correto

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

            enviarDados(scriptURL, formData);
        };
    } else {
        alert("Por favor, selecione um arquivo PDF!");
        return;
    }
});

function enviarDados(scriptURL, formData) {
    console.log("🚀 Enviando requisição para o Apps Script...");

    fetch(scriptURL, {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log("✅ Resposta do servidor recebida:", data);

        // ✅ Ocultar tela de carregamento
        document.getElementById("loading-overlay").style.display = "none";

        if (data.status === "success") {
            console.log("🎉 Formulário e arquivo enviados com sucesso!");
            
            // ✅ Esconder a primeira popup e mostrar a segunda
            document.getElementById("confirmation-popup").style.display = "none";
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
