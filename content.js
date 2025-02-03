
// Add your form field selectors and default values here
const formFields = {	
	'input#nomeCliente': 'Não informado',
    	'input#mailCliente': 'sememail@positivo.com.br',
	'input#rgCliente': '0',
	'input#valor': 30,
	'input#nfCompra': 0,
	'textarea#atendimento_ComentTroca': 'Troca direta',
	'textarea#atendimento_ComentChamada': '> Sintomas:\n- \n\n> Ações:\n- \n\n> Solução:\n- '
};

function checkName({target}){
	// Verifica se o nome tem 0 ou 1 elemento (ou seja, sem sobrenome)	
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

// Function to fill empty form fields with default values
function autoFillForm() {	

	// Iterate through form fields
	for (const [selector, defaultValue] of Object.entries(formFields)) {
		const field = document.querySelector(selector);
		if (!!field){
			if (!field.value.trim().length) {
				field.value = defaultValue;
			}

			if (field.id == 'nomeCliente') {
				field.addEventListener('change', checkName)
			}
			if (field.id == 'atendimento_ComentChamada'){ 
				field.rows=12
			} else {
				field.addEventListener('change', ()=>{
					if (!field.value || !field.value.trim().length) {
						field.value = defaultValue;
					}
				})
			}
		}
	}

	// Espera um pouco pra garantir a atualização do DOM
	setTimeout(()=>{	
		const fone = Array.from(document.querySelectorAll('#div_dadosChamada span.text'))
			.filter(s => s.innerText == 'TELEFONE')
		!!fone.length && fone[0].parentElement.click()
	}, 300)
}

// Run the auto-fill function when the page loads
if (document.readyState === "loading") {	
    document.addEventListener("DOMContentLoaded", autoFillForm);
} else {	// O DOM já está carregado
    autoFillForm(); 
}
