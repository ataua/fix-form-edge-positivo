
const formFields = {	// Add your form field selectors and default values here
	'input#nomeCliente': 'Não informado',
    	'input#mailCliente': 'sememail@positivo.com.br',
	'input#rgCliente': '0',
	'input#valor': 30,
	'input#nfCompra': 0,
	'input#atendimento_ComentTroca': 'Troca direta'
};

function checkName({target}){	// Verifica se o nome tem 0 ou 1 elemento (ou seja, sem sobrenome)
	const res = target.value.trim().split(" ");
	if (res.length <= 1){
		if (res[0] == ''){
			target.value = "Não informado";
		} else {
			alert("Nome incorreto!");
			target.focus();
		}
	}
}


function autoFillForm() {	// Function to fill empty form fields with default values

	// Iterate through form fields
	for (const [selector, defaultValue] of Object.entries(formFields)) {
		const field = document.querySelector(selector);
		if (!!field){
			if (!field.value.trim().length) {
				field.value = defaultValue;
			}

			if (field.id == 'nomeCliente') {
				field.addEventListener('change', checkName)
			} else {
				field.addEventListener('change', ()=>{
					if (!field.value || !field.value.trim().length) {
						field.value = defaultValue;
					}
				})
			}
		}
	}

	setTimeout(()=>{	// Espera um pouco pra garantir a atualização do DOM
		const fone = Array.from(document.querySelectorAll('#div_dadosChamada span.text'))
			.filter(s => s.innerText == 'TELEFONE')
		!!fone.length && fone[0].parentElement.click()
	}, 300)
}


if (document.readyState === "loading") {	// Run the auto-fill function when the page loads
    document.addEventListener("DOMContentLoaded", autoFillForm);
} else {
    autoFillForm(); // O DOM já está carregado
}